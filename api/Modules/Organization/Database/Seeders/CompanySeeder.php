<?php

namespace Modules\Organization\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Organization\Models\Company;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        Company::factory()->count(32)->create();
    }
}
