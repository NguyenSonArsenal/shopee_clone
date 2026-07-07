<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Http\Resources\Api\Auth\LoginResource;
use App\Models\User;
use App\Service\Auth\JWTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * API Đăng ký tài khoản
     */
    public function postRegister(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'username' => $request->username,
                'password' => bcrypt($request->password),
                'email' => $request->email,
                'status' => User::STATUS_ACTIVE,
                'gender' => $request->gender,
            ]);

            $data = [
                'id' => $user->id,
                'username' => $user->username
            ];
            return $this->success($data, "Đăng ký tài khoản thành công!", 201);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->error($e->getMessage());
        }
    }

    /**
     * API Đăng nhập cấp JWT Token
     */
    public function postLogin(LoginRequest $request)
    {
        try {
            sleep(2); // @todo
            $user = User::where('email', $request->email)
                ->where('status', User::STATUS_ACTIVE)
                ->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return $this->error("Tài khoản hoặc mật khẩu không chính xác, hoặc đã bị khóa!", 401);
            }

            // Sinh JWT Token chứa thông tin cơ bản
            $tokenPayload = [
                'id' => $user->id,
                'username' => $user->username,
            ];

            $accessToken = $this->jwtService->generateToken($tokenPayload, getConstant('EXP_ACCESS_TOKEN'));
            $refreshToken = $this->jwtService->generateToken(['id' => $user->id], getConstant('EXP_RF_TOKEN'));

            // Lưu Refresh Token vào Database để quản lý trạng thái (Stateful)
            $user->rf_token = $refreshToken;
            $user->save();

            $loginResponse = new LoginResource([
                'user'          => $user,
                'access_token'  => $accessToken,
                'refresh_token' => $refreshToken,
            ]);

            return $this->success($loginResponse, "Đăng nhập thành công!");
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * API Làm mới Access Token bằng Refresh Token
     * POST /api/refresh-token
     */
    public function postRefreshToken(Request $request)
    {
        $rfToken = $request->input('refresh_token');

        if (!$rfToken) {
            return $this->error("Refresh token không được để trống.", 401);
        }

        // Decode và kiểm tra refresh token
        $payload = $this->jwtService->decodeToken($rfToken);
        if (!$payload || empty($payload['id'])) {
            return $this->error("Refresh token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.", 401);
        }

        // Kiểm tra refresh token có khớp với DB không (tránh dùng token cũ đã logout)
        $user = User::where('id', $payload['id'])
            ->where('rf_token', $rfToken)
            ->where('status', User::STATUS_ACTIVE)
            ->first();

        if (!$user) {
            return $this->error("Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.", 401);
        }

        // Cấp Access Token mới
        $newAccessToken = $this->jwtService->generateToken(
            ['id' => $user->id, 'username' => $user->username],
            getConstant('EXP_ACCESS_TOKEN')
        );

        return $this->success([
            'access_token' => $newAccessToken,
        ], "Làm mới token thành công!");
    }

    /**
     * Gửi mã OTP Quên mật khẩu
     */
    public function forgotPasswordSendOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|email'
        ], [
            'identifier.required' => 'Email không được để trống.',
            'identifier.email' => 'Email không đúng định dạng.'
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $email = trim($request->identifier);
        $user = User::where('email', $email)->first();

        if (!$user) {
            return $this->error('Tài khoản không tồn tại.', 404);
        }

        if ($user->status !== User::STATUS_ACTIVE) {
            return $this->error('Tài khoản chưa được kích hoạt. Vui lòng liên hệ quản trị viên.', 403);
        }

        // Tạo mã OTP 6 số ngẫu nhiên
        $otp = (string) rand(100000, 999999);
        
        // Ghi log để tiện test
        Log::info("OTP Forgot Password for {$email}: {$otp}");

        // Lưu vào Cache 2 phút (120 giây)
        Cache::put('otp_forgot_' . $email, $otp, 120);
        Cache::put('otp_forgot_sent_at_' . $email, now()->timestamp, 120);

        return $this->success(null, 'Gửi mã OTP thành công. Vui lòng kiểm tra email.');
    }

    /**
     * Lấy thông tin xác thực OTP (thời gian còn lại, email bị ẩn)
     */
    public function forgotPasswordShowVerify(Request $request)
    {
        $email = $request->query('email');
        if (empty($email)) {
            return $this->error('Thông tin email không hợp lệ.', 422);
        }

        $sentAt = Cache::get('otp_forgot_sent_at_' . $email);
        if (!$sentAt) {
            return $this->error('Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng gửi lại.', 404);
        }

        $elapsed = now()->timestamp - $sentAt;
        $ttlSeconds = 120 - $elapsed;

        if ($ttlSeconds <= 0) {
            Cache::forget('otp_forgot_' . $email);
            Cache::forget('otp_forgot_sent_at_' . $email);
            return $this->error('Mã OTP đã hết hạn. Vui lòng gửi lại.', 404);
        }

        $maskedEmail = $this->maskIdentifier($email);

        return $this->success([
            'email' => $email,
            'masked_email' => $maskedEmail,
            'ttl_seconds' => max(0, $ttlSeconds),
        ], 'Lấy thông tin OTP thành công.');
    }

    /**
     * Xác thực mã OTP
     */
    public function forgotPasswordVerifyOtp(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'identifier' => 'required|email',
            'otp' => 'required|string|size:6'
        ], [
            'identifier.required' => 'Email không được để trống.',
            'identifier.email' => 'Email không đúng định dạng.',
            'otp.required' => 'Mã OTP không được để trống.',
            'otp.size' => 'Mã OTP phải gồm 6 chữ số.'
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $email = trim($request->identifier);
        $otp = trim($request->otp);

        $cachedOtp = Cache::get('otp_forgot_' . $email);

        if (!$cachedOtp || $cachedOtp !== $otp) {
            return $this->error('Mã OTP không chính xác hoặc đã hết hạn.', 422);
        }

        // Tạo reset token ngẫu nhiên
        $resetToken = Str::random(40);

        // Lưu reset token trong 10 phút
        Cache::put('reset_token_' . $resetToken, $email, 600);

        // Xóa OTP khỏi cache
        Cache::forget('otp_forgot_' . $email);
        Cache::forget('otp_forgot_sent_at_' . $email);

        return $this->success([
            'reset_token' => $resetToken
        ], 'Xác thực OTP thành công.');
    }

    /**
     * Đặt lại mật khẩu mới
     */
    public function forgotPasswordReset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reset_token' => 'required|string',
            'password' => 'required|string|min:6'
        ], [
            'reset_token.required' => 'Token không hợp lệ.',
            'password.required' => 'Mật khẩu mới không được để trống.',
            'password.min' => 'Mật khẩu mới phải có ít nhất 6 ký tự.'
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $resetToken = $request->reset_token;
        $password = $request->password;

        $email = Cache::get('reset_token_' . $resetToken);

        if (!$email) {
            return $this->error('Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.', 422);
        }

        $user = User::where('email', $email)->first();
        if (!$user) {
            return $this->error('Tài khoản không tồn tại.', 404);
        }

        $user->password = bcrypt($password);
        $user->save();

        // Xóa reset token khỏi cache
        Cache::forget('reset_token_' . $resetToken);

        return $this->success(null, 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.');
    }

    /**
     * Helper ẩn bớt ký tự email/SĐT
     */
    private function maskIdentifier(string $identifier): string
    {
        if (str_contains($identifier, '@')) {
            $parts = explode('@', $identifier);
            return substr($parts[0], 0, 2) . '***@' . $parts[1];
        }
        if (strlen($identifier) <= 5) {
            return $identifier;
        }
        return substr($identifier, 0, 3) . '***' . substr($identifier, -2);
    }
}
