// app/trips/trips.data.ts
export type Trip = {
  slug: string;
  title: string;
  subtitle: string;
  coverImage: string; // use webp
  startDate: string;
  endDate: string;
  nights: number;
  price: number;
  highlights: string[];
  itinerary: string[];
};

export const trips: Trip[] = [
  {
    slug: "goa-sun-sand",
    title: "Goa – Sun, Sand & Salsa",
    subtitle: "Beach vibes, sunset cruises, and old Latin quarters.",
    coverImage: "/images/trips/goa.webp",
    startDate: "2025-10-02",
    endDate: "2025-10-06",
    nights: 4,
    price: 12999,
    highlights: [
      "Sunset cruise on Mandovi",
      "Fontainhas heritage walk",
      "Beachside BBQ night",
      "Anjuna flea market"
    ],
    itinerary: [
      "Day 1: Arrival & beachfront chill + BBQ",
      "Day 2: Old Goa + Fontainhas walk + café hop",
      "Day 3: Beach day + water sports (optional)",
      "Day 4: Sunset cruise + group dinner",
      "Day 5: Brunch & checkout",
    ],
  },
  {
    slug: "himachal-hideout",
    title: "Himachal Hideout",
    subtitle: "Pines, cafés, starry skies—mountain calm with cozy stays.",
    coverImage: "/images/trips/himachal.webp",
    startDate: "2025-11-14",
    endDate: "2025-11-18",
    nights: 4,
    price: 14999,
    highlights: [
      "Bonfire & acoustic night",
      "Café crawl in Old Manali",
      "Riverside picnic",
      "Short forest hike"
    ],
    itinerary: [
      "Day 1: Arrive & settle—evening bonfire",
      "Day 2: Café crawl + local exploration",
      "Day 3: Riverside picnic + games",
      "Day 4: Forest hike + stargazing",
      "Day 5: Leisure morning & checkout",
    ],
  },
];
