import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";

// Next.js tự host font, tự sinh @font-face — không cần CSS thủ công
const roboto = Roboto({
  variable: "--font-roboto",   // dùng qua var(--font-roboto) trong SCSS
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BDS Tan Long",
  description: "Thông tin mua bán nhà đất, cho thuê bất động sản trên toàn quốc. Nguồn tin mua bán, cho thuê nhà đất, văn phòng, chung cư,... thông tin cập nhật nhanh và chính xác nhất.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${roboto.variable} h-full`}>
      {/* roboto.variable gắn --font-roboto vào <html> */}
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
