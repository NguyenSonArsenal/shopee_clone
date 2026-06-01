<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Models\User;
use App\Service\Auth\JWTService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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
    public function postRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|unique:user,username|max:50',
            'password' => 'required|string|min:6',
            'full_name' => 'nullable|string|max:100',
            'email' => 'nullable|email|unique:user,email|max:64',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'code' => 422,
                'message' => 'Dữ liệu đăng ký không hợp lệ!',
                'data' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password), // Hash mật khẩu chuẩn Bcrypt
            'full_name' => $request->full_name,
            'email' => $request->email,
            'phone' => $request->phone,
            'status' => User::STATUS_ACTIVE, // Đăng ký xong tự kích hoạt (Trạng thái = 1)
        ]);

        return response()->json([
            'code' => 201,
            'message' => 'Đăng ký tài khoản thành công!',
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
            ]
        ], 201);
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
