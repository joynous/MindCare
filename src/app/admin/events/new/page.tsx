'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

const eventFormSchema = z.object({
  eventName: z.string().min(5, 'Event name must be at least 5 characters'),
  eventDate: z.string()
    .refine(val => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    }, 'Event date must be a valid future date'),
  eventTime: z.string().regex(/^\d{1,2}:\d{2} [AP]M$/, 'Invalid time format (e.g., 10:00 AM)'),
  eventVenue: z.string().min(5, 'Venue must be at least 5 characters'),
  totalSeats: z.number().min(1, 'At least 1 seat required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  speakers: z.array(z.object({
    name: z.string().min(3),
    role: z.string().min(3),
  })),
  paymentAmount: z.number().min(0, 'Payment amount cannot be negative'),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

export default function EventCreationForm() {
  const { register, control, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      speakers: [{ name: '', role: '' }]
    }
  });

  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({
    control,
    name: 'speakers'
  });

  const [existingDates, setExistingDates] = useState<Set<string>>(new Set());
  const selectedDate = watch('eventDate');

  // Fetch existing event dates safely
  useEffect(() => {
    const fetchEventDates = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('eventdate');

        if (error) throw error;

        const validDates = (data || [])
          .map(event => {
            try {
              const date = new Date(event.eventdate);
              return date.toISOString().split('T')[0];
            } catch {
              return null;
            }
          })
          .filter((date): date is string => !!date);

        setExistingDates(new Set(validDates));
      } catch (error) {
        console.error('Error fetching event dates:', error);
      }
    };
    fetchEventDates();
  }, []);

  const onSubmit = async (data: EventFormValues) => {
    try {
      // Validate date again to prevent any edge cases
      const eventDate = new Date(data.eventDate);
      if (isNaN(eventDate.getTime())) {
        throw new Error('Invalid date format');
      }

      const dateString = eventDate.toISOString().split('T')[0];
      
      if (existingDates.has(dateString)) {
        throw new Error('Another event already exists on this date');
      }

      if (eventDate < new Date()) {
        throw new Error('Cannot create event in the past');
      }

      const { error } = await supabase.from('events').insert({
        eventname: data.eventName,
        eventdate: eventDate.toISOString(),
        eventtime: data.eventTime,
        eventvenue: data.eventVenue,
        totalseats: data.totalSeats,
        bookedseats: 0,
        description: data.description,
        speakers: data.speakers,
        payment_amount: data.paymentAmount,
      });

      if (error) throw error;
      
      setExistingDates(prev => new Set([...prev, dateString]));
      toast.success('Event created successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to create event. Please try again.';
      toast.error(errorMessage);
      console.error('Event creation error:', error);
    }
  };

  // Get minimum date string in local timezone format
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);
  const minDateString = minDate.toISOString().split('T')[0];

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl mt-8 font-bold mb-8 text-[#1A2E35] text-center"
      >
        Create New Event
      </motion.h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <label className="block text-sm font-medium text-gray-700">Event Name</label>
            <input
              {...register('eventName')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
            />
            {errors.eventName && (
              <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>
            )}
          </motion.div>

      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <label className="block text-sm font-medium text-gray-700">Event Date</label>
        <input
          type="date"
          {...register('eventDate')}
          min={minDateString}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
        />
        {errors.eventDate && (
          <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>
        )}
        {selectedDate && existingDates.has(new Date(selectedDate).toISOString().split('T')[0]) && (
          <p className="text-red-500 text-sm mt-1">Another event already exists on this date</p>
        )}
      </motion.div>


          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">Event Time</label>
            <input
              placeholder="10:00 AM"
              {...register('eventTime')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
            />
            {errors.eventTime && (
              <p className="text-red-500 text-sm mt-1">{errors.eventTime.message}</p>
            )}
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              {...register('eventVenue')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
            />
            {errors.eventVenue && (
              <p className="text-red-500 text-sm mt-1">{errors.eventVenue.message}</p>
            )}
          </motion.div>

          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-gray-700">Total Seats</label>
            <input 
              type="number" 
              min="1"
              {...register('totalSeats', { valueAsNumber: true })} 
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
            />
            {errors.totalSeats && (
              <p className="text-red-500 text-sm mt-1">{errors.totalSeats.message}</p>
            )}
          </motion.div>
        </div>
        <motion.div 
  className="space-y-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.5 }}
>
  <label className="block text-sm font-medium text-gray-700">Payment Amount (₹)</label>
  <input
    type="number"
    step="1"
    min={0}
    {...register('paymentAmount', { valueAsNumber: true })}
    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
  />
  {errors.paymentAmount && (
    <p className="text-red-500 text-sm mt-1">{errors.paymentAmount.message}</p>
  )}
</motion.div>


        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-[#1A2E35]">Event captains</h3>
            <button
              type="button"
              onClick={() => appendSpeaker({ name: '', role: '' })}
              className="flex items-center text-[#3AA3A0] hover:text-[#2E827F] transition-colors"
            >
              <Plus className="w-5 h-5 mr-1" />
              Add Event captain
            </button>
          </div>

          {speakerFields.map((field, index) => (
            <motion.div
              key={field.id}
              className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg group"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex-1 space-y-2">
                <input
                  placeholder="Speaker Name"
                  {...register(`speakers.${index}.name`)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
                />
                <input
                  placeholder="Speaker Role"
                  {...register(`speakers.${index}.role`)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => removeSpeaker(index)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-6"
        >
          <button
            type="submit"
            disabled={
              !!isSubmitting ||
              !!errors.eventDate ||
              !!(
                selectedDate &&
                existingDates.has(
                  new Date(selectedDate).toISOString().split('T')[0]
                )
              )
            }
            className="w-full bg-[#3AA3A0] hover:bg-[#2E827F] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}