import React from 'react';

// Khai báo kiểu dữ liệu cho thuộc tính (Props) của Icon
interface IconProps {
	className?: string;
}

// 1. Component Icon Facebook
export const FacebookIcon = ({ className = "w-4 h-4" }: IconProps) => (
	<svg
		className={`${className} fill-current`}
		viewBox="0 0 24 24"
	>
		<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
	</svg>
);

// 2. Component Icon TikTok
export const TikTokIcon = ({ className = "w-4 h-4" }: IconProps) => (
	<svg
		className={`${className} fill-current`}
		viewBox="0 0 24 24"
	>
		<path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.63 4.14 1.05.99 2.49 1.51 3.93 1.56v3.82c-1.88-.08-3.71-.84-5.11-2.12-.13-.12-.22-.16-.27.02-.03.71-.02 1.43-.02 2.14 0 3.75-.41 6.89-2.75 9.07-2.07 1.94-5.26 2.51-8.02 1.69-2.91-.87-5.11-3.61-5.13-6.66-.08-3.66 2.69-7.1 6.37-7.25 1.15-.05 2.3.17 3.37.6v3.91c-.81-.46-1.74-.63-2.67-.53-1.63.16-3.06 1.48-3.15 3.12-.12 2.21 1.77 4.25 3.98 4.14 1.77-.09 3.09-1.57 3.12-3.33V0h.01z" />
	</svg>
);
