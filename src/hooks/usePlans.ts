import { useEffect, useState } from 'react';
import type { Plan } from '../types/onboarding';

interface UsePlansResult {
  plans: Plan[];
  error: string | null;
  isLoading: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export function usePlans(): UsePlansResult {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/plans`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<unknown[]>;
      })
      .then((data) => {
        const mapped: Plan[] = (data as Record<string, unknown>[]).map((p) => {
          const name = (p.name as Record<string, string> | null) ?? {};
          const description = (p.description as Record<string, string> | null) ?? {};
          return {
            id: p.id as string ?? '',
            slug: p.slug as string ?? '',
            name: { pt: name.pt ?? '', en: name.en ?? '', es: name.es ?? '' },
            description: { pt: description.pt ?? '', en: description.en ?? '', es: description.es ?? '' },
            isPopular: p.isPopular as boolean ?? false,
            pricePerStudentCents: p.pricePerStudentCents as number ?? 0,
            minStudents: p.minStudents as number ?? 0,
            trialDays: p.trialDays as number ?? 0,
            features: p.features as string[] ?? [],
            featureLimits: p.featureLimits as Record<string, unknown> ?? {},
            isSelfService: p.isSelfService as boolean ?? true,
            sortOrder: p.sortOrder as number ?? 0,
          };
        });
        setPlans(mapped);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load plans');
      })
      .finally(() => setIsLoading(false));
  }, []);

  return { plans, error, isLoading };
}
