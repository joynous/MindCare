// app/gallery/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { eventImages } from '../data/event';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Event Gallery</h1>
          <Link
            href="/"
            className="text-orange-600 hover:underline inline-flex items-center"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {eventImages.map((image) => (
            <div 
              key={image.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <p className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-center p-4 text-sm">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}