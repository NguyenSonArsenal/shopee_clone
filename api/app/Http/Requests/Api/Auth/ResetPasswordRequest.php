<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\BaseApiFormRequest;

class ResetPasswordRequest extends BaseApiFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reset_token'           => 'bail|required|string',
            'password'              => 'bail|required|string|min:6|confirmed',
            'password_confirmation' => 'bail|required|string',
        ];
    }
}
