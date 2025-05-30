"use client";

import Image from "next/image";
import Link from "next/link";
//import { useCountries } from "../lib/getCountries"; //No longer needed
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { addToFavorite, DeleteFromFavorite } from "../actions";
import { useState } from "react";

interface RoomCategoryInfo {
  name: string;
  price: number;
  availableRooms: number;
}

interface iAppProps {
  imagePaths: string[];
  description: string;
 // location: string; // No longer need string location
  latitude: number | null;  // Receive latitude
  longitude: number | null; // Receive longitude
  location_name: string | null; // Add location_name
  price?: number;
  roomCategories?: RoomCategoryInfo[];
  contactPhone?:     string;
  contactEmail?:     string;
  contactWhatsapp?:  string;
  title: string;
  userId: string | undefined;
  isInFavoriteList: boolean;
  favoriteId: string;
  hostelId: string;
  pathName: string;
  userRole: string | null;
  hostelUserId: string;
}

export function ListingCard({
  title,
  description,
  imagePaths,
   // location, // No longer needed
  latitude,
  longitude,
  location_name,
  price,
  roomCategories,
  contactPhone,
  contactEmail,
  contactWhatsapp,
  userId,
  favoriteId,
  isInFavoriteList,
  hostelId,
  pathName,
  userRole,
  hostelUserId,
}: iAppProps) {
   // const { getCountryByValue } = useCountries(); // No longer needed
  // const country = getCountryByValue(location);  // No longer needed
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Determine price display based on room categories if available
  let priceDisplay = "";
  if (roomCategories && roomCategories.length > 0) {
    const minPrice = Math.min(...roomCategories.map(c => c.price));
    const maxPrice = Math.max(...roomCategories.map(c => c.price));
    
    if (minPrice === maxPrice) {
      priceDisplay = `USh ${minPrice.toLocaleString()}`;
    } else {
      priceDisplay = `USh ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
    }
  } else if (price) {
    priceDisplay = `USh ${price.toLocaleString()}`;
  } else {
    priceDisplay = "Price on request";
  }
  
  // Get room availability information
  const totalAvailableRooms = roomCategories 
    ? roomCategories.reduce((sum, category) => sum + category.availableRooms, 0)
    : null;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        {imagePaths.length > 0 ? (
          <Image
            src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${imagePaths[currentImage]}`}
            alt={`Image of ${title}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}

        {imagePaths.length > 1 && (
          <>
            <button
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow text-gray-700 hover:bg-white transition-opacity duration-200 backdrop-blur-sm ${
                isHovering ? "opacity-80" : "opacity-0 md:opacity-0"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentImage((prev) => (prev === 0 ? imagePaths.length - 1 : prev - 1));
              }}
              aria-label="Previous image"
            >
              ◀
            </button>
            <button
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 p-2 rounded-full shadow text-gray-700 hover:bg-white transition-opacity duration-200 backdrop-blur-sm ${
                isHovering ? "opacity-80" : "opacity-0 md:opacity-0"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setCurrentImage((prev) => (prev === imagePaths.length - 1 ? 0 : prev + 1));
              }}
              aria-label="Next image"
            >
              ▶
            </button>
          </>
        )}

        {userId && (
          <div className="z-10 absolute top-3 right-3">
            {isInFavoriteList ? (
              <form action={DeleteFromFavorite}>
                <input type="hidden" name="favoriteId" value={favoriteId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <DeleteFromFavoriteButton />
              </form>
            ) : (
              <form action={addToFavorite}>
                <input type="hidden" name="hostelId" value={hostelId} />
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="pathName" value={pathName} />
                <AddToFavoriteButton />
              </form>
            )}
          </div>
        )}

        {imagePaths.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/40 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
            {currentImage + 1}/{imagePaths.length}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-grow p-4">
        <Link href={`/hostel/${hostelId}`} className="flex flex-col flex-grow">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-lg text-gray-900 line-clamp-1 mb-1">{title}</h3>
          </div>
          <div className="flex items-center text-sm mb-2">
            {location_name ? (
              <span className="line-clamp-1 bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-100 font-medium flex items-center">
                <span className="mr-1">📍</span> {location_name}
              </span>
            ) : (
              <span className="line-clamp-1 text-gray-500">
                <span className="mr-1">📍</span> {latitude && longitude ? 'Precise Location' : 'Location Available'}
              </span>
            )}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-grow">{description}</p>
          <div className="mt-auto pt-3 border-t border-gray-100">
            <p className="flex items-baseline">
              <span className="font-semibold text-lg">{priceDisplay}</span>
              <span className="text-gray-500 text-sm ml-1">/ semester</span>
            </p>
            {roomCategories && (
              <p className="text-sm text-gray-600 mt-1">
                {totalAvailableRooms === 0 
                  ? <span className="text-red-600">Fully booked</span>
                  : `${totalAvailableRooms} room${totalAvailableRooms === 1 ? '' : 's'} available`}
              </p>
            )}
          </div>
        </Link>

        {userRole === "STUDENT" && (
          <Link
            href={`/hostel/${hostelId}`}
            className="mt-2 block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Book Now
          </Link>
        )}

        {userRole === "HOSTEL_OWNER" && userId === hostelUserId && (
          <Link
            href={`/create/${hostelId}/structure`}
            className="mt-2 block text-center bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            Edit Listing
          </Link>
        )}
      </div>
    </div>
  );
}