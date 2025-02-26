
import { createBooking } from "@/app/actions";
import { CategoryShowcase } from "@/app/components/CategoryShowcase";
import { HomeMap } from "@/app/components/HomeMap";
import { SelectCalendar } from "@/app/components/SelectCalendar";
import { BookingSubmitButton } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/lib/db"
import { useCountries } from "@/app/lib/getCountries";
import { Button } from "@/components/ui/button";
import { PhotoModal } from "@/app/components/PhotoModal";
import { HostelPhotos } from "@/app/components/HostelPhotos";

import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";
import {unstable_noStore as noStore} from "next/cache"

import { Metadata } from 'next';
import { ResolvingMetadata } from 'next';


 async function getData(hostelid: string) {
    noStore();
    const data = await prisma.hostel.findUnique({
        where: {
            id: hostelid,
        },
        select: {
            photos: true,
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

 export interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: any;

 }


  export async function generateMetadata(
    { params, searchParams }: { params: Promise<{ id: string }>; searchParams: any },
    parent: ResolvingMetadata
  ): Promise<Metadata> {
    const resolvedParams = await params;  // ✅ Await params
    const data = await getData(resolvedParams.id);
  
    return {
      title: data?.title || 'Hostel Details',
      description: data?.description || 'View details about this hostel',
    };
  }


export default async function HostelRoute({
    params, searchParams }: PageProps) { 
    
    const userSession = getKindeServerSession(); // ✅ Hook moved outside
    const { getUser } = userSession;
    const user = await getUser();

    const countries = useCountries(); // ✅ Hook moved outside
    const { getCountryByValue } = countries;

    const data = await getData((await params).id);
    const location = getCountryByValue(data?.location as string);
    return (
        <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
      <HostelPhotos photos={data?.photos ?? []} title={data?.title ?? "Hostel"} />
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
                    <input type="hidden" name="hostelId" value={(await params).id} />
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
  
}