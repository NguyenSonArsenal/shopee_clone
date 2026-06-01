"use client"; // Bắt buộc phải có dòng này ở đầu file khi dùng useState

import React, {useState} from 'react';
import Link from "next/link";

export default function LoginPage() {
	// 1. Quản lý trạng thái (State) của Form theo chuẩn React 18
	const [username, setUsername] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);

	// 2. Hàm xử lý khi người dùng nhấn nút ĐĂNG NHẬP
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert(`Đăng nhập với:\nTài khoản: ${username}\nMật khẩu: ${password}`);
	};

	return (
		// Toàn bộ trang nền màu cam chuẩn Shopee (#ee4d2d)
		<div className="flex min-h-screen w-full items-center justify-center bg-[#ee4d2d] p-4 sm:p-6 md:p-8">

			{/* Khung thẻ Login màu trắng, tự co giãn (w-full trên điện thoại, tối đa 420px trên máy tính) */}
			<div className="w-full max-w-[420px] rounded-sm bg-white p-6 shadow-xl sm:p-8">

				{/* Tiêu đề Đăng nhập + Biểu tượng QR code bên phải */}
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-xl sm:text-2xl text-gray-800 font-normal">Đăng nhập</h1>
				</div>

				{/* Form Đăng nhập */}
				<form onSubmit={handleSubmit} className="space-y-4">

					{/* Ô nhập Tài khoản */}
					<div>
						<input
							type="text"
							placeholder="Email/Số điện thoại"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
						/>
					</div>

					{/* Ô nhập Mật khẩu (Có tích hợp nút hiện/ẩn mắt thần) */}
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full rounded-sm border border-gray-300 px-3 py-3 pr-10 text-sm focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800"
						/>
						{/* Nút mắt thần */}
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
						>
							{showPassword ? (
								// Mắt mở
								<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"
								     viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round"
									      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
									<path strokeLinecap="round" strokeLinejoin="round"
									      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
								</svg>
							) : (
								// Mắt nhắm
								<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"
								     viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round"
									      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
								</svg>
							)}
						</button>
					</div>

					{/* Nút Đăng nhập màu cam đặc trưng, có hiệu ứng hover mờ đi nhẹ */}
					<button
						type="submit"
						className="w-full rounded-sm bg-[#ee4d2d] py-3 text-sm font-medium text-white shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
					>
						ĐĂNG NHẬP
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
