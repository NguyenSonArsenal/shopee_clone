<?php

namespace App\Service\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthService
{
    private const RESET_TOKEN_TTL = 600; // 10 phút

    /**
     * Tìm kiếm người dùng bằng email hoặc số điện thoại.
     */
    public function findUserByIdentifier(string $identifier)
    {
        return User::where('email', $identifier)->first();
    }

    /**
     * Cấp reset_token (lưu Cache) sau khi OTP đã verify thành công.
     * Token này là "vé" để đi tiếp bước đặt lại mật khẩu (xem resetPassword).
     *
     * @param User $user Người dùng đã xác thực OTP thành công
     * @return string reset_token dùng 1 lần, hết hạn sau RESET_TOKEN_TTL giây
     */
    public function createResetToken(User $user): string
    {
        $resetToken = Str::random(64);
        Cache::put('reset_token:' . $resetToken, $user->id, self::RESET_TOKEN_TTL);

        return $resetToken;
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
