<?php

namespace App\Http\Requests\Api\Auth;


use App\Http\Requests\BaseApiFormRequest;
use App\Models\Enum\UserType;
use App\Models\User;
use App\Rules\PasswordStrength;
use App\Rules\PhoneNumber;
use App\Rules\UniquePhone;
use App\Rules\VietnameseName;

class RegisterRequest extends BaseApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'full_name' => ['required', 'string', 'max:200', new VietnameseName('Họ và tên')],
            'phone' => ['required', new PhoneNumber(), new UniquePhone()],
            'email' => ['required', 'email', function ($attribute, $value, $fail) {
                if (User::where('email', $value)->exists()) {
                    $fail('Email này đã được sử dụng.');
                }
            }],
            'password' => ['required', 'confirmed', new PasswordStrength()],
            'password_confirmation' => 'required',
            'type' => 'required|string|in:' . implode(',', array_column(UserType::cases(), 'value')),
            'company_name' => 'required_if:type,' . UserType::F2->value . '|nullable|string|max:255',
            'agree' => 'accepted',
            'ref_code' => 'nullable|string',
        ];
    }

    public function messages()
    {
        return [
            'type.in' => 'Vai trò không hợp lệ.',
            'company_name.required_if' => 'Vui lòng nhập tên công ty khi đăng ký với vai trò Công ty.',
            'agree.accepted' => 'Bạn phải đồng ý với điều khoản dịch vụ.',
        ];
    }

    public function attributes()
    {
        return [
            'full_name' => 'họ và tên',
            'type' => 'vai trò',
            'company_name' => 'tên công ty',
            'agree' => 'điều khoản dịch vụ',
        ];
    }
}
