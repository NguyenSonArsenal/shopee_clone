<?php

namespace Modules\Organization\Http\Requests\Branch;

use App\Http\Requests\BaseApiFormRequest;
use App\Rules\PhoneNumber;
use Modules\Organization\Models\Branch;

class StoreBranchRequest extends BaseApiFormRequest
{
    // Trim chuỗi, đưa chuỗi rỗng về null để không lưu '' vào DB
    protected function prepareForValidation()
    {
        $data = [];

        foreach (['name', 'code', 'address'] as $field) {
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
        $lengths = config('validate.lengths.' . Branch::getTableName());

        return [
            'company_id'       => 'required|integer|exists:company,id',
            'name'             => 'required|string|max:' . $lengths['name'],
            'code'             => 'nullable|string|max:' . $lengths['code'],
            'address'          => 'nullable|string|max:' . $lengths['address'],
            'phone'            => ['nullable', new PhoneNumber()],
            'manager_id'       => 'nullable|integer|exists:user,id',
            'receptionist_id'  => 'nullable|integer|exists:user,id',
            'is_active'        => 'nullable|boolean',
        ];
    }

    public function messages()
    {
        return [
            'company_id.exists'      => 'Công ty không tồn tại.',
            'manager_id.exists'      => 'Người quản lý không tồn tại.',
            'receptionist_id.exists' => 'Lễ tân không tồn tại.',
        ];
    }

    public function attributes()
    {
        return [
            'company_id'      => 'công ty',
            'name'            => 'tên chi nhánh',
            'code'            => 'mã chi nhánh',
            'address'         => 'địa chỉ',
            'phone'           => 'số điện thoại',
            'manager_id'      => 'người quản lý',
            'receptionist_id' => 'lễ tân',
            'is_active'       => 'trạng thái hoạt động',
        ];
    }
}
