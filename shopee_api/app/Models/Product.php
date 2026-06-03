<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'product';

    const STATUS_ACTIVE   = 1;
    const STATUS_INACTIVE = 2;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description',
        'price', 'price_sale', 'stock', 'thumbnail',
        'sold', 'rating', 'status',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }
}
