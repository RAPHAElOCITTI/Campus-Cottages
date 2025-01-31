type Hostel = {
  id: string;
  title: string;
  photo: string;
  price: number;
  description: string;
  location: string;
  Favorite: Array<{ id: string }>;
};

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

interface SearchParams {
  filter?: string;
  location?: string;
  guests?: string;
  room?: string;
  kitchen?: string;
  bathroom?: string;
}

interface HostelProps {
  params: { id: string };
  searchParams?: SearchParams;
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
    const data = await prisma.hostel.findMany({
      where: {
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
            userId: UserId ?? undefined,
          },
        },
      },
    });

    // Ensure all required fields are present and not null
    return data.map(hostel => ({
      ...hostel,
      title: hostel.title ?? '',
      photo: hostel.photo ?? '',
      price: hostel.price ?? 0,
      description: hostel.description ?? '',
      location: hostel.location ?? '',
      Favorite: hostel.Favorite || [],
    }));
  } catch (error) {
    console.error("Error fetching hostel data:", error);
    return [];
  } finally {
    console.log("Finished fetching hostel data");
  }
}

export default async function Hostel({
  params, searchParams }: HostelProps) {
  try {
    return (
      <div className="container mx-auto px-5 lg:px-10">
        <MapFilterItems />
        <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
          <ShowItems searchParams={searchParams} />
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
                imagePath={item.photo}
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
