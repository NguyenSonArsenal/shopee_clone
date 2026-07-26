<?php

namespace Modules\Organization\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Modules\Organization\Database\Factories\CompanyFactory;

class Company extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'company';
    public $incrementing = false;
    protected $keyType = 'string';

    protected static function booted()
    {
        static::creating(function (Company $company) {
            if (!$company->id) {
                $company->id = (string) Str::orderedUuid();
            }
        });
    }

    protected $fillable = [
        'representative_id',
        'manager_id',
        'name',
        'short_name',
        'tax_code',
        'established_date',
        'phone',
        'email',
        'website',
        'address',
        'description',
        'logo_url',
        'is_active',
    ];

    protected $casts = [
        'established_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function representative()
    {
        return $this->belongsTo(User::class, 'representative_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    // Model nằm ngoài namespace App\Models nên HasFactory không tự đoán được tên factory, phải khai báo tay
    protected static function newFactory(): Factory
    {
        return CompanyFactory::new();
    }
}
