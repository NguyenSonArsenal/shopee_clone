<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Thời Trang Nam',           'icon' => '👕'],
            ['name' => 'Điện Thoại & Phụ Kiện',   'icon' => '📱'],
            ['name' => 'Thiết Bị Điện Tử',         'icon' => '📺'],
            ['name' => 'Máy Tính & Laptop',         'icon' => '💻'],
            ['name' => 'Máy Ảnh & Quay Phim',      'icon' => '📷'],
            ['name' => 'Đồng Hồ',                   'icon' => '⌚'],
            ['name' => 'Giày Dép Nam',              'icon' => '👟'],
            ['name' => 'Thiết Bị Điện Gia Dụng',   'icon' => '🔌'],
            ['name' => 'Thể Thao & Du Lịch',       'icon' => '⚽'],
            ['name' => 'Ô Tô & Xe Máy',            'icon' => '🏍️'],
            ['name' => 'Thời Trang Nữ',             'icon' => '👗'],
            ['name' => 'Mẹ & Bé',                   'icon' => '🍼'],
            ['name' => 'Sắc Đẹp',                   'icon' => '💄'],
            ['name' => 'Sức Khỏe',                  'icon' => '💊'],
        ];

        foreach ($categories as $category) {
            DB::table('category')->insertOrIgnore([
                'name'       => $category['name'],
                'slug'       => Str::slug($category['name']) . '-' . Str::random(4),
                'image'      => null,
                'status'     => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
