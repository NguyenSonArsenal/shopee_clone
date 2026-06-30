"use client";
import React, {useEffect} from 'react';
import Link from 'next/link';
import { FacebookIcon, TikTokIcon } from '@icon';
import {FaRegQuestionCircle} from "react-icons/fa";
import dynamic from 'next/dynamic';
import {useAuthStore} from "@store/authStore";

interface HeaderProps {
	cartCount: number;
}

// Tắt SSR (Server-Side Rendering) cho component HeaderUser
const HeaderUser = dynamic(() => import('./HeaderUser'), {
	ssr: false,
	loading: () => (
		<div className="relative group cursor-pointer py-1 flex items-center gap-2 hover:opacity-90 z-30">
			<div className="w-16 h-3 rounded-sm bg-white/20" />
		</div>
	)
});

export default function Header({ cartCount }: HeaderProps) {
	// Khôi phục trạng thái đăng nhập từ localStorage khi reload trang (Hydration)
	useEffect(() => {
		const user = localStorage.getItem('user');
		const accessToken = localStorage.getItem('token');

		if (user && accessToken) {
			useAuthStore.setState({
				user: JSON.parse(user),
				token: accessToken
			});
		}
	}, [])

	return (
		<header className="bg-[#ee4d2d] text-white pt-2 pb-4 px-4 sticky top-0 z-50 shadow-md">
			<div className="max-w-[1200px] mx-auto">
				<div className="flex justify-between items-center text-xs pb-2 border-b border-orange-400">
					<div className="flex gap-4 items-center">
						  <span className="hover:opacity-80 cursor-pointer flex items-center gap-2">
						    Kết nối
							  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Kết nối Facebook">
								  <FacebookIcon/>
							  </a>
							  <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="Kết nối Tiktok">
								  <TikTokIcon/>
							  </a>
						  </span>
					</div>

					<div className="flex gap-4 items-center">
						<div className="relative group cursor-pointer py-1 flex items-center gap-1.5 hover:opacity-90 z-30">
							<FaRegQuestionCircle className="text-base"/><span>Hỗ trợ</span>
						</div>
						<HeaderUser />
					</div>
				</div>

				<div className="flex justify-between items-center pt-4 gap-4">
					<Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wider cursor-pointer">
						<span className="font-bold text-3xl">Shopee</span>
					</Link>

					<div className="flex-1 max-w-[800px] bg-white rounded-sm p-1 flex">
						<input
							type="text"
							placeholder="SẮM SỬA TẾT GA - Tìm sản phẩm..."
							onChange={() => {}}
							className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none"
						/>
						<button className="bg-[#ee4d2d] text-white px-6 py-2 rounded-sm hover:opacity-90 transition-opacity">
							🔍
						</button>
					</div>

					<Link href="/cart" className="relative p-2 cursor-pointer hover:opacity-90">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round"
							      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"/>
						</svg>
						{cartCount > 0 && (
							<span
								className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-xs font-bold px-2 py-0.5 rounded-full border-2 border-[#ee4d2d] shadow-sm">
                  {cartCount}
                </span>
						)}
					</Link>
				</div>
			</div>
		</header>
	)
};