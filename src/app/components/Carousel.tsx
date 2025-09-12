'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Carousel({ images, title }: { images: {id: number; src: string; alt:string}[]; title: string }) {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="relative w-full h-full">
      <Image
        src={images[index].src}
        alt={`${title} image ${index + 1}`}
        fill
        className="object-cover rounded-xl"
        sizes="100vw"
        quality={80}
        priority
      />
      {/* Left arrow */}
      <button
        onClick={prev}
        className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      {/* Right arrow */}
      <button
        onClick={next}
        className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
