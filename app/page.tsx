
import { MapFilterItems } from "./components/MapFilterItems";
import { prisma } from "./lib/db";
import { ListingCard } from "./components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { NoItems } from "./components/Noitems";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Footer from "./components/CreationBottomBar";
import {unstable_noStore as noStore} from "next/cache"




async function getData({
  searchParams,
  UserId,
}: {
  UserId: string | undefined;
  searchParams?: {
    filter?: string;
    location?: string;
    guests?: string;
    room?: string;
    kitchen?: string;
    bathroom?: string;
  };
}
) {
  noStore ();
  const data = await prisma.hostel.findMany({
    where:{
      addedCategory: true,
      addedLocation: true,
      addedDescription: true,
      categoryName: searchParams?.filter ?? undefined,
      location: searchParams?.location ?? undefined,
      guests: searchParams?.guests ?? undefined,
      rooms: searchParams?.room ?? undefined,
      Kitchen: searchParams?.kitchen ?? undefined,
      bathrooms: searchParams?.bathroom ?? undefined,
    },
    select: {
      title: true,
      photo: true,
      id: true,
      price: true,
      description: true,
      location: true,
      Favorite: {
        where: {
          userId: UserId ?? undefined
        },
      },

    },
  });

  
  
  return data;
}

export default  async function Hostel({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    location?: string;
    guests?: string;
    room?: string;
    kitchen?: string;
    bathroom?: string;
  };
}) {
return (
    <div className="container mx-auto px-5 lg:px-10">
      <MapFilterItems />

<Suspense key= {searchParams?.filter}fallback={<SkeletonLoading/>}>
      <ShowItems searchParams={searchParams}/>
</Suspense>
      
    </div>
  );
}  

async function ShowItems({
  searchParams,
}: {
  searchParams?: {
    filter?: string;
    location?: string;
    guests?: string;
    room?: string;
    kitchen?: string;
    bathroom?: string;
  };
}) {
  const {getUser} = getKindeServerSession()
  const user = await getUser()
  const data = await getData({searchParams: searchParams, UserId: user?.id });

  return(
    <>
    {data.length === 0? (
      <NoItems description="Please check another category or create your own listing!" title="Sorry no listings found for this category..."/>
    ): (
      <div className="grid
    lg:grid-cols-4
    sm:grid-cols-2 
    md:grid-cols-3 
    gap-8
    mt-8">
     {data.map((item) => (
       <ListingCard 
       key={item.id} 
       title={item.title as string}
       description={item.description as string} 
       imagePath={item.photo as string} 
       location={item.location as string}
       price={item.price as number}
       userId={user?.id}
       favoriteId={item.Favorite[0]?.id}
       isInFavoriteList={item.Favorite.length > 0 ? true : false}
       hostelId={item.id}
       pathName="/"
       />
     ))}
   </div>
    )}
    </>
  );
 
}



function SkeletonLoading() {
  return (
    <div className="grid
    lg:grid-cols-4
    sm:grid-cols-2 
    md:grid-cols-3 
    gap-8
    mt-8">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}




