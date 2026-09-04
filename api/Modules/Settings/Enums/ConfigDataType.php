<?php

namespace Modules\Settings\Enums;

// Kiểu dữ liệu thật của cột `value` (luôn lưu string trong DB) — Config::getValue() ép kiểu lại theo đây
enum ConfigDataType: string
{
    case STRING = 'string';
    case INTEGER = 'integer';
    case DECIMAL = 'decimal';
    case BOOLEAN = 'boolean';
    case JSON = 'json';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
