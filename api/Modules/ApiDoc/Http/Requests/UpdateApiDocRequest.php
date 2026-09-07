<?php

namespace Modules\ApiDoc\Http\Requests;

use App\Http\Requests\BaseApiFormRequest;

class UpdateApiDocRequest extends BaseApiFormRequest
{
    public function rules()
    {
        return [
            'module' => 'required|string|max:100',
            'method' => 'required|string|in:GET,POST,PUT,PATCH,DELETE',
            'url' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'curl_example' => 'nullable|string',
            'parameters' => 'nullable|string',
            'response_sample' => 'nullable|string',
        ];
    }

    public function attributes()
    {
        return [
            'module' => 'module',
            'method' => 'phương thức',
            'url' => 'url',
            'description' => 'mô tả',
            'curl_example' => 'curl mẫu',
            'parameters' => 'tham số',
            'response_sample' => 'response mẫu',
        ];
    }
}
