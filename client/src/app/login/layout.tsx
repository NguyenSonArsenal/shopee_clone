import {Metadata} from 'next';
import React from 'react';

// Khai báo tiêu đề riêng biệt cực kỳ chuẩn SEO cho trang Login
export const metadata: Metadata = {
    title: 'Login',
    description: 'Trang đăng nhập hệ thống mua sắm trực tuyến Shopee Mini',
};

export default function LoginLayout({children}: { children: React.ReactNode }) {
    return <>{children}</>;
}
