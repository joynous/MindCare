// app/trips/[slug]/page.tsx
export const dynamic = 'force-static';
export const revalidate = 600; // 10 min
export const dynamicParams = true;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { trips } from "../trips.data";

type Props = { params: { slug: string } };

export default function TripDetailPage({ params: { slug } }: Props) {
  const trip = trips.find(t => t.slug === slug);
  if (!trip) return notFound();

  return (
    <main className="min-h-screen mt-10 bg-white text-[#0f172a] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      <article className="max-w-screen-md mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <header>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{trip.title}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">{trip.subtitle}</p>
          <p className="mt-1 text-sm sm:text-base text-gray-700 dark:text-gray-200">
            {new Date(trip.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long" })} –{" "}
            {new Date(trip.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
            {" • "} {trip.nights} nights
          </p>
        </header>

        <div className="mt-5 relative w-full aspect-[16/10] rounded-xl overflow-hidden">
          <Image
            src={trip.coverImage}
            alt={trip.title}
            fill
            className="object-cover"
            sizes="100vw"
            quality={75}
            priority
          />
        </div>

        {/* Highlights */}
        <section className="mt-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold">Highlights</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trip.highlights.map((h) => (
              <li key={h} className="rounded-xl p-4 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10">
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Itinerary */}
        <section className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold">Itinerary</h2>
          <ol className="mt-3 space-y-3 list-decimal list-inside">
            {trip.itinerary.map((d, i) => (
              <li key={i} className="text-gray-700 dark:text-gray-200">{d}</li>
            ))}
          </ol>
        </section>

        {/* Price & CTA */}
        <footer className="mt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Starting at</p>
            <p className="text-2xl sm:text-3xl font-bold">₹{trip.price}</p>
          </div>

          {/* Link this to your existing registration flow for trips */}
          <Link
            href={`/events/${trip.slug}/register`} // or a dedicated /trips/[slug]/register if you plan that
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-[#F7D330] text-[#1A2E35] font-semibold shadow hover:brightness-95 transition"
            aria-label="Register for this trip"
          >
            Register Now
          </Link>
        </footer>
      </article>
    </main>
  );
}

export async function generateStaticParams() {
  // Pre-build known slugs; in real app fetch from DB/API.
  return trips.map(t => ({ slug: t.slug }));
}
