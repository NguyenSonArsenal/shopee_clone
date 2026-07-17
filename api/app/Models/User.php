<?php

namespace App\Models;

use App\Models\Enum\UserGender;
use App\Models\Enum\UserType;
use App\Models\Enum\UserStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $table = 'user';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted()
    {
        static::creating(function (User $user) {
            if (!$user->id) {
                $user->id = (string) Str::orderedUuid();
            }
        });
    }

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
        'type',
        'company_name',
        'referral_code',
        'sponsor_id',
    ];

    // Khai báo cast kiểu dữ liệu sang Enum
    protected $casts = [
        'status' => UserStatus::class,
        'gender' => UserGender::class,
        'type' => UserType::class,
    ];

    public function sponsor()
    {
        return $this->belongsTo(User::class, 'sponsor_id');
    }
}
