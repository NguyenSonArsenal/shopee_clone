"use client";

import {useQuery} from '@tanstack/react-query';
import {Skeleton} from 'antd';
import {categoryApi} from '@/api/categoryApi';
import {CATEGORY_ICON_MAP} from '@constant/category';
import {delay} from "@helper";
import {TIME_REFRESH} from "@constant/constant";
import React from "react";

export default function CategorySection() {
	const {data: listCategory = [], isLoading} = useQuery({
		queryKey: ['get_list_category'],
		queryFn: async () => {
			await delay(1000); // Delay 3s
			return categoryApi.getList();
		},
		staleTime: TIME_REFRESH,
	});

	return (
		<section className="bg-white rounded-sm shadow-sm p-4 mb-6">
			<h2
				className="font-medium text-lg text-[#0000008a] uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
				Danh mục
			</h2>

			{isLoading && <Skeleton style={{height: 'auto'}}/>}

			{!isLoading && (
				<div
					className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 border-t border-l border-gray-100">
					{listCategory.map((cat) => (
						<div
							key={cat.id}
							className="flex flex-col items-center justify-center p-4 border-r border-b border-gray-100 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer text-center"
						>
              <span className="text-3xl">
                  {cat.image
	                  ? <img src={cat.image} className="w-8 h-8 object-cover"/>
	                  : CATEGORY_ICON_MAP[cat.name] ?? '🏷️'
                  }
              </span>
							<span className="text-sm text-gray-700 font-light leading-tight">{cat.name}</span>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
