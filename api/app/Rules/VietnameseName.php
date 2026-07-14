<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class VietnameseName implements Rule
{
    protected ?string $attributeLabel;
    protected string $errorMessage = '';

    public function __construct(?string $attributeLabel = null)
    {
        $this->attributeLabel = $attributeLabel;
    }

    public function passes($attribute, $value)
    {
        $label = $this->attributeLabel ?? 'Trường này';

        if (!is_string($value)) {
            $this->errorMessage = "{$label} phải là một chuỗi ký tự.";
            return false;
        }

        $pattern = '/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ\s]+$/u';
        if (!preg_match($pattern, $value)) {
            $this->errorMessage = "{$label} chỉ được nhập chữ cái tiếng Việt và khoảng trắng.";
            return false;
        }

        return true;
    }

    public function message()
    {
        return $this->errorMessage;
    }
}
