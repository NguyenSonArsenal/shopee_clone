<?php

namespace App\Models\Enum;

enum OtpPurpose: string {
    case REGISTER = 'register';
    case FORGOT_PASSWORD = 'forgot_password';
}
