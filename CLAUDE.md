# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nexus EduCare landing page — a marketing site for a Brazilian school management platform (gestao escolar). The product targets daycares and schools, connecting parents, teachers, and administrators. Content is in Portuguese (primary), English, and Spanish.

This is the `landing/` directory within the `nexus-educare` monorepo. Sibling directories include `mobile/` and `web/`.

## Commands

- **Dev server:** `npm run dev` (Vite, runs on localhost)
- **Build:** `npm run build` (runs `tsc -b && vite build`, outputs to `dist/`)
- **Lint:** `npm run lint` (ESLint with TypeScript + React hooks rules)
- **Preview production build:** `npm run preview`

- **Tests:** `npm run test:run` (Vitest + happy-dom) — 33 testes em `src/__tests__/` (14 schemas + 19 masks)

## Tech Stack

- React 19, TypeScript, Vite 7
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin, NOT PostCSS — config is in `src/index.css` using `@theme` blocks)
- Framer Motion for animations
- Lucide React for icons
- Zod for form validation schemas (`src/utils/schemas.ts`)
- `clsx` for conditional class merging
- Deployed on Vercel (see `vercel.json` with SPA rewrites)

## Architecture

**SPA with react-router-dom** — `App.tsx` defines routes:
- `/` → `Home` (marketing landing page with vertical scroll sections)
- `/cadastro` → `Signup` (multi-step onboarding form)
- `/onboarding` → `OnboardingProgress` (provisioning progress tracker)
- `/termos` → `Terms` (14 sections, hardcoded pt-BR)
- `/privacidade` → `Privacy` (14 sections, LGPD-compliant, hardcoded pt-BR)
- `/:lang` and `/:lang/*` → legacy language prefix redirects

Home page uses hash-based anchor navigation (`scroll-snap-type: y mandatory`) for section scrolling.

### Path alias
`@` maps to `/src` (configured in `vite.config.ts`).

### i18n System
Custom implementation in `src/i18n/` — no external i18n library.
- `I18nProvider` wraps the app in `main.tsx` and provides `useI18n()` hook
- Three locales: `pt-BR.json`, `en-US.json`, `es-ES.json` in `src/i18n/locales/`
- Language codes used in URLs are `br`, `en`, `es` (e.g., `/br#pricing`)
- Language detection: URL path > browser language > defaults to `br`
- The `pt-BR.json` locale file serves as the type source (`type Locale = typeof ptBR`)
- When adding new text, add keys to ALL three locale JSON files

### Component Structure
- `src/components/layout/` — `Header.tsx`, `Footer.tsx`
- `src/components/sections/` — Each page section is its own component (Hero, Problems, Solution, HowItWorks, Features, Differentials, Pricing, Testimonials, FAQ, CTAFinal)
- `src/components/signup/` — Multi-step form components: `SchoolInfoStep`, `AdminInfoStep`, `OtpStep`, `PlanConfirmStep`, `StepIndicator`
- `src/components/onboarding/` — Provisioning UI: `ProgressTracker`, `SuccessScreen`, `ErrorScreen`
- `src/components/ui/` — Floating UI elements (FloatingLangSwitcher, ScrollIndicator)
- `src/utils/` — `masks.ts` (CNPJ/phone input masks), `schemas.ts` (Zod validation schemas)
- `src/data/` — Static data arrays (features, pricing, faq, testimonials) — note these are hardcoded in Portuguese and NOT yet using the i18n system

### Theme Colors (defined in `src/index.css` via `@theme`)
- Primary: green (`#43A047` at 500) — matches the mobile app
- Secondary: lime (`#7CB342` at 500)
- Accent: amber (`#F59E0B` at 500)
- Font: Inter

### Section IDs for navigation
`desafios`, `solucao`, `como-funciona`, `features`, `diferenciais`, `pricing`, `testimonials`, `faq`, `contato`

## Key Patterns

- All components access translations via `const { t } = useI18n()` then use `t.section.key`
- Icons are imported individually from `lucide-react` (tree-shaken)
- Animations use Framer Motion's `motion` components with `initial`/`animate`/`transition` props
- The Header uses `IntersectionObserver` to highlight the active nav link and sync the URL hash

### Unified Dark Header

`Header`, `Signup`, and `OnboardingProgress` all use **always-dark** top bar (`bg-slate-900`). The `Header` no longer toggles transparency on scroll — it's always dark with `shadow-md`. Logo uses the colored version (no `brightness-0 invert` filter).

### Split-Screen Brand Layout

`Signup` and `OnboardingProgress` pages share a consistent split-screen layout:
- **Top bar** — `bg-slate-900` with back arrow + logo (shared across desktop and mobile)
- **Desktop** — Left half: green gradient panel with headline, brand features (3 icons + labels), social proof. Right half: page content on `bg-slate-50`.
- **Mobile** — Top bar only, then content below (no gradient panel).
- Brand feature labels and headlines are inline i18n (br/en/es objects), not from locale JSON files.

### Signup Multi-Step Flow with OTP

The signup form has 5 internal steps (`school → school_otp → admin → admin_otp → confirm`), but only 3 visible steps in `StepIndicator`:

```
School Info → [School OTP] → Admin Info → [Admin OTP] → Confirm & Submit
    (step=0)      (step=0)      (step=1)      (step=1)       (step=2)
```

- After each info step, `advanceFromSchool` / `advanceFromAdmin` calls `POST /otp/send`, then advances to the OTP sub-step
- `StepIndicator` uses a `STEP_INDEX` map so `school_otp` shows as step 0, `admin_otp` shows as step 1
- `OtpStep` component: 30s resend cooldown, max 3 resends, max 5 attempts, calls `POST /otp/send` + `POST /otp/verify`
- On OTP verified: advance to next main step (`school_otp → admin`, `admin_otp → confirm`)

### Onboarding / Provisioning Flow

1. `POST /onboarding/start` creates record with `status: 'pending_payment'` and fires `process-payment` (fire-and-forget)
2. School provisions immediately through 3 steps → `completed`
3. `tenants.subscription_status = 'pending_approval'` — mobile features LOCKED until admin approves
4. `GET /onboarding/:id/status` returns `isComplete: true` → `SuccessScreen` shown immediately
5. `isPendingApproval` field is always `false` in the current flow — `ApprovalWaitingScreen` exists in code but is never shown
6. Admin calls `POST /platform/onboardings/:id/approve` (with `Admin-Secret` header) → `tenants.subscription_status: 'pending_approval' → 'trial'` → features unlocked, approval email sent

### OTP API Endpoints

Two REST endpoints handle email verification:

| Endpoint         | Purpose                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| `POST /otp/send`   | Generates crypto-random 6-digit code, stores in `verifications` table, sends via Resend (best-effort) |
| `POST /otp/verify` | Checks code, increments attempts (max 5), marks verified; returns `{ verified, remainingAttempts? }`  |

**`verifications` table** (platform-scoped, no tenant_id):
- `email TEXT`, `code TEXT`, `type TEXT` (`school_email` | `admin_email`), `expires_at TIMESTAMPTZ` (10 min TTL), `attempts INT DEFAULT 0`, `verified_at TIMESTAMPTZ NULL`
- Unique verification per email+type — previous unverified records deleted on new send

### Zod Form Validation

Form steps use Zod schemas from `src/utils/schemas.ts`:
- `schoolSchema` — validates schoolName, schoolEmail (required + email format), schoolPhone (required), schoolCnpj (required, format `00.000.000/0001-00`)
- `adminSchema` — validates adminName, adminEmail (required + email format), adminPhone (required), adminGender (required)
- `adminRole` is fixed to `'administrator'` — NOT a form field (school creator always gets `administrator` role)
- `adminHireDate` is NOT a form field
- Zod error messages are i18n keys (`'required'`, `'invalidEmail'`) mapped to `t.signup.validation[key]` at render time
- Input masks (CNPJ, phone) are applied on `onChange` handlers, independent of Zod validation

### Onboarding Success Screen

After provisioning completes, `SuccessScreen` displays the admin's credentials directly on the page:
- School name, email, and temporary password (16-char generated by `generateTempPassword()` in platform-auth) — **only shown for new users** (multi-school admins reuse existing credentials)
- Copy-to-clipboard button for the password
- App Store + Google Play badges (native SVG — not generic button icons)
- Warning note: user must change password on first login
- The `temp_password` is AES-256-GCM encrypted in the `onboardings` table and decrypted by `GET /onboarding/:id/status` only when status = `completed`

### ProgressTracker (OnboardingProgress)

Vertical stepper with 3 steps: `payment`, `tenant_creation`, `platform_setup`
- Active step: pulse/ping animation on the indicator dot
- Completed step: green checkmark circle + green connector line
- Pending step: gray dot
- Each `StepConfig` has a `labelKey` (`'payment' | 'tenant_creation' | 'platform_setup'`) that maps to `t.onboarding.steps[labelKey]` — NOT the DB status string

### Multi-School Onboarding

The same admin email can register multiple schools:
- `start-onboarding`: does NOT block duplicate `admin_email` values
- `provision-school` (stepPlatform): checks `getPlatformUserByEmail()` before creating — reuses existing platform user if found, only creates platform auth + sets `must_change_password`/`tempPassword` for **new** users
- `temp_password` in onboardings will be `null` for existing-user school registrations — `SuccessScreen` handles this gracefully (no password shown, no copy button)
