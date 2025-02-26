"use client";

import { useState } from "react";
import Image from "next/image";
import { PhotoModal } from "@/app/components/PhotoModal"; // Import the modal
import { Button } from "@/components/ui/button";

interface HostelPhotosProps {
  photos: string[];
  title: string;
}

export function HostelPhotos({ photos, title }: HostelPhotosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!photos || photos.length === 0) {
    return <p>No photos available</p>;
  }

  return (
    <div className="flex gap-4 mb-8">
      {/* Primary Large Photo (First Photo) */}
      <div className="relative w-2/3 h-[550px] rounded-lg overflow-hidden cursor-pointer" onClick={() => openModal(0)}>
        <Image
          alt={`Primary image of ${title}`}
          src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photos[0]}`}
          fill
          className="rounded-lg h-full object-cover"
        />
      </div>
      {/* Thumbnails (Remaining Photos) */}
      {photos.length > 1 && (
        <div className="w-1/3 flex flex-col gap-4">
          {photos.slice(1).map((photo, index) => (
            <div
              key={index}
              className="relative h-[130px] rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openModal(index + 1)}
            >
              <Image
                alt={`Thumbnail ${index + 2} of ${title}`}
                src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photo}`}
                fill
                className="rounded-lg h-full object-cover"
              />
            </div>
          ))}
          {/* "Show all photos" Button/Link (Optional, static for now) */}
          <Button variant="outline" className="mt-2 w-full">
            Show all photos
          </Button>
        </div>
      )}
      {isModalOpen && (
        <PhotoModal
          photos={photos}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={closeModal}
        />
      )}
    </div>
  );
}