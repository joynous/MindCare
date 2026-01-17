'use client';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import PaymentButton from './PaymentButton';
import { useForm } from 'react-hook-form';
import { CheckCircle, XCircle, Minus, Plus } from 'lucide-react';

const STORAGE_KEY = "eventReg:userDetails";

type FormData = {
  name: string;
  email: string;
  phone: string;
  age: string;
  hearAbout: string;
  otherSource?: string;
  idProof: boolean;
  termsAccepted: boolean;
  instagramPhotos: string;
  ticketNames: string[]; // Added for ticket holder names
};

export interface EventData {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventVenue: string;
  totalSeats: number;
  bookedSeats: number;
  paymentAmount: number;
  entityType?: 'event' | 'trip';
}

const EventRegistration = ({ event }: { event: EventData }) => {
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      hearAbout: '',
      age: '',
      idProof: false,
      termsAccepted: false,
      instagramPhotos: '',
      ticketNames: ['']
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    event: string;
    ticketQuantity: number;
    ticketNames: string[];
    age: string;
    hearAbout: string;
    otherSource?: string;
    idProof: boolean;
    termsAccepted: boolean;
    instagramPhotos: string;
  }>({
    name: '',
    email: '',
    phone: '',
    event: event.eventId,
    ticketQuantity: 1,
    ticketNames: [''],
    age: '',
    hearAbout: '',
    idProof: false,
    termsAccepted: false,
    instagramPhotos: ''
  });

  // Watch hearAbout value for conditional rendering
  const hearAboutValue = watch('hearAbout');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isEarlyBirdEligible, setIsEarlyBirdEligible] = useState(false);
  const [couponInfo, setCouponInfo] = useState<
    Array<{ code: string; discount: number; description: string; valid: boolean }>
  >([]);
  const skipAutoApply = useRef(false); // Track if auto-apply should be skipped

  // NEW: universal extra code state (flat ₹50 off per order)
  const [extraCodeApplied, setExtraCodeApplied] = useState(false);
  // NEW: second extra code state for GCCSPECIAL200 (₹200 off)
  const [gccExtraApplied, setGccExtraApplied] = useState(false);

  const earlyBirdDiscountValue = process.env.NEXT_PUBLIC_EARLY_BIRD_DISCOUNT ? parseInt(process.env.NEXT_PUBLIC_EARLY_BIRD_DISCOUNT) : 150;

  // Calculate available seats
  const availableSeats = event.totalSeats - event.bookedSeats;

  // Calculate prices based on ticket quantity
  const originalPricePerTicket = event.paymentAmount;
  const discount = formData.ticketQuantity * (appliedCoupon ? appliedCoupon.discount : 0);
  const totalOriginalPrice = formData.ticketQuantity * originalPricePerTicket;
  // NEW: include extra flat off if JOYSPECIAL100 or GCCSPECIAL200 applied (only one allowed)
  const extraDiscount = extraCodeApplied ? 100 : (gccExtraApplied ? 200 : 0);
  const finalPrice = Math.max(0, totalOriginalPrice - (discount + extraDiscount));

  // Check if event is in the future (within 7 days) for early bird eligibility
  useEffect(() => {
    const earlyBirdEligible = true; // Changed to 1 day
    setIsEarlyBirdEligible(earlyBirdEligible);

    // Initialize coupon info with validity status
    setCouponInfo([
      {
        code: 'EARLYBIRD',
        discount: earlyBirdDiscountValue,
        description: `${earlyBirdDiscountValue} off`,
        valid: earlyBirdEligible
      },
      {
        code: 'FRIEND10',
        discount: Math.min(100, originalPricePerTicket * 0.1),
        description: '10% off (max ₹100)',
        valid: true
      },
      {
        code: 'WELCOME15',
        discount: Math.min(200, originalPricePerTicket * 0.15),
        description: '15% off (max ₹200)',
        valid: true
      },
      // NOTE: extra coupons are intentionally not listed here; they can be entered manually.
    ]);
  }, [event.eventDate, originalPricePerTicket, earlyBirdDiscountValue]);

  // Apply early bird discount by default if eligible and not skipped
  useEffect(() => {
    if (isEarlyBirdEligible && !appliedCoupon && !skipAutoApply.current) {
      setAppliedCoupon({ code: 'EARLYBIRD', discount: earlyBirdDiscountValue });
    }
  }, [isEarlyBirdEligible, appliedCoupon, earlyBirdDiscountValue]);

  // Prefill on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      reset(parsed, { keepDirty: false });
    }
  }, [reset]);

  useEffect(() => {
    const sub = watch((vals) => {
      setFormData(prev => ({
        ...prev,
        ...vals,
        event: event.eventId,
        // Preserve ticket quantity and names as they're managed separately
        ticketQuantity: prev.ticketQuantity,
        ticketNames: prev.ticketNames,
      }));
    });

    return () => sub.unsubscribe();
  }, [watch, event.eventId]);

  const handleFormChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      event: event.eventId
    }));
  };

  // Handle ticket quantity changes
  const handleTicketQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > availableSeats) return;

    const newTicketNames = Array(newQuantity).fill('').map((_, i) => formData.ticketNames[i] || '');
    setFormData(prev => ({
      ...prev,
      ticketQuantity: newQuantity,
      ticketNames: newTicketNames
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

    // NEW: handle extra codes (only one extra coupon can be applied)
    if (upperCode === 'JOYSPECIAL100') {
      if (extraCodeApplied || gccExtraApplied) {
        setCouponError('Only one extra coupon can be applied');
        return;
      }
      setExtraCodeApplied(true);
      return;
    }

    if (upperCode === 'GCCSPECIAL200') {
      if (extraCodeApplied || gccExtraApplied) {
        setCouponError('Only one extra coupon can be applied');
        return;
      }
      setGccExtraApplied(true);
      return;
    }

    if (upperCode === 'EARLYBIRD') {
      if (!isEarlyBirdEligible) {
        setCouponError('Early bird discount has expired for this event');
        return;
      }
      setAppliedCoupon({ code: upperCode, discount: earlyBirdDiscountValue });
    }
    else if (upperCode === 'FRIEND10') {
      setAppliedCoupon({ code: upperCode, discount: Math.min(100, originalPricePerTicket * 0.1) });
    }
    else if (upperCode === 'WELCOME15') {
      setAppliedCoupon({ code: upperCode, discount: Math.min(200, originalPricePerTicket * 0.15) });
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

  // NEW: remove any extra code (JOYSPECIAL100 or GCCSPECIAL200)
  const removeExtra = () => {
    setExtraCodeApplied(false);
    setGccExtraApplied(false);
    if (['JOYSPECIAL100', 'GCCSPECIAL200'].includes(couponCode.toUpperCase())) setCouponCode('');
  };

  // Function to handle coupon click
  const handleCouponClick = (code: string) => {
    setCouponCode(code);
    applyCoupon(code);
  };

  // Function to handle step 1 continue button click
  const handleContinueToPayment = async () => {

    // Trigger form validation
    const isValid = await validateForm();

    if (isValid) {
      setCurrentStep(2);
    } else {
      // Scroll to first error
      setTimeout(() => {
        const firstErrorElement = document.querySelector('.border-red-500');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Watch values and save to localStorage after submit
  const values = watch();
  const saveToLocal = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        hearAbout: formData.hearAbout,
        otherSource: formData.otherSource,
        idProof: formData.idProof,
        termsAccepted: formData.termsAccepted,
        instagramPhotos: formData.instagramPhotos
      })
    );
  };

  // NEW: combine codes for backend tracking (e.g., "EARLYBIRD+JOYSPECIAL100" or "EARLYBIRD+GCCSPECIAL200")
  const combinedCouponCodes = [
    appliedCoupon?.code || null,
    extraCodeApplied ? 'JOYSPECIAL100' : null,
    gccExtraApplied ? 'GCCSPECIAL200' : null,
  ].filter(Boolean).join('+');

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
          <p className="text-green-700 dark:text-green-200">
            Check your email for confirmation details for {formData.ticketQuantity} ticket{formData.ticketQuantity > 1 ? 's' : ''}.
          </p>
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
      ) : (
        <form onSubmit={handleSubmit(() => { saveToLocal(); })} className="space-y-6">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                  Full Name *
                </label>
                <input
                  {...register('name', {
                    required: "Name is required",
                    onChange: (e) => handleFormChange('name', e.target.value)
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                    ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                  onBlur={() => trigger('name')}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    {...register('age', {
                      required: "Age is required",
                      min: {
                        value: 10,
                        message: "Minimum age is 10"
                      },
                      max: {
                        value: 50,
                        message: "Maximum age is 50"
                      },
                      onChange: (e) => handleFormChange('age', e.target.value)
                    })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                      dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                      ${errors.age ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Your age"
                    onBlur={() => trigger('age')}
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone', {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Please enter a valid 10-digit Indian phone number"
                      },
                      onChange: (e) => handleFormChange('phone', e.target.value)
                    })}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                      dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                      ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="10-digit phone number"
                    onBlur={() => trigger('phone')}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Please enter a valid email"
                    },
                    onChange: (e) => handleFormChange('email', e.target.value)
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                    ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="your@email.com"
                  onBlur={() => trigger('email')}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                  How did you hear about us? *
                </label>
                <select
                  {...register('hearAbout', {
                    required: "This field is required",
                    onChange: (e) => handleFormChange('hearAbout', e.target.value)
                  })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                    ${errors.hearAbout ? 'border-red-500 focus:ring-red-500' : ''}`}
                  onBlur={() => trigger('hearAbout')}
                >
                  <option value="">Select an option</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Other">Other</option>
                </select>
                {errors.hearAbout && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.hearAbout.message}
                  </p>
                )}

                {hearAboutValue === 'Other' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                      Please specify *
                    </label>
                    <input
                      {...register('otherSource', {
                        required: hearAboutValue === 'Other' ? "Please specify how you heard about us" : false,
                        onChange: (e) => handleFormChange('otherSource', e.target.value)
                      })}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                        dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]
                        ${errors.otherSource ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="How did you hear about us?"
                      onBlur={() => trigger('otherSource')}
                    />
                    {errors.otherSource && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircle className="w-4 h-4 mr-1" />
                        {errors.otherSource.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

                            {/* Number of Tickets Selector */}
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                <label className="block text-sm font-medium mb-3 dark:text-[#E5E7EB]">
                  Number of Tickets *
                </label>
                <div className="flex items-center gap-4 mb-4">
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(formData.ticketQuantity - 1)}
                    disabled={formData.ticketQuantity <= 1}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-2xl font-semibold dark:text-[#E5E7EB]">{formData.ticketQuantity}</span>
                  <button
                    type="button"
                    onClick={() => handleTicketQuantityChange(formData.ticketQuantity + 1)}
                    disabled={formData.ticketQuantity >= availableSeats}
                    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({availableSeats - formData.ticketQuantity} seats available)
                  </span>
                </div>

                {/* Ticket Holder Names */}
                {formData.ticketQuantity > 0 && (
                  <div className="mt-4 space-y-3">
                    <label className="block text-sm font-medium dark:text-[#E5E7EB]">
                      Enter name for each ticket *
                    </label>
                    {Array.from({ length: formData.ticketQuantity }).map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Ticket ${index + 1} holder name`}
                        value={formData.ticketNames[index] || ''}
                        onChange={(e) => {
                          const newTicketNames = [...formData.ticketNames];
                          newTicketNames[index] = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            ticketNames: newTicketNames
                          }));
                        }}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
                          dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Instagram Photos Permission */}
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-[#E5E7EB]">
                  Do we have your permission to post photos/videos that may include you on our official instagram page? *
                </label>
                <div className="flex gap-6 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="yes"
                      {...register('instagramPhotos', {
                        required: "Please select an option",
                        onChange: (e) => handleFormChange('instagramPhotos', e.target.value)
                      })}
                      className="h-4 w-4 text-[#3AA3A0] focus:ring-[#3AA3A0] border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-[#E5E7EB]">Yes, absolutely!</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="no"
                      {...register('instagramPhotos', {
                        required: "Please select an option",
                        onChange: (e) => handleFormChange('instagramPhotos', e.target.value)
                      })}
                      className="h-4 w-4 text-[#3AA3A0] focus:ring-[#3AA3A0] border-gray-300"
                    />
                    <span className="text-gray-700 dark:text-[#E5E7EB]">No, I prefer not</span>
                  </label>
                </div>
                {errors.instagramPhotos && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <XCircle className="w-4 h-4 mr-1" />
                    {errors.instagramPhotos.message}
                  </p>
                )}
              </div>

              {/* ID Proof Checkbox */}
              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="idProof"
                  {...register('idProof', {
                    required: "You must agree to provide ID proof",
                    onChange: (e) => handleFormChange('idProof', e.target.checked)
                  })}
                  className={`mt-1 h-5 w-5 rounded border-gray-300 text-[#3AA3A0] focus:ring-[#3AA3A0]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:focus:ring-[#2DB4AF] 
                    ${errors.idProof ? 'border-red-500' : ''}`}
                />
                <label htmlFor="idProof" className="block text-sm text-gray-700 dark:text-[#E5E7EB]">
                  Please provide any ID proof in the event (Aadhar/PAN card)? *
                </label>
              </div>
              {errors.idProof && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.idProof.message}
                </p>
              )}

              {/* Terms & Conditions Checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  {...register('termsAccepted', {
                    required: "You must accept the terms and conditions",
                    onChange: (e) => handleFormChange('termsAccepted', e.target.checked)
                  })}
                  className={`mt-1 h-5 w-5 rounded border-gray-300 text-[#3AA3A0] focus:ring-[#3AA3A0]
                    dark:bg-[#1F2937] dark:border-gray-600 dark:focus:ring-[#2DB4AF] 
                    ${errors.termsAccepted ? 'border-red-500' : ''}`}
                />
                <label htmlFor="termsAccepted" className="block text-sm text-gray-700 dark:text-[#E5E7EB]">
                  I accept the <a href="/communityGuidelines" className="text-[#3AA3A0] dark:text-[#2DB4AF] underline" target="_blank">terms and conditions</a> *
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.termsAccepted.message}
                </p>
              )}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleContinueToPayment}
                  className={`w-full bg-[#3AA3A0] dark:bg-[#2DB4AF] text-white py-3 rounded-lg 
                    hover:bg-[#2E827F] dark:hover:bg-[#1E8F8C] transition-colors
                    ${!isValid ? 'opacity-90' : ''}`}
                >
                  Continue to Payment
                </button>

              </div>
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
                  {/* Price breakdown */}
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-[#9CA3AF]">
                      Price per ticket:
                    </span>
                    <span className="text-gray-600 dark:text-[#9CA3AF]">₹{originalPricePerTicket}</span>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600 dark:text-[#9CA3AF]">
                      Subtotal ({formData.ticketQuantity} ticket{formData.ticketQuantity > 1 ? 's' : ''}):
                    </span>
                    <span className="text-gray-600 dark:text-[#9CA3AF]">₹{totalOriginalPrice}</span>
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
                      <span className="text-green-600 dark:text-green-400">-₹{discount}</span>
                    </div>
                  )}

                  {/* NEW: Extra flat discount line for JOYSPECIAL100 */}
                  {extraCodeApplied && (
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-[#9CA3AF]">Extra Discount (JOYSPECIAL100):</span>
                        <button
                          onClick={removeExtra}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="text-green-600 dark:text-green-400">-₹100</span>
                    </div>
                  )}

                  {/* NEW: Extra flat discount line for GCCSPECIAL200 */}
                  {gccExtraApplied && (
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center">
                        <span className="text-gray-600 dark:text-[#9CA3AF]">Extra Discount (GCCSPECIAL200):</span>
                        <button
                          onClick={removeExtra}
                          className="ml-2 text-xs text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                      <span className="text-green-600 dark:text-green-400">-₹200</span>
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

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-1 min-w-0 p-3 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] dark:focus:ring-[#2DB4AF]
      dark:bg-[#1F2937] dark:border-gray-600 dark:text-[#E5E7EB]"
                  />
                  <button
                    type="button"
                    onClick={() => applyCoupon(couponCode)}
                    className="w-full sm:w-auto shrink-0 bg-[#3AA3A0] dark:bg-[#2DB4AF] text-white px-4 rounded-lg 
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

                {/* NEW: success chip for JOYSPECIAL100 */}
                {extraCodeApplied && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Extra code JOYSPECIAL100 applied!</span>
                  </div>
                )}

                {/* NEW: success chip for GCCSPECIAL200 */}
                {gccExtraApplied && (
                  <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Extra code GCCSPECIAL200 applied!</span>
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
                entityType={event.entityType}
                status={paymentStatus}
                eventData={event}
                formData={formData}
                couponCode={combinedCouponCodes} // send combined codes e.g. "EARLYBIRD+JOYSPECIAL50"
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
