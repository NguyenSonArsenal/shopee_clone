<?php

namespace App\Models\Enum;

enum UserStatus: int
{
    case ACTIVE = 1;
    case BLOCKED = 2;

    /**
     * Lấy tên hiển thị tiếng Việt tương ứng
     */
    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Hoạt động',
            self::BLOCKED => 'Đã khóa',
        };
    }
}
