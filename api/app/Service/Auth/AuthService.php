<?php

namespace App\Service\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Service\Otp\OtpService;

class AuthService
{
    private const RESET_TOKEN_TTL = 600; // 10 phút

    private $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    /**
     * Tìm kiếm người dùng bằng email hoặc số điện thoại.
     */
    public function findUserByIdentifier(string $identifier)
    {
        return User::where('email', $identifier)->first();
    }

    /**
     * Xác thực OTP cho flow QUÊN MẬT KHẨU.
     * Tạo reset_token để dùng ở bước đặt lại mật khẩu.
     */
    public function verifyOtp(User $user, string $otp): array
    {
        $result = $this->otpService->verify($user->id, $otp);
        if (!$result['success']) {
            return $result;
        }

        $resetToken = Str::random(64);
        Cache::put('reset_token:' . $resetToken, $user->id, self::RESET_TOKEN_TTL);

        return ['success' => true, 'reset_token' => $resetToken];
    }

    /**
     * Thực hiện đổi mật khẩu dựa trên reset_token.
     */
    public function resetPassword(string $resetToken, string $password): array
    {
        $tokenKey = 'reset_token:' . $resetToken;
        $userId   = Cache::get($tokenKey);

        if (!$userId) {
            return ['success' => false, 'message' => 'Phiên đặt lại mật khẩu đã hết hạn.', 'code' => 422];
        }

        $user = User::find($userId);
        if (!$user) {
            return ['success' => false, 'message' => 'Tài khoản không tồn tại.', 'code' => 404];
        }

        // Cập nhật trường password (ở API project dùng 'password' thay vì 'password_hash')
        $user->password = Hash::make($password);
        $user->save();

        Cache::forget($tokenKey);
        Cache::forget('otp:' . $user->id);

        Log::info('Password reset successful via API', ['user_id' => $user->id]);
        return ['success' => true];
    }

    /**
     * Chuẩn hóa định dạng số điện thoại.
     */
    public function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[\s\-\.\(\)]/', '', $phone);
        if (str_starts_with($phone, '+84')) {
            $phone = '0' . substr($phone, 3);
        } elseif (str_starts_with($phone, '84') && strlen($phone) === 11) {
            $phone = '0' . substr($phone, 2);
        }
        return $phone;
    }

    /**
     * Ẩn một phần số điện thoại.
     */
    public function maskPhone(string $phone): string
    {
        if (strlen($phone) <= 5) return $phone;
        return substr($phone, 0, 3) . '***' . substr($phone, -3);
    }
}
