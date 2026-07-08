<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\ForgotPasswordSendOtpRequest;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Http\Resources\Api\Auth\LoginResource;
use App\Models\Enum\OtpPurpose;
use App\Models\Enum\UserStatus;
use App\Models\User;
use App\Service\Auth\JWTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Service\Auth\AuthService;
use App\Service\Otp\OtpService;
use App\Service\Otp\OtpStrategyFactory;
use App\Http\Requests\Api\Auth\ResetPasswordRequest;

class AuthController extends Controller
{
    protected $jwtService;
    protected $authService;
    protected $otpService;
    protected $otpStrategyFactory;

    public function __construct(
        JWTService $jwtService,
        AuthService $authService,
        OtpService $otpService,
        OtpStrategyFactory $otpStrategyFactory
    ) {
        $this->jwtService = $jwtService;
        $this->authService = $authService;
        $this->otpService = $otpService;
        $this->otpStrategyFactory = $otpStrategyFactory;
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
            sleep(1); // @todo
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
    public function forgotPasswordSendOtp(ForgotPasswordSendOtpRequest $request)
    {
        try {
            $user = $this->authService->findUserByIdentifier(trim($request->email));

            if (empty($user)) {
                return $this->error('Tài khoản không tồn tại.', 404);
            }

            if ($user->status !== UserStatus::ACTIVE) {
                return $this->error('Tài khoản chưa được kích hoạt. Vui lòng liên hệ quản trị viên.', 403);
            }

            $strategy = $this->otpStrategyFactory->make($user->email);
            $result = $this->otpService->send($strategy, $user->email, $user->id, OtpPurpose::FORGOT_PASSWORD->value);

            if ($result['success']) {
                return $this->success();
            }
            return $this->error(arrayGet($result, 'message'), arrayGet($result, 'code'));
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
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

        $user = $this->authService->findUserByIdentifier($email);
        if (!$user) {
            return $this->error('Tài khoản không tồn tại.', 404);
        }

        $sentAt = Cache::get('forgot_password_otp_sent_at:' . $user->id);
        if (!$sentAt) {
            return $this->error('Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng gửi lại.', 404);
        }

        $ttlMinutes = config('config.otp.email.ttl_minutes', 2);
        $elapsed = now()->timestamp - $sentAt;
        $ttlSeconds = ($ttlMinutes * 60) - $elapsed;

        if ($ttlSeconds <= 0) {
            Cache::forget('forgot_password_otp_sent_at:' . $user->id);
            Cache::forget('otp:' . $user->id);
            return $this->error('Mã OTP đã hết hạn. Vui lòng gửi lại.', 404);
        }

        $maskedIdentifier = $this->maskIdentifier($user->email);

        return $this->success([
            'identifier' => $user->email,
            'maskedIdentifier' => $maskedIdentifier,
            'ttlSeconds' => max(0, $ttlSeconds),
        ], 'Lấy thông tin OTP thành công.');
    }

    /**
     * Xác thực mã OTP
     */
    public function forgotPasswordVerifyOtp(ForgotPasswordSendOtpRequest $request)
    {
        $identifier = $request->email;
        $user = $this->authService->findUserByIdentifier(trim($identifier));
        if (!$user) {
            return $this->error('Tài khoản không tồn tại.', 404);
        }

        $result = $this->authService->verifyOtp($user, $request->otp);

        if ($result['success']) {
            Cache::forget('forgot_password_otp_sent_at:' . $user->id);
        }

        return response()->json(
            array_diff_key($result, ['code' => '']),
            $result['success'] ? 200 : ($result['code'] ?? 422)
        );
    }

    /**
     * Đặt lại mật khẩu mới
     */
    public function forgotPasswordReset(ResetPasswordRequest $request)
    {
        $result = $this->authService->resetPassword($request->reset_token, $request->password);
        return response()->json(
            array_diff_key($result, ['code' => '']),
            $result['success'] ? 200 : ($result['code'] ?? 422)
        );
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
