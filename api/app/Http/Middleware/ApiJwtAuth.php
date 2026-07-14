<?php

namespace App\Http\Middleware;

use App\Models\Enum\UserStatus;
use App\Models\User;
use App\Service\Auth\JWTService;
use Closure;
use Illuminate\Http\Request;

class ApiJwtAuth
{
    protected $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    public function handle(Request $request, Closure $next)
    {
        $authHeader = $request->header('Authorization');

        if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'success' => false,
                'code'    => 401,
                'message' => 'Bạn chưa đăng nhập.',
            ], 401);
        }

        $token   = substr($authHeader, 7); // Bỏ "Bearer "
        $payload = $this->jwtService->decodeToken($token);

        if (!$payload || empty($payload['id'])) {
            return response()->json([
                'success' => false,
                'code'    => 401,
                'message' => 'Token không hợp lệ hoặc đã hết hạn.',
            ], 401);
        }

        $user = User::where('id', $payload['id'])
            ->where('status', UserStatus::ACTIVE)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'code'    => 401,
                'message' => 'Tài khoản không tồn tại hoặc đã bị khóa.',
            ], 401);
        }

        // Gắn user vào request để controller dùng
        $request->merge(['_auth_user' => $user]);
        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
