<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    // Tên sản phẩm mẫu theo từng category
    private static array $productNames = [
        // Thời Trang Nam (id 1)
        'Áo thun nam', 'Áo sơ mi nam', 'Quần jean nam', 'Quần short nam', 'Áo khoác nam',
        'Áo polo nam', 'Áo hoodie nam', 'Quần tây nam', 'Áo vest nam', 'Bộ đồ thể thao nam',

        // Điện Thoại (id 2)
        'iPhone 15 Pro Max', 'Samsung Galaxy S24', 'Xiaomi 14 Pro', 'OPPO Find X7',
        'Vivo X100', 'Realme GT5', 'OnePlus 12', 'Google Pixel 8', 'Ốp lưng điện thoại', 'Cáp sạc nhanh',

        // Điện tử (id 3)
        'Smart TV Samsung 55 inch', 'TV LG OLED 65 inch', 'Loa Bluetooth JBL', 'Tai nghe Sony',
        'Amply Marantz', 'Máy chiếu Epson', 'Soundbar Samsung', 'Tivi TCL 50 inch',

        // Laptop (id 4)
        'MacBook Pro M3', 'Dell XPS 15', 'Laptop Asus ROG', 'HP Spectre x360',
        'Lenovo ThinkPad X1', 'Acer Swift 5', 'MSI Creator Z16', 'Surface Pro 9',

        // Máy ảnh (id 5)
        'Canon EOS R6', 'Sony A7 IV', 'Nikon Z6 III', 'Fujifilm X-T5',
        'GoPro Hero 12', 'DJI Pocket 3', 'Lens Canon 50mm', 'Túi đựng máy ảnh',

        // Đồng hồ (id 6)
        'Apple Watch Series 9', 'Samsung Galaxy Watch 6', 'Garmin Fenix 7', 'Casio G-Shock',
        'Seiko Presage', 'Orient Bambino', 'Tissot T-Touch', 'Omega Seamaster',

        // Giày dép nam (id 7)
        'Giày Nike Air Max', 'Adidas Ultraboost', 'Giày da nam công sở', 'Dép Birkenstock',
        'Giày Converse Chuck Taylor', 'New Balance 574', 'Puma RS-X', 'Giày thể thao Vans',

        // Điện gia dụng (id 8)
        'Máy lạnh Daikin 1HP', 'Tủ lạnh Samsung Side by Side', 'Máy giặt LG AI DD',
        'Nồi cơm điện Panasonic', 'Máy hút bụi Dyson', 'Bếp từ Bosch', 'Lò vi sóng Electrolux',

        // Thể thao (id 9)
        'Bóng đá Adidas', 'Vợt cầu lông Yonex', 'Đạp xe leo núi', 'Balo du lịch 40L',
        'Giày chạy bộ Nike', 'Bộ dụng cụ tập gym', 'Lều cắm trại', 'Bình nước thể thao',

        // Ô tô xe máy (id 10)
        'Phụ kiện xe máy', 'Camera hành trình ô tô', 'Lọc gió xe ô tô', 'Lốp xe Michelin',
        'Đèn LED gầm xe', 'Ghế ngồi xe hơi cho bé', 'Nước rửa xe', 'Bộ vệ sinh xe máy',

        // Thời trang nữ (id 11)
        'Đầm hoa maxi nữ', 'Áo blouse nữ', 'Chân váy công sở', 'Quần jean nữ ống rộng',
        'Áo khoác dạ nữ', 'Bộ đồ ngủ lụa', 'Đồ bơi 2 mảnh', 'Vest nữ công sở',

        // Mẹ & Bé (id 12)
        'Xe đẩy em bé', 'Ghế ăn dặm', 'Bình sữa Pigeon', 'Tã dán Pampers',
        'Đồ chơi giáo dục', 'Quần áo sơ sinh', 'Địu em bé Ergobaby', 'Máy hút sữa Medela',

        // Sắc đẹp (id 13)
        'Kem chống nắng Anessa', 'Son MAC Ruby Woo', 'Serum vitamin C', 'Mặt nạ Innisfree',
        'Nước tẩy trang Bioderma', 'Phấn nền Huda Beauty', 'Mascara Maybelline', 'Kem dưỡng Laneige',

        // Sức khỏe (id 14)
        'Máy đo huyết áp Omron', 'Máy massage cổ', 'Thực phẩm chức năng Vitamin C',
        'Bàn chải điện Oral-B', 'Máy xông mũi họng', 'Băng gối thể thao', 'Dầu tràm trà', 'Đai lưng bảo vệ',
    ];

    private static array $brands = [
        'Nike', 'Adidas', 'Samsung', 'Apple', 'Sony', 'LG', 'Xiaomi', 'OPPO',
        'Panasonic', 'Casio', 'Canon', 'Nikon', 'Dell', 'HP', 'Asus', 'Lenovo',
        'Uniqlo', 'Zara', 'H&M', 'Gucci', 'Chanel', 'Dior', 'Maybelline', 'L\'Oréal',
        'Innisfree', 'Laneige', 'The Ordinary', 'Cetaphil', 'Dyson', 'Philips',
    ];

    public function definition(): array
    {
        $name  = $this->faker->randomElement(self::$productNames);
        $brand = $this->faker->randomElement(self::$brands);
        $fullName = $brand . ' ' . $name . ' ' . $this->faker->numerify('####');

        $price     = $this->faker->numberBetween(50000, 50000000);
        $priceSale = $this->faker->boolean(60)
            ? (int) ($price * $this->faker->randomFloat(2, 0.7, 0.95))
            : null;

        return [
            'category_id' => Category::inRandomOrder()->value('id') ?? 1,
            'name'        => $fullName,
            'slug'        => Str::slug($fullName) . '-' . Str::random(6),
            'description' => $this->faker->paragraphs(3, true),
            'price'       => $price,
            'price_sale'  => $priceSale,
            'stock'       => $this->faker->numberBetween(0, 500),
            'thumbnail'   => 'https://picsum.photos/seed/' . $this->faker->numberBetween(1, 1000) . '/400/400',
            'sold'        => $this->faker->numberBetween(0, 10000),
            'rating'      => $this->faker->randomFloat(1, 3.0, 5.0),
            'status'      => 1,
        ];
    }
}
