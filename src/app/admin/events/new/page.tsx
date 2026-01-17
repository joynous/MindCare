'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { supabase } from '../../../lib/supabase';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Trash } from 'lucide-react';
import { useEffect, useState, ReactNode } from 'react';

const parseMarkdown = (text: string): ReactNode[] => {
  const parts: ReactNode[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    parts.push(
      <strong key={`bold-${match.index}`}>{match[1]}</strong>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

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
  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { speakers: [{ name: '', role: '' }] }
  });

  const paymentAmount = useWatch({ control, name: 'paymentAmount', defaultValue: 0 });
  const voucherAmount = process.env.NEXT_PUBLIC_VOUCHER_AMOUNT ? parseInt(process.env.NEXT_PUBLIC_VOUCHER_AMOUNT) : 399;
  const displayedAmount = paymentAmount + voucherAmount;
  const description = useWatch({ control, name: 'description', defaultValue: '' });

  const { fields: speakerFields, append: appendSpeaker, remove: removeSpeaker } = useFieldArray({ control, name: 'speakers' });

  const [existingEvents, setExistingEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase.from('events').select('eventdate, eventtime, eventvenue');
        if (error) throw error;
        const conflictKeys = new Set<string>();
        data?.forEach(evt => {
          const dateStr = new Date(evt.eventdate).toISOString().split('T')[0];
          const time = evt.eventtime?.trim().toUpperCase();
          const venue = evt.eventvenue?.trim().toLowerCase();
          if (dateStr && time && venue) conflictKeys.add(`${dateStr}|${time}|${venue}`);
        });
        setExistingEvents(conflictKeys);
      } catch {
        toast.error('Failed to load existing events data');
      }
    };
    fetchEvents();
  }, []);

  const onSubmit = async (data: EventFormValues) => {
    try {
      const eventDate = new Date(data.eventDate);
      if (isNaN(eventDate.getTime())) throw new Error('Invalid date format');
      if (eventDate < new Date()) throw new Error('Cannot create event in the past');
      const dateStr = eventDate.toISOString().split('T')[0];
      const timeKey = data.eventTime.trim().toUpperCase();
      const venueKey = data.eventVenue.trim().toLowerCase();
      const conflictKey = `${dateStr}|${timeKey}|${venueKey}`;
      if (existingEvents.has(conflictKey)) throw new Error('An event already exists at this venue on the same date and time');

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
      setExistingEvents(prev => new Set(prev).add(conflictKey));
      toast.success('Event created successfully!');
    } catch (err) {
      toast.error(
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message || 'Failed to create event. Please try again.'
          : 'Failed to create event. Please try again.'
      );
    }
  };

  const minDateString = new Date().toISOString().split('T')[0];

  return (
    <div className="mx-auto p-6 bg-gradient-to-b from-orange-50 to-amber-50 overflow-hidden rounded-xl shadow-lg mt-8">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl mt-8 font-bold mb-8 text-[#1A2E35] text-center">
        Create New Event
      </motion.h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <label className="block text-sm font-medium text-gray-700">Event Name</label>
            <input
              {...register('eventName')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
            {errors.eventName && <p className="text-red-500 text-sm mt-1">{errors.eventName.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <label className="block text-sm font-medium text-gray-700">Event Date</label>
            <input
              type="date"
              {...register('eventDate')}
              min={minDateString}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
            {errors.eventDate && <p className="text-red-500 text-sm mt-1">{errors.eventDate.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <label className="block text-sm font-medium text-gray-700">Event Time</label>
            <input
              placeholder="10:00 AM"
              {...register('eventTime')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            />
            {errors.eventTime && <p className="text-red-500 text-sm mt-1">{errors.eventTime.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <label className="block text-sm font-medium text-gray-700">Venue</label>
            <input
              {...register('eventVenue')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark:border-gray-600"
            />
            {errors.eventVenue && <p className="text-red-500 text-sm mt-1">{errors.eventVenue.message}</p>}
          </motion.div>

          <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <label className="block text-sm font-medium text-gray-700">Total Seats</label>
            <input
              type="number"
              min="1"
              {...register('totalSeats', { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark;border-gray-600"
            />
            {errors.totalSeats && <p className="text-red-500 text-sm mt-1">{errors.totalSeats.message}</p>}
          </motion.div>
        </div>

        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <label className="block text-sm font-medium text-gray-700">Payment Amount (₹)</label>
          <input
            type="number"
            step="1"
            min={0}
            {...register('paymentAmount', { valueAsNumber: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark;border-gray-600"
          />
          {errors.paymentAmount && <p className="text-red-500 text-sm mt-1">{errors.paymentAmount.message}</p>}
        </motion.div>

        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <label className="block text-sm font-medium text-gray-700">Voucher Amount (₹)</label>
          <input
            type="number"
            value={voucherAmount}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
          />
        </motion.div>

        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <label className="block text-sm font-medium text-gray-700">Displayed Amount (₹)</label>
          <input
            type="number"
            value={displayedAmount}
            disabled
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500"
          />
        </motion.div>

        <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark;border-gray-600"
          />
          <p className="text-sm text-gray-500 mt-1">
            Note: Use *text* to make text bold. Line breaks and spaces will be preserved. Links will be clickable.
          </p>
          {description && (
            <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900 dark:border-blue-700">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Preview:</p>
              <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                {parseMarkdown(description)}
              </div>
            </div>
          )}
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </motion.div>

        <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-[#1A2E35]">Event captains</h3>
            <button type="button" onClick={() => appendSpeaker({ name: '', role: '' })} className="flex items-center text-[#3AA3A0] hover:text-[#2E827F] transition-colors">
              <Plus className="w-5 h-5 mr-1" />
              Add Event captain
            </button>
          </div>

          {speakerFields.map((field, index) => (
            <motion.div key={field.id} className="flex gap-4 items-start bg-gray-50 rounded-lg group" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex-1 space-y-2">
                <input placeholder="Speaker Name" {...register(`speakers.${index}.name`)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark;border-gray-600" />
                <input placeholder="Speaker Role" {...register(`speakers.${index}.role`)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent dark:bg-gray-700 dark;text-gray-100 dark;border-gray-600" />
              </div>
              <button type="button" onClick={() => removeSpeaker(index)} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-6">
          <button type="submit" disabled={isSubmitting} className="w-full bg-[#3AA3A0] hover:bg-[#2E827F] text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
