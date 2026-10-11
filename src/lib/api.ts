import type {
  FetchPlansResponse,
  StartOnboardingRequest,
  StartOnboardingResponse,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
  OnboardingStatusResponse,
  RevealInitialCredentialRequest,
  RevealInitialCredentialResponse,
  SendOtpRequest,
  SendOtpResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
} from "../types/onboarding";

const API_URL = import.meta.env.VITE_API_URL || "";

async function restFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || data.error || `API error: ${res.status}`);
  }

  return data as T;
}

export async function fetchPlans(): Promise<FetchPlansResponse> {
  const data = await restFetch<Array<{
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
  }>>("/plans");

  return {
    plans: data.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: p.description ?? { pt: '', en: '', es: '' },
      isPopular: p.isPopular ?? false,
      pricePerStudentCents: p.pricePerStudentCents,
      minStudents: p.minStudents,
      trialDays: p.trialDays,
      features: p.features,
      featureLimits: p.featureLimits,
      isSelfService: p.isSelfService,
      sortOrder: p.sortOrder,
    })),
  };
}

export async function startOnboarding(
  data: StartOnboardingRequest,
): Promise<StartOnboardingResponse> {
  return restFetch<StartOnboardingResponse>("/onboarding/start", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function processPayment(
  data: ProcessPaymentRequest,
): Promise<ProcessPaymentResponse> {
  return restFetch<ProcessPaymentResponse>(
    `/onboarding/${data.onboardingId}/process-payment`,
    {
      method: "POST",
      body: JSON.stringify({ paymentMethod: data.paymentMethod }),
    },
  );
}

export async function getOnboardingStatus(
  onboardingId: string,
  accessToken?: string | null,
): Promise<OnboardingStatusResponse> {
  const headers: Record<string, string> = {};
  if (accessToken) {
    headers["x-onboarding-token"] = accessToken;
  }
  return restFetch<OnboardingStatusResponse>(
    `/onboarding/${onboardingId}/status`,
    { headers },
  );
}

export async function revealInitialCredential(
  data: RevealInitialCredentialRequest,
): Promise<RevealInitialCredentialResponse> {
  return restFetch<RevealInitialCredentialResponse>(
    "/onboarding/reveal-initial-credential",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
}

export async function createSetupIntent(data: {
  email: string;
  name: string;
}): Promise<{ clientSecret: string; customerId: string }> {
  return restFetch("/onboarding/setup-intent", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
  await restFetch<{ ok: boolean }>("/otp/send", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return { success: true, expiresIn: 600 };
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const res = await restFetch<{ ok: boolean; verified: boolean; remainingAttempts?: number }>(
    "/otp/verify",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  return { verified: res.verified, remainingAttempts: res.remainingAttempts };
}

export async function requestDemo(data: {
  name: string;
  email: string;
  phone: string;
  schoolName: string;
}): Promise<void> {
  await restFetch("/onboarding/contact/demo", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function contactUs(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  await restFetch("/onboarding/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
