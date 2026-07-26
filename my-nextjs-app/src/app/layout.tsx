import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";
import {ToastProvider} from "@/context/ToastContext";
import {ConfirmProvider} from "@/context/ConfirmContext";
import {ReactQueryProvider} from "@/context/ReactQueryProvider";
import {AntdRegistry} from "@ant-design/nextjs-registry";

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
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          {/* antd sinh CSS bằng JS lúc chạy — thiếu cái này: AntdRegistry thì CSS chỉ có sau hydrate, gây giật layout lúc mới load trang */}
          <AntdRegistry>
            <ToastProvider>
              <ConfirmProvider>
                {children}
              </ConfirmProvider>
            </ToastProvider>
          </AntdRegistry>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
