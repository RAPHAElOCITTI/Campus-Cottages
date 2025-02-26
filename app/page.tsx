

import { Metadata } from 'next';
import { MapFilterItems } from "./components/MapFilterItems";
import { prisma } from "./lib/db";
import { ListingCard } from "./components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { NoItems } from "./components/Noitems";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Footer from "./components/CreationBottomBar";
import { unstable_noStore as noStore } from "next/cache";


type Hostel = {
  id: string;
  title: string;
  photos: string[];
  price: number;
  description: string;
  location: string;
  Favorite: Array<{ id: string }>;
};

interface SearchParams {
  filter?: string;
  location?: string;
  guests?: string;
  room?: string;
  kitchen?: string;
  bathroom?: string;
}

interface HostelProps {
  params: Promise<{ id: string }>;
    searchParams?: any;
}

export const metadata: Metadata = {
  title: 'Hostel Listings',
  description: 'View our available hostels',
};

async function getData({
  searchParams,
  UserId,
}: {
  UserId: string | undefined;
  searchParams?: SearchParams;
}): Promise<Hostel[]> {
  noStore();
  try {

    // Await searchParams here
    const resolvedSearchParams = await searchParams;
    console.log("Resolved search params:", resolvedSearchParams);

    const data = await prisma.hostel.findMany({
      where: {
        addedCategory: true,
        addedLocation: true,
        addedDescription: true,
        categoryName: resolvedSearchParams?.filter ?? undefined,
        location: resolvedSearchParams?.location ?? undefined,
        guests: resolvedSearchParams?.guests ?? undefined,
        rooms: resolvedSearchParams?.room ?? undefined,
        Kitchen: resolvedSearchParams?.kitchen ?? undefined,
        bathrooms: resolvedSearchParams?.bathroom ?? undefined,
      },
      select: {
        title: true,
        photos: true, //Fetching multiple photos
        id: true,
        price: true,
        description: true,
        location: true,
        Favorite: true,
        Booking: UserId
        ? {
            where: {
              userId: UserId,
            },
          }
          : undefined,
        },
      
    });

    
    // Ensure all required fields are present and not null
    return data.map(hostel => ({
     
     
      id: hostel.id ?? '',
      title: hostel.title ?? '',
      photos: hostel.photos ? (Array.isArray(hostel.photos) ? hostel.photos : [hostel.photos]) :[],
      price: hostel.price ?? 0,
      description: hostel.description ?? '',
      location: hostel.location ?? '',
      Favorite: hostel.Favorite ? hostel.Favorite.map(fav => ({ id: fav.id })) : [], // Map to only id
    }));

 
  } catch (error) {
    console.error("Error fetching hostel data:", error);
    return [];
  } finally {
    console.log("Finished fetching hostel data");
  }
}

export default async function Hostel({
  params, 
  searchParams
 }: HostelProps) {
  try {

    // Await searchParams here as well
    const resolvedSearchParams = await searchParams;

    return (
      <div className="container mx-auto px-5 lg:px-10">
        <MapFilterItems />
        <Suspense key={resolvedSearchParams?.filter} fallback={<SkeletonLoading />}>
          <ShowItems searchParams={resolvedSearchParams} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error rendering Hostel component:", error);
    return <div>Error loading hostels</div>;
  } finally {
    console.log("Finished rendering Hostel component");
  }
}

async function ShowItems({ searchParams }: { searchParams?: SearchParams }) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const data = await getData({ searchParams, UserId: user?.id });

    return (
      <>
        {data.length === 0 ? (
          <NoItems
            description="Please check another category or create your own listing!"
            title="Sorry, no listings found for this category..."
          />
        ) : (
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
            {data.map((item: Hostel) => (
              <ListingCard
                key={item.id}
                title={item.title}
                description={item.description}
                imagePaths={item.photos}
                location={item.location}
                price={item.price}
                userId={user?.id}
                favoriteId={item.Favorite[0]?.id}
                isInFavoriteList={item.Favorite.length > 0}
                hostelId={item.id}
                pathName="/"
              />
            ))}
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading ShowItems:", error);
    return <div>Error loading items</div>;
  } finally {
    console.log("Finished rendering ShowItems");
  }
}

function SkeletonLoading() {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-8">
      {[...Array(7)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
