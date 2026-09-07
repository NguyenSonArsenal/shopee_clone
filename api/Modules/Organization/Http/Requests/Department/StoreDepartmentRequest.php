<?php

namespace Modules\Organization\Http\Requests\Department;

use App\Http\Requests\BaseApiFormRequest;
use Modules\Organization\Models\Department;

class StoreDepartmentRequest extends BaseApiFormRequest
{
    // Trim chuỗi, đưa chuỗi rỗng về null để không lưu '' vào DB
    protected function prepareForValidation()
    {
        $data = [];

        foreach (['name', 'code'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $value = trim($this->input($field));
                $data[$field] = $value === '' ? null : $value;
            }
        }

        if (!empty($data)) {
            $this->merge($data);
        }
    }

    public function rules()
    {
        $lengths = config('validate.lengths.' . Department::getTableName());

        return [
            'company_id' => 'nullable|integer|exists:company,id',
            'branch_id'  => 'nullable|integer|exists:branch,id',
            'name'       => 'required|string|max:' . $lengths['name'],
            'code'       => 'nullable|string|max:' . $lengths['code'],
            'manager_id' => 'nullable|integer|exists:user,id',
            'is_active'  => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'company_id.exists' => 'Công ty không tồn tại.',
            'branch_id.exists'  => 'Chi nhánh không tồn tại.',
            'manager_id.exists' => 'Người quản lý không tồn tại.',
        ];
    }

    public function attributes()
    {
        return [
            'company_id' => 'công ty',
            'branch_id'  => 'chi nhánh',
            'name'       => 'tên phòng ban',
            'code'       => 'mã phòng ban',
            'manager_id' => 'người quản lý',
            'is_active'  => 'trạng thái hoạt động',
        ];
    }
}
