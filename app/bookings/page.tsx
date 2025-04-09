import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ListingCard } from "../components/ListingCard";
import { BookingDetails } from "../components/BookingDetails";
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
      startDate: true,
      endDate: true,
      createdAt: true,
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
          Favorite: true,
          Booking: {
            where: { userId: userId },
          },
          RoomCategory: {
            select: {
              id: true,
              name: true,
              price: true,
              availableRooms: true,
              totalRooms: true,
            },
          },
        },
      },
      RoomCategory: {
        select: {
          id: true,
          name: true,
          price: true,
          description: true,
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
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6 mt-8">
          {data.map((item) => (
            <BookingDetails
              key={`booking-${item.id}`}
              startDate={item.startDate}
              endDate={item.endDate}
              hostelTitle={item.Hostel?.title}
              roomCategoryName={item.RoomCategory?.name}
              roomCategoryPrice={item.RoomCategory?.price}
              createdAt={item.createdAt}
            />
          ))}
        </div>
      )}
    </section>
  );
}