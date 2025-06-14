'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import PaymentButton from './PaymentButton';
import { useForm } from 'react-hook-form';
import { CheckCircle, XCircle } from 'lucide-react';

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
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string; discount: number} | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isEarlyBirdEligible, setIsEarlyBirdEligible] = useState(false);
  const [couponInfo, setCouponInfo] = useState<
    Array<{code: string; discount: number; description: string; valid: boolean}>
  >([]);
  const skipAutoApply = useRef(false); // Track if auto-apply should be skipped

  // Calculate prices
  const originalPrice = event.paymentAmount;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, originalPrice - discount);
  
  // Check if event is in the future (within 7 days) for early bird eligibility
  useEffect(() => {
    const eventDate = new Date(event.eventDate);
    const today = new Date();
    const timeDiff = eventDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    const earlyBirdEligible = daysDiff >= 1; // Changed to 1 day
    setIsEarlyBirdEligible(earlyBirdEligible);
    
    // Initialize coupon info with validity status
    setCouponInfo([
      { 
        code: 'EARLYBIRD', 
        discount: 150, 
        description: '₹150 off', 
        valid: earlyBirdEligible 
      },
      { 
        code: 'FRIEND10', 
        discount: Math.min(100, originalPrice * 0.1), 
        description: '10% off (max ₹100)', 
        valid: true 
      },
      { 
        code: 'WELCOME25', 
        discount: Math.min(200, originalPrice * 0.25), 
        description: '30% off (max ₹200)', 
        valid: true 
      }
    ]);
  }, [event.eventDate, originalPrice]);

  // Apply early bird discount by default if eligible and not skipped
  useEffect(() => {
    if (isEarlyBirdEligible && !appliedCoupon && !skipAutoApply.current) {
      setAppliedCoupon({ code: 'EARLYBIRD', discount: 150 });
    }
  }, [isEarlyBirdEligible, appliedCoupon]);

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

  const applyCoupon = (code: string) => {
    setCouponError('');
    const upperCode = code.toUpperCase();
    
    if (upperCode === 'EARLYBIRD') {
      if (!isEarlyBirdEligible) {
        setCouponError('Early bird discount has expired for this event');
        return;
      }
      setAppliedCoupon({ code: upperCode, discount: 150 });
    } 
    else if (upperCode === 'FRIEND10') {
      setAppliedCoupon({ code: upperCode, discount: Math.min(100, originalPrice * 0.1) });
    }
    else if (upperCode === 'WELCOME25') {
      setAppliedCoupon({ code: upperCode, discount: Math.min(200, originalPrice * 0.30) });
    }
    else {
      setCouponError('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
    skipAutoApply.current = true; // Skip auto-apply after removal
  };

  // Function to handle coupon click
  const handleCouponClick = (code: string) => {
    setCouponCode(code);
    applyCoupon(code);
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
                
                <div className="mt-4 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-[#9CA3AF]">Original Price:</span>
                    <span className="text-gray-600 dark:text-[#9CA3AF]">₹{originalPrice}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-[#9CA3AF]">Discount ({appliedCoupon.code}):</span>
                        <button 
                          onClick={removeCoupon}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="text-green-600 dark:text-green-400">-₹{appliedCoupon.discount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-[#1A2E35] dark:text-[#E5E7EB]">Total Amount:</span>
                    <span className="text-[#1A2E35] dark:text-[#E5E7EB]">₹{finalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="bg-[#F7FFF7] dark:bg-[#1F2937] p-4 rounded-lg">
                <h4 className="font-semibold mb-3 dark:text-[#E5E7EB]">Apply Coupon</h4>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                      dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                  />
                  <button
                    type="button"
                    onClick={() => applyCoupon(couponCode)}
                    className="bg-[#3AA3A0] dark:bg-[#2DB4AF] text-white px-4 rounded-lg 
                      hover:bg-[#2E827F] dark:hover:bg-[#1E8F8C] transition-colors"
                  >
                    Apply
                  </button>
                </div>
                
                {couponError && (
                  <div className="flex items-center mt-2 text-red-500">
                    <XCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">{couponError}</span>
                  </div>
                )}
                
                {appliedCoupon && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Coupon applied successfully!</span>
                  </div>
                )}
                
                <div className="mt-3 text-sm">
                  <p className="font-medium mb-1 dark:text-gray-300">Available coupons:</p>
                  <ul className="space-y-1">
                    {couponInfo.map((coupon, index) => (
                      <li 
                        key={index}
                        className={`flex items-center cursor-pointer p-2 rounded-lg transition-colors ${coupon.valid ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'opacity-60'}`}
                        onClick={() => coupon.valid && handleCouponClick(coupon.code)}
                      >
                        <span className={`px-2 py-0.5 rounded mr-2 ${coupon.valid ? 'bg-[#3AA3A0] text-white' : 'bg-gray-300 text-gray-500'}`}>
                          {coupon.code}
                        </span>
                        <span className={`${coupon.valid ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500 line-through'}`}>
                          {coupon.description}
                          {coupon.code === 'EARLYBIRD' && !coupon.valid && ' (expired)'}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <PaymentButton
                amount={finalPrice}
                status={paymentStatus}
                eventData={event}
                formData={formData}
                couponCode={appliedCoupon?.code}
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