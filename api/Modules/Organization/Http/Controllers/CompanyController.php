<?php

namespace Modules\Organization\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Http\Requests\StoreCompanyRequest;
use Modules\Organization\Http\Requests\UpdateCompanyRequest;
use Modules\Organization\Models\Company;

class CompanyController extends Controller
{
    /**
     * GET /api/organization/company
     * Danh sách công ty, có phân trang + tìm kiếm theo tên/mã số thuế
     */
    public function getList()
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
     */
    public function getDetail($id)
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
     * @param StoreCompanyRequest $request Dữ liệu công ty đã được validate
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(StoreCompanyRequest $request)
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
     * @param UpdateCompanyRequest $request Dữ liệu cần cập nhật đã được validate
     * @param string $id UUID của công ty
     * @return \Illuminate\Http\JsonResponse
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
}
