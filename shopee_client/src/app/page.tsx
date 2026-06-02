"use client"; // Để dùng các tính năng tương tác của React 18

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {FacebookIcon, ShopeeAvatar, TikTokIcon} from "../component/icon/icon";
import {useAuthStore} from "@store/authStore";
import { useRouter } from 'next/navigation';
import LogoutConfirmModal from "@modal/LogoutConfirmModal";

// Định nghĩa kiểu dữ liệu cho Sản phẩm bằng TypeScript
interface Product {
	id: number;
	name: string;
	price: number;
	sold: string;
	imageColor: string; // Dùng màu nền giả lập ảnh cho nhẹ và đẹp
	tag?: string;
	discount?: string;
}

// Định nghĩa kiểu dữ liệu cho Danh mục
interface Category {
	id: number;
	name: string;
	icon: string;
}

export default function HomePage() {
	// 1. Dữ liệu giả lập cho Danh mục ngành hàng (Categories)
	const categories: Category[] = [
		{ id: 1, name: 'Thời Trang Nam', icon: '👕' },
		{ id: 2, name: 'Điện Thoại & Phụ Kiện', icon: '📱' },
		{ id: 3, name: 'Thiết Bị Điện Tử', icon: '📺' },
		{ id: 4, name: 'Máy Tính & Laptop', icon: '💻' },
		{ id: 5, name: 'Máy Ảnh & Quay Phim', icon: '📷' },
		{ id: 6, name: 'Đồng Hồ', icon: '⌚' },
		{ id: 7, name: 'Giày Dép Nam', icon: '👟' },
		{ id: 8, name: 'Thiết Bị Điện Gia Dụng', icon: '🔌' },
		{ id: 9, name: 'Thể Thao & Du Lịch', icon: '⚽' },
		{ id: 10, name: 'Ô Tô & Xe Máy', icon: '🏍️' },
		{ id: 11, name: 'Thời Trang Nữ', icon: '👗' },
		{ id: 12, name: 'Mẹ & Bé', icon: '🍼' },
		{ id: 13, name: 'Sắc Đẹp', icon: '💄' },
		{ id: 14, name: 'Sức Khỏe', icon: '💊' },
	];

	// 2. Dữ liệu giả lập Danh sách sản phẩm ban đầu (Gợi ý hôm nay)
	const initialProducts: Product[] = [
		{ id: 1, name: 'Áo sơ mi nam tay ngắn cổ vest URBAN lịch lãm thoáng mát', price: 302000, sold: '352', imageColor: 'bg-blue-100', tag: 'Mall', discount: '-11%' },
		{ id: 2, name: 'Mũ bảo hiểm kiểu dáng nửa đầu kính phi công cao cấp độc lạ', price: 110000, sold: '8.4k', imageColor: 'bg-zinc-200', tag: 'Yêu thích', discount: '-50%' },
		{ id: 3, name: 'Điện thoại thông minh A06 5G Ram 8GB Bộ nhớ 256GB Pin trâu', price: 2900000, sold: '10k+', imageColor: 'bg-emerald-100', tag: 'Mall', discount: '-21%' },
		{ id: 4, name: 'Camera Wifi giám sát trong nhà xoay 360 độ ban đêm có màu', price: 459000, sold: '70k+', imageColor: 'bg-amber-100', tag: 'Yêu thích', discount: '-17%' },
		{ id: 5, name: 'Dầu gội thảo dược hỗ trợ giảm rụng tóc và kích mọc tóc nhanh', price: 619000, sold: '456', imageColor: 'bg-rose-100', tag: 'Yêu thích', discount: '-15%' },
		{ id: 6, name: 'Nón bảo hiểm lưới thoáng khí phong cách thể thao cho nữ', price: 158460, sold: '1k+', imageColor: 'bg-purple-100', tag: 'Yêu thích', discount: '-45%' },
	];

	// Danh sách sản phẩm tải thêm khi ấn nút "Xem thêm"
	const moreProducts: Product[] = [
		{ id: 7, name: 'Võ phục Vovinam chất vải dày dặn thấm hút mồ hôi tốt', price: 160000, sold: '841', imageColor: 'bg-sky-100', tag: 'Yêu thích' },
		{ id: 8, name: 'Quạt cầm tay mini sạc USB tích điện siêu mát bỏ túi tiện lợi', price: 329000, sold: '4k+', imageColor: 'bg-cyan-100', tag: 'Mall', discount: '-18%' },
		{ id: 9, name: 'Sim 5G tốc độ cao trọn gói 12 tháng không giới hạn data', price: 1219000, sold: '720', imageColor: 'bg-red-100', tag: 'Yêu thích' },
		{ id: 10, name: 'Mũ lưỡi trai thêu chữ cá tính phong cách Hàn Quốc nam nữ', price: 139000, sold: '7k+', imageColor: 'bg-indigo-100', tag: 'Yêu thích', discount: '-7%' },
		{ id: 11, name: 'Viên uống bổ mắt Omega 3 nhập khẩu chính hãng hỗ trợ thị lực', price: 625000, sold: '886', imageColor: 'bg-yellow-100', tag: 'Yêu thích', discount: '-37%' },
		{ id: 12, name: 'Hộp đậu đen xanh lòng rang sẵn mộc vị thơm ngon nguyên chất', price: 549000, sold: '763', imageColor: 'bg-teal-100', tag: 'Yêu thích', discount: '-39%' },
	];

	// 3. Quản lý trạng thái (State) bằng React Hooks
	const [products, setProducts] = useState<Product[]>(initialProducts);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [hasMore, setHasMore] = useState<boolean>(true);
	const [cartCount, setCartCount] = useState<number>(0);
	const [isOpenLogoutConfirm, setIsOpenLogoutConfirm] = useState(false);

	const { user, logout } = useAuthStore();
	const router = useRouter();

	// Khôi phục trạng thái đăng nhập từ localStorage khi reload trang (Hydration)
	useEffect(() => {
		console.log('check is login')
		const user = localStorage.getItem('user');
		const accessToken = localStorage.getItem('token');

		if (user && accessToken) {
			useAuthStore.setState({
				user: JSON.parse(user),
				token: accessToken
			});
		}
	}, [])

	// Hàm tải thêm sản phẩm khi click "Xem thêm"
	const handleLoadMore = () => {
		setProducts([...products, ...moreProducts]);
		setHasMore(false); // Đã tải hết dữ liệu giả
	};

	const handleConfirmLogout = () => {
		logout()
		router.push('/login');
	}

	// Hàm giả lập click thêm vào giỏ hàng
	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault(); // Tránh bị nhảy vào trang chi tiết khi click nút mua
		setCartCount(cartCount + 1);
	};

	// Lọc sản phẩm theo từ khóa tìm kiếm (Real-time Filter)
	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gray-100 font-sans pb-12">

			{/* ────────────────── SECTION 1: HEADER & NAVBAR (CHỮ MÀU TRẮNG NỀN CAM) ────────────────── */}
			<header className="bg-[#ee4d2d] text-white pt-2 pb-4 px-4 sticky top-0 z-50 shadow-md">
				<div className="max-w-[1200px] mx-auto">

					{/* Thanh Navbar nhỏ trên cùng */}
					<div className="flex justify-between items-center text-xs pb-2 border-b border-orange-400">
						{/* Sửa lại cụm "Kết nối" ở đầu file page.tsx thành thế này: */}
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
							{/*<span className="hover:opacity-80 cursor-pointer flex items-center gap-1">🔔 Thông báo</span>*/}
							<span className="hover:opacity-80 cursor-pointer">❓ Hỗ trợ</span>
							{/*<span className="hover:opacity-80 cursor-pointer">🌐 Tiếng Việt</span>*/}

							{
								user ?
									<>
										<div className="relative group cursor-pointer py-1 flex items-center gap-1.5 hover:opacity-90 z-30">
											👤 <span className="font-semibold">{user.username}</span>

											<div className="absolute right-0 top-full pt-3 w-[160px] hidden group-hover:block z-50">
												<div className="absolute right-4 top-1.5 h-0 w-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-white"></div>
												<div className="rounded-sm bg-white text-gray-800 shadow-lg border border-gray-100 overflow-hidden">
													<div className="flex flex-col py-1.5">
														<Link href="/profile" className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors">
															Tài khoản của tôi
														</Link>
														<Link href="/orders" className="block w-full text-left px-4 py-2 text-xs hover:bg-gray-50 hover:text-[#ee4d2d] transition-colors">
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
										<div className="flex gap-2">
											<Link href="/register">Đăng ký</Link>
											<span>|</span>
											<Link href="/login">Đăng nhập</Link>
										</div>
									</>
							}
						</div>
					</div>

					{/* Thanh Logo + Ô tìm kiếm + Giỏ hàng chính */}
					<div className="flex justify-between items-center pt-4 gap-4">

						{/* Logo Shopee */}
						<Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-wider cursor-pointer">
							<span className="font-bold text-3xl">Shopee</span>
						</Link>

						{/* Ô tìm kiếm thông minh */}
						<div className="flex-1 max-w-[800px] bg-white rounded-sm p-1 flex">
							<input
								type="text"
								placeholder="SẮM SỬA TẾT GA - Tìm sản phẩm..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-3 py-2 text-sm text-gray-800 focus:outline-none"
							/>
							<button className="bg-[#ee4d2d] text-white px-6 py-2 rounded-sm hover:opacity-90 transition-opacity">
								🔍
							</button>
						</div>

						{/* Icon Giỏ hàng nhảy số */}
						<Link href="/cart" className="relative p-2 cursor-pointer hover:opacity-90">
							<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
							</svg>
							{cartCount > 0 && (
								<span className="absolute -top-1 -right-1 bg-white text-[#ee4d2d] text-xs font-bold px-2 py-0.5 rounded-full border-2 border-[#ee4d2d] shadow-sm">
                  {cartCount}
                </span>
							)}
						</Link>
					</div>
				</div>
			</header>

			<div className="max-w-[1200px] mx-auto px-4 mt-6">

				{/* ────────────────── SECTION 2: DANH MỤC NGÀNH HÀNG ────────────────── */}
				<section className="bg-white rounded-sm shadow-sm p-4 mb-6">
					<h2 className="font-medium text-lg text-[#0000008a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
						Danh mục
					</h2>

					{/* Lưới danh mục 7 cột trên Desktop, tự động xuống hàng và co giãn */}
					<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 border-t border-l border-gray-100">
						{categories.map((cat) => (
							<div
								key={cat.id}
								className="flex flex-col items-center justify-center p-4 border-r border-b border-gray-100 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer text-center"
							>
								<span className="text-3xl mb-2">{cat.icon}</span>
								<span className="text-sm text-gray-700 font-light leading-tight">{cat.name}</span>
							</div>
						))}
					</div>
				</section>

				{/* ────────────────── SECTION 3: GỢI Ý HÔM NAY ────────────────── */}
				<section className="space-y-4">

					{/* Tiêu đề mục Gợi ý hôm nay */}
					<div className="bg-white p-4 border-b-4 border-[#ee4d2d] rounded-sm shadow-sm text-center">
						<h2 className="text-[#ee4d2d] text-lg uppercase tracking-wider">
							Gợi ý hôm nay
						</h2>
					</div>

					{/* Lưới sản phẩm Responsive: 2 cột trên Mobile, 6 cột trên Desktop */}
					{filteredProducts.length === 0 ? (
						<div className="bg-white p-12 text-center text-gray-500 rounded-sm shadow-sm">
							Không tìm thấy sản phẩm nào khớp với từ khóa tìm kiếm của bạn.
						</div>
					) : (
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
							{filteredProducts.map((prod) => (
								<Link
									href={`/product/${prod.id}`}
									key={prod.id}
									className="bg-white rounded-sm shadow-sm border border-transparent hover:border-[#ee4d2d] hover:shadow-md hover:translate-y-[-2px] transition-all flex flex-col justify-between overflow-hidden cursor-pointer group relative"
								>

									{/* Ảnh sản phẩm giả lập bằng các màu sắc dịu nhẹ kèm icon */}
									<div className={`w-full aspect-square ${prod.imageColor} flex items-center justify-center text-4xl relative`}>
										🎁
										{/* Nhãn giảm giá Shopee màu vàng chéo góc */}
										{prod.discount && (
											<span className="absolute top-0 right-0 bg-[#ffd424] text-[#ee4d2d] text-[10px] font-bold px-1.5 py-0.5 rounded-bl-sm">
                        {prod.discount}
                      </span>
										)}
									</div>

									{/* Chi tiết nội dung của sản phẩm */}
									<div className="p-2 flex flex-col flex-1 justify-between">

										{/* Tên sản phẩm giới hạn hiển thị */}
										<div className="text-sm text-gray-800 leading-relaxed line-clamp-2 min-h-[36px] mb-2">
											{prod.tag && (
												<span className={`inline-block text-[9px] font-bold text-white px-1 mr-1 rounded-sm ${prod.tag === 'Mall' ? 'bg-[#d0011b]' : 'bg-[#ee4d2d]'}`}>
                          {prod.tag}
                        </span>
											)}
											{prod.name}
										</div>

										{/* Giá tiền đỏ rực + Chỉ số số lượng đã bán */}
										<div className="flex items-center justify-between mt-auto">
                      <span className="text-[#ee4d2d] text-sm font-normal">
                        ₫{(prod.price).toLocaleString('vi-VN')}
                      </span>
											<span className="text-[10px] text-gray-400">
                        Đã bán {prod.sold}
                      </span>
										</div>

									</div>
								</Link>
							))}
						</div>
					)}

					{/* Nút Xem Thêm (Chỉ hiển thị khi còn dữ liệu) */}
					{hasMore && filteredProducts.length > 0 && (
						<div className="flex justify-center pt-8">
							<button
								onClick={handleLoadMore}
								className="bg-white border border-gray-300 px-12 py-3 text-sm text-gray-600 rounded-sm hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm cursor-pointer min-w-[240px]"
							>
								Xem Thêm
							</button>
						</div>
					)}

					{isOpenLogoutConfirm && (
						<LogoutConfirmModal
							onClose={() => setIsOpenLogoutConfirm(false)}
							onConfirm={handleConfirmLogout}
						/>
					)}
				</section>
			</div>
		</div>
	);
}
