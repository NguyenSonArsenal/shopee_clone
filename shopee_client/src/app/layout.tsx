// layout.tsx là Server Component

import "./globals.css";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Providers from "@component/Providers";

const queryClient = new QueryClient();

export const metadata = {
  title: "Shopee Mini | Mua sắm Online",
  description: "Hệ thống mua sắm trực tuyến Shopee Mini",
  icons: {
    icon: "/image/shopee.jpg", // In public folder
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
