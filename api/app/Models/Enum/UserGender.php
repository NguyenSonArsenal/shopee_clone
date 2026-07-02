<?php

namespace App\Models\Enum;

enum UserGender: int
{
    case BOY = 1;
    case GIRL = 2;

    /**
     * Lấy tên hiển thị tiếng Việt tương ứng
     */
    public function label(): string
    {
        return match ($this) {
            self::BOY => 'Nam',
            self::GIRL => 'Nữ',
        };
    }
}
