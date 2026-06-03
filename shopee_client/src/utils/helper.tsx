export const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Parse lỗi từ Axios response của API về dạng string[]
 * Dùng chung cho tất cả form submit trong toàn bộ project
 */
export function parseApiErrors(err: any): string[] {
	if (!err.response || !err.response.data) {
		return ['Không thể kết nối đến máy chủ API!'];
	}

	const errorData = err.response.data;

	// Laravel Validation Error (422) - nhiều lỗi cùng lúc
	if (errorData.errors) {
		return Object.values(errorData.errors).flat() as string[];
	}

	// Lỗi đơn từ server (401, 403, 500...)
	return [errorData.message || 'Đã có lỗi xảy ra, vui lòng thử lại!'];
}
