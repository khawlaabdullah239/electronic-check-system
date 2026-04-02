# Bug Fixes + Localization + Dark Mode + QR Verification — Design Spec

**Date:** 2026-03-26
**Scope:** Fix 6 issues found during testing

---

## 1. Amount Format Fix

Display all monetary amounts as Western Arabic numerals with comma separators: `100,000,006` not `١٠٠٬٠٠٠٬٠٠٦`.

Use `Number(amount).toLocaleString('en-US')` everywhere amounts are displayed.

**Affected files:** DashboardPage, ChecksListPage, CheckDetailPage, VerifyPublicPage.

## 2. Issue Date Validation

Add `max` attribute to the issue date input in CheckForm, set to today's date. Prevents selecting future dates.

```jsx
max={new Date().toISOString().split('T')[0]}
```

**Affected file:** CheckForm.jsx

## 3. Public QR Verification Page

### Route
`/verify/:checkNumber/:signature` — public, no auth required.

### QR Code Data Change
Instead of encoding JSON, encode a URL:
```
https://electronic-check-system.netlify.app/verify/{checkNumber}/{signature}
```
This means when someone scans the QR code with any phone scanner, it opens a browser with the verification page.

### Verification Logic
1. Page loads with checkNumber and signature from URL params
2. Fetches check from Supabase: `supabase.from('checks').select('*').eq('check_number', checkNumber).eq('signature', signature).single()`
3. If found: show verified check details
4. If not found: show "الشيك غير صالح" (Invalid Check) error

### Page Layout (Certificate Style)
- Centered card, max-width 600px
- App logo at top
- Green checkmark + "تم التحقق من صحة الشيك" heading (or red X for invalid)
- Check fields in a clean two-column table:
  - رقم الشيك, اسم المصدر, رقم حساب المصدر, اسم المستفيد
  - المبلغ (formatted), المبلغ بالحروف
  - تاريخ الإصدار, تاريخ الاستحقاق
  - اسم البنك, اسم الفرع
  - الحالة (StatusBadge)
- Verification timestamp at bottom
- "نظام الشيك الإلكتروني السوداني" footer
- No sidebar, no header — standalone page

### RLS Policy Addition
Need to allow anonymous (public) read access for the verify page:
```sql
CREATE POLICY "Public can verify checks by number and signature"
  ON checks FOR SELECT
  TO anon
  USING (true);
```

## 4. Print/PDF Layout Fix

### Problems
- Content splits across 2 pages
- Ugly borders visible
- Browser prints localhost URL in footer

### Solution
Update `@media print` in `index.css`:
```css
@media print {
  @page {
    size: A4;
    margin: 15mm;
  }
  .no-print { display: none !important; }
  body { background: white !important; }
  /* Hide sidebar, header */
  aside, header, nav, button { display: none !important; }
  /* Remove shadows and borders for clean print */
  * { box-shadow: none !important; }
  /* Single page fit */
  .print-content { break-inside: avoid; }
}
```

Update CheckDetailPage:
- Wrap printable content in `print-content` class
- Compact spacing for A4 fit
- Remove border-radius and shadows in print
- Clean certificate-style layout

## 5. Localization (Arabic/English)

### Architecture
- `src/context/LocaleContext.jsx` — provides `{ locale, setLocale, t }`
- `src/locales/ar.js` — Arabic translations (default)
- `src/locales/en.js` — English translations
- `t('key')` function returns translated string

### Translation Structure
```javascript
// ar.js
export default {
  app: { title: 'نظام الشيك الإلكتروني', subtitle: 'نظام QR السوداني' },
  nav: { home: 'الرئيسية', checks: 'الشيكات', addCheck: 'إضافة شيك' },
  auth: { login: 'تسجيل الدخول', logout: 'خروج', email: 'البريد الإلكتروني', password: 'كلمة المرور' },
  dashboard: { title: 'لوحة التحكم', totalChecks: 'إجمالي الشيكات', ... },
  check: { checkNumber: 'رقم الشيك', issuerName: 'اسم المصدر', ... },
  // ... all strings
};
```

### Toggle
- Button in Header: globe icon with "عربي" / "EN" text
- Switches `dir` attribute on root element between `rtl` and `ltr`
- Persisted in `localStorage` key `locale`

## 6. Dark/Light Mode

### Architecture
- `src/context/ThemeContext.jsx` — provides `{ theme, toggleTheme }`
- CSS variables in `index.css` for both themes
- Toggle button in Header: Sun/Moon icon

### Dark Mode Colors
```css
[data-theme="dark"] {
  --bg: #0F172A;
  --card: #1E293B;
  --text: #F8FAFC;
  --text-muted: #94A3B8;
  --border: #334155;
}
```

### Implementation
- Add `data-theme` attribute to `<html>` element
- Components use CSS variables: `bg-[var(--bg)]` or Tailwind dark classes
- Persisted in `localStorage` key `theme`
- Respects `prefers-color-scheme` as default

## 7. Acceptance Criteria

1. Amounts show as `100,000,006` (not Arabic numerals)
2. Issue date cannot be set to future
3. QR code encodes a URL that opens public verification page
4. Public verification page shows certificate-style check details without login
5. Print layout fits on one A4 page, no borders/shadows, no URL footer
6. Arabic/English toggle works across all pages
7. Dark/Light mode toggle works with proper contrast
8. All persisted in localStorage (locale + theme)
