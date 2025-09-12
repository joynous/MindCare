// app/trips/[slug]/page.tsx
export const revalidate = 600; // 10 min
export const dynamicParams = true;

import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import EventRegistration from '@/app/components/EventRegistration';
import Image from 'next/image';
import Carousel from '@/app/components/Carousel';

type TripRow = {
  slug: string;
  title: string;
  subtitle: string;
  cover_image: string | null;
  location: string | null;
  start_date: string; // 'YYYY-MM-DD'
  end_date: string;   // 'YYYY-MM-DD'
  price: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard' | null;
  spots_total: number | null;
  spots_booked: number | null;
  highlights: string[] | null; // text[]
  itinerary: string[] | null;  // text[]
  is_active: boolean;
};

function nightsBetween(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((e.getTime() - s.getTime()) / msPerDay);
  return Math.max(0, diff);
}

function formatDateRangeLong(startISO: string, endISO: string) {
  const s = new Date(startISO);
  const e = new Date(endISO);
  const sStr = s.toLocaleDateString('en-IN', { day: '2-digit', month: 'long' });
  const eStr = e.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  return `${sStr} – ${eStr}`;
}

async function fetchTrip(slug: string): Promise<TripRow | null> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('trips')
    .select(
      'slug,title,subtitle,cover_image,location,start_date,end_date,price,difficulty,spots_total,spots_booked,highlights,itinerary,is_active'
    )
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[TripDetail] Supabase error:', error.message);
    return null;
  }
  if (!data || !data.is_active) return null;
  return data as TripRow;
}

type PageParams = { slug: string };

export default async function TripDetailPage(
  { params }: { params: Promise<PageParams> }
) {
  const { slug } = await params; // 👈 get slug from the promised params
  const trip = await fetchTrip(slug);
  if (!trip) return notFound();

  const nights = nightsBetween(trip.start_date, trip.end_date);
  const seatsTotal = trip.spots_total ?? 0;
  const seatsBooked = trip.spots_booked ?? 0;

  const tripsImages = [
    { id: 1, src: `/images/trips/${trip.slug}/1.webp`, alt: 'Art Meetup Club' },
    { id: 2, src: `/images/trips/${trip.slug}/2.webp`, alt: 'Strolling/Hiking Club' },
    { id: 5,src: `/images/trips/${trip.slug}/3.webp`, alt: 'Mehfil collective Club' },
    { id: 3,src: `/images/trips/${trip.slug}/4.webp`, alt: 'Trekking Club' },
  ];
  
  return (
    <main className="min-h-screen bg-white text-[#0f172a] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      {/* Hero / Header */}
      <div className="max-w-7xl mx-auto mt-10 px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{trip.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{trip.subtitle}</p>
          <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            {formatDateRangeLong(trip.start_date, trip.end_date)} {' • '} {nights}{' '}
            {nights === 1 ? 'night' : 'nights'}
          </p>
        </div>

        {/* Cover image */}
          <div className="mt-5 relative w-full aspect-[16/10] rounded-xl overflow-hidden">
          {tripsImages.length > 0 ? (
            <Carousel images={tripsImages} title={trip.title} />
          ) : (
            <Image
              src={trip.cover_image || '/images/trips/default.webp'}
              alt={trip.title}
              fill
              className="object-cover"
              sizes="100vw"
              quality={100}
              priority
            />
          )}
        </div>

        {/* Main: Details (left) + Registration (right) */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <article className="lg:col-span-2 space-y-8">
            {/* Quick facts */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="rounded-xl p-3 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">Location</p>
                <p className="font-medium">{trip.location ?? '—'}</p>
              </div>
              <div className="rounded-xl p-3 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">Difficulty</p>
                <p className="font-medium">{trip.difficulty ?? 'Easy'}</p>
              </div>
              {/* <div className="rounded-xl p-3 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">Seats Left</p>
                <p className={`font-medium ${seatsLeft === 0 ? 'text-red-500' : ''}`}>{seatsLeft}</p>
              </div> */}
              <div className="rounded-xl p-3 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                <p className="text-gray-500 dark:text-gray-400">Price</p>
                <p className="font-semibold">₹{new Intl.NumberFormat('en-IN').format(trip.price)}</p>
              </div>
            </section>

            {/* Highlights */}
            {/* {trip.highlights && trip.highlights.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Highlights</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {trip.highlights.map((h, idx) => (
                    <li
                      key={`${h}-${idx}`}
                      className="rounded-xl p-4 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )} */}

            {/* Itinerary */}
{trip.itinerary && trip.itinerary.length > 0 && (
  <section>
    <h2 className="text-xl sm:text-2xl font-semibold">Itinerary</h2>
    <ul className="mt-3 space-y-3">
      {trip.itinerary
        .map((line) => (line ?? '').trimEnd())
        .map((line, i) =>
          line.length ? (
            <li
              key={i}
              className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap"
            >
              {line}
            </li>
          ) : (
            // preserve blank lines as spacing blocks
            <li key={i} className="list-none h-3" aria-hidden />
          )
        )}
    </ul>
  </section>
)}


          </article>

          {/* Right: Registration Card (same structure/props as trips page) */}
          <aside id="register" className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1F2937] dark:text-white p-4 md:p-6 lg:p-8 rounded-xl shadow lg:sticky lg:top-8">
              <EventRegistration
                event={{
                  eventId: trip.slug,                 // using slug as id for trips
                  eventName: trip.title,
                  eventDate: trip.start_date,         // primary date (start)
                  eventVenue: trip.location ?? '',
                  totalSeats: seatsTotal,
                  bookedSeats: seatsBooked,
                  paymentAmount: trip.price,
                  entityType: 'trip',
                }}
              />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function todayISODate() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export async function generateStaticParams() {
  // Prebuild active & upcoming slugs
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const today = todayISODate();
    const { data, error } = await supabase
      .from('trips')
      .select('slug,start_date,end_date,is_active')
      .eq('is_active', true)
      .gte('end_date', today);

    if (error || !data) return [];
    return data.map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}
