<?php

namespace Modules\Organization\Http\Requests;

use Illuminate\Validation\Rule;
use Modules\Organization\Models\Region;

class UpdateRegionRequest extends StoreRegionRequest
{
    public function rules()
    {
        $rules = parent::rules();

        $lengths = config('validate.lengths.' . Region::getTableName());

        $rules['name'] = 'nullable|string|max:' . $lengths['name'];

        $rules['code'] = [
            'nullable',
            'string',
            'max:' . $lengths['code'],
            Rule::unique('region', 'code')
                ->ignore($this->route('id'), 'id')
                ->whereNull('deleted_at'),
        ];

        return $rules;
    }
}
