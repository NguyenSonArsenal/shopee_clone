import axiosInstance from '@/lib/axios';

export interface Category {
	id: number;
	name: string;
	slug: string;
	image: string | null;
}

export const categoryApi = {
	getList: () => axiosInstance.get('/category').then(res => res.data.data as Category[]),
};