import { useEffect, useState } from 'react';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe, type Stripe } from '@stripe/stripe-js';
import { createSetupIntent } from '../../lib/api';
import { maskCpfCnpj } from '../../utils/masks';

// Lazy-load Stripe to avoid blocking page load
let stripePromise: Promise<Stripe | null> | null = null;
function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;
    stripePromise = key ? loadStripe(key) : Promise.resolve(null);
  }
  return stripePromise!;
}

// ─── Inner form (must be inside <Elements>) ──────────────────────────────────

interface PaymentFormProps {
  customerId: string;
  onSuccess: (customerId: string, paymentMethodId: string, cardholderName: string, billingCpf: string) => void;
  onBack: () => void;
}

function PaymentForm({ customerId, onSuccess, onBack }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState('');
  const [billingCpf, setBillingCpf] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; cpf?: string }>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    const errors: { name?: string; cpf?: string } = {};
    if (!cardholderName.trim()) errors.name = 'Nome do titular é obrigatório.';
    const docDigits = billingCpf.replace(/\D/g, '');
    if (docDigits.length !== 11 && docDigits.length !== 14) errors.cpf = 'CPF ou CNPJ inválido.';
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsLoading(true);
    setError(null);

    const { setupIntent, error: stripeError } = await stripe.confirmSetup({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: window.location.href,
        payment_method_data: {
          billing_details: { name: cardholderName.trim() },
        },
      },
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Erro ao salvar cartão.');
      setIsLoading(false);
      return;
    }

    if (setupIntent?.status === 'succeeded') {
      const paymentMethodId = typeof setupIntent.payment_method === 'string'
        ? setupIntent.payment_method
        : (setupIntent.payment_method?.id ?? '');
      onSuccess(customerId, paymentMethodId, cardholderName.trim(), billingCpf);
    } else {
      setError('Cartão não confirmado. Tente novamente.');
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Nome do titular *
          </label>
          <input
            type="text"
            value={cardholderName}
            onChange={e => setCardholderName(e.target.value)}
            placeholder="Como aparece no cartão"
            autoComplete="cc-name"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            className={`w-full px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 ${fieldErrors.name ? 'border-red-400' : 'border-slate-300'}`}
          />
          {fieldErrors.name && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            CPF / CNPJ do titular *
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={billingCpf}
            onChange={e => setBillingCpf(maskCpfCnpj(e.target.value))}
            placeholder="000.000.000-00 ou 00.000.000/0001-00"
            autoComplete="off"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '14px' }}
            className={`w-full px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 ${fieldErrors.cpf ? 'border-red-400' : 'border-slate-300'}`}
          />
          {fieldErrors.cpf && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.cpf}</p>
          )}
        </div>
      </div>

      <PaymentElement options={{ layout: 'tabs' }} />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors disabled:opacity-50"
        >
          &larr; Voltar
        </button>
        <button
          type="submit"
          disabled={!stripe || isLoading}
          className="flex-1 py-2.5 px-6 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-semibold rounded-xl transition-colors text-sm"
        >
          {isLoading ? 'Salvando...' : 'Confirmar cartão →'}
        </button>
      </div>

      <p className="text-xs text-slate-400 text-center">
        Pagamento seguro via Stripe. O cartão só será cobrado após o trial.
      </p>
    </form>
  );
}

// ─── Outer wrapper (initializes Elements) ────────────────────────────────────

interface PaymentStepProps {
  schoolEmail: string;
  schoolName: string;
  onSuccess: (customerId: string, paymentMethodId: string, cardholderName: string, billingCpf: string) => void;
  onBack: () => void;
}

export function PaymentStep({ schoolEmail, schoolName, onSuccess, onBack }: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    createSetupIntent({ email: schoolEmail, name: schoolName })
      .then(({ clientSecret: cs, customerId: cid }: { clientSecret: string; customerId: string }) => {
        setClientSecret(cs);
        setCustomerId(cid);
      })
      .catch(() => setInitError('Não foi possível inicializar o pagamento. Tente novamente.'));
  }, [schoolEmail, schoolName]);

  if (initError) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <span className="text-red-600 text-lg">!</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Erro</h2>
            <p className="text-sm text-slate-500">{initError}</p>
          </div>
        </div>
        <button
          onClick={onBack}
          className="text-sm text-slate-600 hover:text-slate-800"
        >
          &larr; Voltar
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center animate-pulse">
            <span className="text-primary-600 text-lg">&#x1F4B3;</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Dados de pagamento</h2>
            <p className="text-sm text-slate-500">Inicializando...</p>
          </div>
        </div>
        <div className="h-40 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
          <span className="text-primary-600 text-lg">&#x1F4B3;</span>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Dados de pagamento</h2>
          <p className="text-sm text-slate-500">Cartão salvo agora, cobrado após o trial</p>
        </div>
      </div>

      <Elements
        stripe={getStripe()}
        options={{
          clientSecret,
          fonts: [
            {
              cssSrc:
                'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
            },
          ],
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#43A047',
              borderRadius: '8px',
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          },
          locale: 'pt-BR',
        }}
      >
        <PaymentForm
          customerId={customerId}
          onSuccess={onSuccess}
          onBack={onBack}
        />
      </Elements>
    </div>
  );
}
