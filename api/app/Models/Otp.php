<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use App\Models\Enum\OtpPurpose;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Otp extends BaseModel
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'otp';
    protected $casts = [
        'purpose'    => OtpPurpose::class,
        'otp_expires_at' => 'datetime',
        'otp_used_at'    => 'datetime',
        'reset_token_expires_at'    => 'datetime',
        'reset_token_used_at'    => 'datetime',
    ];

    protected $fillable = [
        'identifier',
        'purpose',
        'otp',
        'otp_expires_at',
        'otp_used_at',
        'attempts',
        'reset_token',
        'reset_token_expires_at',
        'reset_token_used_at',
    ];
}
