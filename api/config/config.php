<?php

return [
    'status' => [
        'active' => 1,
        'inactive' => -1,
    ],
    'default_weights' => [
        'weekday' => 45, // Thứ 2 đến Thứ 5
        'weekend' => 55, // Thứ 6 đến Chủ Nhật
    ],
    'mail' => [
        'mailtrap' => [
            'username'   => env('MAILTRAP_USERNAME'),
            'password'   => env('MAILTRAP_PASSWORD'),
        ]
    ],
    'auth' => [
        'lockout_minutes' => 1, // Thời gian khóa tài khoản tạm thời (phút)
        'max_login_attempts' => 5, // Số lần đăng nhập sai tối đa
    ],
    'otp' => [
        'max_verify_attempts' => 5, // Số lần nhập sai tối đa
        'email' => [
            'ttl_minutes'        => 1, // Thời gian hiệu lực OTP email (phút)
            'rate_limit_max'     => 3,  // Số lần gửi tối đa trong 1 window
            'rate_limit_minutes' => 10, // Rate limit window (phút)
        ],
        'phone' => [
            'ttl_minutes'        => 5,  // Thời gian hiệu lực OTP SMS (phút)
            'rate_limit_max'     => 3,  // Số lần gửi tối đa trong 1 window
            'rate_limit_minutes' => 10, // Rate limit window (phút)
        ],
    ],
];
