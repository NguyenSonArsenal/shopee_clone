<?php

use Modules\Organization\Models\Branch;
use Modules\Organization\Models\Company;
use Modules\Organization\Models\Department;

return [
    'lengths' => [
        Company::getTableName() => [
            'email'        => 64,
            'website'      => 64,
            'address'      => 255,
            'logo_url'     => 255,
            'name'         => 255,
            'short_name'   => 100,
            'phone'        => 15,
            'tax_code'     => 20,
        ],
        Branch::getTableName() => [
            'name'    => 255,
            'code'    => 50,
            'address' => 255,
            'phone'   => 15,
        ],
        Department::getTableName() => [
            'name' => 255,
            'code' => 50,
        ],
    ],
];
