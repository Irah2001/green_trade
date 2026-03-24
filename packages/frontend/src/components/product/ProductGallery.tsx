'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: Readonly<ProductGalleryProps>) {
  const safeImages = images?.length > 0 ? images : ['/images/green_trade.webp'];

  const [mainIndex, setMainIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square md:aspect-4/3 rounded-2xl overflow-hidden bg-gray-100">
        <Image
          src={safeImages[mainIndex]}
          alt="Vue principale du produit"
          fill
          priority
          quality={95}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {safeImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setMainIndex(index)}
              className={`relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all
                ${mainIndex === index ? 'border-olive opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image
                src={img}
                alt={`Miniature ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
