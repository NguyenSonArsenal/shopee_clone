import React from 'react';

// Khai báo kiểu dữ liệu cho thuộc tính (Props) của Icon
interface IconProps {
    className?: string;
}

export const BrandIcon = ({ className = "w-4 h-4" }: IconProps) => (
    <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
);