<?php

namespace Modules\Organization\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $companyId = DB::table('company')->where('name', 'Công ty CP Dịch Vụ Và Đầu Tư Tân Long')->value('id');

        $names = [
            ['Hạ Long', 'I0000000075'],
            ['Hạ Long Xanh', 'I0000000115'],
            ['Nghệ An', 'I0000000018'],
            ['Tân Long Bắc Giang', 'I0000000038'],
            ['Tân Long Bắc Ninh', 'I0000000107'],
            ['Tân Long Đà Nẵng', 'I0000000116'],
            ['Tân Long Đông Hà Nội', 'I0000000043'],
            ['Tân Long Hải Dương', 'I0000000117'],
            ['Tân Long Hải Phòng', 'I0000000090'],
            ['Tân Long Homes', 'I0000000032'],
            ['Tân Long Mỹ Đình', 'I0000003'],
            ['Tân Long Nguyễn Trãi', 'I0000000108'],
            ['Tân Long Nha Trang', 'I0000000102'],
            ['Tân Long Phú Quốc', 'I0000000112'],
            ['Tân Long Tây Hà Nội', 'I0000000059'],
            ['Tân Long Tây Hồ', 'I0000002'],
            ['Tân Long Vĩnh Yên', 'I0000000105'],
            ['Tân Long Yên Sở', 'I0000000122'],
            ['Tập Đoàn Gosun', 'I0000000097'],
            ['Xuân Diệu', 'I0000001'],
        ];

        $now = now();

        foreach ($names as [$name, $code]) {
            DB::table('branch')->insert([
                'company_id' => $companyId,
                'name' => $name,
                'code' => $code,
                // Chưa có data nhân sự chuẩn nên để trống, gán sau khi có bảng user thật
                'manager_id' => null,
                'receptionist_id' => null,
                'is_active' => true,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }
}
