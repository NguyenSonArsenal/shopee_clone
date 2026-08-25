<?php

namespace Modules\Organization\Http\Requests\Branch;

use Modules\Organization\Models\Branch;

class UpdateBranchRequest extends StoreBranchRequest
{
    public function rules()
    {
        $rules = parent::rules();

        $lengths = config('validate.lengths.' . Branch::getTableName());

        $rules['company_id'] = 'sometimes|required|integer|exists:company,id';
        $rules['name'] = 'sometimes|required|string|max:' . $lengths['name'];

        return $rules;
    }
}
