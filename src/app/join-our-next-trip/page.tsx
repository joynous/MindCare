// app/join-our-next-trip/page.tsx
export const dynamic = 'force-static';
export const revalidate = 1800; // 30 min

import Image from "next/image";
import Link from "next/link";
import Carousel from "../components/Carousel";

export default function TripsLandingPage() {
    const tripsImages = [
    { id: 2, src: `/images/trips/joynous-escapes-champawat-calling/2.webp`, alt: 'Strolling/Hiking Club' },
        { id: 4,src: `/images/trips/joynous-escapes-champawat-calling/5.webp`, alt: 'Trekking Club' },
    { id: 5,src: `/images/trips/joynous-escapes-champawat-calling/3.webp`, alt: 'Mehfil collective Club' },
    { id: 1, src: `/images/trips/joynous-escapes-champawat-calling/1.webp`, alt: 'Art Meetup Club' },
    { id: 3,src: `/images/trips/joynous-escapes-champawat-calling/4.webp`, alt: 'Trekking Club' },
  ];

  return (
    <main className="min-h-screen bg-white text-[#0f172a] dark:bg-[#0b1220] dark:text-[#e5e7eb]">
      {/* Poster / Hero */}
      <section className="relative">
        <div className="relative w-full aspect-[9/12] sm:aspect-[16/9] overflow-hidden">
          {tripsImages.length > 0 ? (
                      <Carousel images={tripsImages} title={''} />
                    ) : (
                      <Image
                        src='/images/trips/default.webp'
                        alt={'Our Next Trip'}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={100}
                        priority
                      />
                    )}
          {/* CTA on poster bottom */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/60 to-transparent">
            <div className="max-w-screen-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                Ready for our next trip?
              </h1>
              <Link
                href="/trips"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-5 py-3 bg-[#F7D330] text-[#1A2E35] font-semibold shadow hover:brightness-95 transition"
                aria-label="Register for our next trip"
              >
                Register for Next Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Joynous */}
      <section className="max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          Why choose Joynous?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              title: "Curated Experiences",
              desc: "Thoughtfully planned itineraries that balance exploration and chill.",
              icon: "🧭",
            },
            {
              title: "Great Company",
              desc: "Meet friendly people and build memories beyond screens.",
              icon: "🤝",
            },
            {
              title: "Stress-free Planning",
              desc: "Stay light—logistics, stays, permits handled by us.",
              icon: "🧳",
            },
          ].map((f) => (
            <article
              key={f.title}
              className="rounded-2xl p-5 sm:p-6 bg-[#f8fafc] dark:bg-[#111a2e] border border-gray-200/60 dark:border-white/10"
            >
              <div className="text-3xl mb-3" aria-hidden>
                {f.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {f.desc}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
