<?php

namespace Modules\Organization\Http\Requests;

use App\Http\Requests\BaseApiFormRequest;
use App\Rules\PhoneNumber;
use Illuminate\Validation\Rule;
use Modules\Organization\Models\Company;

class StoreCompanyRequest extends BaseApiFormRequest
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

        foreach (['name', 'short_name', 'tax_code', 'phone', 'email', 'website', 'address', 'description', 'logo_url'] as $field) {
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
     * Quy tắc validate khi tạo mới công ty
     *
     * @return array
     */
    public function rules()
    {
        $lengths = config('validate.lengths.' . Company::getTableName());

        return [
            'representative_id' => 'nullable|integer|exists:user,id',
            'manager_id'        => 'nullable|integer|exists:user,id',
            'name'              => 'required|string|max:' . $lengths['name'],
            'short_name'        => 'nullable|string|max:' . $lengths['short_name'],
            'tax_code'          => [
                'nullable',
                'string',
                'max:' . $lengths['tax_code'],
                'regex:/^[0-9]{10}(-[0-9]{3})?$/',
                Rule::unique('company', 'tax_code')->whereNull('deleted_at'),
            ],
            'established_date'  => 'nullable|date|before_or_equal:today',
            'phone'             => ['nullable', new PhoneNumber()],
            'email'             => 'nullable|email|max:' . $lengths['email'],
            'website'           => 'nullable|url|max:' . $lengths['website'],
            'address'           => 'nullable|string|max:' . $lengths['address'],
            'description'       => 'nullable|string',
            'logo_url'          => 'nullable|string|max:' . $lengths['logo_url'],
            'is_active'         => 'nullable|boolean',
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
            'tax_code.regex'  => 'Mã số thuế phải gồm 10 chữ số, hoặc 10 chữ số kèm 3 chữ số đơn vị phụ thuộc (vd: 0101234567-001).',
            'tax_code.unique' => 'Mã số thuế này đã được sử dụng bởi công ty khác.',
            'representative_id.exists' => 'Người đại diện không tồn tại.',
            'manager_id.exists'        => 'Người quản lý không tồn tại.',
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
            'representative_id' => 'người đại diện',
            'manager_id'        => 'người quản lý',
            'name'              => 'tên công ty',
            'short_name'        => 'tên viết tắt',
            'tax_code'          => 'mã số thuế',
            'established_date'  => 'ngày thành lập',
            'phone'             => 'số điện thoại',
            'email'             => 'email',
            'website'           => 'website',
            'address'           => 'địa chỉ',
            'description'       => 'mô tả',
            'logo_url'          => 'logo',
            'is_active'         => 'trạng thái hoạt động',
        ];
    }
}
