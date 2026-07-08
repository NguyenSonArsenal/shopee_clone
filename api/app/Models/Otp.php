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
    protected $casts = ['purpose' => OtpPurpose::class];

    protected $fillable = [
        'identifier',
        'purpose',
        'code',
        'expires_at',
        'used_at',
    ];
}
