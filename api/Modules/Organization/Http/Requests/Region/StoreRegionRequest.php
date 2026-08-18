<?php

namespace Modules\Organization\Http\Requests\Region;

use App\Http\Requests\BaseApiFormRequest;
use App\Rules\PhoneNumber;
use Illuminate\Validation\Rule;
use Modules\Organization\Models\Region;

class StoreRegionRequest extends BaseApiFormRequest
{
    /**
     * Chuẩn hoá dữ liệu đầu vào trước khi validate
     * - Trim các chuỗi, đưa chuỗi rỗng về null để không lưu '' vào DB
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        $data = [];

        foreach (['name', 'code', 'phone', 'email', 'address'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $value = trim($this->input($field));
                $data[$field] = $value === '' ? null : $value;
            }
        }

        if (!empty($data)) {
            $this->merge($data);
        }
    }

    /**
     * Quy tắc validate khi tạo mới vùng miền
     *
     * @return array
     */
    public function rules()
    {
        $lengths = config('validate.lengths.' . Region::getTableName());

        return [
            'company_id' => 'nullable|integer|exists:company,id',
            'manager_id' => 'nullable|integer|exists:user,id',
            'name'       => 'required|string|max:' . $lengths['name'],
            'code'       => [
                'nullable',
                'string',
                'max:' . $lengths['code'],
                Rule::unique('region', 'code')->whereNull('deleted_at'),
            ],
            'phone'      => ['nullable', new PhoneNumber()],
            'email'      => 'nullable|email|max:' . $lengths['email'],
            'address'    => 'nullable|string|max:' . $lengths['address'],
            'is_active'  => 'nullable|boolean',
        ];
    }

    /**
     * Thông báo lỗi tuỳ chỉnh
     *
     * @return array
     */
    public function messages()
    {
        return [
            'code.unique'        => 'Mã vùng miền này đã được sử dụng.',
            'company_id.exists'  => 'Công ty không tồn tại.',
            'manager_id.exists'  => 'Người quản lý không tồn tại.',
        ];
    }

    /**
     * Tên hiển thị của các trường trong thông báo lỗi
     *
     * @return array
     */
    public function attributes()
    {
        return [
            'company_id' => 'công ty',
            'manager_id' => 'người quản lý',
            'name'       => 'tên vùng miền',
            'code'       => 'mã vùng miền',
            'phone'      => 'số điện thoại',
            'email'      => 'email',
            'address'    => 'địa chỉ',
            'is_active'  => 'trạng thái hoạt động',
        ];
    }
}
