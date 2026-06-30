"use client"; // Để dùng các tính năng tương tác của React 18

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {useAuthStore} from "@store/authStore";
import { useRouter } from 'next/navigation';
import Header from "@component/Header/Header";
import CategorySection from "@component/HomePage/CategorySection";

interface Product {
	id: number;
	name: string;
	price: number;
	sold: string;
	imageColor: string; // Dùng màu nền giả lập ảnh cho nhẹ và đẹp
	tag?: string;
	discount?: string;
}

export default function HomePage() {
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

	// Hàm tải thêm sản phẩm khi click "Xem thêm"
	const handleLoadMore = () => {
		setProducts([...products, ...moreProducts]);
		setHasMore(false); // Đã tải hết dữ liệu giả
	};

	const filteredProducts = products.filter(product =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="min-h-screen bg-gray-100 font-sans pb-12">
			<Header cartCount={cartCount}/>

			<div className="max-w-[1200px] mx-auto px-4 mt-6">
				<CategorySection />

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
				</section>
			</div>
		</div>
	);
}
