import Link from "next/link";

export default function AuthLeftPanel({}) {
  return (
    <div className="left">
      <Link href="/" className="brand-logo">
        <div className="brand-icon-box">
          <svg viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <div className="brand-text">
          BANGHANG<span>.NET</span>
        </div>
      </Link>

      <p className="brand-tagline">
        Nền tảng quản lý bảng hàng — kết nối nhà đầu tư, môi giới và khách hàng.
      </p>

      {/* Footer copyright */}
      <div className="left-footer">
        © 2026 Tân Long Land &nbsp;·&nbsp;
        <Link href="/">banghang.net</Link>
      </div>
    </div>
  )
}
