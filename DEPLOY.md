# 🚀 Hướng dẫn Deploy Krysos Trust lên Vercel

## Bước 1: Chuẩn bị GitHub Repository

### 1.1 Tạo repo mới trên GitHub
1. Vào https://github.com/new
2. Đặt tên repo: `krysos-trust`
3. Chọn **Private** (hoặc Public tùy ý)
4. **KHÔNG** tick "Add a README" (vì mình đã có)
5. Nhấn **Create repository**

### 1.2 Push code lên GitHub
Mở Terminal, vào thư mục dự án và chạy:

```bash
cd krysos-trust

# Khởi tạo git
git init
git add .
git commit -m "Initial commit: Krysos Trust website"

# Kết nối với GitHub (thay YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/krysos-trust.git
git branch -M main
git push -u origin main
```

---

## Bước 2: Deploy lên Vercel

### 2.1 Kết nối Vercel với GitHub
1. Vào https://vercel.com và đăng nhập bằng GitHub
2. Nhấn **"Add New..."** → **"Project"**
3. Tìm và chọn repo `krysos-trust`
4. Nhấn **"Import"**

### 2.2 Cấu hình project
Vercel sẽ tự detect Next.js. Bạn chỉ cần:
- **Framework Preset:** Next.js (tự động)
- **Root Directory:** `.` (mặc định)
- **Build Command:** `next build` (mặc định)
- **Output Directory:** `.next` (mặc định)

→ Nhấn **"Deploy"**

### 2.3 Chờ build (~1-2 phút)
Vercel sẽ build và deploy. Khi xong, bạn sẽ nhận được URL dạng:
```
https://krysos-trust-xxxx.vercel.app
```

🎉 **Website đã live!**

---

## Bước 3: Gắn domain riêng (tùy chọn)

### 3.1 Thêm domain trên Vercel
1. Vào **Project Settings** → **Domains**
2. Nhập domain (ví dụ: `krysostrust.com`)
3. Nhấn **Add**

### 3.2 Cấu hình DNS
Vercel sẽ cho bạn DNS records cần thêm. Tùy nhà cung cấp domain:

**Nếu dùng Namecheap / GoDaddy / Google Domains:**
- Thêm **A record**: `76.76.21.21`
- Thêm **CNAME**: `cname.vercel-dns.com`

**Nếu dùng Cloudflare:**
- Thêm **CNAME** trỏ đến `cname.vercel-dns.com`
- Tắt Proxy (chỉ DNS only) ban đầu

DNS cần 5-30 phút để cập nhật.

---

## Bước 4: Cập nhật nội dung sau này

Mỗi lần bạn push code mới lên GitHub, Vercel sẽ **tự động** build và deploy lại:

```bash
# Sửa code
git add .
git commit -m "Update testimonials"
git push
```

→ Vercel tự deploy trong ~1 phút. Không cần làm gì thêm.

---

## Bước 5: Thêm Google Analytics (tùy chọn)

1. Tạo GA4 property tại https://analytics.google.com
2. Copy Measurement ID (dạng `G-XXXXXXXXXX`)
3. Thêm vào `src/app/layout.js`:

```jsx
import Script from 'next/script';

// Thêm vào trong <head> hoặc trước </body>:
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `}
</Script>
```

---

## Troubleshooting

| Vấn đề | Giải pháp |
|---------|-----------|
| Build failed | Kiểm tra log trên Vercel Dashboard → Deployments |
| Fonts không load | Kiểm tra CSP headers nếu có custom domain |
| Trang trắng | Kiểm tra `"use client"` ở đầu component file |
| 404 trên refresh | Đây là SPA behavior, Next.js App Router xử lý tự động |

---

## Chi phí

| Hạng mục | Chi phí |
|----------|---------|
| Vercel Hobby plan | **Miễn phí** (100GB bandwidth/tháng) |
| Domain (.com) | ~$10-15/năm |
| SSL Certificate | **Miễn phí** (Vercel tự cấp) |

💡 **Tip:** Vercel Hobby plan đủ cho traffic ~50,000 visits/tháng. Khi cần scale, upgrade lên Pro ($20/tháng).
