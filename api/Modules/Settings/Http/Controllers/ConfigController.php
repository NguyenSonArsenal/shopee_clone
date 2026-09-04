<?php

namespace Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Modules\Settings\Models\Config;
use OpenApi\Annotations as OA;

class ConfigController extends Controller
{
    /**
     * GET /api/settings/config
     * Danh sách config, lọc theo group hoặc danh sách key
     *
     * @OA\Get(
     *     path="/api/settings/config",
     *     tags={"Settings / Config"},
     *     summary="Danh sách cấu hình hệ thống",
     *     @OA\Parameter(name="group", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="keys[]", in="query", @OA\Schema(type="array", @OA\Items(type="string"))),
     *     @OA\Response(response=200, description="Thành công")
     * )
     */
    public function index(Request $request)
    {
        try {
            $query = Config::query();

            if ($request->filled('group')) {
                $query->where('group', $request->get('group'));
            }

            if ($request->filled('keys')) {
                $query->whereIn('key', (array) $request->get('keys'));
            }

            $rows = $query->orderBy('key')->get(['key', 'data_type', 'group', 'description']);

            // Trả kèm value đã ép kiểu (Config::getValue) để FE nhận đúng array/number/boolean, không phải string thô
            $result = $rows->map(fn ($row) => [
                'key' => $row->key,
                'value' => Config::getValue($row->key),
                'data_type' => $row->data_type,
                'group' => $row->group,
                'description' => $row->description,
            ]);

            return $this->success($result);
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    /**
     * PUT /api/settings/config
     * Cập nhật nhiều key cùng lúc. Key đã có thì chỉ đổi value (giữ nguyên data_type/group/description);
     * key chưa có thì tự tạo mới (group mặc định "general", data_type tự suy ra từ kiểu value gửi lên)
     *
     * @OA\Put(
     *     path="/api/settings/config",
     *     tags={"Settings / Config"},
     *     summary="Cập nhật cấu hình hệ thống (bulk, tự tạo key mới nếu chưa có)",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"data"},
     *             @OA\Property(property="data", type="object", example={"pagination.default_per_page": 20})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Cập nhật thành công"),
     *     @OA\Response(response=422, description="Không có dữ liệu để cập nhật")
     * )
     */
    public function update(Request $request)
    {
        try {
            $data = (array) $request->input('data', []);

            if (empty($data)) {
                return $this->error('Không có dữ liệu để cập nhật', 422);
            }

            foreach ($data as $key => $value) {
                $config = Config::firstOrNew(['key' => $key]);

                if (!$config->exists) {
                    $config->data_type = $this->inferDataType($value);
                    $config->group = 'general';
                }

                $config->value = is_array($value) ? json_encode($value) : (string) $value;
                $config->save();
            }

            return $this->success(null, 'Cập nhật cấu hình thành công');
        } catch (\Exception $e) {
            Log::error($e);
            return $this->systemError();
        }
    }

    // Chỉ dùng khi tạo mới key chưa từng có trong bảng — key đã tồn tại thì giữ nguyên data_type cũ
    private function inferDataType(mixed $value): string
    {
        return match (true) {
            is_array($value) => 'json',
            is_bool($value) => 'boolean',
            is_int($value) => 'integer',
            is_float($value) => 'decimal',
            default => 'string',
        };
    }
}
