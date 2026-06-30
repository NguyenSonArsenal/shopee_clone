import React, { useState, useEffect } from 'react';

interface Props {
	states: Record<string, any>; // Nhận các local state của page
}

// Helper tự động làm phẳng Object lồng nhau để hiển thị trên 1 dòng
function flattenObject(obj: any, prefix = ''): Record<string, any> {
	const result: Record<string, any> = {};
	if (!obj) return result;

	Object.entries(obj).forEach(([key, value]) => {
		const newKey = prefix ? `${prefix}.${key}` : key;
		if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
			Object.assign(result, flattenObject(value, newKey));
		} else {
			result[newKey] = value;
		}
	});
	return result;
}

export default function StateDebugger({ states }: Props) {
	const [isCollapsed, setIsCollapsed] = useState(false); // Trạng thái thu nhỏ
	const [isVisible, setIsVisible] = useState(true); // Trạng thái ẩn/hiện hoàn toàn
	const [globalStates, setGlobalStates] = useState<Record<string, any>>({});

	// 1. Tự động tìm kiếm, đăng ký và lắng nghe sự thay đổi của tất cả các Zustand Store
	useEffect(() => {
		if (typeof window === 'undefined') return;

		const getStoreStates = () => {
			const stores = (window as any).__ZUSTAND_STORES__ || {};
			const statesData: Record<string, any> = {};
			
			Object.entries(stores).forEach(([name, store]: [string, any]) => {
				const fullState = store.getState();
				const cleanState: Record<string, any> = {};
				
				// Chỉ lấy các biến state, loại bỏ các hàm action
				Object.entries(fullState).forEach(([key, val]) => {
					if (typeof val !== 'function') {
						cleanState[key] = val;
					}
				});
				statesData[name] = cleanState;
			});
			return statesData;
		};

		const updateGlobal = () => {
			setGlobalStates(getStoreStates());
		};

		// Đăng ký lắng nghe thay đổi trạng thái của từng store
		const stores = (window as any).__ZUSTAND_STORES__ || {};
		const unsubscribes = Object.values(stores).map((store: any) => {
			return store.subscribe(updateGlobal);
		});

		updateGlobal();

		// Quét định kỳ mỗi 1 giây đề phòng có store được load muộn (Dynamic Import)
		const interval = setInterval(updateGlobal, 1000);

		return () => {
			unsubscribes.forEach((unsub) => unsub());
			clearInterval(interval);
		};
	}, []);

	// Lắng nghe phím tắt Ctrl + H để ẩn/hiện nhanh bảng debug
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key.toLowerCase() === 'h') {
				e.preventDefault();
				setIsVisible((prev) => !prev);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	if (process.env.NODE_ENV !== 'development' || !isVisible) return null;

	// Giao diện khi thu nhỏ (chỉ hiển thị 1 icon nhỏ ở góc phải)
	if (isCollapsed) {
		return (
			<button
				onClick={() => setIsCollapsed(false)}
				className="fixed bottom-4 right-4 bg-black/90 hover:bg-black text-green-400 p-2.5 rounded-full shadow-lg z-[9999] border border-green-500/30 cursor-pointer pointer-events-auto"
				title="Mở bảng Debug"
			>
				⚙️
			</button>
		);
	}

	// Làm phẳng các state để đưa về hiển thị 1 dòng
	const flatLocal = flattenObject(states);
	const flatGlobal = flattenObject(globalStates);

	return (
		<div className="fixed bottom-4 right-4 bg-black/95 text-green-400 p-4 rounded-sm shadow-2xl text-[11px] font-mono z-[9999] border border-green-500/20 w-[300px] pointer-events-auto">
			{/* Tiêu đề + Nút thu nhỏ */}
			<div className="flex justify-between items-center border-b border-green-500/30 pb-1.5 mb-2.5">
				<span className="font-bold text-[9px] tracking-wider text-green-500">⚙️ STATE DEVELOPER TOOL</span>
				<button
					onClick={() => setIsCollapsed(true)}
					className="text-gray-400 hover:text-white cursor-pointer px-1"
					title="Thu nhỏ"
				>
					➖
				</button>
			</div>

			{/* 1. HIỂN THỊ CÁC GLOBAL STATE (Tự động quét từ Zustand) */}
			{Object.keys(flatGlobal).length > 0 && (
				<div className="mb-3">
					<div className="text-yellow-500 font-bold mb-1 text-[10px] border-b border-white/5 pb-0.5">[Zustand Global]:</div>
					<div className="space-y-1">
						{Object.entries(flatGlobal).map(([name, value]) => (
							<div key={name} className="flex justify-between gap-2 py-0.5">
								<span className="text-gray-500">{name}:</span>
								<span className="text-white font-semibold text-right break-all max-w-[180px]">
									{value === null ? 'null' : String(value)}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* 2. HIỂN THỊ LOCAL STATES CỦA TRANG (Hiển thị 1 dòng) */}
			<div>
				<div className="text-cyan-400 font-bold mb-1 text-[10px] border-b border-white/5 pb-0.5">[Local States]:</div>
				<div className="space-y-1">
					{Object.entries(flatLocal).map(([name, value]) => (
						<div key={name} className="flex justify-between gap-2 py-0.5">
							<span className="text-gray-500">{name}:</span>
							<span className="text-white font-semibold text-right break-all max-w-[180px]">
								{value === null ? 'null' : String(value)}
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Chỉ dẫn phím tắt */}
			<div className="text-[9px] text-gray-600 text-center mt-3 pt-1.5 border-t border-white/5">
				Nhấn <kbd className="bg-gray-800 px-1 rounded text-gray-400">Ctrl + H</kbd> để ẩn/hiện nhanh
			</div>
		</div>
	);
}
