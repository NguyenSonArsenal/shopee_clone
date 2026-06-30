<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo 10.000 sản phẩm, insert theo batch 500 để tránh timeout/memory
        $total     = 10000;
        $batchSize = 500;
        $batches   = $total / $batchSize;

        for ($i = 0; $i < $batches; $i++) {
            Product::factory()->count($batchSize)->create();
            $this->command->info("✅ Đã insert batch " . ($i + 1) . "/$batches (" . (($i + 1) * $batchSize) . " sản phẩm)");
        }
    }
}
