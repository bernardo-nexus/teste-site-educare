/**
 * E2E: one full school onboarding per plan
 *
 * Self-service plans (basico, intermediario, completo): full UI flow via /signup
 * Customizado: direct API call (not self-service — enterprise consultative sales)
 *
 * OTP codes are read from the REST API via GET /otp/debug (Admin-Secret, non-production only).
 * reCAPTCHA is bypassed by intercepting start-onboarding requests and injecting Admin-Secret header.
 * Stripe payment step is bypassed by intercepting js.stripe.com and create-setup-intent with mocks.
 */
import { test, expect, Page } from '@playwright/test'

// ─── Config ─────────────────────────────────────────────────────────────────

const API_URL = process.env.VITE_API_URL ?? 'http://localhost:3000'
const ADMIN_SECRET = process.env.ADMIN_SECRET ?? ''

// ─── Plans ───────────────────────────────────────────────────────────────────

type PlanCase = {
  slug: string
  label: string
  schoolName: string
  schoolRazaoSocial: string
  schoolCnpj: string
  schoolEmail: string
  schoolPhone: string
  schoolFoundationDate: string
  adminName: string
  adminEmail: string
  adminPhone: string
  adminGender: 'male' | 'female'
  isSelfService: boolean
}

const PLANS: PlanCase[] = [
  {
    slug: 'basico',
    label: 'Básico',
    schoolName: 'Creche Plano Básico E2E',
    schoolRazaoSocial: 'Creche Básico E2E Ltda.',
    schoolCnpj: '12.345.678/0001-01',
    schoolEmail: 'escola.basico@nexus-e2e.io',
    schoolPhone: '(11) 91234-0001',
    schoolFoundationDate: '01/01/2020',
    adminName: 'Thomas Forster',
    adminEmail: 'thomas@nexus-group.io',
    adminPhone: '(11) 91234-0011',
    adminGender: 'male',
    isSelfService: true,
  },
  {
    slug: 'intermediario',
    label: 'Intermediário',
    schoolName: 'Escola Intermediário E2E',
    schoolRazaoSocial: 'Escola Intermediário E2E Ltda.',
    schoolCnpj: '12.345.678/0001-02',
    schoolEmail: 'escola.intermediario@nexus-e2e.io',
    schoolPhone: '(11) 91234-0002',
    schoolFoundationDate: '15/03/2018',
    adminName: 'Thomas Forster',
    adminEmail: 'thomas@nexus-group.io',
    adminPhone: '(11) 91234-0022',
    adminGender: 'male',
    isSelfService: true,
  },
  {
    slug: 'completo',
    label: 'Completo',
    schoolName: 'Escola Completo E2E',
    schoolRazaoSocial: 'Escola Completo E2E Ltda.',
    schoolCnpj: '12.345.678/0001-03',
    schoolEmail: 'escola.completo@nexus-e2e.io',
    schoolPhone: '(11) 91234-0003',
    schoolFoundationDate: '10/06/2015',
    adminName: 'Thomas Forster',
    adminEmail: 'thomas@nexus-group.io',
    adminPhone: '(11) 91234-0033',
    adminGender: 'male',
    isSelfService: true,
  },
  {
    slug: 'customizado',
    label: 'Customizado',
    schoolName: 'Rede Customizado E2E',
    schoolRazaoSocial: 'Rede Customizado E2E S.A.',
    schoolCnpj: '12.345.678/0001-04',
    schoolEmail: 'escola.customizado@nexus-e2e.io',
    schoolPhone: '(11) 91234-0004',
    schoolFoundationDate: '05/05/2010',
    adminName: 'Thomas Forster',
    adminEmail: 'thomas@nexus-group.io',
    adminPhone: '(11) 91234-0044',
    adminGender: 'male',
    isSelfService: false,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getOtp(email: string, type: 'school_email' | 'admin_email'): Promise<string> {
  for (let i = 0; i < 20; i++) {
    const res = await fetch(
      `${API_URL}/otp/debug?email=${encodeURIComponent(email)}&type=${type}`,
      { headers: { 'admin-secret': ADMIN_SECRET } },
    )
    if (res.ok) {
      const data: { code: string } = await res.json()
      if (data.code) return data.code
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error(`OTP not found for ${email} / ${type}`)
}

async function interceptWithAdminSecret(page: Page) {
  await page.route(`${API_URL}/onboarding/start`, async (route) => {
    // Add Admin-Secret to bypass reCAPTCHA.
    const body = JSON.parse(route.request().postData() || '{}')
    delete body.stripeCustomerId
    delete body.stripePaymentMethodId
    delete body.billingCpf
    await route.continue({
      headers: {
        ...route.request().headers(),
        'Admin-Secret': ADMIN_SECRET,
      },
      postData: JSON.stringify(body),
    })
  })
}

/**
 * Mock the Stripe payment step for E2E tests:
 * - Intercepts the pre-bundled @stripe/stripe-js Vite module with a direct mock
 *   so loadStripe() immediately resolves with a fake Stripe instance
 * - Intercepts setup-intent with a fake client secret
 */
const MOCK_STRIPE_MODULE = `
function noop() { return undefined; }
function promiseOk() { return Promise.resolve({}); }
function makeEl(type) {
  return {
    elementType: type,
    mount: noop, destroy: noop, unmount: noop, update: noop, blur: noop, clear: noop, focus: noop,
    collapse: noop, on: function(){ return this; }, off: function(){ return this; }, once: function(){ return this; }
  };
}
function makeElements() {
  return {
    create: function(t) { return makeEl(t); },
    getElement: function() { return null; },
    fetchUpdates: promiseOk,
    submit: promiseOk,
    update: noop,
    collapse: noop,
    destroy: noop
  };
}
function makeMockStripe() {
  var e = makeElements();
  return {
    elements: function() { return e; },
    confirmSetup: function() { return Promise.resolve({ setupIntent: { id: 'seti_e2e', status: 'succeeded', payment_method: 'pm_e2e' } }); },
    confirmPayment: function() { return Promise.resolve({ paymentIntent: { status: 'succeeded' } }); },
    createToken: function() { return Promise.resolve({}); },
    createPaymentMethod: function() { return Promise.resolve({}); },
    confirmCardPayment: function() { return Promise.resolve({}); },
    retrieveSetupIntent: function() { return Promise.resolve({}); },
    retrievePaymentIntent: function() { return Promise.resolve({}); },
    _registerWrapper: noop,
    registerAppInfo: noop
  };
}
export const loadStripe = function() {
  return Promise.resolve(makeMockStripe());
};
`

async function mockStripeForE2E(page: Page) {
  await page.route('**/*stripe_stripe-js*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript; charset=utf-8',
      body: MOCK_STRIPE_MODULE,
    })
  })

  await page.route('https://js.stripe.com/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: 'window.Stripe=function(){return{}};' })
  })

  await page.route(`${API_URL}/onboarding/setup-intent`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        clientSecret: 'seti_e2e_mock_secret_placeholder',
        customerId: 'cus_e2e_mock',
      }),
    })
  })
}

// ─── Self-service plans — full UI flow ───────────────────────────────────────

const selfServicePlans = PLANS.filter((p) => p.isSelfService)

for (const plan of selfServicePlans) {
  test(`UI: onboarding completo — plano ${plan.label}`, async ({ page }) => {
    await interceptWithAdminSecret(page)
    await mockStripeForE2E(page)

    await page.goto('/signup')

    if (plan.slug !== 'intermediario') {
      await page.getByRole('button', { name: new RegExp(`^${plan.label}`) }).click()
    }

    // ── Step 1: School info ──────────────────────────────────────────────────
    await expect(page.getByRole('heading', { name: /dados da escola/i })).toBeVisible()

    await page.getByPlaceholder('00.000.000/0001-00').fill(plan.schoolCnpj)
    await page.getByPlaceholder('Razão Social Ltda.').fill(plan.schoolRazaoSocial)
    await page.getByPlaceholder(/arco-íris/i).fill(plan.schoolName)
    await page.getByPlaceholder('contato@escola.com.br').fill(plan.schoolEmail)
    await page.getByPlaceholder('(11) 99999-9999').first().fill(plan.schoolPhone)
    await page.getByPlaceholder('DD/MM/AAAA').fill(plan.schoolFoundationDate)

    await page.getByRole('button', { name: /^continuar$/i }).click()

    // ── Step 2: School OTP ───────────────────────────────────────────────────
    await expect(page.getByRole('heading', { name: /verificação de email/i })).toBeVisible({ timeout: 10_000 })
    const schoolOtp = await getOtp(plan.schoolEmail, 'school_email')
    await page.getByPlaceholder('000000').fill(schoolOtp)
    await page.getByRole('button', { name: /^verificar$/i }).click()

    // ── Step 3: Admin info ───────────────────────────────────────────────────
    await expect(page.getByRole('heading', { name: /administrador/i })).toBeVisible({ timeout: 10_000 })

    await page.getByPlaceholder('Maria da Silva').fill(plan.adminName)
    await page.getByPlaceholder('maria@escola.com.br').fill(plan.adminEmail)
    await page.getByPlaceholder('(11) 99999-9999').last().fill(plan.adminPhone)

    const genderText = plan.adminGender === 'male' ? /masculino/i : /feminino/i
    await page.getByRole('button', { name: genderText }).click()

    await page.getByRole('button', { name: /^continuar$/i }).click()

    // ── Step 4: Admin OTP ────────────────────────────────────────────────────
    await expect(page.getByRole('heading', { name: /verificação de email/i })).toBeVisible({ timeout: 10_000 })
    const adminOtp = await getOtp(plan.adminEmail, 'admin_email')
    await page.getByPlaceholder('000000').fill(adminOtp)
    await page.getByRole('button', { name: /^verificar$/i }).click()

    // ── Step 5: Payment (Stripe mocked) ─────────────────────────────────────
    await expect(page.getByRole('heading', { name: /dados de pagamento/i })).toBeVisible({ timeout: 10_000 })
    await page.getByPlaceholder('Como aparece no cartão').fill(plan.adminName)
    await page.getByPlaceholder('000.000.000-00 ou 00.000.000/0001-00').fill('123.456.789-09')
    const confirmCardBtn = page.getByRole('button', { name: /confirmar cartão/i })
    await expect(confirmCardBtn).toBeEnabled({ timeout: 10_000 })
    await confirmCardBtn.click()

    // ── Step 6: Confirm ──────────────────────────────────────────────────────
    await expect(page.getByRole('heading', { name: /confirmação/i })).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(plan.label, { exact: true }).first()).toBeVisible()
    await page.getByRole('checkbox').check()
    await page.getByRole('button', { name: /começar trial/i }).click()

    // ── Onboarding progress ──────────────────────────────────────────────────
    await expect(page).toHaveURL(/\/onboarding/, { timeout: 15_000 })
    await expect(page.getByText(/preparando sua escola/i)).toBeVisible()
    await expect(page.getByText('Tudo pronto!')).toBeVisible({ timeout: 60_000 })
    await expect(page.getByText(plan.schoolName)).toBeVisible()

    console.log(`✅ Plano ${plan.label}: onboarding concluído — ${plan.schoolName}`)
  })
}

// ─── Customizado — direct API provisioning (not self-service) ────────────────

test('API: provisionar escola — plano customizado', async () => {
  const plan = PLANS.find((p) => p.slug === 'customizado')!
  const headers = { 'Content-Type': 'application/json' }

  // Step 1: send OTP for school email
  const otpSchoolRes = await fetch(`${API_URL}/otp/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: plan.schoolEmail, type: 'school_email' }),
  })
  expect(otpSchoolRes.status).toBe(200)

  // Step 2: verify OTP for school email
  const schoolOtp = await getOtp(plan.schoolEmail, 'school_email')
  const verifySchoolData = await fetch(`${API_URL}/otp/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: plan.schoolEmail, code: schoolOtp, type: 'school_email' }),
  }).then((r) => r.json()) as { verified: boolean }
  expect(verifySchoolData.verified).toBe(true)

  // Step 3: send OTP for admin email
  const otpAdminRes = await fetch(`${API_URL}/otp/send`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: plan.adminEmail, type: 'admin_email' }),
  })
  expect(otpAdminRes.status).toBe(200)

  // Step 4: verify OTP for admin email
  const adminOtp = await getOtp(plan.adminEmail, 'admin_email')
  const verifyAdminData = await fetch(`${API_URL}/otp/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email: plan.adminEmail, code: adminOtp, type: 'admin_email' }),
  }).then((r) => r.json()) as { verified: boolean }
  expect(verifyAdminData.verified).toBe(true)

  // Step 5: start-onboarding (bypass reCAPTCHA via Admin-Secret)
  const startRes = await fetch(`${API_URL}/onboarding/start`, {
    method: 'POST',
    headers: { ...headers, 'Admin-Secret': ADMIN_SECRET },
    body: JSON.stringify({
      schoolName: plan.schoolName,
      schoolEmail: plan.schoolEmail,
      schoolPhone: plan.schoolPhone,
      schoolCnpj: plan.schoolCnpj,
      schoolRazaoSocial: plan.schoolRazaoSocial,
      schoolFoundationDate: plan.schoolFoundationDate,
      adminName: plan.adminName,
      adminEmail: plan.adminEmail,
      adminPhone: plan.adminPhone,
      adminGender: plan.adminGender,
      adminRole: 'administrator',
      planSlug: plan.slug,
      estimatedStudents: 30,
    }),
  })
  expect([200, 201]).toContain(startRes.status)
  const startData = await startRes.json() as { onboardingId: string }
  expect(startData.onboardingId).toBeTruthy()

  // Customizado is a negotiated enterprise plan — payment is handled manually by the sales team.
  console.log(`✅ Plano Customizado: onboarding criado via API — id=${startData.onboardingId}`)
})
