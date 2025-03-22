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

type Hostel = {
  id: string;
  title: string;
  photos: string[];
  price: number;
  description: string;
  location: string;
  Favorite: Array<{ id: string }>;
  UserId: string;
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
  title: "Hostel Listings",
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
    const resolvedSearchParams = await searchParams;
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
        photos: true,
        id: true,
        price: true,
        description: true,
        location: true,
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
      },
    });

    return data.map((hostel) => ({
      id: hostel.id ?? "",
      title: hostel.title ?? "",
      photos: hostel.photos ? (Array.isArray(hostel.photos) ? hostel.photos : [hostel.photos]) : [],
      price: hostel.price ?? 0,
      description: hostel.description ?? "",
      location: hostel.location ?? "",
      Favorite: hostel.Favorite ? hostel.Favorite.map((fav) => ({ id: fav.id })) : [],
      UserId: hostel.UserId,
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
    const resolvedSearchParams = await searchParams;

    return (
      <div className="container mx-auto px-5 lg:px-10">
        {userRole === "HOSTEL_OWNER" && (
          <Link href="/create" className="block mb-4 text-blue-600 hover:underline">
            List a Hostel
          </Link>
        )}
        <MapFilterItems />
        <Suspense key={resolvedSearchParams?.filter} fallback={<SkeletonLoading />}>
          <ShowItems searchParams={resolvedSearchParams} userRole={userRole} userId={user?.id} />
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
                location={item.location}
                price={item.price}
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