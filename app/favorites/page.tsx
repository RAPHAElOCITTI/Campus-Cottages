import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";
import { NoItems } from "../components/Noitems";
import { ListingCard } from "../components/ListingCard";
import { unstable_noStore as noStore } from "next/cache";

// Fetch the user's favorite hostels, including the favorite ID and hostel owner ID
async function getData(userId: string) {
  noStore();
  return await prisma.favorite.findMany({
    where: {
      userId: userId,
    },
    select: {
      id: true, // Include the favorite ID for the current user's favorite entry
      hostel: {
        select: {
          photos: true,
          id: true,
          title: true,
          Favorite: true, // Include all favorites for the hostel (though not filtered by user here)
          price: true,
          location: true,
          latitude: true,
          longitude: true,
          location_name: true, // Added location_name
          description: true,
          UserId: true, // Include the hostel owner's ID for role-specific actions
        },
      },
    },
  });
}

// Fetch the user's role for role-specific rendering in ListingCard
async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role;
}

export default async function FavoriteRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) return redirect("/"); // Redirect unauthenticated users

  const userRole = await getUserRole(user.id); // Get the user's role
  const data = await getData(user.id); // Get the user's favorite hostels

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-2xl font-semibold tracking-tight">Your Favorites</h2>
      {data.length === 0 ? (
        <NoItems
          title="Hey, you don't have any favorites"
          description="Please add favorites to see them..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={`favorite-${item.hostel?.id}`}
              title={item.hostel?.title as string}
              description={item.hostel?.description as string}
              latitude={item.hostel?.latitude}
              longitude={item.hostel?.longitude}
              location_name={item.hostel?.location_name}
              pathName="/favorites"
              hostelId={item.hostel?.id as string}
              imagePaths={item.hostel?.photos as string[]}
              price={item.hostel?.price as number}
              userId={user.id}
              favoriteId={item.id} // Use the favorite ID from the favorite entry
              isInFavoriteList={true} // All hostels here are favorited by the user
              userRole={userRole} // Pass the user's role for role-specific buttons
              hostelUserId={item.hostel?.UserId as string} // Pass the hostel owner's ID
            />
          ))}
        </div>
      )}
    </section>
  );
}