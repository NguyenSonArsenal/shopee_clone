<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends BaseModel
{
    use SoftDeletes;

    protected $table = 'category';

    const STATUS_ACTIVE   = 1;
    const STATUS_INACTIVE = 2;

    protected $fillable = ['name', 'slug', 'image', 'status'];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
