<?php

namespace Modules\Organization\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
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
            $result = $query->select('id', 'name', 'short_name')->paginate($perPage);

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
}
