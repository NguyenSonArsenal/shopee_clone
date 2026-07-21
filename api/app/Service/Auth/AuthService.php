<?php

namespace App\Service\Auth;

use App\Models\Enum\HttpStatus;
use App\Models\Enum\UserStatus;
use App\Models\User;
use App\Service\Otp\OtpService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

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
     * Đăng ký tài khoản mới (bỏ qua bước xác thực OTP, validate xong lưu DB luôn).
     */
    public function register(array $data): User
    {
        $sponsor = $this->resolveSponsor($data['ref_code'] ?? null);

        return User::create([
            'username' => $this->generateUsername($data['email']),
            'full_name' => $data['full_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'gender' => $data['gender'],
            'password' => Hash::make($data['password']),
            'type' => $data['type'],
            'company_name' => $data['company_name'] ?? null,
            'referral_code' => $this->generateReferralCode(),
            'sponsor_id' => $sponsor?->id,
            'status' => UserStatus::ACTIVE,
        ]);
    }

    private function resolveSponsor(?string $refCode): ?User
    {
        if (!$refCode) {
            return null;
        }
        return User::where('referral_code', strtoupper($refCode))->first();
    }

    private function generateReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }

    private function generateUsername(string $email): string
    {
        $base = Str::slug(explode('@', $email)[0], '_');
        $username = $base;
        $i = 0;
        while (User::where('username', $username)->exists()) {
            $username = $base . '_' . ++$i;
        }
        return $username;
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
