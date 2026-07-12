<?php

namespace App\Service\Auth;

use App\Models\Enum\HttpStatus;
use App\Models\User;
use App\Service\Otp\OtpService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthService
{
    private $otpService;

    public function __construct(OtpService $otpService)
    {
        $this->otpService = $otpService;
    }

    public function findUserByIdentifier(string $identifier)
    {
        return User::where('email', $identifier)->first();
    }

    /**
     * Thực hiện đổi mật khẩu dựa trên reset_token (validate/consume qua OtpService).
     */
    public function resetPassword(string $resetToken, string $password): array
    {
        $check = $this->otpService->validateResetToken($resetToken);
        if (!$check['success']) {
            return $check;
        }

        $user = $this->findUserByIdentifier($check['identifier']);
        if (!$user) {
            return ['success' => false, 'message' => 'Tài khoản không tồn tại.', 'code' => HttpStatus::NOT_FOUND->value];
        }

        $user->password = Hash::make($password);
        $user->save();

        $this->otpService->markResetTokenUsed($resetToken);

        return ['success' => true, 'message' => 'Đặt lại mật khẩu thành công.'];
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
