// lib/paymentUtils.ts
import Razorpay from 'razorpay';

export interface PaymentStatusResult {
  isAlreadyCaptured: boolean;
  status: string;
  amount: number;
  currency: string;
  error?: string;
}

/**
 * Check if payment is already captured in Razorpay
 * Returns true if captured, false if needs capturing
 */
export async function checkIfPaymentCaptured(
  razorpay: Razorpay,
  paymentId: string
): Promise<PaymentStatusResult> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payment: any = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      return {
        isAlreadyCaptured: false,
        status: 'not_found',
        amount: 0,
        currency: 'INR',
        error: 'Payment not found in Razorpay',
      };
    }

    const amountInRupees = payment.amount / 100;

    return {
      isAlreadyCaptured: payment.status === 'captured',
      status: payment.status,
      amount: amountInRupees,
      currency: payment.currency || 'INR',
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    return {
      isAlreadyCaptured: false,
      status: 'error',
      amount: 0,
      currency: 'INR',
      error: `Failed to fetch payment: ${errorMsg}`,
    };
  }
}
