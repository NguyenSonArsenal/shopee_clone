"use client";  // Chỉ file này cần use client

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
	// Dùng useState để tránh share QueryClient giữa các request (best practice)
	const [queryClient] = useState(() => new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // Mặc định cache 1 phút
			},
		},
	}));

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} /> {/* To debug react query */}
		</QueryClientProvider>
	);
}
