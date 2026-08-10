<?php

namespace Modules\Organization\Models;

use App\Models\Base\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class Region extends BaseModel
{
    use SoftDeletes;

    protected $table = 'region';

    protected $fillable = [
        'company_id',
        'manager_id',
        'name',
        'code',
        'phone',
        'email',
        'address',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }
}
