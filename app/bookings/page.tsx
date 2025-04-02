import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/Noitems";
import { prisma } from "../lib/db";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";

async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role;
}

async function getData(userId: string) {
  noStore();
  const data = await prisma.booking.findMany({
    where: { userId: userId },
    select: {
      id: true,
      Hostel: {
        select: {
          id: true,
          location: true,
          latitude: true,
          longitude: true,
          location_name: true,
          title: true,
          photos: true,
          description: true,
          price: true,
          Favorite: true,
          Booking: {
            where: { userId: userId },
          },
        },
      },
    },
  });

  return data;
}

export default async function BookingRoute() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) return redirect("/");

  const userRole = await getUserRole(user.id);
  if (userRole !== "STUDENT") {
    return (
      <section className="container mx-auto px-5 lg:px-10 mt-10">
        <h2 className="text-2xl font-semibold tracking-tight">Your Bookings</h2>
        <p className="mt-4 text-gray-600">Only Students can view bookings.</p>
      </section>
    );
  }

  const data = await getData(user.id);

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-2xl font-semibold tracking-tight">Your Bookings</h2>
      {data.length === 0 ? (
        <NoItems
          title="Hey, you don’t have any bookings"
          description="Please make reservations to see them..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item) => (
            <ListingCard
              key={`booking-${item.Hostel?.id}-${item?.id}`}
              title={item.Hostel?.title as string}
              description={item.Hostel?.description as string}
              latitude={item.Hostel?.latitude}
              longitude={item.Hostel?.longitude}
              location_name={item.Hostel?.location_name}
              pathName="/bookings"
              hostelId={item.Hostel?.id as string}
              imagePaths={item.Hostel?.photos as string[]}
              price={item.Hostel?.price as number}
              userId={user.id}
              favoriteId={item.Hostel?.Favorite[0]?.id as string}
              isInFavoriteList={(item.Hostel?.Favorite.length as number) > 0}
              userRole={userRole}
              hostelUserId={item.Hostel?.id as string} // Simplified; actual UserId not needed here
            />
          ))}
        </div>
      )}
    </section>
  );
}