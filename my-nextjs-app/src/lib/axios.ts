import axios from 'axios';
import {STORAGE_KEYS} from "@/config/constant";

const myAxios = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
	timeout: 10000,
});

// ─── Request Interceptor ───────────────────────────────────────────────
// Tự động gắn Bearer token vào mỗi request
myAxios.interceptors.request.use((config) => {
	const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
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

myAxios.interceptors.response.use(
	(response) => response, // Thành công → pass thẳng

	async (error) => {
		const originalRequest = error.config;

    // Debug
    console.error(
      `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`, error.response?.data || error.message
    );

    // Chỉ xử lý lỗi 401 và KHÔNG PHẢI là API login, đồng thời chưa retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/login')) {
			const rfToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

			// Không có refresh token → logout luôn
			if (!rfToken) {
				localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
				localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
				window.location.href = '/login';
				return Promise.reject(error);
			}

			// Đang có request khác đang refresh → xếp hàng chờ
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((newToken) => {
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return myAxios(originalRequest);
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
				return myAxios(originalRequest);

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
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      error.message = serverMessage;
    }
		return Promise.reject(error);
	}
);

export default myAxios;
