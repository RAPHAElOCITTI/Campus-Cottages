import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";
import { NoItems } from "../components/Noitems";
import { ListingCard } from "../components/ListingCard";
import {unstable_noStore as noStore} from "next/cache"

async function getData(userId: string) {
    noStore();
     return await prisma.favorite.findMany({
       where: {
            userId: userId
       },
       select: {
        hostel: {
            select: {
                photo: true,
                id: true,
                title: true,
                Favorite: true,
                price: true,
                location: true,
                description: true,
            },
        },
       },
     });
}


export default async function FavoriteRoute() {
            const {getUser} = getKindeServerSession();
            const user = await getUser();
            if(!user) return redirect("/");
        const data = await getData(user.id);


    return (
        <section className="container mx-auto px-5 lg:px-10 mt-10">
            <h2 className="text-2xl font-semibold tracking-tight">Your Favorites</h2>

            {data.length === 0 ? (
                <NoItems title="Hey you dont have any favorites" description="Please add favorites to see them..."/>
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
                        key={`favorite
                            -${item.hostel?.id}`} 
                        title={item.hostel?.title as string}// Add this line
                        description={item.hostel?.description as string}
                        location={item.hostel?.location as string}
                        pathName="/favorites"
                        hostelId={item.hostel?.id as string}
                        imagePath={item.hostel?.photo as string}
                        price={item.hostel?.price as number}
                        userId={user.id}
                        favoriteId={item.hostel?.Favorite[0].id as string}
                        isInFavoriteList={item.hostel?.Favorite.length as number> 0 ? true : false}
                        
                        />
                    ))}
                </div>
            )}
        </section>
    );
}