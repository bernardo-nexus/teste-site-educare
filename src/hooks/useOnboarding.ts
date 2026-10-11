import { useState, useCallback } from "react";

import { startOnboarding, sendOtp } from "../lib/api";
import { saveOnboardingAccessToken } from "../lib/onboarding-access-token";
import type {
  SchoolFormData,
  AdminFormData,
  SignupStep,
  StartOnboardingResponse,
} from "../types/onboarding";

interface UseOnboardingReturn {
  step: SignupStep;
  schoolData: SchoolFormData;
  adminData: AdminFormData;
  isSubmitting: boolean;
  isSendingOtp: boolean;
  error: string | null;
  onboardingResult: StartOnboardingResponse | null;
  stripeCustomerId: string | null;
  stripePaymentMethodId: string | null;
  billingCpf: string | null;
  cardholderName: string | null;
  setSchoolData: (data: SchoolFormData) => void;
  setAdminData: (data: AdminFormData) => void;
  goToStep: (step: SignupStep) => void;
  goBack: () => void;
  advanceFromSchool: (data: SchoolFormData) => Promise<void>;
  advanceFromAdmin: (data: AdminFormData) => Promise<void>;
  advanceFromPayment: (customerId: string, paymentMethodId: string, cardholderName: string, billingCpf: string) => void;
  submitOnboarding: (planSlug: string, studentCount: number, recaptchaToken?: string) => Promise<string | null>;
}

export function useOnboarding(): UseOnboardingReturn {
  const [step, setStep] = useState<SignupStep>("school");
  const [schoolData, setSchoolData] = useState<SchoolFormData>({
    schoolName: "",
    schoolRazaoSocial: "",
    schoolCnpj: "",
    schoolEmail: "",
    schoolPhone: "",
    schoolFoundationDate: "",
  });
  const [adminData, setAdminData] = useState<AdminFormData>({
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminGender: "",
    adminRole: "administrator",
    adminHireDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboardingResult, setOnboardingResult] =
    useState<StartOnboardingResponse | null>(null);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState<string | null>(null);
  const [billingCpf, setBillingCpf] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState<string | null>(null);

  const goToStep = useCallback((newStep: SignupStep) => {
    setStep(newStep);
    setError(null);
  }, []);

  const goBack = useCallback(() => {
    setError(null);
    if (step === "school_otp") setStep("school");
    else if (step === "admin") setStep("school_otp");
    else if (step === "admin_otp") setStep("admin");
    else if (step === "payment") setStep("admin_otp");
    else if (step === "confirm") setStep("payment");
  }, [step]);

  const advanceFromPayment = useCallback((customerId: string, paymentMethodId: string, name: string, cpf: string) => {
    setStripeCustomerId(customerId);
    setStripePaymentMethodId(paymentMethodId);
    setCardholderName(name);
    setBillingCpf(cpf);
    setStep("confirm");
  }, []);

  const advanceFromSchool = useCallback(async (data: SchoolFormData) => {
    setSchoolData(data);
    setError(null);
    setIsSendingOtp(true);
    try {
      await sendOtp({ email: data.schoolEmail, type: 'school_email' });
      setStep("school_otp");
    } catch {
      setError("Erro ao enviar o código de verificação. Tente novamente.");
    } finally {
      setIsSendingOtp(false);
    }
  }, []);

  const advanceFromAdmin = useCallback(async (data: AdminFormData) => {
    setAdminData(data);
    setError(null);
    setIsSendingOtp(true);
    try {
      await sendOtp({ email: data.adminEmail, type: 'admin_email' });
      setStep("admin_otp");
    } catch {
      setError("Erro ao enviar o código de verificação. Tente novamente.");
    } finally {
      setIsSendingOtp(false);
    }
  }, []);

  const submitOnboarding = useCallback(
    async (planSlug: string, studentCount: number, recaptchaToken?: string): Promise<string | null> => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await startOnboarding({
          schoolName: schoolData.schoolName,
          schoolRazaoSocial: schoolData.schoolRazaoSocial || undefined,
          schoolCnpj: schoolData.schoolCnpj,
          schoolEmail: schoolData.schoolEmail,
          schoolPhone: schoolData.schoolPhone,
          adminName: adminData.adminName,
          adminEmail: adminData.adminEmail,
          adminPhone: adminData.adminPhone || undefined,
          adminGender: adminData.adminGender || undefined,
          adminRole: adminData.adminRole,
          schoolFoundationDate: schoolData.schoolFoundationDate,
          adminHireDate: adminData.adminHireDate || undefined,
          planSlug,
          estimatedStudents: studentCount,
          recaptchaToken,
          stripeCustomerId: stripeCustomerId ?? undefined,
          stripePaymentMethodId: stripePaymentMethodId ?? undefined,
          billingCpf: billingCpf ?? undefined,
        });

        setOnboardingResult(result);
        if (result.onboardingAccessToken) {
          saveOnboardingAccessToken(
            result.onboardingId,
            result.onboardingAccessToken,
          );
        }

        return result.onboardingId;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(message);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    },
    [schoolData, adminData, stripeCustomerId, stripePaymentMethodId, billingCpf],
  );

  return {
    step,
    schoolData,
    adminData,
    isSubmitting,
    isSendingOtp,
    error,
    onboardingResult,
    stripeCustomerId,
    stripePaymentMethodId,
    billingCpf,
    cardholderName,
    setSchoolData,
    setAdminData,
    goToStep,
    goBack,
    advanceFromSchool,
    advanceFromAdmin,
    advanceFromPayment,
    submitOnboarding,
  };
}
