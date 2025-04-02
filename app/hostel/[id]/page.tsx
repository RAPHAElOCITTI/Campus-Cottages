import { createBooking } from "@/app/actions";
import { CategoryShowcase } from "@/app/components/CategoryShowcase";
import { HomeMap } from "@/app/components/HomeMap";
import { SelectCalendar } from "@/app/components/SelectCalendar";
import { BookingSubmitButton } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/lib/db";
import { useCountries } from "@/app/lib/getCountries";
import { Button } from "@/components/ui/button";
import { PhotoModal } from "@/app/components/PhotoModal";
import { HostelPhotos } from "@/app/components/HostelPhotos";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { Metadata, ResolvingMetadata } from "next";

// Define getData function
async function getData(hostelid: string) {
  noStore();
  const data = await prisma.hostel.findUnique({
    where: {
      id: hostelid,
    },
    select: {
      photos: true,
      description: true,
      guests: true,
      rooms: true,
      bathrooms: true,
      Kitchen: true,
      title: true,
      categoryName: true,
      price: true,
      location: true,
      latitude: true,
      longitude: true,
      Booking: {
        where: {
          hostelId: hostelid,
        },
      },
      User: {
        select: {
          ProfileImage: true,
          firstName: true,
        },
      },
    },
  });

  return data;
}

// Define PageProps interface
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: any;
}

export async function generateMetadata(
  { params, searchParams }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getData(resolvedParams.id);

  return {
    title: data?.title || "Hostel Details",
    description: data?.description || "View details about this hostel",
  };
}

export default async function HostelRoute({ params, searchParams }: PageProps) {
  const userSession = getKindeServerSession();
  const { getUser } = userSession;
  const user = await getUser();

  const countries = useCountries();
  const { getCountryByValue } = countries;

  const data = await getData((await params).id);
  const location = getCountryByValue(data?.location as string);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-16">
      {/* Title Section */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-6 tracking-tight">
        {data?.title}
      </h1>

      {/* Photos Section */}
      <div className="mb-8">
        <HostelPhotos photos={data?.photos ?? []} title={data?.title ?? "Hostel"} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Location and Stats */}
          <div>
            <h3 className="text-2xl font-medium text-gray-800">
              {location?.flag} {location?.label} / {location?.region}
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
              <p>{data?.guests} Guests</p>
              <span>·</span>
              <p>{data?.rooms} Rooms</p>
              <span>·</span>
              <p>{data?.Kitchen} Kitchen</p>
              <span>·</span>
              <p>{data?.bathrooms} Bathrooms</p>
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-normal text-gray-800">{data?.price} USh / sem</p>

          </div>

          {/* Host Info */}
          <div className="flex items-center bg-gray-50 p-4 rounded-lg">
            <Image
              src={
                data?.User?.ProfileImage ??
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6LXNJFTmLzCoExghcATlCWG85kI8dsnhJng&s"
              }
              alt="User Profile"
              className="w-12 h-12 rounded-full object-cover"
              width={48}
              height={48}
            />
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Hosted by {data?.User?.firstName}</h3>
              <p className="text-sm text-gray-500">Host since 2024</p>
            </div>
          </div>

          <Separator className="my-2" />

          

          {/* Category */}
          <CategoryShowcase categoryName={data?.categoryName as string} />

          <Separator className="my-2" />

          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{data?.description}</p>

          <Separator className="my-2" />

          {/* Map */}
          <div className="rounded-lg overflow-hidden">
            <HomeMap 
              locationValue={location?.value as string}
              latitude={data?.latitude}
              longitude={data?.longitude} 
            />
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <form action={createBooking} className="space-y-6">
              <input type="hidden" name="hostelId" value={(await params).id} />
              <input type="hidden" name="userId" value={user?.id} />

              <div className="space-y-4">
                <SelectCalendar booking={data?.Booking} />
              </div>

              {user?.id ? (
                <BookingSubmitButton />
              ) : (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
                  asChild
                >
                  <Link href="/api/auth/login">Make a Booking Reservation</Link>
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}