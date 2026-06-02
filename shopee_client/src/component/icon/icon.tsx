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

export const ShopeeAvatar = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg enableBackground="new 0 0 15 15" viewBox="0 0 15 15" x="0" y="0" className="shopee-svg-icon icon-headshot">
			<g>
				<circle cx="7.5" cy="4.5" fill="none" r="3.8" strokeMiterlimit="10"></circle>
				<path d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" strokeLinecap="round" strokeMiterlimit="10"></path>
			</g>
		</svg>
	);
};

export const EyeOn = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"
		     viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round"
			      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
			<path strokeLinecap="round" strokeLinejoin="round"
			      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
		</svg>
	);
};

export const EyeOff = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => {
	return (
		<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5"
		     viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round"
			      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.815 7.815 3 3m-3-3-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
		</svg>
	);
};
