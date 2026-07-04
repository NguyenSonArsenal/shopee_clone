"use client"

import React, { useState } from "react";
import { IconHeart } from "@icon";
import { message } from "antd";

type Property = {
  id: string;
  title: string;
  price: string;
  area: string;
  location: string;
  image: string;
  type: string;
};

const FAVORITES_MOCK: Property[] = [
  {
    id: "1",
    title: "Căn hộ Vinhomes Metropolis 2 phòng ngủ sang trọng",
    price: "6.8 tỷ",
    area: "78 m²",
    location: "Ba Đình, Hà Nội",
    image: "🏢",
    type: "Chung cư"
  },
  {
    id: "2",
    title: "Biệt thự song lập Vinhomes Ocean Park phân khu Ngọc Trai",
    price: "24.5 tỷ",
    area: "150 m²",
    location: "Gia Lâm, Hà Nội",
    image: "🏡",
    type: "Biệt thự"
  },
  {
    id: "3",
    title: "Nhà phố thương mại Shophouse Grand World Hưng Yên",
    price: "12.8 tỷ",
    area: "90 m²",
    location: "Văn Giang, Hưng Yên",
    image: "🏪",
    type: "Shophouse"
  },
  {
    id: "4",
    title: "Căn hộ Studio Vinhomes Smart City đầy đủ nội thất",
    price: "1.9 tỷ",
    area: "32 m²",
    location: "Nam Từ Liêm, Hà Nội",
    image: "🏢",
    type: "Chung cư"
  }
];

export default function FavoritesPage() {
  const [properties, setProperties] = useState<Property[]>(FAVORITES_MOCK);
  const [toast, contextHolder] = message.useMessage();

  const handleRemoveFavorite = (id: string, title: string) => {
    setProperties(properties.filter(p => p.id !== id));
    toast.success(`Đã xóa "${title.substring(0, 20)}..." khỏi danh sách quan tâm!`);
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs">
      {contextHolder}

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#b20707] flex items-center justify-center">
          <IconHeart className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
          Bất động sản quan tâm
        </h2>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-16 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 text-2xl">
            💔
          </div>
          <p className="text-gray-400 text-sm font-medium">
            Danh sách bất động sản quan tâm trống.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {properties.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col"
            >
              
              {/* Image / Icon container */}
              <div className="h-44 bg-gray-50 flex items-center justify-center text-5xl relative">
                {item.image}
                
                {/* Type Badge */}
                <span className="absolute top-3 left-3 bg-[#b20707] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider">
                  {item.type}
                </span>

                {/* Heart Button */}
                <button
                  onClick={() => handleRemoveFavorite(item.id, item.title)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-[#b20707] flex items-center justify-center shadow-xs transition-colors cursor-pointer"
                  title="Xóa khỏi quan tâm"
                >
                  <IconHeart className="w-5 h-5 fill-current" />
                </button>
              </div>

              {/* Info container */}
              <div className="p-5 flex-1 flex flex-col gap-3 justify-between">
                
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-gray-800 text-sm leading-snug group-hover:text-[#b20707] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-xs font-medium">
                    📍 {item.location}
                  </p>
                </div>

                {/* Details row */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <span className="text-[#b20707] font-bold text-base font-mono">
                    {item.price}
                  </span>
                  <span className="text-gray-500 text-xs font-semibold font-mono">
                    📐 {item.area}
                  </span>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
