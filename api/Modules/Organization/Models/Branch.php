<?php

namespace Modules\Organization\Models;

use App\Models\Base\BaseModel;
use App\Models\User;
use Illuminate\Database\Eloquent\SoftDeletes;

class Branch extends BaseModel
{
    use SoftDeletes;

    protected $table = 'branch';

    protected $fillable = [
        'company_id',
        'name',
        'code',
        'address',
        'phone',
        'manager_id',
        'receptionist_id',
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

    public function receptionist()
    {
        return $this->belongsTo(User::class, 'receptionist_id');
    }
}
