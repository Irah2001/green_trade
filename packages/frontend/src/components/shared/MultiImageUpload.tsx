// src/components/shared/MultiImageUpload.tsx
'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { uploadImage } from '@/services/upload.service';

interface MultiImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function MultiImageUpload({ images, onChange, maxImages = 5 }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxImages) {
      alert(`Vous ne pouvez ajouter que ${maxImages} images maximum.`);
      return;
    }

    setIsUploading(true);

    try {
      const uploadPromises = files.map((file) => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);

      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      alert("Erreur lors de l'envoi de certaines images.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div>
      <input
        type="file"
        accept="image/jpeg, image/png, image/webp"
        multiple
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
        {images.filter(Boolean).map((img, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group border border-gray-200">
            <Image
              src={img}
              alt={`Photo ${index + 1}`}
              fill
              sizes="(max-width: 640px) 33vw, 20vw"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
            {index === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                Principale
              </span>
            )}
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => !isUploading && fileInputRef.current?.click()}
            disabled={isUploading}
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center transition-colors
              ${isUploading 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-gray-300 text-gray-400 hover:border-olive hover:text-olive'}`}
          >
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-olive" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6 mb-1" />
                <span className="text-xs">Ajouter</span>
              </>
            )}
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Ajoutez jusqu'à {maxImages} photos. La première photo sera la photo principale.
      </p>
    </div>
  );
}