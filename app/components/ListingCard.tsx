import Image from "next/image";
import Link from "next/link";
import { useCountries } from "../lib/getCountries";
import { AddToFavoriteButton, DeleteFromFavoriteButton } from "./SubmitButtons";
import { addToFavorite, DeleteFromFavorite } from "../actions";



interface iAppProps {
    imagePath: string;
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
    imagePath, 
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
    
    console.log(country);

    return (
        <div className="flex flex-col">
            <div className="relative h-72">
               <Image 
               src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${imagePath}`}
               alt="Image of Hostel" 
               fill 
               className="rounded-lg h-full object-cover mb-3" 
               /> 

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