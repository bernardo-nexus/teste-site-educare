import { useState, useEffect, useCallback, useRef } from 'react';

import { getOnboardingStatus } from '../lib/api';
import { getOnboardingAccessToken } from '../lib/onboarding-access-token';
import type { OnboardingStatusResponse } from '../types/onboarding';

const POLL_INTERVAL_MS = 1500;

interface UseOnboardingStatusReturn {
  data: OnboardingStatusResponse | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useOnboardingStatus(onboardingId: string | null): UseOnboardingStatusReturn {
  const [data, setData] = useState<OnboardingStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!onboardingId) return;

    try {
      const accessToken = getOnboardingAccessToken(onboardingId);
      const result = await getOnboardingStatus(onboardingId, accessToken);
      setData(result);
      setError(null);

      // Stop polling if complete or failed
      if (result.isComplete || result.isFailed) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch status');
    } finally {
      setIsLoading(false);
    }
  }, [onboardingId]);

  useEffect(() => {
    if (!onboardingId) {
      setIsLoading(false);
      return;
    }

    // Initial fetch
    fetchStatus();

    // Start polling
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [onboardingId, fetchStatus]);

  const retry = useCallback(() => {
    setIsLoading(true);
    setError(null);
    fetchStatus();

    // Restart polling
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);
  }, [fetchStatus]);

  return { data, isLoading, error, retry };
}
