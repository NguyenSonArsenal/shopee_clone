<?php

use Modules\Organization\Models\Company;
use Modules\Organization\Models\Region;

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
        Region::getTableName() => [
            'name'         => 255,
            'code'         => 50,
            'phone'        => 15,
            'email'        => 64,
            'address'      => 255,
        ]
    ],
];
