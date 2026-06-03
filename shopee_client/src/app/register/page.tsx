"use client";

import React, { useState } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { EyeOn, EyeOff } from "@icon";
import StateDebugger from "@component/StateDebugger";
import { GENDER, GENDER_OPTIONS } from '@constant/user';
import axiosInstance from '@/lib/axios';
import {delay} from "@helper";
import { parseApiErrors } from '@/utils/helper';
import FormErrors from "@component/FormErrors";

export default function RegisterPage() {
	const router = useRouter();

	const [username, setUsername] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [gender, setGender] = useState<number>(GENDER.BOY);
	const [password, setPassword] = useState<string>('');
	const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string[]>([]);

	const isButtonDisabled = !username.trim() || !email.trim() || !password.trim() || !passwordConfirmation.trim() || loading;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		delay(1000)
		// Kiểm tra xác nhận mật khẩu trước khi gọi API
		if (password !== passwordConfirmation) {
			setError(['Mật khẩu xác nhận không khớp!']);
			return
		}

		setLoading(true);
		setError([]);
		try {
			const response = await axiosInstance.post('register', {
				username: username,
				email: email,
				gender: gender || null,
				password: password,
				password_confirmation: passwordConfirmation,
			});
			if (response.data && response.data.success == true) {
				router.push('/login');
			}
		} catch (err: any) {
			setError(parseApiErrors(err));
		} finally {
			setLoading(false);
		}
	};

	// CSS dùng chung cho các ô input
	const inputClass = "w-full rounded-sm border border-gray-300 px-3 py-3 text-sm focus:border-gray-500 focus:outline-none placeholder-gray-400 text-gray-800";

	return (
		<div className="flex min-h-screen w-full items-center justify-center bg-[#ee4d2d] p-4 sm:p-6 md:p-8">
			<div className="w-full max-w-[420px] rounded-sm bg-white p-6 shadow-xl sm:p-8">

				<div className="flex items-center justify-between mb-6">
					<h1 className="text-xl sm:text-2xl text-gray-800 font-normal">Đăng ký</h1>
				</div>

				<FormErrors error={error}/>

				<form onSubmit={handleSubmit} className="space-y-4">

					{/* Username */}
					<input
						type="text"
						placeholder="Tên đăng nhập không chứa khoảng trắng"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className={inputClass}
					/>

					{/* Email */}
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className={inputClass}
					/>

					{/* Giới tính (Radio Button kiểu Shopee) */}
					<div className="flex items-center gap-6">
						<p className="text-sm text-gray-500 whitespace-nowrap">Giới tính:</p>
						{GENDER_OPTIONS.map((option) => (
							<label key={option.value} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
								<input
									type="radio"
									name="gender"
									value={option.value}
									checked={gender == option.value}
									onChange={(e) => setGender(Number(e.target.value))}
									className="accent-[#ee4d2d] w-4 h-4 cursor-pointer"
								/>
								{option.label}
							</label>
						))}
					</div>

					{/* Password */}
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className={`${inputClass} pr-10`}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
						>
							{showPassword ? <EyeOn/> : <EyeOff/>}
						</button>
					</div>

					{/* Password Confirmation */}
					<div className="relative">
						<input
							type={showPasswordConfirm ? "text" : "password"}
							placeholder="Xác nhận mật khẩu"
							value={passwordConfirmation}
							onChange={(e) => setPasswordConfirmation(e.target.value)}
							required
							className={`${inputClass} pr-10`}
						/>
						<button
							type="button"
							onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
						>
							{showPasswordConfirm ? <EyeOn/> : <EyeOff/>}
						</button>
					</div>

					{/* Nút Đăng ký */}
					<button
						type="submit"
						disabled={isButtonDisabled}
						className={`w-full rounded-sm bg-[#ee4d2d] py-3 text-sm font-medium text-white shadow-sm transition-opacity
							${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 cursor-pointer'}`}
					>
						{loading ? (
							<div className="flex items-center justify-center gap-2">
								<svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
									<path className="opacity-75" fill="currentColor"
									      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
								</svg>
								<span>ĐANG ĐĂNG KÝ...</span>
							</div>
						) : 'ĐĂNG KÝ'}
					</button>

				</form>

				<div className="my-5 flex items-center justify-between">
					<span className="h-[1px] w-[40%] bg-gray-200"></span>
					<span className="text-xs text-gray-400 uppercase font-medium">HOẶC</span>
					<span className="h-[1px] w-[40%] bg-gray-200"></span>
				</div>

				<p className="mt-4 text-center text-sm text-gray-400">
					Bạn đã có tài khoản?{' '}
					<Link href="/login" className="text-[#ee4d2d] font-medium hover:underline">Đăng nhập</Link>
				</p>

			</div>



			<StateDebugger states={{ username, email, gender, password, passwordConfirmation, showPassword, showPasswordConfirm, loading, error }} />
		</div>
	);
}
