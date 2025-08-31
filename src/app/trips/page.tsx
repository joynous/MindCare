// app/trips/page.tsx
export const dynamic = 'force-static';
export const revalidate = 300; // 5 min

import Image from "next/image";
import Link from "next/link";
import { trips } from "./trips.data";

export default function TripsPage() {
  const upcoming = trips.filter(t => new Date(t.startDate) >= new Date());

  return (
    <main className="min-h-screen mt-10 bg-white text-[#0f172a] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      <header className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Upcoming Trips</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Pick your next adventure and register in a few taps.
        </p>
      </header>

      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 pb-16">
        {upcoming.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No upcoming trips yet—check back soon!</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {upcoming.map((trip) => (
              <li key={trip.slug} className="rounded-2xl overflow-hidden bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                <Link href={`/trips/${trip.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-yellow-400">
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={trip.coverImage}
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
                        {new Date(trip.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} – {new Date(trip.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="font-semibold text-[#1A2E35] dark:text-white">₹{trip.price}</span>
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
