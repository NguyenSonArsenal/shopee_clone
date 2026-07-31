<?php

namespace Modules\Organization\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends StoreCompanyRequest
{
    public function rules()
    {
        return [];
        $rules = parent::rules();

        $rules['name'] = 'sometimes|required|string|max:255';

        $rules['tax_code'] = [
            'nullable',
            'string',
            'max:20',
            'regex:/^[0-9]{10}(-[0-9]{3})?$/',
            Rule::unique('company', 'tax_code')
                ->ignore($this->route('id'), 'id')
                ->whereNull('deleted_at'),
        ];

        return $rules;
    }
}
