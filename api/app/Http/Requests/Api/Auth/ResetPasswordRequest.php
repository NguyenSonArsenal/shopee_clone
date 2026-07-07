<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reset_token'           => 'required|string',
            'password'              => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'reset_token.required'           => 'Token không hợp lệ.',
            'password.required'              => 'Vui lòng nhập mật khẩu mới.',
            'password.min'                   => 'Mật khẩu phải có ít nhất 6 ký tự.',
            'password.confirmed'             => 'Mật khẩu xác nhận không khớp.',
            'password_confirmation.required' => 'Vui lòng nhập xác nhận mật khẩu.',
        ];
    }
}
