import { createBooking } from "@/app/actions";
import { CategoryShowcase } from "@/app/components/CategoryShowcase";
import { HomeMap } from "@/app/components/HomeMap";
import { RoomCategories } from "@/app/components/RoomCategories";
import { RoomCategoryDisplay } from "@/app/components/RoomCategoryDisplay";
import { SelectCalendar } from "@/app/components/SelectCalendar";
import { BookingSubmitButton } from "@/app/components/SubmitButtons";
import { prisma } from "@/app/lib/db";
//import { MobileMoneyPayment } from "@/app/components/MobileMoneyPayment";
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

// NEW IMPORTS
import { PaymentFormComponent } from "@/app/components/PaymentFormComponent";
import { initiateDarazaPayment } from "@/app/actions";
import { RoomCategory } from "@prisma/client"; // Import RoomCategory type


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
      bathrooms: true,
      Kitchen: true,
      title: true,
      categoryName: true,
      location: true,
      latitude: true,
      longitude: true,
      location_name: true,
      contactPhone: true, // Added contactPhone
      contactEmail: true, // Added contactEmail
      contactWhatsapp: true, // Added contactWhatsapp
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
      RoomCategory: {
        select: {
          id: true,
          name: true,
          price: true,
          availableRooms: true,
          totalRooms: true,
          description: true,
          photos: true,
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
  
  

  // Check user role
  let userRole = null;
  if (user?.id) {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true }
    });
    userRole = dbUser?.role;
  }

   // --- NEW: Check payment status from the database ---
  let hasUserPaid = false;
  if (user?.id) {
    // Implement your logic to check if the user has paid the access fee
    // This could be a separate table, or a field on the User or Hostel table.
    // For demonstration, let's assume a simple check.
    // In a real app, you'd check a `Payment` table for a successful transaction.
    const paymentRecord = await prisma.payment.findFirst({ // Assuming you have a Payment model
        where: {
            userId: user.id,
            hostelId: (await params).id,
            status: 'SUCCESS', // Or 'COMPLETED' or 'APPROVED'
            purpose: 'ACCESS_FEE' // A custom field to identify this specific payment type
        }
    });
    hasUserPaid = !!paymentRecord; // If a record exists, assume they've paid
  }
  // --- END NEW ---

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
            {data?.location_name && (
              <div className="bg-green-50 border border-green-200 rounded-md px-4 py-3 mt-3 inline-block">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">📍</span>
                  <div>
                    <span className="text-base font-medium text-green-700">{data.location_name}</span>
                    <div className="text-xs text-green-600 mt-1">Precise location verified by hostel owner</div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-2">
              <p>{data?.guests} Guests</p>
              <span>·</span>
              <p>{data?.Kitchen} Kitchen</p>
              <span>·</span>
              <p>{data?.bathrooms} Bathrooms</p>
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-normal text-gray-800">
              {data?.RoomCategory && data.RoomCategory.length > 0 
                ? `${Math.min(...data.RoomCategory.map(c => c.price))} - ${Math.max(...data.RoomCategory.map(c => c.price))} USh / sem` 
                : "Price varies by room type"}
            </p>

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
          
          {/* Room Categories */}
          <RoomCategoryDisplay roomCategories={data?.RoomCategory || []} />

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
            {userRole === "STUDENT" ? (
              <>
                {/* Mobile Money Payment Component */}
                {data?.RoomCategory && data.RoomCategory.length > 0 ? (
                  <div className="space-y-6">
                    {/* Room Categories Selection */}
                    <RoomCategories roomCategories={data.RoomCategory} />
                    
                    <Separator className="my-4" />

                     {/* Conditional rendering based on payment status */}
                    {hasUserPaid ? (
                      // --- Show Contact Info and Booking Form after payment ---
                      <div className="dynamic-payment-section" id="payment-section">
                        <div className="border rounded-lg p-4 mb-4">
                          <h3 className="font-medium mb-2">
                            Hostel Owner Contact Information
                          </h3>
                          <p className="text-sm text-green-600 mb-3">
                            Payment confirmed! You can now contact the owner and book.
                          </p>
                          <div className="space-y-2 text-sm">
                            <p>
                              <strong>Phone:</strong>{" "}
                              {data?.contactPhone || "Not provided"}
                            </p>
                            {data?.contactEmail && (
                              <p>
                                <strong>Email:</strong> {data.contactEmail}
                              </p>
                            )}
                            {data?.contactWhatsapp && (
                              <p>
                                <strong>WhatsApp:</strong> {data.contactWhatsapp}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Dates section (always visible) */}
                        <div className="space-y-4">
                          <SelectCalendar booking={data?.Booking} />
                        </div>

                        {/* Booking button (now enabled) */}
                        <div className="mt-4">
                          <form action={createBooking}>
                            <input type="hidden" name="hostelId" value={(await params).id} />
                            <input type="hidden" name="userId" value={user?.id} />
                            {/* The selected category ID should be passed from RoomCategories client component. */}
                            {/* This would require a client-side state in RoomCategories and an effect to update a hidden input */}
                            {/* For simplicity here, assuming `RoomCategories` handles updating a form element, 
                                or you pass `selectedCategoryId` via a client component prop. */}
                            <input type="hidden" name="roomCategoryId" id="selected-category-id" value={searchParams?.roomCategoryId || ''} />

                            <BookingSubmitButton /> {/* Your existing submit button */}
                          </form>
                        </div>
                      </div>
                    ) : (
                      // --- Show Payment Form if not paid ---
                      <PaymentFormComponent
                        hostelId={(await params).id}
                        // These would come from the user's selection in RoomCategories,
                        // which would need to update searchParams or a client-side state
                        // For now, these are placeholders. A robust solution needs client-side state in RoomCategories
                        // or passing these via URL search params
                        selectedRoomCategoryId={searchParams?.roomCategoryId || ""} // Get from URL or client-side state
                        selectedRoomPrice={parseFloat(searchParams?.roomPrice || "0")} // Get from URL or client-side state
                        initiateDarazaPayment={initiateDarazaPayment} // Pass the server action
                        onPaymentSuccess={() => {
                          // This function will be called on the client side.
                          // To re-render the server component with the new `hasUserPaid` status,
                          // you'd typically need to trigger a revalidation (e.g., via `router.refresh()` from `next/navigation`).
                          // This would require this component to be a client component, or
                          // the `onPaymentSuccess` to trigger a redirect or invalidate cache from an action.
                          // For now, we'll assume a client-side component would handle this better,
                          // or the user would refresh the page.
                          console.log("Payment success, page refresh might be needed to see changes.");
                          // In a real app: router.refresh() if this was a client component.
                          // For now, the user might need to refresh the page to see the contact info.
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-amber-600 bg-amber-50 p-3 rounded-md mb-4">
                    No room categories are currently available for this hostel.
                  </div>
                )}
              </>
            ) : userRole === "HOSTEL_OWNER" ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700">Hostel Owner Account</h3>
                  <p className="text-blue-600 mt-2">As a hostel owner, you can list your own hostels instead of booking.</p>
                </div>
                <Link 
                  href="/my-hostels" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors block text-center"
                >
                  Manage My Hostels
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">Sign in to book this hostel</p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-md transition-colors"
                  asChild
                >
                  <Link href="/api/auth/login">Sign In</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}