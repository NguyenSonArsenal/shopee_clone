import { create } from 'zustand';

interface AuthState {
	user: any;
	token: string | null;
	login: (user: any, token: string) => void;
	logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	user: null,
	token: null,

	// Hành động đăng nhập thành công: Lưu vào RAM của App và lưu vào localStorage để khi F5 không bị mất
	login: (user, token) => {
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('token', token);
		set({ user, token });
	},

	// Hành động đăng xuất: Xóa sạch RAM và localStorage
	logout: () => {
		localStorage.removeItem('user');
		localStorage.removeItem('token');
		set({ user: null, token: null });
	}
}));
