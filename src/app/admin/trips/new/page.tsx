// app/admin/trips/new/page.tsx
'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useForm,
  useFieldArray,
  SubmitHandler,
  Resolver,
  FieldErrors,
} from 'react-hook-form';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { useEffect, useMemo, useState } from 'react';
import {
  Plus,
  Trash,
  Sparkles,
  MapPin,
  CalendarDays,
  BadgeIndianRupee,
} from 'lucide-react';
import { supabase } from '@/app/lib/supabase';

// ====== IMPORTANT: client-side default cover (no input field shown) ======
const DEFAULT_COVER = '/images/trips/default.webp';

// ---- ZOD SCHEMA (no cover_image field in the form) ----
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  subtitle: z.string().min(10, 'Subtitle must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  start_date: z
    .string()
    .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid start date'),
  end_date: z
    .string()
    .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Invalid end date'),
  // Use coerce to safely accept input strings from <input type="number">
  price: z.coerce.number().int().min(0, 'Price must be ≥ 0'),
  difficulty: z.enum(['Easy', 'Moderate', 'Hard']).default('Easy'),
  spots_total: z.coerce.number().int().min(0),
  highlights: z
    .array(z.object({ value: z.string().min(3) }))
    .min(1, 'Add at least one highlight'),
  // Single big textarea for itinerary input; we will split to array on submit
  itinerary_raw: z.string().min(3, 'Paste the itinerary (can be multi-line)'),
  slug: z
    .string()
    .min(3, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase, numbers and dashes'),
  is_active: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

// ---- Helpers ----
const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const diffNights = (start?: string, end?: string) => {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return 0;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((e.getTime() - s.getTime()) / msPerDay);
  return Math.max(0, diffDays);
};

export default function CreateTripPage() {
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Admin gate + ready flag so the button isn't clickable prematurely
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 👇 Make resolver shape match RHF expectations exactly
  // @ts-expect-error: resolver generic mismatch between @hookform/resolvers and RHF; safe at runtime
  const rhfResolver: Resolver<FormValues> = zodResolver(formSchema);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: rhfResolver,
    defaultValues: {
      title: '',
      subtitle: '',
      location: '',
      start_date: '',
      end_date: '',
      price: 0,
      difficulty: 'Easy',
      spots_total: 20,
      highlights: [{ value: '' }],
      itinerary_raw: '',
      slug: '',
      is_active: true,
    },
    mode: 'onBlur',
  });

  // Highlights array
  const {
    fields: highlights,
    append: appendHighlight,
    remove: removeHighlight,
  } = useFieldArray({
    control,
    name: 'highlights',
  });

  // Nights preview
  const startDate = watch('start_date');
  const endDate = watch('end_date');
  const nightsPreview = useMemo(
    () => diffNights(startDate, endDate),
    [startDate, endDate]
  );

  // Auto-slug from title
  const title = watch('title');
  useEffect(() => {
    if (!title) return;
    const base = toSlug(title);
    setValue('slug', base, { shouldValidate: true });
  }, [title, setValue]);

  // Check admin (policy guard)
  useEffect(() => {
    (async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setIsAdmin(false);
          setAdminChecked(true);
          return;
        }
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (error) {
          // Fail closed but inform
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data?.is_admin));
        }
      } catch {
        setIsAdmin(false);
      } finally {
        setAdminChecked(true);
      }
    })();
  }, []);

  const handleCheckSlug = async (slug: string) => {
    if (!slug) return false;
    setCheckingSlug(true);
    const { data, error } = await supabase
      .from('trips')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    setCheckingSlug(false);
    if (error) {
      // Let DB unique constraint be the final guard if the check fails
      return true;
    }
    return !data; // true if available
  };

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      if (!isAdmin) {
        toast.error('Only admins can create trips.');
        return;
      }

      // Dates sanity
      const s = new Date(values.start_date);
      const e = new Date(values.end_date);
      if (e < s) {
        toast.error('End date must be after Start date.');
        return;
      }

      // Slug availability (best effort; unique constraint is final authority)
      const available = await handleCheckSlug(values.slug);
      if (!available) {
        toast.error('Slug already in use. Try another.');
        return;
      }

      // Convert raw itinerary (multiline textarea) -> text[] preserving lines and spacing
      // Keep empty lines to preserve spacing exactly.
      const itineraryArray = values.itinerary_raw.replace(/\r\n/g, '\n').split('\n');

      // Insert (no cover_image field in form; use client-side default)
      const { error } = await supabase.from('trips').insert({
        slug: values.slug,
        title: values.title,
        subtitle: values.subtitle,
        cover_image: DEFAULT_COVER, // <- no user input, constant default
        location: values.location,
        start_date: values.start_date,
        end_date: values.end_date,
        price: values.price,
        difficulty: values.difficulty,
        spots_total: values.spots_total,
        spots_booked: 0,
        highlights: values.highlights.map((h) => h.value),
        itinerary: itineraryArray, // text[]
        is_active: values.is_active,
      });

      if (error) throw error;

      toast.success('Trip created successfully!');
    } catch (err) {
      const message =
        typeof err === 'object' && err !== null && 'message' in err
          ? (err as { message?: string }).message || 'Failed to create trip.'
          : 'Failed to create trip.';
      toast.error(message);
    }
  };

  // Surface validation errors loudly so submit never feels "dead"
  const onInvalid = (errs: FieldErrors<FormValues>) => {
    const first = Object.values(errs)[0];
    const msg = first?.message || 'Please correct the highlighted fields.';
    toast.error(msg);
  };

  return (
    <>
      {/* Toaster for visible feedback */}
      <Toaster richColors position="top-center" />

      <div className="mx-auto max-w-3xl p-6 sm:p-8 mt-16">
        {/* Minimal Glow header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-white/10 bg-[#0E141C] p-5 text-white relative overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full blur-3xl opacity-30"
            style={{
              background:
                'radial-gradient(50% 50% at 50% 50%, #38F5BF 0%, transparent 70%)',
            }}
          />
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-[#38F5BF]" />
            <h1 className="text-xl sm:text-2xl font-bold">Create New Trip</h1>
          </div>
          <p className="mt-1 text-sm text-[#A6ADBB]">
            Paste your day-by-day itinerary, add highlights, set dates & publish.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          {/* Title + Subtitle */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Title
              </label>
              <input
                {...register('title')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                placeholder="Rishikesh River Retreat"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Subtitle
              </label>
              <input
                {...register('subtitle')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                placeholder="Weekend getaway with rafting, café hopping & sunset aarti."
              />
              {errors.subtitle && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.subtitle.message}
                </p>
              )}
            </div>
          </div>

          {/* Location + Price */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Location
              </label>
              <div className="mt-1 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#A78BFA]" />
                <input
                  {...register('location')}
                  className="w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                  placeholder="Rishikesh, Uttarakhand"
                />
              </div>
              {errors.location && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Price (₹)
              </label>
              <div className="mt-1 flex items-center gap-2">
                <BadgeIndianRupee className="h-4 w-4 text-[#38F5BF]" />
                <input
                  type="number"
                  min={0}
                  {...register('price')} // valueAsNumber not needed; z.coerce handles it
                  className="w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                  placeholder="6999"
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          {/* Dates + Nights + Difficulty */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Start Date
              </label>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#A78BFA]" />
                <input
                  type="date"
                  {...register('start_date')}
                  className="w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                />
              </div>
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                End Date
              </label>
              <div className="mt-1 flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#A78BFA]" />
                <input
                  type="date"
                  {...register('end_date')}
                  className="w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                />
              </div>
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.end_date.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Difficulty
              </label>
              <select
                {...register('difficulty')}
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
              >
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-[#A6ADBB] -mt-2">
            Estimated nights:{' '}
            <span className="font-medium text-white">{nightsPreview}</span>
          </p>

          {/* Seats & Active */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#A6ADBB]">
                Total Spots
              </label>
              <input
                type="number"
                min={0}
                {...register('spots_total')} // valueAsNumber not needed; z.coerce handles it
                className="mt-1 w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                placeholder="20"
              />
              {errors.spots_total && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.spots_total.message}
                </p>
              )}
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-[#A6ADBB]">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="h-4 w-4 rounded border-white/20 bg-[#0E141C]"
                />
                Visible / Active
              </label>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-[#A6ADBB]">
              Slug
            </label>
            <input
              {...register('slug')}
              className="mt-1 w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
              placeholder="rishikesh-2025-10"
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-400">{errors.slug.message}</p>
            )}
            <p className="mt-1 text-xs text-[#A6ADBB]">
              {checkingSlug ? 'Checking availability…' : 'Tip: lowercase-with-dashes'}
            </p>
          </div>

          {/* Highlights */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-white">
                Highlights
              </label>
              <button
                type="button"
                onClick={() => appendHighlight({ value: '' })}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white hover:bg-white/10"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {highlights.map((f, idx) => (
                <div key={f.id} className="flex gap-2">
                  <input
                    {...register(`highlights.${idx}.value` as const)}
                    className="w-full rounded-lg border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF]"
                    placeholder="Sunset Aarti at Triveni Ghat"
                  />
                  <button
                    type="button"
                    onClick={() => removeHighlight(idx)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 text-white hover:bg-white/10"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {errors.highlights && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.highlights.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Itinerary (PASTE ANYTHING; we’ll preserve spacing & emojis) */}
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              Itinerary (paste multi-line)
            </label>
            <textarea
              {...register('itinerary_raw')}
              rows={10}
              className="w-full rounded-xl border border-white/10 bg-[#0E141C] px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#38F5BF] font-mono"
              placeholder={`Day 1: Arrival 🧳
- Check-in and café crawl ☕️

Day 2: Rafting & Ganga Aarti 🌊🪔
- Morning rafting
- Evening aarti at Triveni Ghat

Day 3: Chill & checkout 😌`}
            />
            <p className="mt-1 text-xs text-[#A6ADBB]">
              New lines and spaces are saved as-is. Emojis/icons are supported.
            </p>
            {errors.itinerary_raw && (
              <p className="mt-1 text-sm text-red-400">
                {errors.itinerary_raw.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !adminChecked}
              className="w-full rounded-lg bg-[#38F5BF] px-6 py-3 font-semibold text-[#0B0F14] transition hover:opacity-90 disabled:opacity-50"
            >
              {!adminChecked
                ? 'Checking permissions…'
                : isSubmitting
                ? 'Creating Trip…'
                : 'Create Trip'}
            </button>

            {!adminChecked && (
              <p className="mt-2 text-xs text-[#A6ADBB]">
                Please wait, verifying admin access…
              </p>
            )}
            {adminChecked && !isAdmin && (
              <p className="mt-2 text-sm text-red-400">
                Only admins can create trips. Please sign in with an admin account.
              </p>
            )}
          </motion.div>
        </form>
      </div>
    </>
  );
}
