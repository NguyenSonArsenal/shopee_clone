<?php

namespace App\Models\Enum;

enum UserType: string
{
    case F2 = 'f2';
    case CTV = 'ctv';
    case KH = 'kh';

    /**
     * Lấy tên hiển thị tiếng Việt tương ứng
     */
    public function label(): string
    {
        return match ($this) {
            self::F2 => 'Công ty (F2)',
            self::CTV => 'CTV',
            self::KH => 'Khách hàng',
        };
    }
}
