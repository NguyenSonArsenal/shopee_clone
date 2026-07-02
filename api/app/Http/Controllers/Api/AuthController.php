<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Auth\LoginRequest;
use App\Http\Requests\Api\Auth\RegisterRequest;
use App\Models\User;
use App\Service\Auth\JWTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

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
            sleep(3); // @todo
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

            $data = [
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'user' => [
                    'username' => $user->username,
                ]
            ];
            return $this->success($data, "Đăng nhập thành công!");
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
}
