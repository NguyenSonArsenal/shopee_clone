<?php

namespace App\Http\Requests\Api\Auth;


use App\Http\Requests\BaseApiFormRequest;
use App\Models\User;

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
            'username' => 'bail|required|string|max:64|alpha_dash|unique:user',
            'email' => 'bail|required|string|email|max:64|unique:user',
            'password' => 'bail|required|string|confirmed|min:6|max:64',
            'password_confirmation' => 'required',
            'gender'=> 'nullable|integer|in:' . User::GENDER_BOY . ',' . User::GENDER_GIRL,
        ];
    }
}
