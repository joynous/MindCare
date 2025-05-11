'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { EventData } from './EventRegistration';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  amount: number;
  status: 'idle' | 'processing' | 'success' | 'error';
  onRetry: () => void;
  formData?: {
    name: string;
    email: string;
    phone: string;
    event: string;
  };
  eventData: EventData;
  onValidate?: () => Promise<boolean>;
  onProcessing?: () => void;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
}

export default function PaymentButton({
  amount,
  status,
  onRetry,
  formData,
  eventData,
  onValidate,
  onProcessing,
  onSuccess
}: PaymentButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [retryCount]);

  const handlePayment = async () => {
    if (!scriptLoaded || (onValidate && !(await onValidate()))) return;
    setErrorMessage(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: registration, error: dbError } = await supabase
        .from('registrations')
        .insert({
          ...formData,
          user_id: user?.id,
          status: 'pending'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const paymentOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'MindCare Community',
        description: `Registration for ${formData?.event || 'event'}`,
        prefill: {
          name: formData?.name || '',
          email: formData?.email || '',
          contact: formData?.phone || ''
        },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          try {
            onProcessing?.();
            
            const captureResult = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                eventId: eventData.eventId,
                registrationId: registration.id,
                amount: amount
              })
            });

            if (!captureResult.ok) {
              const errorData = await captureResult.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            onSuccess?.(response.razorpay_payment_id);
          } catch (error) {
            handlePaymentError(
              registration.id,
              error instanceof Error ? error : new Error('Payment processing failed')
            );
          }
        },
        theme: {
          color: '#3AA3A0',
          backdrop_color: '#F7FFF7'
        },
        modal: {
          ondismiss: () => {
            setErrorMessage('Payment cancelled by user');
          }
        }
      };

      new window.Razorpay(paymentOptions).open();
    } catch (error) {
      handlePaymentError(
        '',
        error instanceof Error ? error : new Error('Payment initialization failed')
      );
    }
  };

  const handlePaymentError = async (registrationId: string, error: Error) => {
    if (registrationId) {
      await supabase
        .from('registrations')
        .update({ status: 'failed' })
        .eq('id', registrationId);
    }
    
    setErrorMessage(
      `${error.message}. Please try again. Any money deducted will be refunded.`
    );
    onRetry();
  };

  return (
    <div className="space-y-4">
      <motion.button
        onClick={handlePayment}
        disabled={!scriptLoaded || status === 'processing'}
        whileHover={(!scriptLoaded || status === 'processing') ? {} : { scale: 1.02 }}
        whileTap={(!scriptLoaded || status === 'processing') ? {} : { scale: 0.98 }}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
          status === 'processing' || !scriptLoaded
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-[#3AA3A0] hover:bg-[#2E827F] text-white'
        }`}
      >
        {!scriptLoaded ? (
          'Loading Payment...'
        ) : status === 'processing' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay ₹${amount}`
        )}
      </motion.button>

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
          <button
            onClick={() => {
              setRetryCount(prev => prev + 1);
              handlePayment();
            }}
            className="ml-auto text-sm underline hover:text-red-700"
          >
            Try Again
          </button>
        </motion.div>
      )}
    </div>
  );
}