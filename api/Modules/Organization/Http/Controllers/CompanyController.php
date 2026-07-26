<?php

namespace Modules\Organization\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\Organization\Models\Company;

class CompanyController extends Controller
{
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
