<?php

namespace App\Http\Requests\Api\Auth;

use App\Http\Requests\BaseApiFormRequest;

class LoginRequest extends BaseApiFormRequest
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
        $rules = [
            'email' => 'bail|required',
            'password' => 'bail|required',
        ];
        return $rules;
    }
}
