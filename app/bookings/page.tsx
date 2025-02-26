import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/Noitems";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";
import {unstable_noStore as noStore} from "next/cache"

async function getData(userId: string) {
    noStore();
    const data = await prisma.booking.findMany ({
        where: {
            userId: userId
        },
            select: {
                id: true, // 👈 Ensure the booking ID is selected
                Hostel: {
                    select: {
                        id: true,
                        location: true,
                        title: true,
                        photos: true,
                        description: true,
                        price: true,
                        Favorite: true,
                        Booking: {
                            where: {
                                userId: userId
                            }
                        }
                    }
                }
            }
    });

    return data;
}

export default async function BookingRoute() {
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    if(!user?.id) return redirect("/");

    const data = await getData(user.id)
    
    return (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Bookings</h2>
        
                    {data.length === 0 ? (
                        <NoItems title="Hey you dont have any bookings" description="Please make Reservations to see them..."/>
                    ): (
                        <div className="grid 
                        lg:grid-cols-4 
                        sm:grid-cols-2 
                        md:grid-cols-3
                        grid-cols-1
                        gap-8 mt-8
                        ">
                            {data.map((item) => (
                            <ListingCard 
                                key={`booking-${item.Hostel?.id}-${item?.id}`} 
                                title={item.Hostel?.title as string}// Add this line
                                description={item.Hostel?.description as string}
                                location={item.Hostel?.location as string}
                                pathName="/favorites"
                                hostelId={item.Hostel?.id as string}
                                imagePaths={item.Hostel?.photos as string[]} // Pass an array of images
                                price={item.Hostel?.price as number}
                                userId={user.id}
                                favoriteId={item.Hostel?.Favorite[0]?.id as string}
                                isInFavoriteList={
                                    (item.Hostel?.Favorite.length as number) > 0 ? true : false
                                }
                                
                                />
                            ))}
                        </div>
                    )}
                </section>
            );
    
}