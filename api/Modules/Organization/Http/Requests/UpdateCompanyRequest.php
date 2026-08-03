<?php

namespace Modules\Organization\Http\Requests;

use Illuminate\Validation\Rule;
use Modules\Organization\Models\Company;

class UpdateCompanyRequest extends StoreCompanyRequest
{
    public function rules()
    {
        $rules = parent::rules();

        $lengths = config('validate.lengths.' . Company::getTableName());

        $rules['name'] = 'sometimes|required|string|max:' . $lengths['name'];

        $rules['tax_code'] = [
            'nullable',
            'string',
            'max:' . $lengths['tax_code'],
            'regex:/^[0-9]{10}(-[0-9]{3})?$/',
            Rule::unique('company', 'tax_code')
                ->ignore($this->route('id'), 'id')
                ->whereNull('deleted_at'),
        ];

        return $rules;
    }
}
