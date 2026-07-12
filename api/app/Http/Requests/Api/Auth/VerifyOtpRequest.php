<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\BaseApiFormRequest;

class VerifyOtpRequest extends BaseApiFormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|string',
            'otp'        => 'required|size:6',
        ];
    }

    public function messages(): array
    {
        return [
            'email.required'      => 'Vui lòng nhập email',
            'otp.required'        => 'Vui lòng nhập mã OTP.',
            'otp.size'            => 'Mã OTP phải đúng 6 ký tự.',
        ];
    }
}
