# Supervisor Fixes — Complete Design Spec

**Date:** 2026-03-26
**Project:** Sudanese Electronic Check System
**Scope:** Fix all 7 supervisor comments + add Supabase database

---

## 1. Overview

Transform the current monolithic localStorage-based SPA into a multi-page, database-backed application with authentication, CRUD operations, professional dashboard, and working QR codes.

## 2. Technology Additions

| Addition | Package | Purpose |
|----------|---------|---------|
| Database + Auth | `@supabase/supabase-js` | PostgreSQL database + email/password auth |
| Routing | `react-router-dom` | Page navigation + protected routes |
| QR (fix) | `qrious` (bundle, not CDN) | Proper QR code generation |

## 3. Database Schema (Supabase PostgreSQL)

### Table: profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Table: checks
```sql
CREATE TABLE checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_number TEXT NOT NULL UNIQUE,
  issuer_name TEXT NOT NULL,
  issuer_account TEXT NOT NULL,
  beneficiary_name TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  amount_in_words TEXT NOT NULL,
  issue_date DATE NOT NULL,
  due_date DATE,
  bank_name TEXT NOT NULL,
  branch_name TEXT,
  security_pin TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cashed', 'returned')),
  signature TEXT NOT NULL,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can read all checks" ON checks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert checks" ON checks FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can update checks" ON checks FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admins can delete checks" ON checks FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
```

### Default Users (seeded via Supabase dashboard or SQL)
- Admin: email `admin@echeck.sd`, password `admin123`, role `admin`
- User: email `user@echeck.sd`, password `user123`, role `user`

## 4. File Structure

```
src/
├── main.jsx                       # React DOM + BrowserRouter
├── App.jsx                        # Route definitions + AuthProvider
├── lib/
│   └── supabase.js                # createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
├── context/
│   └── AuthContext.jsx             # useAuth hook: user, profile, login, logout, loading
├── components/
│   ├── layout/
│   │   ├── AppLayout.jsx          # Sidebar + Header + main content area
│   │   ├── Sidebar.jsx            # Arabic navigation with role-based items
│   │   ├── Header.jsx             # User name, role badge, logout button
│   │   └── ProtectedRoute.jsx     # Auth guard + optional role check
│   ├── check/
│   │   ├── CheckForm.jsx          # Reusable form for add/edit
│   │   ├── CheckCard.jsx          # Check preview card with QR
│   │   ├── QRCode.jsx             # QRious canvas wrapper
│   │   └── StatusBadge.jsx        # Color-coded status badge
│   ├── dashboard/
│   │   ├── StatCard.jsx           # Icon + number + label card
│   │   └── StatusChart.jsx        # CSS bar chart for status distribution
│   └── ui/
│       ├── Button.jsx             # Styled button variants
│       ├── Input.jsx              # Form input with label + icon
│       ├── Select.jsx             # Dropdown with label
│       ├── Modal.jsx              # Confirmation dialog
│       └── Alert.jsx              # Success/error message
├── pages/
│   ├── LoginPage.jsx              # Email + password login form
│   ├── DashboardPage.jsx          # Stats cards + recent checks + chart
│   ├── ChecksListPage.jsx         # Table with search, filter, CRUD actions
│   ├── AddCheckPage.jsx           # CheckForm in add mode
│   ├── EditCheckPage.jsx          # CheckForm in edit mode, loaded by :id
│   └── CheckDetailPage.jsx        # Full check view + QR code + print
└── utils/
    ├── arabicWords.js             # numberToArabicWords function (extracted)
    ├── crypto.js                  # SHA-256 hash generation (extracted)
    └── constants.js               # SUDANESE_BANKS array, STATUS_OPTIONS
```

## 5. Authentication Flow

1. User visits any route → `ProtectedRoute` checks `supabase.auth.getSession()`
2. No session → redirect to `/login`
3. Login page: email + password → `supabase.auth.signInWithPassword()`
4. On success: fetch profile from `profiles` table to get role
5. Store in AuthContext: `{ user, profile: { role, full_name }, loading }`
6. Admin routes additionally check `profile.role === 'admin'`
7. Logout: `supabase.auth.signOut()` → clear context → redirect to `/login`

## 6. Route Definitions

```jsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
    <Route index element={<DashboardPage />} />
    <Route path="checks" element={<ChecksListPage />} />
    <Route path="checks/add" element={<ProtectedRoute requiredRole="admin"><AddCheckPage /></ProtectedRoute>} />
    <Route path="checks/edit/:id" element={<ProtectedRoute requiredRole="admin"><EditCheckPage /></ProtectedRoute>} />
    <Route path="checks/:id" element={<CheckDetailPage />} />
  </Route>
</Routes>
```

## 7. Page Specifications

### LoginPage
- Centered card with app logo/title
- Email input, password input, login button
- Error message display
- RTL Arabic layout
- No team member info visible

### DashboardPage
- 4 stat cards in a grid:
  - إجمالي الشيكات (total checks count) — blue
  - مجموع المبالغ (total amount sum) — green
  - الشيكات المتأخرة (overdue: due_date < today AND status = 'pending') — red
  - الشيكات المصروفة (status = 'cashed') — emerald
- Recent checks table (last 5, ordered by created_at desc)
- Status distribution chart (CSS bars showing pending/cashed/returned counts)

### ChecksListPage
- Table columns: رقم الشيك | اسم المستفيد | المبلغ | تاريخ الاستحقاق | الحالة | الإجراءات
- StatusBadge component for color-coded status
- Actions: View (all users), Edit (admin), Delete (admin)
- Delete shows Modal confirmation dialog
- Search by check number or beneficiary name

### AddCheckPage
- CheckForm in "add" mode
- Fields: check_number, issuer_name, issuer_account, beneficiary_name, amount (auto-calculates amount_in_words), issue_date, due_date, bank_name (dropdown), branch_name, security_pin (4-digit)
- On submit: generate SHA-256 signature, call supabase insert, redirect to /checks
- Success toast message

### EditCheckPage
- CheckForm in "edit" mode, pre-loaded by URL param :id
- Same fields, pre-filled
- On submit: call supabase update, redirect to /checks

### CheckDetailPage
- Full check display card with all fields
- QR code canvas (QRious) encoding: { checkNumber, beneficiary, amount, date, status }
- Print button (window.print with print-friendly CSS)
- Back button to checks list

## 8. QR Code Fix

- Install QRious as npm dependency (not CDN): `npm install qrious`
- QRCode component:
  ```jsx
  // Uses useRef + useEffect to instantiate QRious on canvas
  const canvasRef = useRef(null);
  useEffect(() => {
    new QRious({
      element: canvasRef.current,
      value: JSON.stringify(data),
      size: 200,
      level: 'H'
    });
  }, [data]);
  ```
- QR data payload: `{ checkNumber, beneficiaryName, amount, issueDate, status, signature }`

## 9. Remove Team Info

- Remove STUDENTS array rendering from any UI component
- Remove supervisor name from UI
- Remove footer with team credits from app screens
- Keep all team info in README.md only
- App footer shows only: "نظام الشيك الإلكتروني السوداني © 2026"

## 10. Design System Application

All UI follows CLAUDE.md design system:
- Colors: Navy primary (#0F172A), Gold accent (#A16207), Blue secondary (#1E3A8A)
- Font: IBM Plex Sans Arabic
- Icons: Lucide React only
- Spacing: 8dp grid
- RTL-first layout with logical properties

## 11. Environment Variables

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

Added to `.env` (gitignored) and documented in README.

## 12. Deployment

- No changes to Netlify config needed (still static SPA)
- Add `_redirects` file: `/* /index.html 200` for client-side routing
- Supabase handles all backend (database + auth) as a service
- Environment variables set in Netlify dashboard

## 13. Acceptance Criteria

1. QR codes generate and are scannable on every check detail page
2. Supabase database stores all checks persistently
3. Admin can add, edit, delete checks; regular user can only view
4. Login/logout works with role-based access
5. Dashboard shows 4 accurate stat cards + chart
6. No team member info visible in the application UI
7. All routes work with proper navigation and protection
