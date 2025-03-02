"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { PhotoModal } from "@/app/components/PhotoModal";
import { Button } from "@/components/ui/button";

interface HostelPhotosProps {
  photos: string[];
  title: string;
}

export function HostelPhotos({ photos, title }: HostelPhotosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const openModal = (index: number) => {
    setSelectedPhotoIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle horizontal scrolling for mobile
  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      container.classList.add("cursor-grabbing");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseUp = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseLeave = () => {
      isDown = false;
      container.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center text-gray-400">
          <div className="mx-auto mb-2 w-12 h-12 border-2 border-gray-300 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p>No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Primary Large Photo */}
        <div 
          className="relative w-full md:w-2/3 h-72 sm:h-96 md:h-[550px] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl" 
          onClick={() => openModal(0)}
        >
          <Image
            alt={`Primary image of ${title}`}
            src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photos[0]}`}
            fill
            sizes="(max-width: 768px) 100vw, 66vw"
            priority
            className="rounded-xl object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {/* Mobile Horizontal Scroll for Thumbnails */}
        {photos.length > 1 && (
          <div 
            ref={thumbnailContainerRef}
            className="w-full md:w-1/3 flex flex-row md:flex-col gap-3 mt-3 md:mt-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 cursor-grab"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {photos.slice(1, 5).map((photo, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 md:flex-shrink w-36 sm:w-48 md:w-full h-24 sm:h-32 md:h-[130px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => openModal(index + 1)}
              >
                <Image
                  alt={`Thumbnail ${index + 2} of ${title}`}
                  src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photo}`}
                  fill
                  sizes="(max-width: 768px) 33vw, 25vw"
                  className="rounded-xl object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
            
            {/* Show All Photos Button */}
            <Button 
              variant="outline" 
              className="flex-shrink-0 md:flex-shrink w-36 sm:w-48 md:w-full h-24 sm:h-32 md:h-12 md:mt-auto bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-800 hover:bg-white hover:text-black transition-all duration-300 shadow-sm hover:shadow-md rounded-xl"
              onClick={() => openModal(0)}
            >
              {photos.length > 5 ? `View all ${photos.length} photos` : "View all photos"}
            </Button>
          </div>
        )}
      </div>
      
      {/* Photo Modal */}
      {isModalOpen && (
        <PhotoModal
          photos={photos}
          initialPhotoIndex={selectedPhotoIndex}
          onClose={closeModal}
        />
      )}

      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}