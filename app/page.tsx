import { Metadata } from "next";
import { MapFilterItems } from "./components/MapFilterItems";
import { prisma } from "./lib/db";
import { ListingCard } from "./components/ListingCard";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { NoItems } from "./components/Noitems";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Footer from "./components/CreationBottomBar";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";

type RoomCategory = {
  id: string;
  name: string;
  price: number;
  availableRooms: number;
};

type Hostel = {
  id: string;
  title: string;
  photos: string[];
  price: number | null;
  description: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  location_name: string | null;
  Favorite: Array<{ id: string }>;
  UserId: string;
  RoomCategory: RoomCategory[];
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

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Campus Cottages",
  description: "View our available hostels",
};

async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role;
}

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
       
        Kitchen: searchParams?.kitchen ?? undefined,
        bathrooms: searchParams?.bathroom ?? undefined,
      },
      select: {
        title: true,
        photos: true,
        id: true,
        price: true,
        description: true,
        location: true,
        // Selecting the newly added latitude and longitude
        latitude: true, // Added latitude
        longitude: true, // Added longitude
        location_name: true, // Added location_name
        UserId: true,
        Favorite: UserId
          ? {
              where: { userId: UserId },
            }
          : undefined,
        Booking: UserId
          ? {
              where: { userId: UserId },
            }
          : undefined,
        RoomCategory: {
          select: {
            id: true,
            name: true,
            price: true,
            availableRooms: true,
          },
        },
      },
    });

    return data.map((hostel) => ({
      id: hostel.id ?? "",
      title: hostel.title ?? "",
      photos: hostel.photos ? (Array.isArray(hostel.photos) ? hostel.photos : [hostel.photos]) : [],
      price: hostel.price, // Can be null now, as we might use room category prices instead
      description: hostel.description ?? "",
      location: hostel.location ?? "",
      latitude: hostel.latitude ?? null,
      longitude: hostel.longitude ?? null,
      location_name: hostel.location_name ?? null,
      Favorite: hostel.Favorite ? hostel.Favorite.map((fav) => ({ id: fav.id })) : [],
      UserId: hostel.UserId,
      RoomCategory: hostel.RoomCategory || [],
    }));
  } catch (error) {
    console.error("Error fetching hostel data:", error);
    return [];
  }
}

export default async function Hostel({ params, searchParams }: HostelProps) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const userRole = user ? await getUserRole(user.id) : null;

    return (
      <div className="container mx-auto px-5 lg:px-10">
        {userRole === "HOSTEL_OWNER" && (
          <Link href="/create" className="block mb-4 text-blue-600 hover:underline">
           
          </Link>
        )}
        <MapFilterItems />
        <Suspense key={searchParams?.filter} fallback={<SkeletonLoading />}>
          <ShowItems searchParams={searchParams} userRole={userRole} userId={user?.id} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error rendering Hostel component:", error);
    return <div>Error loading hostels</div>;
  }
}

async function ShowItems({
  searchParams,
  userRole,
  userId,
}: {
  searchParams?: SearchParams;
  userRole: string | null;
  userId: string | undefined;
}) {
  try {
    const data = await getData({ searchParams, UserId: userId });

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
                latitude={item.latitude}
                longitude={item.longitude}
                location_name={item.location_name}
                price={item.price || undefined}
                roomCategories={item.RoomCategory.map(cat => ({
                  name: cat.name,
                  price: cat.price,
                  availableRooms: cat.availableRooms
                }))}
                userId={userId}
                favoriteId={item.Favorite[0]?.id}
                isInFavoriteList={item.Favorite.length > 0}
                hostelId={item.id}
                pathName="/"
                userRole={userRole}
                hostelUserId={item.UserId}
              />
            ))}
          </div>
        )}
      </>
    );
  } catch (error) {
    console.error("Error loading ShowItems:", error);
    return <div>Error loading items</div>;
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