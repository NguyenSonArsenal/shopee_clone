<?php

namespace App\Models;

use App\Models\Enum\UserGender;
use App\Models\Enum\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'user';

    const STATUS_ACTIVE = 1;
    const STATUS_BLOCKED = 2;

    const GENDER_BOY = 1;
    const GENDER_GIRL = 2;
    protected $fillable = [
        'username',
        'password',
        'full_name',
        'status',
        'email',
        'phone',
        'rf_token',
        'gender',
        'avatar',
        'birthday',
    ];

    // Khai báo cast kiểu dữ liệu sang Enum
    protected $casts = [
        'status' => UserStatus::class,
        'gender' => UserGender::class,
    ];
}
