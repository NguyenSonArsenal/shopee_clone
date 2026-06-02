import React from 'react';

// Khai báo tham số nhận vào từ HomePage
interface Props {
	onClose: () => void;
	onConfirm: () => void;
}

export default function LogoutConfirmModal({ onClose, onConfirm }: Props) {
	return (
		<div className="fixed inset-0 bg-black/40 z-[99] flex items-center justify-center p-4">
			<div className="bg-white rounded-sm shadow-xl max-w-[380px] w-full p-6 border border-gray-100">

				<div className="flex flex-col items-center text-center">
					<span className="text-4xl mb-3">⚠️</span>
					<h3 className="text-gray-800 font-medium text-base">Xác nhận đăng xuất</h3>
					<p className="text-gray-500 text-sm mt-2">Bạn có chắc chắn muốn đăng xuất?</p>
				</div>

				<div className="flex gap-3 mt-6">
					{/* Click nút Không -> gọi hàm onClose của Cha */}
					<button onClick={onClose} className="text-gray-800 flex-1 rounded-sm border border-gray-300 py-2 text-sm cursor-pointer">
						Không
					</button>

					{/* Click nút Có -> gọi hàm onConfirm của Cha */}
					<button onClick={onConfirm} className="flex-1 rounded-sm bg-[#ee4d2d] py-2 text-sm text-white cursor-pointer">
						Có, Đăng xuất
					</button>
				</div>
			</div>
		</div>
	);
}
