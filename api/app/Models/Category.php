<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
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
