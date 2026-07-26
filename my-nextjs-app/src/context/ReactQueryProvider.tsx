"use client"

import { useState, ReactNode } from "react"
import {keepPreviousData, QueryClient, QueryClientProvider} from "@tanstack/react-query"

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState(() => ...) đảm bảo QueryClient chỉ tạo 1 lần duy nhất, không tạo lại mỗi lần re-render
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false, // default: true
        placeholderData: keepPreviousData // giữ trang cũ, trong lúc đợi trang mới load xong
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
