<?php

namespace Modules\Settings\Models;

use App\Models\Base\BaseModel;
use Illuminate\Support\Facades\Cache;

class Config extends BaseModel
{
    protected $table = 'config';

    public $timestamps = false;

    protected $fillable = ['key', 'value', 'data_type', 'group', 'description', 'is_public'];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    public const CACHE_KEY = 'config:all';
    public const CACHE_TTL = 3600;

    protected static function booted(): void
    {
        static::saved(fn () => static::clearCache());
        static::deleted(fn () => static::clearCache());
    }

    // Toàn bộ bảng config, cache theo key => ['value' => ..., 'data_type' => ...]
    public static function allCached(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            return static::query()
                ->get(['key', 'value', 'data_type'])
                ->keyBy('key')
                ->map(fn (self $c) => ['value' => $c->value, 'data_type' => $c->data_type])
                ->all();
        });
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    // Lấy giá trị đã ép kiểu theo data_type (int/float/bool/array) để dùng trực tiếp trong code PHP
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $all = static::allCached();
        if (!array_key_exists($key, $all)) {
            return $default;
        }

        $row = $all[$key];

        return match ($row['data_type']) {
            'integer' => (int) $row['value'],
            'decimal' => (float) $row['value'],
            'boolean' => filter_var($row['value'], FILTER_VALIDATE_BOOLEAN),
            'json' => json_decode((string) $row['value'], true),
            default => $row['value'],
        };
    }

    // Upsert 1 key (tạo mới nếu chưa có), tự json_encode nếu value là mảng
    public static function set(string $key, mixed $value, string $dataType = 'string', string $group = 'general', ?string $description = null): self
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => is_array($value) ? json_encode($value) : (string) $value,
                'data_type' => $dataType,
                'group' => $group,
                'description' => $description,
            ]
        );
    }
}
