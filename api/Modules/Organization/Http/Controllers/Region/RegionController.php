<?php

namespace Modules\Organization\Http\Controllers\Region;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\Region\StoreRegionRequest;
use Modules\Organization\Http\Requests\Region\UpdateRegionRequest;
use Modules\Organization\Models\Region;
use OpenApi\Annotations as OA;

class RegionController extends Controller
{
    /**
     * GET /api/organization/region
     * Danh sách vùng miền, có phân trang + tìm kiếm theo tên/mã
     *
     * @OA\Get(
     *     path="/api/organization/region",
     *     tags={"Organization / Region"},
     *     summary="Danh sách vùng miền",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Trang hiện tại"),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Tìm theo tên/mã vùng miền"),
     *     @OA\Response(response=200, description="Thành công")
     * )
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
     *
     * @OA\Get(
     *     path="/api/organization/region/{id}",
     *     tags={"Organization / Region"},
     *     summary="Chi tiết vùng miền",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy vùng miền")
     * )
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
     *
     * @OA\Post(
     *     path="/api/organization/region",
     *     tags={"Organization / Region"},
     *     summary="Tạo mới vùng miền",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="company_id", type="integer", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="email", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Tạo thành công"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
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
     *
     * @OA\Put(
     *     path="/api/organization/region/{id}",
     *     tags={"Organization / Region"},
     *     summary="Cập nhật vùng miền",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="company_id", type="integer", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="email", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy vùng miền"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
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
     *
     * @OA\Delete(
     *     path="/api/organization/region/{id}",
     *     tags={"Organization / Region"},
     *     summary="Xoá vùng miền",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Xoá thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy vùng miền")
     * )
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
