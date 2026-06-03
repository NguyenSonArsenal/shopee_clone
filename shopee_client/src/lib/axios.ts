import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	timeout: 10000,
});

// ─── Request Interceptor ───────────────────────────────────────────────
// Tự động gắn Bearer token vào mỗi request
axiosInstance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token');
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────
// Tự động refresh token khi nhận 401, rồi retry request cũ
let isRefreshing = false; // Tránh gọi refresh nhiều lần cùng lúc
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

// Khi đang refresh, các request khác sẽ xếp hàng chờ
const processQueue = (error: unknown, token: string | null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token!);
	});
	failedQueue = [];
};

axiosInstance.interceptors.response.use(
	(response) => response, // Thành công → pass thẳng

	async (error) => {
		const originalRequest = error.config;

		// Chỉ xử lý lỗi 401 và chưa retry lần nào
		if (error.response?.status === 401 && !originalRequest._retry) {
			const rfToken = localStorage.getItem('rf_token');

			// Không có refresh token → logout luôn
			if (!rfToken) {
				localStorage.removeItem('token');
				localStorage.removeItem('rf_token');
				window.location.href = '/login';
				return Promise.reject(error);
			}

			// Đang có request khác đang refresh → xếp hàng chờ
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((newToken) => {
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return axiosInstance(originalRequest);
				});
			}

			// Bắt đầu refresh
			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const res = await axios.post(
					`${process.env.NEXT_PUBLIC_API_URL}/refresh-token`,
					{ refresh_token: rfToken },
					{ headers: { 'Content-Type': 'application/json' } }
				);

				const newToken = res.data.data.access_token;
				localStorage.setItem('token', newToken);

				// Thông báo cho các request đang chờ
				processQueue(null, newToken);

				// Retry request ban đầu với token mới
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return axiosInstance(originalRequest);

			} catch (refreshError) {
				// Refresh thất bại → logout
				processQueue(refreshError, null);
				localStorage.removeItem('token');
				localStorage.removeItem('rf_token');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);

export default axiosInstance;
