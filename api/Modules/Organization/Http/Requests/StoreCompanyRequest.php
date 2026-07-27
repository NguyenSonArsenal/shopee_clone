<?php

namespace Modules\Organization\Http\Requests;

use App\Http\Requests\BaseApiFormRequest;
use App\Rules\PhoneNumber;
use Illuminate\Validation\Rule;

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
        return [
            'representative_id' => 'nullable|uuid|exists:user,id',
            'manager_id'        => 'nullable|uuid|exists:user,id',
            'name'              => 'required|string|max:255',
            'short_name'        => 'nullable|string|max:100',
            'tax_code'          => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9]{10}(-[0-9]{3})?$/',
                // Mã số thuế không được trùng với công ty khác (bỏ qua bản ghi đã xoá mềm)
                Rule::unique('company', 'tax_code')->whereNull('deleted_at'),
            ],
            'established_date'  => 'nullable|date|before_or_equal:today',
            'phone'             => ['nullable', new PhoneNumber()],
            'email'             => 'nullable|email|max:64',
            'website'           => 'nullable|url|max:32',
            'address'           => 'nullable|string|max:255',
            'description'       => 'nullable|string',
            'logo_url'          => 'nullable|string|max:255',
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
