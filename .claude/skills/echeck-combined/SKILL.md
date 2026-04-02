---
name: echeck-combined
description: "Combined development workflow for the Sudanese Electronic Check System that orchestrates the Team Leader and Full Stack Developer skills together. Use this skill for any substantial development task: building new features, refactoring existing code, redesigning UI, or implementing major changes. This skill ensures every piece of work goes through proper planning (Team Leader) and implementation (Full Stack Dev) with quality gates. Invoke when: user requests a feature, redesign, refactor, or any multi-step development work. Also triggers on: 'build this', 'redesign', 'improve', 'add feature', 'refactor', 'implement'."
---

# E-Check Combined Development Workflow

This skill orchestrates the Team Leader and Full Stack Developer roles for the Sudanese Electronic Check System. Every substantial piece of work follows a structured flow ensuring quality, consistency, and adherence to the banking-grade design system.

## Workflow

```
User Request
    │
    ▼
┌─────────────────────┐
│  TEAM LEADER PHASE   │
│  1. Read CLAUDE.md   │
│  2. Analyze request  │
│  3. Plan approach    │
│  4. Define tasks     │
│  5. Set acceptance   │
│     criteria         │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  FULLSTACK DEV PHASE │
│  1. Read relevant    │
│     source files     │
│  2. Implement code   │
│  3. Apply design     │
│     system           │
│  4. Test RTL/a11y    │
│  5. Self-review      │
└────────┬────────────┘
         │
         ▼
┌─────────────────────┐
│  REVIEW PHASE        │
│  Team Leader checks: │
│  - Design system ✓   │
│  - RTL compliance ✓  │
│  - Security ✓        │
│  - Accessibility ✓   │
│  - Code quality ✓    │
└────────┬────────────┘
         │
    Pass? ──No──▶ Back to Dev Phase
         │
        Yes
         │
         ▼
    ✅ Complete
```

## Phase 1: Team Leader Planning

Before any code is written:

1. **Read CLAUDE.md** — refresh on architecture, design system, conventions
2. **Understand the request** — what does the user actually need?
3. **Identify affected files** — which components, hooks, utils will change?
4. **Check design system** — run UI/UX Pro Max search if needed:
   ```bash
   python "C:\Users\GACA-IT\.claude\plugins\cache\ui-ux-pro-max-skill\ui-ux-pro-max\2.5.0\src\ui-ux-pro-max\scripts\search.py" "<keywords>" --domain <domain>
   ```
5. **Create task breakdown** using TodoWrite
6. **Define acceptance criteria** for each task

### Design System Quick Commands
```bash
# Full design system recommendations
python search.py "banking fintech check QR" --design-system -p "E-Check"

# Specific domain searches
python search.py "form validation" --domain ux
python search.py "banking trust" --domain color
python search.py "arabic professional" --domain typography
python search.py "verification security" --domain style
```

## Phase 2: Full Stack Implementation

For each task in the breakdown:

1. **Read the file(s)** you'll modify — understand existing code first
2. **Write the code** following CLAUDE.md conventions:
   - React functional components with hooks
   - Tailwind CSS with RTL logical properties
   - Design system colors via CSS variables
   - Lucide React icons only
   - Arabic text for all user-facing strings
3. **Apply the design system**:
   - Colors: Navy primary, Gold accent, Blue secondary
   - Font: IBM Plex Sans Arabic
   - Spacing: 8dp grid
   - Radius: 8px buttons, 12px cards
4. **Check RTL** — all layouts must work right-to-left
5. **Self-review** before moving to review phase

### Context7 Integration
For library-specific questions, use Context7 to get up-to-date docs:
```
# Resolve library ID first
mcp__plugin_context7_context7__resolve-library-id("react", "React hooks best practices")

# Then query docs
mcp__plugin_context7_context7__query-docs("/facebook/react", "useEffect cleanup patterns")
```

Use this for: React 19 patterns, Tailwind CSS 4 features, Vite configuration, QRious API.

## Phase 3: Team Leader Review

After implementation, validate:

### Design System Compliance (CRITICAL)
- [ ] Colors match Banking Trust palette
- [ ] Typography uses IBM Plex Sans Arabic
- [ ] Icons are Lucide React SVGs (no emoji)
- [ ] Spacing follows 8dp grid
- [ ] No purple/pink AI gradients
- [ ] No playful or casual design elements

### RTL/Arabic (CRITICAL)
- [ ] Layout renders correctly in RTL
- [ ] Logical properties used (ms/me/ps/pe not ml/mr)
- [ ] Arabic text is properly formatted
- [ ] Numbers display correctly
- [ ] Form labels in Arabic, visible

### Accessibility (HIGH)
- [ ] Contrast >= 4.5:1 for text
- [ ] Focus states visible on all interactive elements
- [ ] Form inputs have associated labels
- [ ] aria-labels on icon-only buttons
- [ ] Touch targets >= 44px

### Security (HIGH)
- [ ] No sensitive data in QR codes
- [ ] PIN handling is secure
- [ ] Hash generation is correct
- [ ] Form validation prevents injection

### Code Quality (MEDIUM)
- [ ] No duplicate code
- [ ] Clean imports
- [ ] Proper error handling
- [ ] No unused variables
- [ ] Consistent naming conventions

## When to Use Each Agent Individually

| Situation | Use |
|-----------|-----|
| Quick code review | Team Leader skill only |
| Small bug fix (< 10 lines) | Full Stack Dev skill only |
| Architecture question | Team Leader skill only |
| New feature | **Combined workflow** |
| UI redesign | **Combined workflow** |
| Major refactor | **Combined workflow** |
| Design system query | Team Leader + UI/UX Pro Max |
| Component implementation | Full Stack Dev + Context7 |

## Key Reference Paths

| What | Where |
|------|-------|
| Project standards | `CLAUDE.md` |
| Main app code | `src/App.jsx` |
| Entry point | `src/main.jsx` |
| Global styles | `src/index.css` |
| Build config | `vite.config.js` |
| Tailwind config | `tailwind.config.js` |
| Dependencies | `package.json` |

## Banking-Specific UX Rules

1. **Trust signals** — Use navy, gold, and formal typography. No casual or playful elements.
2. **Amount display** — Always show both numeric and Arabic words for amounts
3. **Verification feedback** — Clear success (green check) or failure (red alert) states
4. **QR codes** — Must be large enough to scan (min 200x200px), high error correction
5. **Print layout** — Check preview must be print-ready with proper margins
6. **Security indicators** — Show shield/lock icons near PIN and verification areas
