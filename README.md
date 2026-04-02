# نظام الشيك الإلكتروني السوداني
# Sudanese Electronic Check System

تحويل الشيك الورقي التقليدي إلى شيك إلكتروني باستخدام تقنية QR

Convert traditional paper checks to electronic checks using QR technology.

## Features

- **إصدار شيكات** — Create electronic checks with QR codes and SHA-256 signatures
- **التحقق من الشيكات** — Verify checks by scanning QR codes
- **لوحة تحكم احترافية** — Professional dashboard with statistics and charts
- **إدارة كاملة** — Add, edit, delete, and search checks
- **نظام أدوار** — Admin and regular user roles with access control
- **قاعدة بيانات** — PostgreSQL database via Supabase with Row Level Security
- **تصميم عربي** — Full RTL Arabic interface with IBM Plex Sans Arabic font

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| Vite | Build Tool |
| Tailwind CSS 4 | Styling |
| Supabase | Database + Authentication |
| React Router 7 | Navigation |
| QRious | QR Code Generation |
| Lucide React | Icons |

## Setup

### Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier)

### 1. Clone and Install

```bash
git clone https://github.com/Osamamicro/electronic-check-system.git
cd electronic-check-system
npm install
```

### 2. Setup Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Authentication > Users > Add User** and create:
   - **Admin:** email `admin@echeck.sd`, password `admin123`, metadata: `{"full_name": "المدير", "role": "admin"}`
   - **User:** email `user@echeck.sd`, password `user123`, metadata: `{"full_name": "مستخدم عادي", "role": "user"}`

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase project URL and anon key (found in Project Settings > API).

### 4. Run Development Server

```bash
npm run dev
```

### 5. Login

- **Admin:** admin@echeck.sd / admin123
- **User:** user@echeck.sd / user123

## Deployment (Netlify)

1. Push to GitHub
2. Connect repo to [Netlify](https://netlify.com)
3. Build settings: `npm run build`, publish directory: `dist`
4. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. The `public/_redirects` file handles SPA routing automatically

## Project Structure

```
src/
├── main.jsx              # Entry point
├── App.jsx               # Route definitions
├── lib/supabase.js       # Database client
├── context/AuthContext.jsx # Authentication state
├── components/
│   ├── layout/           # Sidebar, Header, ProtectedRoute
│   ├── check/            # CheckForm, QRCode, StatusBadge
│   └── dashboard/        # StatCard, StatusChart
├── pages/                # All page components
└── utils/                # Arabic words, crypto, constants
```

## Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@echeck.sd | admin123 |
| User | user@echeck.sd | user123 |

---

**مشروع تخرج — كلية شرق النيل**
**قسم تقانة المعلومات**

اعداد الطالبات: خولة عبدالله الطيب، رنا صلاح محمد علي، فداء فتح الرحمن اسحق، نون عبدالرحيم عبيد

مشرف البحث: أ/ محمد صالح
