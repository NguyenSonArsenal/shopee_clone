<?php

namespace Modules\ApiDoc\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Modules\ApiDoc\Models\ApiDoc;
use OpenApi\Annotations as OA;

class ApiDocController extends Controller
{
    /**
     * GET /api/api-doc
     * Danh sách API đã làm, có phân trang + tìm kiếm theo url/mô tả/module
     *
     * @OA\Get(
     *     path="/api/api-doc",
     *     tags={"ApiDoc"},
     *     summary="Danh sách API doc",
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Trang hiện tại"),
     *     @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Tìm theo url/mô tả/module"),
     *     @OA\Response(response=200, description="Thành công")
     * )
     */
    public function index()
    {
        try {
            $perPage = request()->get('per_page', getConstant('BACKEND_PAGINATE'));

            $query = ApiDoc::query();

            if (request('search')) {
                $search = request('search');
                $query->where(function ($q) use ($search) {
                    $q->where('url', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('module', 'like', "%{$search}%");
                });
            }

            $query->orderBy('module')->orderBy('url');

            $total = $query->count();
            $result = $query->paginate($perPage);

            return $this->successWithPaging($total, $result->items(), $result->currentPage(), $perPage);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * GET /api/api-doc/{id}
     * Chi tiết 1 API doc
     *
     * @OA\Get(
     *     path="/api/api-doc/{id}",
     *     tags={"ApiDoc"},
     *     summary="Chi tiết API doc",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy")
     * )
     */
    public function show($id)
    {
        try {
            $apiDoc = ApiDoc::find($id);

            if (empty($apiDoc)) {
                return $this->error('Không tìm thấy API doc', 404);
            }

            return $this->success($apiDoc);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * DELETE /api/api-doc/{id}
     *
     * @OA\Delete(
     *     path="/api/api-doc/{id}",
     *     tags={"ApiDoc"},
     *     summary="Xoá API doc",
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Xoá thành công"),
     *     @OA\Response(response=404, description="Không tìm thấy")
     * )
     */
    public function destroy($id)
    {
        try {
            $apiDoc = ApiDoc::find($id);

            if (empty($apiDoc)) {
                return $this->error('Không tìm thấy API doc', 404);
            }

            $apiDoc->delete();

            return $this->success(null, 'Xoá API doc thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }
}
