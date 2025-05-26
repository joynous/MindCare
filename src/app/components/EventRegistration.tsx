'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import PaymentButton from './PaymentButton';
import { useForm } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

export interface EventData {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  totalSeats: number;
  bookedSeats: number;
  paymentAmount: number;
}

const EventRegistration = ({ event }: { event: EventData }) => {
  const { register, handleSubmit, trigger } = useForm<FormData>();
  const [currentStep, setCurrentStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    event: string;
  }>({
    name: '',
    email: '',
    phone: '',
    event: event.eventId
  });

  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      event: event.eventId
    }));
  };

  const validateForm = async () => {
    return await trigger();
  };

  const handlePaymentProcessing = () => {
    setPaymentStatus('processing');
  };

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
  };

  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    console.error('Payment error:', error);
  };

  const handleRetry = () => {
    setPaymentStatus('idle');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1A2E35] dark:text-[#E5E7EB]">Register Now</h2>
      
      <div className="flex gap-4 mb-6">
        {[1, 2].map((step) => (
          <div 
            key={step}
            className={`h-2 w-16 rounded-full ${currentStep >= step ? 
              'bg-[#3AA3A0] dark:bg-[#2DB4AF]' : 
              'bg-gray-200 dark:bg-gray-600'}`}
          />
        ))}
      </div>

      {paymentStatus === 'success' ? (
        <motion.div 
          className="text-center p-6 bg-green-50 dark:bg-green-900 rounded-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <h3 className="text-xl font-bold text-green-600 dark:text-green-300 mb-2">🎉 Registration Successful!</h3>
          <p className="text-green-700 dark:text-green-200">Check your email for confirmation details.</p>
        </motion.div>
      ) : paymentStatus === 'error' ? (
        <motion.div 
          className="text-center p-6 bg-red-50 dark:bg-red-900 rounded-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <h3 className="text-xl font-bold text-red-600 dark:text-red-300 mb-2">⚠️ Payment Failed</h3>
          <p className="text-red-700 dark:text-red-200">
            Please try again. Any deducted amount will be refunded within 5-7 business days.
          </p>
        </motion.div>
      )  : (
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">Full Name</label>
                <input
                  {...register('name', { 
                    required: true,
                    onChange: (e) => handleFormChange('name', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: true,
                    pattern: /^\S+@\S+\.\S+$/,
                    onChange: (e) => handleFormChange('email', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">Phone</label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: true,
                    pattern: /^[6-9]\d{9}$/,
                    onChange: (e) => handleFormChange('phone', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                  placeholder="10-digit phone number"
                />
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#3AA3A0] dark:bg-[#2DB4AF] text-white py-3 rounded-lg 
                  hover:bg-[#2E827F] dark:hover:bg-[#1E8F8C] transition-colors"
              >
                Continue to Payment
              </button>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-[#F7FFF7] dark:bg-[#1F2937] p-4 rounded-lg">
                <h4 className="font-semibold mb-2 dark:text-[#E5E7EB]">Registration Summary</h4>
                <p className="text-gray-600 dark:text-[#9CA3AF]">Event: {event.eventName}</p>
                <p className="text-gray-600 dark:text-[#9CA3AF]">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                <p className="text-gray-600 dark:text-[#9CA3AF]">Venue: {event.eventVenue}</p>
                <p className="text-gray-600 dark:text-[#9CA3AF]">Available Seats: {event.totalSeats - event.bookedSeats}</p>
                <p className="text-gray-600 dark:text-[#9CA3AF] mt-2">Price: {event.paymentAmount}</p>
              </div>

              <PaymentButton
                amount={event.paymentAmount}
                status={paymentStatus}
                eventData={event}
                formData={formData}
                onValidate={validateForm}
                onProcessing={handlePaymentProcessing}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onRetry={handleRetry}
              />

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-[#3AA3A0] dark:text-[#2DB4AF] hover:underline mt-4"
              >
                ← Back to Details
              </button>
            </motion.div>
          )}
        </form>
      )}
    </div>
  );
};

export default EventRegistration;