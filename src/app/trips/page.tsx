// app/trips/page.tsx
export const dynamic = 'force-static';
export const revalidate = 300; // 5 min

import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// --- Types mirroring your DB shape ---
type TripRow = {
  slug: string;
  title: string;
  subtitle: string;
  cover_image: string | null;
  location: string;
  start_date: string; // ISO date (YYYY-MM-DD)
  end_date: string;   // ISO date
  price: number;
  is_active: boolean;
};

function formatDateRange(startISO: string, endISO: string) {
  const start = new Date(startISO);
  const end = new Date(endISO);
  const startStr = start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  const endStr = end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

function todayISODate() {
  const d = new Date();
  // Strip time to local midnight by using local components
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function fetchUpcomingTrips(): Promise<TripRow[]> {
  // Reads using public anon key. Ensure RLS allows reading active trips.
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const today = todayISODate();

  const { data, error } = await supabase
    .from('trips')
    .select(
      'slug,title,subtitle,cover_image,location,start_date,end_date,price,is_active'
    )
    .eq('is_active', true)
    .gte('end_date', today)
    .order('start_date', { ascending: true });

  if (error) {
    // In a static page, we don't want to throw hard—return empty to render the friendly message.
    console.error('[Trips] Supabase error:', error.message);
    return [];
  }

  return (data ?? []).filter(Boolean) as TripRow[];
}

export default async function TripsPage() {
  const trips = await fetchUpcomingTrips();

  return (
    <main className="min-h-screen mt-10 bg-white text-[#0f172a] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      <header className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Upcoming Trips</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Pick your next adventure and register in a few taps.
        </p>
      </header>

      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {trips.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No upcoming trips yet—check back soon!
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {trips.map((trip) => (
              <li
                key={trip.slug}
                className="rounded-2xl overflow-hidden bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10"
              >
                <Link
                  href={`/trips/${trip.slug}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={`/images/trips/${trip.slug}/2.webp`}
                      alt={trip.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      quality={70}
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h2 className="text-lg sm:text-xl font-semibold">{trip.title}</h2>
                    <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-300 line-clamp-2">
                      {trip.subtitle}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-sm sm:text-base">
                      <span className="text-gray-700 dark:text-gray-200">
                        {formatDateRange(trip.start_date, trip.end_date)}
                      </span>
                      <span className="font-semibold text-[#1A2E35] dark:text-white">
                        ₹{new Intl.NumberFormat('en-IN').format(trip.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
