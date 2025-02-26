"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface PhotoModalProps {
  photos: string[];
  initialPhotoIndex: number;
  onClose: () => void;
}

export function PhotoModal({ photos, initialPhotoIndex, onClose }: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);

  // Handle key press (e.g., Escape to close, Arrow keys to navigate)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [photos, onClose]);

  if (!photos || photos.length === 0) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-[90%] max-w-4xl h-[80vh] bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
          onClick={onClose}
        >
          ✕
        </button>
        <Image
          src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${photos[currentIndex]}`}
          alt={`Enlarged image ${currentIndex + 1} of hostel`}
          fill
          className="object-contain"
        />
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          onClick={() =>
            setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1))
          }
        >
          ◀
        </button>
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-2 rounded-full"
          onClick={() =>
            setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1))
          }
        >
          ▶
        </button>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 p-2 rounded">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}