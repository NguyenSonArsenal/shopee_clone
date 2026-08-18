<?php

namespace Modules\Organization\Http\Controllers\Company;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\Company\StoreCompanyRequest;
use Modules\Organization\Http\Requests\Company\UpdateCompanyRequest;
use Modules\Organization\Models\Company;
use OpenApi\Annotations as OA;

class CompanyController extends Controller
{
    /**
     * GET /api/organization/company
     * Danh sách công ty, có phân trang + tìm kiếm theo tên/mã số thuế
     *
     * @OA\Get(
     *     path="/api/organization/company",
     *     tags={"Organization / Company"},
     *     summary="Danh sách công ty",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Trang hiện tại"),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Tìm theo tên/mã số thuế"),
     *     @OA\Response(response=200, description="Thành công")
     * )
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', 10);

            $query = Company::query();

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('tax_code', 'like', "%{$search}%");
                });
            }

            $query->orderBy('created_at', 'desc');

            $total = $query->count();
            $result = $query->select('id', 'name', 'short_name', 'is_active')->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $result->currentPage(), $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * GET /api/company/{id}
     * Chi tiết 1 công ty
     *
     * @OA\Get(
     *     path="/api/organization/company/{id}",
     *     tags={"Organization / Company"},
     *     summary="Chi tiết công ty",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy công ty")
     * )
     */
    public function show($id)
    {
        try {
            $company = Company::with(['representative:id,full_name,email', 'manager:id,full_name,email'])
                ->find($id);

            if (empty($company)) {
                return $this->error('Không tìm thấy công ty', 404);
            }

            return $this->success($company);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * POST /api/organization/company
     * Tạo mới 1 công ty
     *
     * @OA\Post(
     *     path="/api/organization/company",
     *     tags={"Organization / Company"},
     *     summary="Tạo mới công ty",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="short_name", type="string", nullable=true),
     *             @OA\Property(property="tax_code", type="string", nullable=true),
     *             @OA\Property(property="established_date", type="string", format="date", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="email", type="string", nullable=true),
     *             @OA\Property(property="website", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="representative_id", type="integer", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=201, description="Tạo thành công"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function store(StoreCompanyRequest $request)
    {
        try {
            $data = $request->validated();

            // Mặc định công ty mới là đang hoạt động nếu client không gửi lên
            $data['is_active'] = $data['is_active'] ?? true;

            $company = Company::create($data);

            return $this->success($company, 'Tạo công ty thành công', 201);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * PUT /api/organization/company/{id}
     * Cập nhật thông tin 1 công ty (hỗ trợ cập nhật từng phần)
     *
     * @OA\Put(
     *     path="/api/organization/company/{id}",
     *     tags={"Organization / Company"},
     *     summary="Cập nhật công ty",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="short_name", type="string", nullable=true),
     *             @OA\Property(property="tax_code", type="string", nullable=true),
     *             @OA\Property(property="established_date", type="string", format="date", nullable=true),
     *             @OA\Property(property="phone", type="string", nullable=true),
     *             @OA\Property(property="email", type="string", nullable=true),
     *             @OA\Property(property="website", type="string", nullable=true),
     *             @OA\Property(property="address", type="string", nullable=true),
     *             @OA\Property(property="description", type="string", nullable=true),
     *             @OA\Property(property="representative_id", type="integer", nullable=true),
     *             @OA\Property(property="manager_id", type="integer", nullable=true),
     *             @OA\Property(property="is_active", type="boolean", nullable=true)
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy công ty"),
     *     @OA\Response(response=422, description="Lỗi validate")
     * )
     */
    public function update(UpdateCompanyRequest $request, $id)
    {
        try {
            $company = Company::find($id);

            if (empty($company)) {
                return $this->error('Không tìm thấy công ty', 404);
            }

            $data = $request->validated();

            if (empty($data)) {
                return $this->error('Không có dữ liệu để cập nhật', 422);
            }

            $company->fill($data)->save();

            return $this->success($company->refresh(), 'Cập nhật công ty thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * DELETE /api/organization/company/{id}
     *
     * @OA\Delete(
     *     path="/api/organization/company/{id}",
     *     tags={"Organization / Company"},
     *     summary="Xoá công ty",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Xoá thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy công ty")
     * )
     */
    public function destroy($id)
    {
        try {
            $company = Company::find($id);

            if (empty($company)) {
                return $this->error('Không tìm thấy công ty', 404);
            }

            $company->delete();

            return $this->success(null, 'Xoá công ty thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
