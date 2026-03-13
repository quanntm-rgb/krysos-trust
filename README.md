# Krysos Trust — Website

Website cho Krysos Trust, công ty tư vấn compliance cho fintech/crypto.

## Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **Google Fonts** (Cormorant Garamond, DM Sans, JetBrains Mono)

## Cài đặt local

```bash
# 1. Clone repo
git clone https://github.com/YOUR_USERNAME/krysos-trust.git
cd krysos-trust

# 2. Cài dependencies
npm install

# 3. Chạy dev server
npm run dev
```

Mở http://localhost:3000

## Deploy lên Vercel

Xem hướng dẫn chi tiết trong file `DEPLOY.md`.

## Cấu trúc dự án

```
krysos-trust/
├── src/
│   ├── app/
│   │   ├── globals.css      ← Global styles + animations
│   │   ├── layout.js        ← Root layout + SEO metadata
│   │   └── page.js          ← Homepage entry
│   └── components/
│       └── KrysosTrust.jsx  ← Main website component
├── public/                   ← Static assets (logo, images...)
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## TODO trước khi go-live
- [ ] Thay logo placeholder bằng logo thật
- [ ] Thay nội dung sample (testimonials, số liệu, contact info)
- [ ] Thêm Google Analytics ID
- [ ] Cấu hình domain
- [ ] Thêm ảnh OG cho social sharing
