<?php

namespace Modules\Organization\Http\Requests;

use Illuminate\Validation\Rule;

class UpdateCompanyRequest extends StoreCompanyRequest
{
    /**
     * Quy tắc validate khi cập nhật công ty
     * - Kế thừa rule của StoreCompanyRequest, chỉ khác:
     *   + Cho phép cập nhật từng phần (name dùng "sometimes" thay vì luôn bắt buộc)
     *   + Kiểm tra trùng mã số thuế nhưng bỏ qua chính bản ghi đang sửa
     *
     * @return array
     */
    public function rules()
    {
        $rules = parent::rules();

        // Chỉ validate name khi client có gửi lên (hỗ trợ cập nhật từng phần)
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
