# Sudanese Electronic Check System - نظام الشيك الإلكتروني السوداني

## Project Overview

A graduation project from **East Nile College** (كلية شرق النيل), School of Computer Science & IT, converting traditional paper checks to electronic checks using QR technology.

**Title (AR):** تحويل الشيك العادي الى شيك الإلكتروني بإستخدام تقنية QR
**Supervisor:** أ/ محمد صالح
**Team:** خولة عبدالله الطيب, رنا صلاح محمد علي, فداء فتح الرحمن اسحق, نون عبدالرحيم عبيد

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **UI Framework** | React | 19.1.1 |
| **Build Tool** | Vite (rolldown-vite) | 7.1.14 |
| **CSS** | Tailwind CSS | 4.1.14 |
| **Icons** | Lucide React | 0.545.0 |
| **QR Generation** | QRious (CDN) | 4.0.2 |
| **Crypto** | Web Crypto API (SHA-256) | Native |
| **Storage** | localStorage | Native |
| **Linting** | ESLint | 9.36.0 |

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

---

## Architecture

### Current Structure
```
src/
├── App.jsx          # Monolithic component (ALL logic lives here)
├── main.jsx         # React DOM entry
├── index.css        # Tailwind imports + global styles
└── assets/
    └── react.svg
```

### Target Architecture (Refactored)
```
src/
├── main.jsx
├── App.jsx                    # Root layout + router
├── index.css
├── components/
│   ├── layout/
│   │   ├── Header.jsx         # App header with branding
│   │   ├── Footer.jsx         # Team credits & links
│   │   └── TabNavigation.jsx  # Tab switching UI
│   ├── check/
│   │   ├── CheckForm.jsx      # Check issuance form
│   │   ├── CheckPreview.jsx   # Generated check display
│   │   ├── CheckVerify.jsx    # Verification form + result
│   │   └── CheckHistory.jsx   # History list
│   ├── qr/
│   │   └── QRCodeDisplay.jsx  # QR code generation & display
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Alert.jsx
│       └── Modal.jsx
├── hooks/
│   ├── useChecks.js           # Check CRUD operations
│   ├── useQRCode.js           # QR generation logic
│   └── useCrypto.js           # SHA-256 hashing
├── utils/
│   ├── arabicWords.js         # numberToArabicWords()
│   ├── crypto.js              # Hash generation
│   ├── storage.js             # localStorage wrapper
│   └── constants.js           # Banks list, student names
├── context/
│   └── CheckContext.jsx       # Global state management
└── assets/
    └── fonts/                 # IBM Plex Sans Arabic
```

---

## Design System

### Style: Banking Trust + Exaggerated Minimalism
- Clean, professional, high-contrast
- RTL-first (Arabic primary language)
- Trust indicators and security-focused UX

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#0F172A` | Navy - primary brand, headers |
| `--primary-on` | `#FFFFFF` | Text on primary |
| `--secondary` | `#1E3A8A` | Blue - secondary actions |
| `--secondary-on` | `#FFFFFF` | Text on secondary |
| `--accent` | `#A16207` | Gold - CTAs, highlights |
| `--accent-on` | `#FFFFFF` | Text on accent |
| `--background` | `#F8FAFC` | Page background |
| `--foreground` | `#020617` | Body text |
| `--card` | `#FFFFFF` | Card surfaces |
| `--card-fg` | `#020617` | Card text |
| `--muted` | `#E8ECF1` | Disabled, borders |
| `--muted-fg` | `#64748B` | Secondary text |
| `--border` | `#E2E8F0` | Borders, dividers |
| `--destructive` | `#DC2626` | Errors, destructive |
| `--success` | `#059669` | Valid, verified |
| `--ring` | `#0F172A` | Focus rings |

### Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| **Headings (AR)** | IBM Plex Sans Arabic | 600-700 | clamp(1.5rem, 4vw, 3rem) |
| **Body (AR)** | IBM Plex Sans Arabic | 400 | 16px (1rem) |
| **Mono/Numbers** | IBM Plex Mono | 400 | 14px |
| **Labels** | IBM Plex Sans Arabic | 500 | 14px |

Google Fonts Import:
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
```

### Spacing Scale (8dp system)
`4px | 8px | 12px | 16px | 24px | 32px | 48px | 64px | 96px`

### Border Radius
- Buttons: `8px`
- Cards: `12px`
- Modals: `16px`
- Inputs: `8px`

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
--shadow-card: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
```

---

## Code Conventions

### General
- **Language**: JSX (React), no TypeScript currently
- **Direction**: RTL-first — all layouts must support Arabic RTL
- **File naming**: PascalCase for components, camelCase for utilities/hooks
- **Component style**: Functional components with hooks only
- **State**: useState/useContext (no Redux)
- **CSS**: Tailwind utility classes — avoid inline styles
- **Icons**: Lucide React only — never use emojis as UI icons
- **Imports**: Group by: React, third-party, local components, utils, styles

### Arabic/RTL Rules
- Use `dir="rtl"` on root element
- Use Tailwind logical properties: `ms-`, `me-`, `ps-`, `pe-` instead of `ml-`, `mr-`
- Test all layouts in RTL
- Arabic text must use IBM Plex Sans Arabic font
- Numbers in check displays use Eastern Arabic numerals where appropriate

### Security
- SHA-256 hashing via Web Crypto API for check signatures
- 4-digit PIN for check verification
- No sensitive data in QR codes (only public signature + check number)
- Validate all form inputs before processing

### Anti-Patterns to Avoid
- No emoji as structural UI icons
- No purple/pink AI gradients
- No playful/casual design (this is banking)
- No horizontal scroll on mobile
- No placeholder-only labels on forms
- No generic fonts (Inter, Roboto, Arial)

---

## Key Business Logic

### Check Issuance Flow
1. User fills form (issuer, beneficiary, amount, bank, PIN)
2. Amount auto-converts to Arabic words via `numberToArabicWords()`
3. SHA-256 hash generated from check data + PIN
4. QR code generated with: `{checkNumber, signature, timestamp, country: "SD"}`
5. Check stored in localStorage

### Check Verification Flow
1. User enters check number + PIN
2. System looks up check by number
3. Regenerates hash from stored data + provided PIN
4. Compares hashes for verification
5. Shows valid/invalid result with check details

### Supported Banks (15 Sudanese banks)
بنك الخرطوم, بنك فيصل الإسلامي, بنك أم درمان الوطني, بنك النيلين, بنك السودان المركزي, المصرف الصناعي, بنك المزارع التجاري, بنك الإدخار والتنمية, بنك البركة, بنك التضامن الإسلامي, بنك الثروة الحيوانية, بنك الإستثمار, بنك التنمية التعاوني, بنك قطر الوطني - السودان, بنك أبو ظبي الإسلامي - السودان

---

## Agent Team

This project uses a two-agent development workflow:

### Team Leader Agent
- Reviews code quality, architecture decisions, and UI/UX compliance
- Validates against design system and CLAUDE.md standards
- Coordinates work and maintains project consistency
- Use: `@team-leader` for reviews, planning, architecture decisions

### Full Stack Developer Agent
- Implements features, components, and business logic
- Handles React components, Tailwind styling, QR integration
- Writes and tests code following all conventions
- Use: `@fullstack-dev` for implementation tasks

### Combined Workflow
For any feature or change:
1. **Team Leader** reviews requirements and creates approach
2. **Full Stack Dev** implements the code
3. **Team Leader** reviews the implementation
4. Iterate until quality standards met

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons (Lucide React SVGs only)
- [ ] Consistent icon family throughout
- [ ] Design system colors applied via CSS tokens
- [ ] RTL layout verified on all components

### Interaction
- [ ] All clickable elements have cursor-pointer
- [ ] Hover/focus states with 150-300ms transitions
- [ ] Touch targets >= 44x44px
- [ ] Loading states on async operations

### Accessibility
- [ ] Color contrast >= 4.5:1 (text), >= 3:1 (large text)
- [ ] Visible focus rings on all interactive elements
- [ ] Form inputs have visible labels (not placeholder-only)
- [ ] aria-labels on icon-only buttons
- [ ] prefers-reduced-motion respected

### Layout
- [ ] Mobile-first responsive: 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll
- [ ] Consistent 8dp spacing rhythm
- [ ] Safe area compliance for mobile browsers

### RTL Specific
- [ ] All text renders correctly in RTL
- [ ] Logical properties used (not physical left/right)
- [ ] Icons that imply direction are mirrored for RTL
- [ ] Arabic numbers display correctly
