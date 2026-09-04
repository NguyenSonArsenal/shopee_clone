<?php

namespace Modules\Settings\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Settings\Enums\ConfigDataType;
use Modules\Settings\Enums\ConfigGroup;
use Modules\Settings\Models\Config;

class ConfigSeeder extends Seeder
{
    public function run(): void
    {
        // Ví dụ config phân trang: FE đọc để render các lựa chọn "số dòng/trang"
        Config::set(
            'pagination.per_page_options',
            [10, 20, 50, 100],
            ConfigDataType::JSON->value,
            ConfigGroup::GENERAL->value,
            'Các mức số dòng/trang cho phép chọn ở màn danh sách'
        );

        Config::set(
            'pagination.default_per_page',
            50,
            ConfigDataType::INTEGER->value,
            ConfigGroup::GENERAL->value,
            'Số dòng/trang mặc định khi chưa chọn'
        );
    }
}
