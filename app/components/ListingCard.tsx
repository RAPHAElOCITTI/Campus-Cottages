"use client";

import Image from "next/image";
import Link from "next/link";
import { useCountries } from "../lib/getCountries";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { addToFavorite, DeleteFromFavorite } from "../actions";
import { useState } from "react";



interface iAppProps {
    imagePaths: string[];
    description: string;
    location: string;
    price: number;
    title: string;
    userId: string | undefined;
    isInFavoriteList: boolean;
    favoriteId: string;
    hostelId: string;
    pathName: string;
    
}

export function ListingCard({
    title,
    description, 
    imagePaths, 
    location, 
    price,
    userId,
    favoriteId,
    isInFavoriteList,
    hostelId,
    pathName,
}: iAppProps) {
    const {getCountryByValue} = useCountries()
    const country = getCountryByValue(location);
    const [currentImage, setCurrentImage] = useState(0);
    
    const handlePrevImage = () => {
      setCurrentImage((prevIndex) =>
          prevIndex === 0? imagePaths.length - 1: prevIndex - 1,
      );
  };

  const handleNextImage = () => {
      setCurrentImage((prevIndex) =>
          prevIndex === imagePaths.length - 1? 0: prevIndex + 1,
      );
  };

    console.log(country);

    return (
        <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="relative w-full h-56">
            {imagePaths.length > 0 && ( // Check if there are any images
                    <Image
                        src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${imagePaths[currentImage]}`} // Use currentImage index
                        alt="Image of Hostel"
                        fill
                        className="rounded-lg h-full object-cover mb-3"
                        />
            )}

            {imagePaths.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
              onClick={() => setCurrentImage((prev) => (prev === 0 ? imagePaths.length - 1 : prev - 1))}
            >
              ◀
            </button>
            <button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 p-2 rounded-full"
              onClick={() => setCurrentImage((prev) => (prev === imagePaths.length - 1 ? 0 : prev + 1))}
            >
              ▶
            </button>
          </>
        )}

               

            {userId && (
                <div className="z-10 absolute top-2 right-2">
                    {isInFavoriteList ? (
                        <form action={DeleteFromFavorite}>
                            <input type="hidden" name="favoriteId" value={favoriteId}/>
                            <input type="hidden" name="userId" value={userId}/>
                            <input type="hidden" name="pathName" value={pathName}/>
                            <DeleteFromFavoriteButton />
                        </form>

                       ): ( 
                        <form action={addToFavorite}>
                            <input type="hidden" name="hostelId" value={hostelId}/>
                            <input type="hidden" name="userId" value={userId}/>
                            <input type="hidden" name="pathName" value={pathName}/>
                            <AddToFavoriteButton />
                        </form>
                    )}

                </div>
            )}
            </div>
            <Link href={`/hostel/${hostelId}`} className="mt-2">
                <h3 className="font-medium text-base">
                    {title}
                </h3>
               <p className="text-muted-foreground text-sm line-clamp-2">{description}</p> 
               <p className="pt-2 text-muted-foreground">
                <span className="font-medium text-black">Ush{price}</span> Semester
               </p>
            </Link>

        </div>
        
    );

  
}