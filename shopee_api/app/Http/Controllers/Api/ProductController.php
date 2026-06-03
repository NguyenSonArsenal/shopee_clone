<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * GET /api/categories
     * Danh sách category đang active
     */
    public function getCategory()
    {
        try {
            $categories = Category::where('status', Category::STATUS_ACTIVE)
                ->select('id', 'name', 'slug', 'image')
                ->orderBy('name')
                ->get();

            return $this->success($categories);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    public function getProduct()
    {
        try {
            $perPage = request()->get('per_page', 10);
            $page = request()->get('page', 1);

            $query = Product::with('category:id,name,slug')
                ->where('status', Product::STATUS_ACTIVE);

            // Filter theo category
            if (request('category_id')) {
                $query->where('category_id', request('category_id'));
            }

            // Tìm kiếm theo tên
            if (request('search')) {
                $query->where('name', 'like', '%' . request('search') . '%');
            }

            // Sắp xếp (chỉ cho phép các trường hợp lệ)
            $allowedSorts = ['created_at', 'price', 'sold', 'rating'];
            $sortBy       = in_array(request('sort_by'), $allowedSorts) ? request('sort_by') : 'created_at';
            $sortOrder    = request('sort_order') === 'asc' ? 'asc' : 'desc';
            $query->orderBy($sortBy, $sortOrder);

            $total = $query->count();
            $result = $query->select(
                'id', 'category_id', 'name', 'slug',
                'price', 'price_sale', 'thumbnail',
                'sold', 'rating', 'stock'
            )->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $page, $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
