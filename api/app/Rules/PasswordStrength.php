<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class PasswordStrength implements Rule
{
    protected string $errorMessage = '';

    public function passes($attribute, $value)
    {
        return true; // @todo uncomment in prod
        if (!is_string($value)) {
            $this->errorMessage = 'Mật khẩu phải là một chuỗi ký tự.';
            return false;
        }

        $errors = [];

        if (strlen($value) < 8) {
            $errors[] = 'ít nhất 8 ký tự';
        }

        if (!preg_match('/[A-Z]/', $value)) {
            $errors[] = '1 chữ hoa (A-Z)';
        }

        if (!preg_match('/[a-z]/', $value)) {
            $errors[] = '1 chữ thường (a-z)';
        }

        if (!preg_match('/[0-9]/', $value)) {
            $errors[] = '1 chữ số (0-9)';
        }

        if (!preg_match('/[^A-Za-z0-9]/', $value)) {
            $errors[] = '1 ký tự đặc biệt (!@#$%...)';
        }

        if (!empty($errors)) {
            $this->errorMessage = 'Mật khẩu phải có: ' . implode(', ', $errors) . '.';
            return false;
        }

        return true;
    }

    public function message()
    {
        return $this->errorMessage;
    }
}
