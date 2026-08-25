<?php

namespace Modules\Organization\Http\Controllers\Branch;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\Branch\StoreBranchRequest;
use Modules\Organization\Http\Requests\Branch\UpdateBranchRequest;
use Modules\Organization\Models\Branch;
use OpenApi\Annotations as OA;

class BranchController extends Controller
{
    /**
     * GET /api/organization/branch
     * Danh sách chi nhánh, có phân trang + tìm kiếm theo tên/mã
     *
     * @OA\Get(
     *     path="/api/organization/branch",
     *     tags={"Organization / Branch"},
     *     summary="Danh sách chi nhánh",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Trang hiện tại"),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Tìm theo tên/mã"),
     *     @OA\Response(response=200, description="Thành công")
     * )
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', 10);

            $query = Branch::query();

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $query->orderBy('created_at', 'desc');

            $total = $query->count();
            $result = $query->select('id', 'company_id', 'name', 'code', 'is_active')->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $result->currentPage(), $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * GET /api/organization/branch/{id}
     * Chi tiết 1 chi nhánh
     *
     * @OA\Get(
     *     path="/api/organization/branch/{id}",
     *     tags={"Organization / Branch"},
     *     summary="Chi tiết chi nhánh",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy chi nhánh")
     * )
     */
    public function show($id)
    {
        try {
            $branch = Branch::with(['company:id,name', 'manager:id,full_name,email', 'receptionist:id,full_name,email'])
                ->find($id);

            if (empty($branch)) {
                return $this->error('Không tìm thấy chi nhánh', 404);
            }

            return $this->success($branch);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * POST /api/organization/branch
     * Tạo mới 1 chi nhánh
     *
     * @OA\Post(
     *     path="/api/organization/branch",
     *     tags={"Organization / Branch"},
     *     summary="Tạo mới chi nhánh",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"company_id", "name"},
     *             @OA\Property(property="company_id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="receptionist_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Tạo thành công"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function store(StoreBranchRequest $request)
    {
        try {
            $data = $request->validated();

            // Mặc định chi nhánh mới là đang hoạt động nếu client không gửi lên
            $data['is_active'] = $data['is_active'] ?? true;

            $branch = Branch::create($data);

            return $this->success($branch, 'Tạo chi nhánh thành công', 201);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * PUT /api/organization/branch/{id}
     * Cập nhật thông tin 1 chi nhánh (hỗ trợ cập nhật từng phần)
     *
     * @OA\Put(
     *     path="/api/organization/branch/{id}",
     *     tags={"Organization / Branch"},
     *     summary="Cập nhật chi nhánh",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="company_id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="receptionist_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy chi nhánh"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function update(UpdateBranchRequest $request, $id)
    {
        try {
            $branch = Branch::find($id);

            if (empty($branch)) {
                return $this->error('Không tìm thấy chi nhánh', 404);
            }

            $data = $request->validated();

            if (empty($data)) {
                return $this->error('Không có dữ liệu để cập nhật', 422);
            }

            $branch->fill($data)->save();

            return $this->success($branch->refresh(), 'Cập nhật chi nhánh thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * DELETE /api/organization/branch/{id}
     *
     * @OA\Delete(
     *     path="/api/organization/branch/{id}",
     *     tags={"Organization / Branch"},
     *     summary="Xoá chi nhánh",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Xoá thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy chi nhánh")
     * )
     */
    public function destroy($id)
    {
        try {
            $branch = Branch::find($id);

            if (empty($branch)) {
                return $this->error('Không tìm thấy chi nhánh', 404);
            }

            $branch->delete();

            return $this->success(null, 'Xoá chi nhánh thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
