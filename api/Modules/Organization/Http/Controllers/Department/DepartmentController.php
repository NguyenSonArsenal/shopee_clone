<?php

namespace Modules\Organization\Http\Controllers\Department;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\Department\StoreDepartmentRequest;
use Modules\Organization\Http\Requests\Department\UpdateDepartmentRequest;
use Modules\Organization\Models\Department;
use OpenApi\Annotations as OA;

class DepartmentController extends Controller
{
    /**
     * GET /api/organization/department
     * Danh sách phòng ban, có phân trang + tìm kiếm theo tên/mã
     *
     * @OA\Get(
     *     path="/api/organization/department",
     *     tags={"Organization / Department"},
     *     summary="Danh sách phòng ban",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Trang hiện tại"),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Tìm theo tên/mã"),
     *     @OA\Response(response=200, description="Thành công")
     * )
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', getConstant('BACKEND_PAGINATE'));

            $query = Department::query();

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('code', 'like', "%{$search}%");
                });
            }

            $query->orderBy('created_at', 'desc');

            $total = $query->count();
            $result = $query->select('id', 'company_id', 'branch_id', 'name', 'code', 'is_active')->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $result->currentPage(), $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * GET /api/organization/department/{id}
     * Chi tiết 1 phòng ban
     *
     * @OA\Get(
     *     path="/api/organization/department/{id}",
     *     tags={"Organization / Department"},
     *     summary="Chi tiết phòng ban",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy phòng ban")
     * )
     */
    public function show($id)
    {
        try {
            $department = Department::with(['company:id,name', 'branch:id,name', 'manager:id,full_name,email'])
                ->find($id);

            if (empty($department)) {
                return $this->error('Không tìm thấy phòng ban', 404);
            }

            return $this->success($department);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * POST /api/organization/department
     * Tạo mới 1 phòng ban
     *
     * @OA\Post(
     *     path="/api/organization/department",
     *     tags={"Organization / Department"},
     *     summary="Tạo mới phòng ban",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="company_id", type="integer", nullable=true),
     *             @OA\Property(property="branch_id", type="integer", nullable=true),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Tạo thành công"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function store(StoreDepartmentRequest $request)
    {
        try {
            $data = $request->validated();

            // Mặc định phòng ban mới là đang hoạt động nếu client không gửi lên
            $data['is_active'] = $data['is_active'] ?? true;

            $department = Department::create($data);

            return $this->success($department, 'Tạo phòng ban thành công', 201);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * PUT /api/organization/department/{id}
     * Cập nhật thông tin 1 phòng ban (hỗ trợ cập nhật từng phần)
     *
     * @OA\Put(
     *     path="/api/organization/department/{id}",
     *     tags={"Organization / Department"},
     *     summary="Cập nhật phòng ban",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="company_id", type="integer", nullable=true),
     *             @OA\Property(property="branch_id", type="integer", nullable=true),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy phòng ban"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function update(UpdateDepartmentRequest $request, $id)
    {
        try {
            $department = Department::find($id);

            if (empty($department)) {
                return $this->error('Không tìm thấy phòng ban', 404);
            }

            $data = $request->validated();

            if (empty($data)) {
                return $this->error('Không có dữ liệu để cập nhật', 422);
            }

            $department->fill($data)->save();

            return $this->success($department->refresh(), 'Cập nhật phòng ban thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * DELETE /api/organization/department/{id}
     *
     * @OA\Delete(
     *     path="/api/organization/department/{id}",
     *     tags={"Organization / Department"},
     *     summary="Xoá phòng ban",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Xoá thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy phòng ban")
     * )
     */
    public function destroy($id)
    {
        try {
            $department = Department::find($id);

            if (empty($department)) {
                return $this->error('Không tìm thấy phòng ban', 404);
            }

            $department->delete();

            return $this->success(null, 'Xoá phòng ban thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
