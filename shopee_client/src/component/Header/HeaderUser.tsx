"use client";
import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@store/authStore';
import {FaUserCircle} from "react-icons/fa";
interface HeaderUserProps {
	// onLogoutClick: () => void;
}
export default function HeaderUser({}: HeaderUserProps) {
	const {user, setIsOpenLogoutConfirm} = useAuthStore();

	return (
		<>
			{
				user ?
					<>
						<div className="flex gap-2 relative group cursor-pointer py-1 items-center hover:opacity-90 z-30">
							<FaUserCircle className="text-base"/> <span className="font-semibold">{user.username}</span>

							<div className="absolute right-0 top-full pt-3 w-[160px] hidden group-hover:block z-50">
								<div
									className="absolute right-4 top-1.5 h-0 w-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
								<div
									className="rounded-sm bg-white text-gray-800 shadow-lg border border-gray-100 overflow-hidden">
									<div className="flex flex-col py-1.5">
										<Link href="#"
										      className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors">
											Tài khoản của tôi
										</Link>
										<Link href="#"
										      className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors">
											Đơn mua
										</Link>
										<button
											onClick={() => setIsOpenLogoutConfirm(true)}
											className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors border-t border-gray-100 font-medium cursor-pointer"
										>
											Đăng xuất
										</button>
									</div>
								</div>
							</div>
						</div>
					</>
					:
					<>
						<div className="flex gap-2 relative group cursor-pointer py-1 items-center hover:opacity-90 z-30">
							<Link href="/register">Đăng ký</Link>
							<span>|</span>
							<Link href="/login">Đăng nhập</Link>
						</div>
					</>
			}
		</>
	)
};