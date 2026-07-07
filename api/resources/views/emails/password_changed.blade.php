<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Thay đổi mật khẩu thành công — {{ $siteName }}</title>
{{-- Font hệ thống: Roboto (đồng bộ với web). Client email không hỗ trợ web font sẽ tự fallback sang sans-serif. --}}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet">
<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family:'Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif; background:#f4f6f9; color:#333; line-height:1.6; }
    /* Gmail/Apple Mail tự biến tên miền, email, SĐT thành link xanh gạch chân.
       Ép mọi link kế thừa màu chữ xung quanh + bỏ gạch chân để không bị "vỡ" màu. */
    a { color:inherit !important; text-decoration:none !important; }
    .wrap { max-width:560px; margin:32px auto; background:#fff; border-radius:14px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,.07); }

    /* Header đỏ + logo */
    .header { background:#b20707; padding:22px 40px; text-align:center; }
    .header-logo { font-size:19px; font-weight:700; color:#fff; letter-spacing:-.3px; display:inline-flex; align-items:center; gap:8px; }
    .header-logo-ic { width:22px; height:22px; vertical-align:middle; }

    /* Thân email */
    .body { padding:34px 40px 8px; }
    .greeting { font-size:14px; color:#333; margin-bottom:16px; }

    /* Khối thông báo: tiêu đề + nội dung (theo mẫu) */
    .noti-title { font-size:16px; font-weight:700; color:#222; margin-bottom:10px; }
    .noti-content { font-size:14px; color:#555; line-height:1.7; margin-bottom:22px; }
    .noti-content b { color:#333; }

    /* Ghi chú phụ */
    .note { font-size: 14px;
        color: #555;
        line-height: 1.7;
        margin-bottom: 24px;}

    .sign { font-size:14px; color:#555; margin-bottom:28px; }
    .sign b { color:#333; }

    /* Footer xám */
    .footer { background:#f8f9fb; padding:20px 40px; text-align:center; border-top:1px solid #f0f0f0; }
    .footer p { font-size:12px; color:#b0b0b0; line-height:1.8; }

    @media (max-width:600px) {
        .wrap { margin:0; border-radius:0; box-shadow:none; }
        .body, .header, .footer { padding-left:22px; padding-right:22px; }
    }
</style>
</head>
<body>
<div class="wrap">
    {{-- ── Header ── --}}
    <div class="header">
        <span class="header-logo">
            <svg class="header-logo-ic" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            {{-- Bọc trong <a> do mình kiểm soát + inline trắng: Gmail không tự tạo link xanh nữa. --}}
            <a href="{{ url('/') }}" style="color:#ffffff !important;text-decoration:none !important;">{{ $siteName }}</a>
        </span>
    </div>

    {{-- ── Thân: thông báo đổi mật khẩu (khối tiêu đề + nội dung) ── --}}
    <div class="body">
        <p class="greeting">Xin chào <b>{{ $user->full_name ?? 'bạn' }}</b>,</p>

        <h2 class="noti-title">Thay đổi mật khẩu thành công</h2>
        <p class="noti-content">
            Mật khẩu của tài khoản <b>{{ $user->email }}</b> trên <b>{{ $siteName }}</b> đã được
            <b>thay đổi thành công</b> vào lúc <b>{{ now()->format('H:i - d/m/Y') }}</b>.
        </p>

        <p class="note">
            Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ bộ phận hỗ trợ
            để được trợ giúp kịp thời.
        </p>

        <p class="sign">
            Trân trọng,<br>
            <b>Ban quản trị {{ $siteName }}</b>
        </p>
    </div>

    {{-- ── Footer ── --}}
    <div class="footer">
        <p>
            Email này được gửi tự động từ hệ thống <b>{{ $siteName }}</b>, <br> vui lòng không phản hồi trực tiếp email này.<br>
            Cần hỗ trợ, liên hệ hotline: <b style="color:#b20707">{{ getConfig('hotline') }}</b> <br> <br>
            © {{ date('Y') }} <b>{{ $siteName }}</b>. Đã đăng ký bản quyền.
        </p>
    </div>

    {{-- Token ẩn, KHÁC NHAU mỗi lần gửi → Gmail không coi footer là nội dung lặp
         nên không thu gọn phần cuối vào nút "•••". Không hiển thị với người nhận. --}}
    <div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;mso-hide:all;">
        {{ $user->email ?? '' }}-{{ now()->format('YmdHisu') }}-{{ \Illuminate\Support\Str::random(12) }}
    </div>
</div>
</body>
</html>
