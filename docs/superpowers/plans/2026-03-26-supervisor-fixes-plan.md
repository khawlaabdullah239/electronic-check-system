# Supervisor Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all 7 supervisor comments by adding Supabase database + auth, CRUD screens, professional dashboard, QR fix, routing, and removing team info from UI.

**Architecture:** Multi-page React Router app with Supabase PostgreSQL backend for data persistence and authentication. Role-based access (admin/user). Professional Arabic RTL dashboard with statistics.

**Tech Stack:** React 19, Vite, Tailwind CSS 4, Supabase (PostgreSQL + Auth), React Router DOM 7, QRious, Lucide React, Playwright (testing)

---

## File Structure

```
src/
├── main.jsx                          # Entry: BrowserRouter + AuthProvider + App
├── App.jsx                           # Route definitions + AppLayout
├── index.css                         # Tailwind + Google Fonts + design tokens
├── lib/
│   └── supabase.js                   # Supabase client initialization
├── context/
│   └── AuthContext.jsx               # Auth state: user, profile, login, logout
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx             # Sidebar + Header + <Outlet/>
│   │   ├── Sidebar.jsx               # RTL nav with role-based items
│   │   ├── Header.jsx                # User name, role badge, logout
│   │   └── ProtectedRoute.jsx        # Auth guard + optional role check
│   ├── check/
│   │   ├── CheckForm.jsx             # Reusable add/edit form
│   │   ├── QRCode.jsx                # QRious canvas wrapper
│   │   └── StatusBadge.jsx           # Color-coded status pill
│   └── dashboard/
│       ├── StatCard.jsx              # Icon + number + label card
│       └── StatusChart.jsx           # CSS bar chart
├── pages/
│   ├── LoginPage.jsx                 # Login form
│   ├── DashboardPage.jsx             # Stats + recent + chart
│   ├── ChecksListPage.jsx            # Table + search + CRUD actions
│   ├── AddCheckPage.jsx              # CheckForm (add mode)
│   ├── EditCheckPage.jsx             # CheckForm (edit mode)
│   └── CheckDetailPage.jsx           # Full view + QR + print
├── utils/
│   ├── arabicWords.js                # numberToArabicWords (extracted)
│   ├── crypto.js                     # SHA-256 hash (extracted)
│   └── constants.js                  # Banks, status options
├── .env                              # Supabase URL + anon key (gitignored)
├── public/_redirects                 # Netlify SPA routing
└── e2e/
    └── app.spec.js                   # Playwright E2E tests
```

---

## Task 1: Install Dependencies & Foundation

**Files:**
- Modify: `package.json`
- Create: `src/lib/supabase.js`
- Create: `src/utils/constants.js`
- Create: `src/utils/arabicWords.js`
- Create: `src/utils/crypto.js`
- Create: `.env`
- Create: `.env.example`
- Create: `public/_redirects`
- Modify: `.gitignore`

- [ ] **Step 1: Install new dependencies**

```bash
cd "C:\Users\GACA-IT\Desktop\GACA Projects\repos\ELECTRONIC CHECK\.claude\worktrees\upbeat-curran"
npm install @supabase/supabase-js react-router-dom qrious
```

- [ ] **Step 2: Create .env and .env.example**

`.env`:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

`.env.example`:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

- [ ] **Step 3: Add .env to .gitignore**

Append to `.gitignore`:
```
.env
.env.local
```

- [ ] **Step 4: Create Supabase client**

`src/lib/supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

- [ ] **Step 5: Extract constants**

`src/utils/constants.js`:
```javascript
export const SUDANESE_BANKS = [
  'بنك الخرطوم',
  'بنك فيصل الإسلامي السوداني',
  'بنك أم درمان الوطني',
  'بنك النيلين',
  'بنك السودان المركزي',
  'المصرف الصناعي السوداني',
  'بنك المزارع التجاري',
  'بنك الإدخار والتنمية الاجتماعية',
  'بنك البركة السوداني',
  'بنك التضامن الإسلامي',
  'بنك الثروة الحيوانية والتعاوني',
  'بنك الإستثمار السوداني',
  'بنك التنمية التعاوني الإسلامي',
  'بنك قطر الوطني - السودان',
  'بنك أبو ظبي الإسلامي - السودان'
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'قيد الانتظار', color: 'amber' },
  { value: 'cashed', label: 'مصروف', color: 'emerald' },
  { value: 'returned', label: 'مرتجع', color: 'red' }
];
```

- [ ] **Step 6: Extract arabicWords utility**

`src/utils/arabicWords.js`: Copy the entire `numberToArabicWords` function from the current App.jsx (lines 32-94) and export it as default.

- [ ] **Step 7: Extract crypto utility**

`src/utils/crypto.js`:
```javascript
export const generateHash = async (data) => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
```

- [ ] **Step 8: Create Netlify redirects**

`public/_redirects`:
```
/*    /index.html   200
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: install dependencies and create foundation files

Add supabase, react-router-dom, qrious packages.
Extract utils (arabicWords, crypto, constants).
Setup Supabase client, env files, Netlify redirects."
```

---

## Task 2: Auth Context & Login Page

**Files:**
- Create: `src/context/AuthContext.jsx`
- Create: `src/pages/LoginPage.jsx`

- [ ] **Step 1: Create AuthContext**

`src/context/AuthContext.jsx`:
```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (!error && data) setProfile(data);
    return data;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

- [ ] **Step 2: Create LoginPage**

`src/pages/LoginPage.jsx`:
```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { QrCode, Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0F172A] mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#0F172A]">نظام الشيك الإلكتروني</h1>
          <p className="text-[#64748B] mt-2">تسجيل الدخول للمتابعة</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#0F172A] mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                id="email" type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full ps-10 pe-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                placeholder="admin@echeck.sd"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#0F172A] mb-2">كلمة المرور</label>
            <div className="relative">
              <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748B]" />
              <input
                id="password" type="password" required value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full ps-10 pe-4 py-3 border border-[#E2E8F0] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0F172A] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F172A] text-white rounded-xl font-medium hover:bg-[#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            {loading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
        <p className="text-center text-xs text-[#64748B] mt-6">نظام الشيك الإلكتروني السوداني &copy; 2026</p>
      </div>
    </div>
  );
};

export default LoginPage;
```

- [ ] **Step 3: Commit**

```bash
git add src/context/AuthContext.jsx src/pages/LoginPage.jsx
git commit -m "feat: add Supabase auth context and login page"
```

---

## Task 3: Layout Components

**Files:**
- Create: `src/components/layout/ProtectedRoute.jsx`
- Create: `src/components/layout/Sidebar.jsx`
- Create: `src/components/layout/Header.jsx`
- Create: `src/components/layout/AppLayout.jsx`

- [ ] **Step 1: Create ProtectedRoute**

`src/components/layout/ProtectedRoute.jsx`:
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#64748B]">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

- [ ] **Step 2: Create Sidebar**

`src/components/layout/Sidebar.jsx`:
```jsx
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, FilePlus, QrCode } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  const navItems = [
    { to: '/', label: 'الرئيسية', icon: LayoutDashboard },
    { to: '/checks', label: 'الشيكات', icon: FileText },
    ...(isAdmin ? [{ to: '/checks/add', label: 'إضافة شيك', icon: FilePlus }] : []),
  ];

  return (
    <aside className="w-64 bg-[#0F172A] min-h-screen fixed start-0 top-0 flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-xl">
            <QrCode className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">الشيك الإلكتروني</h1>
            <p className="text-white/50 text-xs">نظام QR السوداني</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
```

- [ ] **Step 3: Create Header**

`src/components/layout/Header.jsx`:
```jsx
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, Shield, User } from 'lucide-react';

const Header = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-[#64748B]">{profile?.full_name}</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            profile?.role === 'admin'
              ? 'bg-[#A16207]/10 text-[#A16207]'
              : 'bg-[#1E3A8A]/10 text-[#1E3A8A]'
          }`}>
            {profile?.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
            {profile?.role === 'admin' ? 'مدير' : 'مستخدم'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          خروج
        </button>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 4: Create AppLayout**

`src/components/layout/AppLayout.jsx`:
```jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="ms-64">
        <Header />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
```

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/
git commit -m "feat: add layout components (sidebar, header, protected route, app layout)"
```

---

## Task 4: Reusable UI Components

**Files:**
- Create: `src/components/check/StatusBadge.jsx`
- Create: `src/components/check/QRCode.jsx`
- Create: `src/components/dashboard/StatCard.jsx`
- Create: `src/components/dashboard/StatusChart.jsx`

- [ ] **Step 1: Create StatusBadge**

`src/components/check/StatusBadge.jsx`:
```jsx
const STATUS_MAP = {
  pending: { label: 'قيد الانتظار', bg: 'bg-amber-100', text: 'text-amber-700' },
  cashed: { label: 'مصروف', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  returned: { label: 'مرتجع', bg: 'bg-red-100', text: 'text-red-700' },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

export default StatusBadge;
```

- [ ] **Step 2: Create QRCode component**

`src/components/check/QRCode.jsx`:
```jsx
import { useRef, useEffect } from 'react';
import QRious from 'qrious';

const QRCodeDisplay = ({ data, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && data) {
      new QRious({
        element: canvasRef.current,
        value: typeof data === 'string' ? data : JSON.stringify(data),
        size,
        background: '#FFFFFF',
        foreground: '#0F172A',
        level: 'H',
      });
    }
  }, [data, size]);

  return (
    <div className="inline-block p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default QRCodeDisplay;
```

- [ ] **Step 3: Create StatCard**

`src/components/dashboard/StatCard.jsx`:
```jsx
const StatCard = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    red: 'bg-red-50 text-red-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
      <p className="text-sm text-[#64748B] mt-1">{label}</p>
    </div>
  );
};

export default StatCard;
```

- [ ] **Step 4: Create StatusChart**

`src/components/dashboard/StatusChart.jsx`:
```jsx
const StatusChart = ({ pending = 0, cashed = 0, returned = 0 }) => {
  const total = pending + cashed + returned || 1;
  const bars = [
    { label: 'قيد الانتظار', count: pending, color: 'bg-amber-400', pct: Math.round((pending / total) * 100) },
    { label: 'مصروف', count: cashed, color: 'bg-emerald-400', pct: Math.round((cashed / total) * 100) },
    { label: 'مرتجع', count: returned, color: 'bg-red-400', pct: Math.round((returned / total) * 100) },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E2E8F0]">
      <h3 className="font-bold text-[#0F172A] mb-4">توزيع حالات الشيكات</h3>
      <div className="space-y-4">
        {bars.map((b) => (
          <div key={b.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-[#64748B]">{b.label}</span>
              <span className="font-medium text-[#0F172A]">{b.count} ({b.pct}%)</span>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${b.color} transition-all duration-500`} style={{ width: `${b.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add reusable UI components (QRCode, StatusBadge, StatCard, StatusChart)"
```

---

## Task 5: CheckForm Component

**Files:**
- Create: `src/components/check/CheckForm.jsx`

- [ ] **Step 1: Create CheckForm**

`src/components/check/CheckForm.jsx`: A reusable form component that works for both add and edit modes. Props: `initialData` (optional, for edit), `onSubmit` (async callback), `isLoading`. Contains all check fields with Arabic labels: checkNumber, issuerName, issuerAccount, beneficiaryName, amount (with auto Arabic words), issueDate, dueDate, bankName (dropdown from SUDANESE_BANKS), branchName, securityPin (4-digit, with show/hide toggle), status (dropdown from STATUS_OPTIONS). Uses Lucide icons, Tailwind styling, proper RTL with `start-`/`end-` logical properties. Auto-calculates `amountInWords` using `numberToArabicWords` when amount changes. Validates all required fields on submit. Generates SHA-256 signature from check data + PIN using `generateHash`.

- [ ] **Step 2: Commit**

```bash
git add src/components/check/CheckForm.jsx
git commit -m "feat: add reusable CheckForm component with Arabic validation"
```

---

## Task 6: All Pages

**Files:**
- Create: `src/pages/DashboardPage.jsx`
- Create: `src/pages/ChecksListPage.jsx`
- Create: `src/pages/AddCheckPage.jsx`
- Create: `src/pages/EditCheckPage.jsx`
- Create: `src/pages/CheckDetailPage.jsx`

- [ ] **Step 1: Create DashboardPage**

`src/pages/DashboardPage.jsx`: Fetches all checks from Supabase `checks` table. Shows 4 StatCards: total checks (blue), total amount formatted as SDG currency (green), overdue checks where due_date < today AND status='pending' (red), cashed checks count (amber). Below cards: recent checks table (last 5) + StatusChart. Full RTL Arabic.

- [ ] **Step 2: Create ChecksListPage**

`src/pages/ChecksListPage.jsx`: Fetches all checks from Supabase ordered by created_at desc. Table with columns: رقم الشيك, اسم المستفيد, المبلغ, تاريخ الاستحقاق, الحالة (StatusBadge), الإجراءات. Search input filters by checkNumber or beneficiaryName. Actions: View (link to /checks/:id), Edit (admin only, link to /checks/edit/:id), Delete (admin only, shows confirmation modal then calls supabase.from('checks').delete()). Uses useAuth to check role for showing admin actions.

- [ ] **Step 3: Create AddCheckPage**

`src/pages/AddCheckPage.jsx`: Renders CheckForm in add mode. On submit: inserts check into Supabase `checks` table with `created_by: user.id`, shows success message, navigates to /checks.

- [ ] **Step 4: Create EditCheckPage**

`src/pages/EditCheckPage.jsx`: Uses `useParams()` to get check ID. Fetches check from Supabase by ID. Renders CheckForm with `initialData` populated. On submit: updates check in Supabase, navigates to /checks.

- [ ] **Step 5: Create CheckDetailPage**

`src/pages/CheckDetailPage.jsx`: Uses `useParams()` to get check ID. Fetches full check from Supabase. Shows all fields in a card layout. Renders QRCodeDisplay with `{ checkNumber, beneficiaryName, amount, issueDate, status, signature }`. Print button calls `window.print()`. Back button links to /checks. Print-friendly CSS media query hides sidebar/header.

- [ ] **Step 6: Commit**

```bash
git add src/pages/
git commit -m "feat: add all pages (dashboard, checks list, add, edit, detail)"
```

---

## Task 7: App Router & Entry Point

**Files:**
- Modify: `src/App.jsx` (complete rewrite)
- Modify: `src/main.jsx`
- Modify: `src/index.css`
- Modify: `index.html`

- [ ] **Step 1: Rewrite App.jsx as router**

`src/App.jsx`:
```jsx
import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChecksListPage from './pages/ChecksListPage';
import AddCheckPage from './pages/AddCheckPage';
import EditCheckPage from './pages/EditCheckPage';
import CheckDetailPage from './pages/CheckDetailPage';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="checks" element={<ChecksListPage />} />
        <Route path="checks/add" element={
          <ProtectedRoute requiredRole="admin"><AddCheckPage /></ProtectedRoute>
        } />
        <Route path="checks/edit/:id" element={
          <ProtectedRoute requiredRole="admin"><EditCheckPage /></ProtectedRoute>
        } />
        <Route path="checks/:id" element={<CheckDetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;
```

- [ ] **Step 2: Update main.jsx**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
```

- [ ] **Step 3: Update index.css with design system tokens + Google Fonts**

```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
@import "tailwindcss/theme" layer(theme);
@import "tailwindcss/preflight" layer(base);
@import "tailwindcss/utilities" layer(utilities);

* { font-family: 'IBM Plex Sans Arabic', system-ui, sans-serif; }
body { direction: rtl; }

@media print {
  .no-print { display: none !important; }
  body { direction: rtl; }
}
```

- [ ] **Step 4: Update index.html**

```html
<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>نظام الشيك الإلكتروني السوداني</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/main.jsx src/index.css index.html
git commit -m "feat: setup React Router, update entry points, apply design system"
```

---

## Task 8: Supabase Database Setup

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create SQL schema file**

`supabase/schema.sql`: Contains the complete SQL schema from the design spec — profiles table, checks table, RLS policies, trigger for updated_at, and seed data for the two default users.

- [ ] **Step 2: Add setup instructions to README**

Document: Go to supabase.com, create free project, run schema.sql in SQL editor, copy URL + anon key to .env.

- [ ] **Step 3: Commit**

```bash
git add supabase/
git commit -m "feat: add Supabase database schema and setup instructions"
```

---

## Task 9: Update README & Remove Team Info

**Files:**
- Modify: `README.md` (complete rewrite)

- [ ] **Step 1: Rewrite README**

Professional README with: project title, description, features list, tech stack, setup instructions (clone, npm install, Supabase setup, env vars, run dev), default login credentials, Netlify deployment guide, screenshots placeholder, team credits (only place team info appears).

- [ ] **Step 2: Verify no team info in UI**

Search all JSX files for student names and supervisor name — confirm they only exist in README.md.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README with setup instructions, move team info out of UI"
```

---

## Task 10: Playwright E2E Tests

**Files:**
- Create: `e2e/app.spec.js`
- Create: `playwright.config.js`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create playwright.config.js**

```javascript
import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
```

- [ ] **Step 3: Create E2E tests**

`e2e/app.spec.js`: Tests covering:
1. Login page renders with Arabic text
2. Invalid login shows error message
3. Successful admin login redirects to dashboard
4. Dashboard shows 4 stat cards
5. Sidebar navigation works (admin sees "إضافة شيك")
6. Admin can add a check via form
7. Checks list page shows table
8. Check detail page shows QR code (canvas element exists)
9. Regular user cannot access add/edit routes
10. Logout redirects to login

- [ ] **Step 4: Commit**

```bash
git add playwright.config.js e2e/
git commit -m "test: add Playwright E2E tests for full app flow"
```

---

## Execution Order & Dependencies

```
Task 1 (foundation) → Task 2 (auth) → Task 3 (layout) → Task 4 (UI components)
                                                               ↓
Task 5 (CheckForm) → Task 6 (pages) → Task 7 (router) → Task 8 (DB schema)
                                                               ↓
                                              Task 9 (README) → Task 10 (tests)
```

**Parallel opportunities:**
- Tasks 4 + 5 can run in parallel (no dependencies between them)
- Tasks 8 + 9 can run in parallel
