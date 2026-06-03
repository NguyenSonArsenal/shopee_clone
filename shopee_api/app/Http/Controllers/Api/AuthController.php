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
        $user = User::where('username', $request->username)
            ->where('status', User::STATUS_ACTIVE)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->error(401, null, "Tài khoản hoặc mật khẩu không chính xác, hoặc đã bị khóa!");
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
    }
}
