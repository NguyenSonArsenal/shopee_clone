<?php

namespace App\Http\Requests\Api\Auth;

use Illuminate\Foundation\Http\FormRequest;

class SendOtpRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'identifier' => 'required|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'identifier.required' => 'Vui lòng nhập email',
        ];
    }
}
