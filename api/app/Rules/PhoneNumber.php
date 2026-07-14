<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class PhoneNumber implements Rule
{
    protected string $errorMessage = '';

    public function passes($attribute, $value)
    {
        if (!is_string($value)) {
            $this->errorMessage = 'Số điện thoại phải là một chuỗi ký tự.';
            return false;
        }

        if (!str_starts_with($value, '0')) {
            $this->errorMessage = 'Số điện thoại phải bắt đầu bằng số 0.';
            return false;
        }

        if (!preg_match('/^[0-9]{10}$/', $value)) {
            $this->errorMessage = 'Số điện thoại phải có độ dài 10 chữ số.';
            return false;
        }

        return true;
    }

    public function message()
    {
        return $this->errorMessage;
    }
}
