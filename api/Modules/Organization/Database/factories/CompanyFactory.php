<?php

namespace Modules\Organization\Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Organization\Models\Company;

class CompanyFactory extends Factory
{
    protected $model = Company::class;

    private static array $prefixes = ['Công ty CP', 'Công ty TNHH', 'Công ty TNHH MTV', 'Tập đoàn'];

    private static array $businessWords = [
        'Đầu Tư', 'Xây Dựng', 'Thương Mại', 'Dịch Vụ', 'Bất Động Sản',
        'Công Nghệ', 'Vận Tải', 'Xuất Nhập Khẩu', 'Truyền Thông', 'Giáo Dục',
    ];

    private static array $properNames = [
        'Tân Long', 'Hoàng Gia', 'Việt Nam', 'Thành Đạt', 'Phú Quý', 'Đại Dương',
        'Hồng Phát', 'Minh Khang', 'Sao Việt', 'An Phát', 'Gia Long', 'Thiên Ân',
        'Bình Minh', 'Đông Dương', 'Kim Cương', 'Ngọc Việt',
    ];

    public function definition()
    {
        $businessWord = $this->faker->randomElement(self::$businessWords);
        $properName = $this->faker->randomElement(self::$properNames);

        // Cột email/website hiện chỉ dài 20 ký tự nên phải cắt bớt để tránh lỗi "Data too long"
        return [
            // Ngẫu nhiên gán cho 1 user có sẵn làm đại diện/quản lý, có thể null nếu chưa có user nào
            'representative_id' => User::inRandomOrder()->value('id'),
            'manager_id' => User::inRandomOrder()->value('id'),
            'name' => "{$this->faker->randomElement(self::$prefixes)} {$businessWord} {$properName}",
            'short_name' => $properName,
            'tax_code' => $this->faker->unique()->numerify('##########'),
            'established_date' => $this->faker->dateTimeBetween('-30 years', '-1 year')->format('Y-m-d'),
            'phone' => $this->faker->numerify('0#########'),
            'email' => substr($this->faker->unique()->safeEmail(), 0, 20),
            'website' => substr($this->faker->domainName(), 0, 20),
            'address' => $this->faker->address(),
            'description' => $this->faker->realText(150),
            'logo_url' => null,
            'is_active' => $this->faker->boolean(85),
        ];
    }
}
