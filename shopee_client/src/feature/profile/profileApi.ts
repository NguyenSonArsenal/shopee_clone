import axiosInstance from '@/lib/axios';
import { User } from '@feature/profile/model/type';

export type UpdateProfileParams = {
	full_name: string;
	email: string;
	phone: string;
	gender: number;
}

const profileApi = {
	// GET /api/me
	me: (): Promise<User> =>
		axiosInstance.get('/me').then(res => res.data.data),

	// PUT /api/me
	updateProfile: (params: UpdateProfileParams): Promise<User> =>
		axiosInstance.put('/me', params).then(res => res.data.data),
};

export default profileApi;