import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../lib/db"
import { redirect } from "next/navigation";
import { NoItems } from "../components/Noitems";
import { ListingCard } from "../components/ListingCard";
import {unstable_noStore as noStore} from "next/cache"

async function getData(userId: string) {
    noStore();
    const data = await prisma.hostel.findMany({
     where: {
        UserId: userId,
        addedCategory: true,
        addedDescription: true,
        addedLocation: true,

     },   
     select: {
        id: true,
        location: true,
        photos: true,
        description: true,
        price: true,
        title: true,
        Favorite: {
            where: {
                userId: userId,
            },
        },
     },
     orderBy: {
        createdAT: "desc",
     },
    });

    return data;
}


export default async function MyHostels() {
     const {getUser} = getKindeServerSession();
     const user = await getUser();

    if(!user) {
        return redirect("/");
    }

    const data = await getData(user.id);
    return (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">Your Hostels</h2>

            {data.length === 0 ? (
                <NoItems description="Please list a home on CampusCottages so you can see it here" title="You dont any Hostels listed"/>
            ): (
                <div 
                className="grid 
                lg:grid-cols-4 
                sm:grid-cols-2 
                md:grid-cols-3
                grid-cols-1
                gap-8 mt-8">
                   {data.map((item) => (
                     <ListingCard 
                     key={item.id} 
                     imagePaths={item.photos as string[]}
                     hostelId={item.id}
                     price={item.price as number}
                     description={item.description as string}
                     title={item.title as string}
                     location={item.location as string}
                     userId={user.id}
                     pathName="/my-hostels"
                     favoriteId={item.Favorite[0]?.id}
                     isInFavoriteList={item.Favorite.length > 0 ? true : false}
                     />
                   ))} 
                </div>
            )}
        </section>
    )
}