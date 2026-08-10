<?php

namespace Modules\Organization\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\StoreRegionRequest;
use Modules\Organization\Http\Requests\UpdateRegionRequest;
use Modules\Organization\Models\Region;

class RegionController extends Controller
{
    /**
     * GET /api/organization/region
     * Danh sách vùng miền, có phân trang + tìm kiếm theo tên/mã
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', 10);

            $query = Region::with(['company:id,name', 'manager:id,full_name,email']);

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $query->orderBy('created_at', 'desc');

            $total = $query->count();
            $result = $query->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $result->currentPage(), $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * GET /api/organization/region/{id}
     * Chi tiết 1 vùng miền
     */
    public function show($id)
    {
        try {
            $region = Region::with(['company:id,name', 'manager:id,full_name,email'])->find($id);

            if (empty($region)) {
                return $this->error('Không tìm thấy vùng miền', 404);
            }

            return $this->success($region);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * POST /api/organization/region
     * Tạo mới 1 vùng miền
     */
    public function store(StoreRegionRequest $request)
    {
        try {
            $data = $request->validated();

            // Mặc định vùng miền mới là đang hoạt động nếu client không gửi lên
            $data['is_active'] = $data['is_active'] ?? true;

            $region = Region::create($data);

            return $this->success($region, 'Tạo vùng miền thành công', 201);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * PUT /api/organization/region/{id}
     * Cập nhật thông tin 1 vùng miền (hỗ trợ cập nhật từng phần)
     */
    public function update(UpdateRegionRequest $request, $id)
    {
        try {
            $region = Region::find($id);

            if (empty($region)) {
                return $this->error('Không tìm thấy vùng miền', 404);
            }

            $data = $request->all();

            if (empty($data)) {
                return $this->error('Không có dữ liệu để cập nhật', 422);
            }

            $region->fill($data)->save();

            return $this->success($region->refresh(), 'Cập nhật vùng miền thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * DELETE /api/organization/region/{id}
     */
    public function destroy($id)
    {
        try {
            $region = Region::find($id);

            if (empty($region)) {
                return $this->error('Không tìm thấy vùng miền', 404);
            }

            $region->delete();

            return $this->success(null, 'Xoá vùng miền thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
