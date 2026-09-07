<?php

namespace Modules\Organization\Http\Requests\Department;

use Modules\Organization\Models\Department;

class UpdateDepartmentRequest extends StoreDepartmentRequest
{
    public function rules()
    {
        $rules = parent::rules();

        $lengths = config('validate.lengths.' . Department::getTableName());

        $rules['name'] = 'sometimes|required|string|max:' . $lengths['name'];

        return $rules;
    }
}
