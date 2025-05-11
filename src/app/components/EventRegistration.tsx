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

const EventRegistration = ({ eventId }: { eventId: string }) => {
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
    event: eventId
  });

  // Handle form updates
  const handleFormChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      event: eventId // Ensure event ID stays updated
    }));
  };

  // Form validation handler
  const validateForm = async () => {
    const isValid = await trigger();
    return isValid;
  };

  // Payment success handler
  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    // Here you would typically submit the form data to your API
    console.log('Payment successful! Data:', formData);
  };

  // Payment error handler
  const handlePaymentError = (error: string) => {
    setPaymentStatus('error');
    console.error('Payment error:', error);
  };

  // Retry handler
  const handleRetry = () => {
    setPaymentStatus('idle');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#1A2E35]">Register Now</h2>
      
      {/* Progress Steps */}
      <div className="flex gap-4 mb-6">
        {[1, 2].map((step) => (
          <div 
            key={step}
            className={`h-2 w-16 rounded-full ${currentStep >= step ? 'bg-[#3AA3A0]' : 'bg-gray-200'}`}
          />
        ))}
      </div>

      {paymentStatus === 'success' ? (
        <motion.div 
          className="text-center p-6 bg-green-50 rounded-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <h3 className="text-xl font-bold text-green-600 mb-2">🎉 Registration Successful!</h3>
          <p className="text-green-700">Check your email for confirmation details.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  {...register('name', { 
                    required: true,
                    onChange: (e) => handleFormChange('name', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0]"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: true,
                    pattern: /^\S+@\S+\.\S+$/,
                    onChange: (e) => handleFormChange('email', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0]"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  {...register('phone', { 
                    required: true,
                    pattern: /^[6-9]\d{9}$/,
                    onChange: (e) => handleFormChange('phone', e.target.value)
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0]"
                  placeholder="10-digit phone number"
                />
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-full bg-[#3AA3A0] text-white py-3 rounded-lg hover:bg-[#2E827F] transition-colors"
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
              <div className="bg-[#F7FFF7] p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Registration Summary</h4>
                <p className="text-gray-600">Event: {eventId}</p>
                <p className="text-gray-600">Name: {formData.name}</p>
                <p className="text-gray-600">Email: {formData.email}</p>
                <p className="text-gray-600">Phone: {formData.phone}</p>
                <p className="text-gray-600 mt-2">Price: ₹499</p>
              </div>

              <PaymentButton
                amount={10}
                status={paymentStatus}
                formData={formData}
                onValidate={validateForm}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onRetry={handleRetry}
              />

              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-[#3AA3A0] hover:underline mt-4"
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