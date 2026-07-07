<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => 'required|string',
            'otp'        => 'required|string|size:6',
        ];
    }

    public function messages(): array
    {
        return [
            'identifier.required' => 'Vui lòng nhập email hoặc số điện thoại.',
            'otp.required'        => 'Vui lòng nhập mã OTP.',
            'otp.size'            => 'Mã OTP phải đúng 6 ký tự.',
        ];
    }
}
