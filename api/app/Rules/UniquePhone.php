<?php

namespace App\Rules;

use App\Models\User;
use Illuminate\Contracts\Validation\Rule;

/**
 * Kiểm tra số điện thoại CHƯA được đăng ký bởi tài khoản khác.
 * Dùng cho cả đăng ký mới và cập nhật hồ sơ:
 *   - Đăng ký:   new UniquePhone()
 *   - Cập nhật:  new UniquePhone($user->id)   // bỏ qua chính tài khoản đang sửa
 */
class UniquePhone implements Rule
{
    public function __construct(
        private ?string $ignoreUserId = null,
        private string $message = 'Số điện thoại này đã được đăng ký.',
    ) {}

    public function passes($attribute, $value)
    {
        if (!is_string($value) || $value === '') {
            return true;
        }

        $exists = User::where('phone', $value)
            ->when($this->ignoreUserId, fn($q) => $q->where('id', '!=', $this->ignoreUserId))
            ->exists();

        return !$exists;
    }

    public function message()
    {
        return $this->message;
    }
}
