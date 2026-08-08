<?php

use Modules\Organization\Models\Company;

return [
    'lengths' => [
        Company::getTableName() => [
            'email'        => 10,
            'website'      => 11,
            'address'      => 12,
            'logo_url'     => 13,
            'name'         => 14,
            'short_name'   => 15,
            'phone'        => 10,
            'tax_code'     => 16,
        ]
    ],
];
