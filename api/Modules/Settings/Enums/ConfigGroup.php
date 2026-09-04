<?php

namespace Modules\Settings\Enums;

// Nhóm cấu hình — cột `group` bảng config, chỉ để gom theo màn hình quản trị (/cau-hinh).
// Thêm module mới thì thêm case ở đây, không cần sửa schema vì cột chỉ là varchar.
enum ConfigGroup: string
{
    case GENERAL = 'general';
    case ORGANIZATION = 'organization';

    public function label(): string
    {
        return match ($this) {
            self::GENERAL => 'Cấu hình chung',
            self::ORGANIZATION => 'Cơ cấu tổ chức',
        };
    }

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
