"use client"; // Bắt buộc phải có dòng này ở đầu file khi dùng useState

import React, {useState} from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '@store/authStore';
import {EyeOn, EyeOff} from "@icon";

export default function LoginPage() {
	const router = useRouter();
	const { login } = useAuthStore();

	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true); // Bắt đầu gọi API -> đặt loading = true
		setError(null);    // Xóa thông báo lỗi cũ đi
		try {
			const response = await axios.post('http://127.0.0.1:8000/api/login', {
				username: username,
				password: password
			});

			// 2. Nếu Laravel trả về 200 thành công:
			if (response.data && response.data.code === 200) {
				const {user, access_token} = response.data.data;
				// Lưu thông tin vào authStore (Zustand & localStorage)
				login(user, access_token);

				// Chuyển hướng người dùng về trang chủ
				router.push('/');
			}
		} catch (err: any) {
			if (err.response && err.response.data) {
				setError(err.response.data.message || 'Đăng nhập thất bại!');
			} else {
				setError('Không thể kết nối đến máy chủ API!');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-[#ee4d2d] p-4 sm:p-6 md:p-8">
			<div className="w-full max-w-[420px] rounded-sm bg-white p-6 shadow-xl sm:p-8">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-xl sm:text-2xl text-gray-800 font-normal">Đăng nhập</h1>
				</div>

				{error && (
					<div className="mb-4 rounded-sm bg-red-50 border border-red-200 p-3 text-xs text-red-600">
						⚠️ {error}
					</div>
				)}

				{/* Form Đăng nhập */}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="text"
							placeholder="Username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm
							focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
						/>
					</div>

					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full rounded-sm border border-gray-300 px-3 py-3 pr-10 text-sm
							focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
							hover:text-gray-600 focus:outline-none cursor-pointer"
						>
							{ showPassword ? <EyeOn /> : <EyeOff /> }
						</button>
					</div>

					<button
						type="submit"
						disabled={loading}
						className={`w-full rounded-sm bg-[#ee4d2d] py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 
						transition-opacity cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
					>
						{loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
					</button>
				</form>

				{/* Quên mật khẩu */}
				{/*<div className="mt-3 text-right">*/}
				{/*	<a href="#" className="text-xs text-[#0055aa] hover:underline">Quên mật khẩu</a>*/}
				{/*</div>*/}

				<div className="my-5 flex items-center justify-between">
					<span className="h-[1px] w-[40%] bg-gray-200"></span>
					<span className="text-xs text-gray-400 uppercase font-medium">HOẶC</span>
					<span className="h-[1px] w-[40%] bg-gray-200"></span>
				</div>

				<p className="mt-8 text-center text-sm text-gray-400">
					Bạn mới biết đến Shopee?{' '}
					<Link href="/register" className="text-[#ee4d2d] font-medium hover:underline">Đăng ký</Link>
				</p>

			</div>
		</div>
	);
}
