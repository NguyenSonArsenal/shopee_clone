<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\BaseApiFormRequest;

class ForgotPasswordSendOtpRequest extends BaseApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email'
        ];
    }
}
