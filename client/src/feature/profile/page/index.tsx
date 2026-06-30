"use client";

import React from 'react';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@component/Header/Header';
import { FaUser, FaShoppingBag, FaPencilAlt } from 'react-icons/fa';
import { Skeleton } from 'antd';

// Dynamic import - ssr:false → không render trên server → không flash trắng
const FormMe = dynamic(
	() => import('@feature/profile/component/FormMe'),
	{
		ssr: false,
		loading: () => (
			<div className="flex-1 px-6 py-6 space-y-5">
				{[1,2,3,4,5].map(i => (
					<div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2">
						<div className="sm:w-[160px] flex-shrink-0" />
						<Skeleton.Input active style={{ width: 320 }} />
					</div>
				))}
			</div>
		),
	}
);

// ─── Sidebar menu ─────────────────────────────────────────────────────
const SIDEBAR_MENUS = [
	{
		icon: <FaUser className="text-[#ee4d2d]" />,
		label: 'Tài Khoản Của Tôi',
		href: '#',
		badge: null,
		children: [
			{ label: 'Hồ Sơ', href: '/profile' },
			{ label: 'Đổi Mật Khẩu', href: '/#' },
		],
	},
	{
		icon: <FaShoppingBag className="text-[#ee4d2d]" />,
		label: 'Đơn Mua',
		href: '/orders',
		badge: null,
	},
];

export default function ProfilePage() {

	return (
		<div className="min-h-screen bg-[#f5f5f5]">
			<Header cartCount={0} />

			<div className="max-w-[1200px] mx-auto px-4 py-6">
				<div className="flex flex-col md:flex-row gap-6">

					{/* ───── SIDEBAR ───── */}
					<aside className="w-full md:w-[220px] flex-shrink-0">

						{/* Avatar + tên user */}
						<div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
							{/*<div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">*/}
							{/*	{avatarPreview*/}
							{/*		? <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />*/}
							{/*		: <FaUser className="text-gray-400 text-xl" />*/}
							{/*	}*/}
							{/*</div>*/}
							<div>
								{/*<p className="font-bold text-gray-800 text-sm truncate max-w-[140px]">{me.username ?? ''}</p>*/}
								<Link href="/profile" className="text-xs text-gray-500 flex items-center gap-1 hover:text-[#ee4d2d]">
									<FaPencilAlt className="text-[10px]" /> Sửa Hồ Sơ
								</Link>
							</div>
						</div>

						{/* Menu items */}
						<nav className="space-y-1">
							{SIDEBAR_MENUS.map((menu) => (
								<div key={menu.label}>
									<Link
										href={menu.href}
										className="flex items-center gap-3 px-2 py-2.5 text-sm text-gray-700 hover:text-[#ee4d2d] rounded-sm transition-colors font-medium"
									>
										<span className="w-5 flex justify-center">{menu.icon}</span>
										<span>{menu.label}</span>
									</Link>

									{/* Sub menu */}
									{menu.children && (
										<div className="ml-8 space-y-0.5">
											{menu.children.map((child) => (
												<Link
													key={child.label}
													href={child.href}
													className={`block text-sm py-1.5 px-2 rounded-sm transition-colors
														${child.href === '/profile'
														? 'text-[#ee4d2d] font-medium'
														: 'text-gray-500 hover:text-[#ee4d2d]'
													}`}
												>
													{child.label}
												</Link>
											))}
										</div>
									)}
								</div>
							))}
						</nav>
					</aside>

					{/* ───── MAIN CONTENT ───── */}
					<main className="flex-1 bg-white rounded-sm shadow-sm">

						{/* Header */}
						<div className="px-6 py-5 border-b border-gray-100">
							<h1 className="text-lg font-medium text-gray-800">Hồ Sơ Của Tôi</h1>
							<p className="text-sm text-gray-500 mt-0.5">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
						</div>

						<FormMe />
					</main>
				</div>
			</div>
		</div>
	);
}
