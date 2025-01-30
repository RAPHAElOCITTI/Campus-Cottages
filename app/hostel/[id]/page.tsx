import { createBooking } from "@/app/actions";
import { CategoryShowcase } from "@/app/components/CategoryShowcase";
import { HomeMap } from "@/app/components/HomeMap";
import { SelectCalendar } from "@/app/components/SelectCalendar";
import { BookingSubmitButton } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/lib/db"
import { useCountries } from "@/app/lib/getCountries";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";
import {unstable_noStore as noStore} from "next/cache"

 async function getData(hostelid: string) {
    noStore();
    const data = await prisma.hostel.findUnique({
        where: {
            id: hostelid,
        },
        select: {
            photo: true,
            description: true,
            guests: true,
            rooms: true,
            bathrooms: true,
            Kitchen: true,
            title: true,
            categoryName: true,
            price: true,
            location: true,
            Booking: {
                where: {
                    hostelId: hostelid,
                },
            },
            User: {
                select: {
                  ProfileImage: true,  
                  firstName: true,

                },
            },

        },
    });

    return data; 
 }


 export default function HostelRoute({ params }: { params: { id: string } }) {
    return new Promise<any>((resolve, reject) => {
      console.log("Fetching hostel data...");
  
      const userSession = getKindeServerSession();
      const { getUser } = userSession;
  
      Promise.all([getUser(), getData(params.id)])
        .then(([user, data]) => {
          console.log("User and data resolved:", user, data);
  
          const countries = useCountries();
          const { getCountryByValue } = countries;
          const location = getCountryByValue(data?.location as string);
    return (
        <div className="w-[75%] mx-auto mt-10 mb-12">
            <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
            <div className="relative h-[550px]">
                <Image 
                alt="Image of Hostels"
                src={`https://reikgvkfmbabfnguexdi.supabase.co/storage/v1/object/public/images/${data?.photo}`}
                fill
            className="rounded-lg h-full object-cover w-full"
                />
            </div>
            <div className="flex justify-between gap-x-24 mt-8">
                <div className="w-2/3">
                    <h3 className="text-xl font-medium">
                        {location?.flag} {location?.label} / {location?.region}
                    </h3>
                    <div className="flex gap-x-2 text-muted-foreground">
                        <p>{data?.guests} Guests</p> * <p>{data?.rooms} Rooms</p> * <p>{data?.Kitchen} Kitchen</p> * <p>{data?.bathrooms} Bathrooms</p>

                    </div>

                    <div className="flex items-center mt-6">
                        <Image 
                        src={data?.User?.ProfileImage ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s"}
                         alt="User Profile" 
                         className="w-11 h-11 rounded-full"
                         width={11} height={11}
                         />
                         <div className="flex flex-col ml-4">
                            <h3 className="font-medium">Hosted by {data?.User?.firstName}</h3>
                            <p className="text-sm text-muted-foreground">Host since 2024</p>

                         </div>
                    </div>

                    <Separator className="my-7"/>

                    <CategoryShowcase categoryName={data?.categoryName as string}/>

                    <Separator className="my-7" />

                    <p className="text-muted-foreground">{data?.description}</p>

                    <Separator className="my-7"/>

                    <HomeMap locationValue={location?.value as string} />
                </div>

                <form action={createBooking}>
                    <input type="hidden" name="hostelId" value={params.id} />
                    <input type="hidden" name="userId" value={user?.id} />

                    <SelectCalendar booking={data?.Booking} />

                    

                    {user?.id ? (
                        <BookingSubmitButton />
                    ): (
                        <Button className="w-full" asChild >
                            <Link href="/api/auth/login">Make a Booking Reservation</Link>
                        </Button>
                    )}

                        
                </form>

            </div>
        </div>
    );
});
    });
}
