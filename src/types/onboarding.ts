export interface StartOnboardingRequest {
  schoolName: string;
  schoolRazaoSocial?: string;
  schoolCnpj?: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolFoundationDate: string;
  schoolAddress?: {
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  adminName: string;
  adminEmail: string;
  adminPhone?: string;
  adminGender?: string;
  adminRole: string;
  adminHireDate?: string;
  planSlug: string;
  estimatedStudents?: number;
  recaptchaToken?: string;
  stripeCustomerId?: string;
  stripePaymentMethodId?: string;
  billingCpf?: string;
}

export interface StartOnboardingResponse {
  onboardingId: string;
  status: string;
  onboardingAccessToken?: string;
  isTrial: boolean;
  trialDays: number;
  estimatedMonthlyAmountCents: number;
}

export interface RevealInitialCredentialRequest {
  onboardingId: string;
  onboardingAccessToken: string;
}

export interface RevealInitialCredentialResponse {
  tempPassword: string;
  oneTime: boolean;
}

export interface ProcessPaymentRequest {
  onboardingId: string;
  paymentMethod?: string;
}

export interface ProcessPaymentResponse {
  status: string;
  paymentId: string;
}

export interface OnboardingStatusResponse {
  id: string;
  status: string;
  statusMessage: Record<string, string>;
  completedSteps: string[];
  totalSteps: number;
  isPendingApproval: boolean;
  isComplete: boolean;
  isFailed: boolean;
  errorMessage: string | null;
  // PII fields — only present when the request includes a valid x-onboarding-token
  schoolName?: string;
  adminEmail?: string;
  tenantId?: string | null;
  planSlug: string;
  isTrial: boolean;
  trialEndsAt: string | null;
  completedAt: string | null;
}

export interface Plan {
  id: string;
  slug: string;
  name: { pt: string; en: string; es: string };
  description: { pt: string; en: string; es: string };
  isPopular: boolean;
  pricePerStudentCents: number;
  minStudents: number;
  trialDays: number;
  features: string[];
  featureLimits: Record<string, unknown>;
  isSelfService: boolean;
  sortOrder: number;
}

export interface FetchPlansResponse {
  plans: Plan[];
}

export type SignupStep = "school" | "school_otp" | "admin" | "admin_otp" | "payment" | "confirm";

export interface SendOtpRequest {
  email: string;
  type: 'school_email' | 'admin_email';
}

export interface SendOtpResponse {
  success: boolean;
  expiresIn: number;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
  type: 'school_email' | 'admin_email';
}

export interface VerifyOtpResponse {
  verified: boolean;
  remainingAttempts?: number;
  error?: string;
}

export interface SchoolFormData {
  schoolName: string;
  schoolRazaoSocial: string;
  schoolCnpj: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolFoundationDate: string;
}

export interface AdminFormData {
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  adminGender: string;
  adminRole: string;
  adminHireDate: string;
}
