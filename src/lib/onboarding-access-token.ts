const ONBOARDING_ACCESS_TOKEN_PREFIX = "onboarding-access-token:";

function buildKey(onboardingId: string): string {
  return `${ONBOARDING_ACCESS_TOKEN_PREFIX}${onboardingId}`;
}

export function saveOnboardingAccessToken(
  onboardingId: string,
  token: string,
): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(buildKey(onboardingId), token);
}

export function getOnboardingAccessToken(onboardingId: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(buildKey(onboardingId));
}

export function clearOnboardingAccessToken(onboardingId: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(buildKey(onboardingId));
}
