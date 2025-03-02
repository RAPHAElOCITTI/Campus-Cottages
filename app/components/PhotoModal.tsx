"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

interface PhotoModalProps {
  photos: string[];
  initialPhotoIndex: number;
  onClose: () => void;
}

export function PhotoModal({ photos, initialPhotoIndex, onClose }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [photos.length, isTransitioning]);

  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [photos.length, isTransitioning]);

  // Handle key press (e.g., Escape to close, Arrow keys to navigate)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose, goToPrevious, goToNext]);

  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      // Swiped left, go to next
      goToNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped right, go to previous
      goToPrevious();
    }
    
    // Reset values
    setTouchStartX(0);
    setTouchEndX(0);
  };

  if (!photos || photos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl h-[85vh] rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button
          className="absolute top-4 right-4 z-20 text-white bg-black/50 hover:bg-black/70 rounded-full p-3 transition-all duration-300 transform hover:scale-105"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="relative w-full h-full">
          <Image
            src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photos[currentIndex]}`}
            alt={`Enlarged image ${currentIndex + 1} of hostel`}
            fill
            sizes="100vw"
            className={`object-contain transition-opacity duration-300 ${isTransitioning ? 'opacity-80' : 'opacity-100'}`}
          />
        </div>

        {/* Navigation buttons - larger on desktop, smaller on mobile */}
        <button
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110 z-10"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-2 rounded-full text-sm tracking-wide transition-opacity duration-300">
          {currentIndex + 1} / {photos.length}
        </div>
        
        {/* Thumbnail navigation at bottom for larger screens */}
        <div className="absolute bottom-14 left-0 right-0 hidden sm:flex justify-center">
          <div className="flex space-x-2 px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full overflow-x-auto max-w-full mx-auto scrollbar-hide">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={`relative w-10 h-10 rounded-full overflow-hidden cursor-pointer transition-all duration-300 ${
                  index === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photo}`}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}