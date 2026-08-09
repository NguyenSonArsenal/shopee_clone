import { NextRequest, NextResponse } from 'next/server'
import {STORAGE_KEYS} from "@/config/constant";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(STORAGE_KEYS.ACCESS_TOKEN)?.value
  console.log(token, '// token')

  const currentUrl = request.nextUrl.pathname
  console.log(currentUrl, '// currentUrl')
  console.log('=========== PROXY RAN ===========')
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Thêm custom header vào request chuyển tiếp
  const response = NextResponse.next()
  response.headers.set('x-custom-proxy-header', 'nextjs-16-proxy')

  return response
}

// Cấu hình các route áp dụng proxy
export const config = {
  matcher: ['/co-cau-to-chuc/:path*'],
}
