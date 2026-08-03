<?php

return [
    'lengths' => [
        Modules\Organization\Models\Company::getTableName() => [
            'email'        => 64,
            'website'      => 64,
            'address'      => 255,
            'logo_url'     => 255,
            'name'         => 255,
            'short_name'   => 100,
            'phone'        => 15,
            'tax_code'     => 20,
        ]
    ],
];
