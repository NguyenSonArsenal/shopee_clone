import { Metadata } from 'next';
import React from 'react';

// Khai báo tiêu đề riêng biệt cực kỳ chuẩn SEO cho trang Login
export const metadata: Metadata = {
	title: 'Register',
	description: 'Đăng ký tài khoản | Shopee Mini',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
