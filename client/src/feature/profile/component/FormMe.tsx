"use client";

import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from 'antd';
import profileApi from '@feature/profile/profileApi';
import { User } from '@feature/profile/model/type';
import {GENDER_OPTIONS} from "@constant/user";
import {TIME_REFRESH} from "@constant/constant";

const inputClass = "border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-[#ee4d2d] w-full max-w-[320px]";
const inputDisabledClass = "border border-gray-200 rounded-sm px-3 py-2 text-sm bg-gray-50 text-gray-400 w-full max-w-[320px]";

export default function FormMe() {
	const queryClient = useQueryClient();

	// Fix hydration flash: chờ client mount xong mới render
	const [isMounted, setIsMounted] = useState(false);
	useEffect(() => { setIsMounted(true); }, []);

	// ─── Fetch profile ───────────────────────────────────────────────
	const { data: profile, isLoading } = useQuery<User>({
		queryKey: ['get_profile'],
		queryFn: profileApi.me,
		staleTime: TIME_REFRESH, // 5 phút
	});

	// Gộp 2 trạng thái: chưa mount HOẶC đang fetch → đều show skeleton
	const showSkeleton = !isMounted || isLoading;

	// ─── Form state ───────────────────────────────────────────────────
	const [fullName, setFullName] = useState('');
	const [email, setEmail]       = useState('');
	const [phone, setPhone]       = useState('');
	const [gender, setGender]     = useState<number>(1);

	// Sync data từ API vào form khi load xong
	useEffect(() => {
		if (profile) {
			setFullName(profile.full_name ?? '');
			setEmail(profile.email ?? '');
			setPhone(profile.phone ?? '');
			setGender(profile.gender ?? 1);
		}
	}, [profile]);

	// ─── Submit ───────────────────────────────────────────────────────
	const { mutate: updateProfile, isPending } = useMutation({
		// @todo
		mutationFn: profileApi.updateProfile,
		onSuccess: () => {
			// Xóa cache → useQuery tự fetch lại data mới
			queryClient.invalidateQueries({ queryKey: ['get_profile'] });
			alert('Cập nhật thành công!');
		},
		onError: () => {
			alert('Có lỗi xảy ra, thử lại sau!');
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		updateProfile({ full_name: fullName, email, phone, gender });
	};

	// ─── Render ───────────────────────────────────────────────────────
	return (
		<form onSubmit={handleSubmit}>
			<div className="flex flex-col lg:flex-row">

				{/* ── Form fields ── */}
				<div className="flex-1 px-6 py-6 space-y-5">

					{/* Tên đăng nhập - không cho sửa */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-sm text-gray-500 sm:w-[160px] sm:text-right flex-shrink-0">
							Tên đăng nhập
						</label>
						{showSkeleton
							? <Skeleton.Input active style={{ width: 320 }} />
							: <input disabled value={profile?.username ?? ''} className={inputDisabledClass} />
						}
					</div>

					{/* Tên */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-sm text-gray-500 sm:w-[160px] sm:text-right flex-shrink-0">
							Tên
						</label>
						{showSkeleton
							? <Skeleton.Input active style={{ width: 320 }} />
							: <input
								type="text"
								value={fullName}
								onChange={(e) => setFullName(e.target.value)}
								className={inputClass}
								placeholder="Nhập tên của bạn"
							/>
						}
					</div>

					{/* Email */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-sm text-gray-500 sm:w-[160px] sm:text-right flex-shrink-0">
							Email
						</label>
						{showSkeleton
							? <Skeleton.Input active style={{ width: 320 }} />
							: <input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className={inputClass}
								placeholder="Nhập email"
							/>
						}
					</div>

					{/* Số điện thoại */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-sm text-gray-500 sm:w-[160px] sm:text-right flex-shrink-0">
							Số điện thoại
						</label>
						{showSkeleton
							? <Skeleton.Input active style={{ width: 320 }} />
							: <input
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className={inputClass}
								placeholder="Nhập số điện thoại"
							/>
						}
					</div>

					{/* Giới tính */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2">
						<label className="text-sm text-gray-500 sm:w-[160px] sm:text-right flex-shrink-0">
							Giới tính
						</label>
						{showSkeleton
							? <Skeleton.Input active style={{ width: 200 }} />
							: <div className="flex gap-5">
								{GENDER_OPTIONS.map((opt) => (
									<label key={opt.value} className="flex items-center gap-1.5 text-sm text-gray-700 cursor-pointer">
										<input
											type="radio"
											name="gender"
											value={opt.value}
											checked={gender === opt.value}
											onChange={() => setGender(opt.value)}
											className="accent-[#ee4d2d] w-4 h-4 cursor-pointer"
										/>
										{opt.label}
									</label>
								))}
							</div>
						}
					</div>

					{/* Nút Lưu */}
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
						<div className="sm:w-[160px] flex-shrink-0" />
						<button
							type="submit"
							disabled={isPending || showSkeleton}
							className="bg-[#ee4d2d] text-white px-10 py-2.5 rounded-sm text-sm hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isPending ? 'Đang lưu...' : 'Lưu'}
						</button>
					</div>
				</div>

				{/* ── Avatar section ── */}
				<div className="lg:w-[240px] flex flex-col items-center justify-start py-8 px-6 border-t lg:border-t-0 lg:border-l border-gray-100 gap-4">
					<div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200 text-4xl">
						👤
					</div>
					<button
						type="button"
						className="border border-gray-300 text-gray-600 text-sm px-5 py-2 rounded-sm hover:border-gray-400 transition-colors cursor-pointer"
					>
						Chọn Ảnh
					</button>
					<div className="text-xs text-gray-400 text-center leading-relaxed">
						<p>Dung lượng tối đa 1 MB</p>
						<p>Định dạng: .JPEG, .PNG</p>
					</div>
				</div>
			</div>
		</form>
	);
}