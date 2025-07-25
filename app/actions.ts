/* "use server";

import { redirect } from "next/navigation";

import { supabase } from "./lib/supabase";
import React from "react";
import { revalidatePath } from "next/cache";
import { prisma } from "./lib/db";




export async function  createcampuscottagesHostel({userId}: {userId: string }) {
    const data = await prisma.hostel.findFirst({
        where: {
            UserId: userId
        },
       orderBy: {
            createdAT: "desc",
       },
    });

    if (data === null) {
        const data = await prisma.hostel.create({
            data: {
                UserId: userId
            },
        });
        return redirect(`/create/${data.id}/structure`);
    } else if(
        !data.addedCategory && 
        !data.addedDescription && 
        !data.addedLocation
    ){
        return redirect(`/create/${data.id}/structure`);
    }else if(
        data.addedCategory && 
        !data.addedDescription
    ) {
        return redirect(`/create/${data.id}/description`);
    }else if(
        data.addedCategory && 
        data.addedDescription && 
        !data.addedLocation
    ) {
        return redirect(`/create/${data.id}/address`);
    }else if(
        data.addedCategory && 
        data.addedDescription && 
        data.addedLocation 
    ) {
        const data = await prisma.hostel.create({
            data: {
                UserId: userId
            },
        });
        return redirect(`/create/${data.id}/structure`);
    }
    
    
}

export async function createCategoryPage(formData: FormData){
    const categoryName = formData.get("categoryName") as string;
    const hostelId = formData.get("hostelId") as string;
    const data = await prisma.hostel.update({
        where: {
            id: hostelId,
        },
        data: {
            categoryName: categoryName,
            addedCategory: true,
        },
    });

    return redirect(`/create/${hostelId}/description`);
}

 

export async function CreateDescription (formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price');
    const imageFile = formData.get('imageFile') as File;

    // Check if imageFile is null or undefined

    if (!imageFile) {
        throw new Error("No file was uploaded. Please select an image file.");
      }

    

    const hostelId = formData.get('hostelId') as string;

    const guestNumber = formData.get('guest') as string;
    const roomNumber = formData.get('room') as string;
    const kitchenNumber = formData.get('kitchen') as string;
    const bathroomNumber = formData.get('bathroom') as string;
    
    const user = await supabase.auth.getUser();

if (!user) {
    throw new Error("User is not authenticated.");
}




// Check if imageFile is null or undefined

  

    const uniqueFileName = `${imageFile.name}-${new Date()}`;
    const { data: imageData, error: uploadError } = await supabase.storage
    .from("images")
    .upload(uniqueFileName ,
     imageFile,
        {
            cacheControl: "2592000",
            contentType: "image/png",
        }
    );

    console.log("Image File Details:", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });
      
      if (!imageFile) {
        throw new Error("Invalid image file. Please select a valid file.");
      }
      
        
    // Handle upload error
if (uploadError) {
  console.error("Image upload failed:", uploadError.message);
  throw new Error("Image upload failed. Please try again.");
}

// Check if imageData is valid
if (!imageData || !imageData.path) {
  throw new Error("Invalid image upload response from Supabase.");
}
        const data = await prisma.hostel.update({
            where: {
                id: hostelId,
            },
            data: {
                title: title,
                description: description,
                price: Number(price),
                rooms: roomNumber,
                Kitchen: kitchenNumber,
                bathrooms: bathroomNumber,
                guests: guestNumber,
                photo: imageData?.path,
                addedDescription: true,
            },
        });
        
        return redirect(`/create/${hostelId}/address`);
    
}

export async function createLocation(formData: FormData) {
    const hostelId = formData.get("hostelId") as string;
    const countryValue  = formData.get("countryValue") as string;
     const data = await prisma.hostel.update({
        where: {
            id: hostelId,
        },
        data: {
            addedLocation: true,
            location: countryValue,
        },
     });
     return redirect("/");
}

export async function addToFavorite(formData: FormData) {
   const hostelId = formData.get("hostelId") as string;
   const userId = formData.get("userId") as string;
   const pathName = formData.get("pathName") as string;

   const data = await prisma.favorite.create({
    data: {
        hostelId: hostelId,
        userId: userId,
    }
   });

   revalidatePath(pathName); 
}

export async function DeleteFromFavorite(formData: FormData) {
    const favoriteId = formData.get("favoriteId") as string;
    const pathName = formData.get("pathName") as string;
    const userId = formData.get("userId") as string;
    
    const data = await prisma.favorite.delete({
        where: {
            id: favoriteId,
            userId: userId,
        },
    });

    revalidatePath(pathName);
}

export async function createBooking(formData: FormData) {
    const userId = formData.get("userId") as string;
    const hostelId = formData.get("hostelId") as string;
    const startDate = formData.get("startDate") as string;
    const endDate = formData.get("endDate") as string;
    
    if (!userId || !hostelId || !startDate || !endDate) {
        throw new Error("All fields (userId, hostelId, startDate, endDate) are required.");
      }
    
      // Convert startDate and endDate to JavaScript Date objects
      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);
    
      // Validate date conversion
      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        throw new Error("Invalid date format. Ensure startDate and endDate are valid ISO-8601 strings.");
      }
    
      // Ensure startDate is before endDate
      if (parsedStartDate >= parsedEndDate) {
        throw new Error("startDate must be earlier than endDate.");
      }


    const data = await prisma.booking.create({
        data: {
            userId: userId,
            endDate: parsedEndDate,
            startDate:  parsedStartDate,
            hostelId: hostelId,
        },
    });

    return redirect("/");
} */

   "use server";

import { redirect } from "next/navigation";
import { PaymentService } from "daraza";
import { prisma } from "./lib/db";
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";
import MyComponent from "@/app/UploadHandling"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const paymentService = new PaymentService({
  apiKey: process.env.DARAZA_API_KEY || "EVZZFvuH.lfW22OJsMsVXrt5A4JrJoCkkDWEA4Yss",
});

// A server action to handle the payment request
export async function initiateDarazaPayment(
  hostelId: string,
  roomCategoryId: string,
  amount: number,
  phone: string
): Promise<{ success: boolean; message: string }> {
  try {
    // --- NEW: Phone Number Formatting ---
    // Remove leading country code (256 or +256) and leading zero (0) if present
    let formattedPhone = phone.trim();
    if (formattedPhone.startsWith('+256')) {
      formattedPhone = formattedPhone.substring(4); // Remove +256
    } else if (formattedPhone.startsWith('256')) {
      formattedPhone = formattedPhone.substring(3); // Remove 256
    } else if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.substring(1); // Remove leading 0
    }

    // After removing prefixes, ensure it's exactly 9 digits
    // You might want to add more robust validation here, e.g., checking if it's numeric
    if (formattedPhone.length !== 9 || !/^\d+$/.test(formattedPhone)) {
        throw new Error("Phone number must be exactly 9 digits after country code/leading zero removal.");
    }
    // --- END NEW ---

    // Validate phone number and amount using the Daraza library with formatted number
    const validatedPhone = paymentService.validatePhoneNumber(formattedPhone);
    const validatedAmount = paymentService.validateAmount(amount);

    // Prepare payment data
    const paymentData = {
      method: 1, // Assuming '1' is the correct method for mobile money based on your curl example
      amount: validatedAmount,
      phone: validatedPhone,
      note: `Hostel booking fee for hostel: ${hostelId}, room: ${roomCategoryId}`,
    };

    console.log("Attempting Daraza payment with:", paymentData);

    // Request to pay
    const response = await paymentService.requestToPay(paymentData);

    console.log("Daraza Payment Response:", response);

    if (response.code === "Success") {
      // Here you would typically also:
      // 1. Save payment status to your database (e.g., mark it as 'initiated' or 'pending')
      // 2. Associate the payment with the user, hostel, and room category
      // 3. Implement a webhook or polling mechanism to confirm final payment status from Daraza
      //    (this is crucial for actual production systems)

      // You should save a record of this initiated payment in your database here
      // For example, to track status or link to the user/hostel.
      await prisma.payment.create({
        data: {
          userId: (await getKindeServerSession().getUser())?.id || "unknown", // Get current user ID
          hostelId: hostelId,
          roomCategoryId: roomCategoryId,
          amount: amount,
          phoneNumber: phone, // Store the original phone number
          status: 'PENDING', // Mark as pending until webhook/polling confirms
          purpose: 'ACCESS_FEE', // Custom field to identify this payment purpose
        },
      });

      return {
        success: true,
        message:
          "Payment initiated successfully! Please approve the payment on your phone.",
      };
    } else {
      // Handle different error codes from Daraza API if available
      return {
        success: false,
        message: `Payment failed: ${response.details || "Unknown error"}`,
      };
    }
  } catch (error: any) {
    console.error("Daraza payment action error:", error);
    return {
      success: false,
      message: `Payment processing error: ${error.message || "An unexpected error occurred."}`,
    };
  }
}

export async function createcampuscottagesHostel({ userId }: { userId: string }) {
  // Check user's role or automatically set to HOSTEL_OWNER for this flow
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, id: true },
  });

  if (!user) {
    throw new Error("User not found. Please sign in first.");
  }
  
  // If user is not a hostel owner, update their role
  if (user.role !== "HOSTEL_OWNER") {
    await prisma.user.update({
      where: { id: userId },
      data: { role: "HOSTEL_OWNER" },
    });
    // *** ADDED: Revalidate path after role change ***
    revalidatePath('/'); // Assuming UserNav is rendered on the root path or a layout that includes it
  }

  // Create a new hostel to start the flow immediately
  const newHostel = await prisma.hostel.create({
    data: { UserId: userId },
  });
  
  // Redirect directly to structure page
  return redirect(`/create/${newHostel.id}/structure`);
}

export async function createCategoryPage(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const hostelId = formData.get("hostelId") as string;

  // Check ownership
  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
    select: { UserId: true },
  });

  if (!hostel || hostel.UserId !== user?.id) {
    throw new Error("You are not authorized to update this listing.");
  }

  const categoryName = formData.get("categoryName") as string;
  await prisma.hostel.update({
    where: { id: hostelId },
    data: { categoryName: categoryName, addedCategory: true },
  });

  return redirect(`/create/${hostelId}/rooms`);
}

export async function addRoomCategories(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const hostelId = formData.get("hostelId") as string;

  // Check ownership
  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
    select: { UserId: true },
  });

  if (!hostel || hostel.UserId !== user?.id) {
    throw new Error("You are not authorized to update this listing.");
  }

  // Get contact details from form
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactWhatsapp = formData.get("contactWhatsapp") as string;
  
  // Validate phone number (required field)
  if (!contactPhone) {
    throw new Error("Phone number is required");
  }
  
  // Basic validation for Ugandan phone numbers
  const phoneRegex = /^(?:\+256|256|0)[7][0-9]{8}$/;
  if (!phoneRegex.test(contactPhone)) {
    throw new Error("Please enter a valid Ugandan phone number");
  }
  
  // Validate email if provided
  if (contactEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      throw new Error("Please enter a valid email address");
    }
  }
  
  // Validate WhatsApp number if provided
  if (contactWhatsapp && !phoneRegex.test(contactWhatsapp)) {
    throw new Error("Please enter a valid WhatsApp number");
  }
  
  // Format phone numbers consistently
  let formattedPhone = contactPhone;
  if (contactPhone.startsWith('0')) {
    formattedPhone = `+256${contactPhone.substring(1)}`;
  } else if (!contactPhone.startsWith('+')) {
    formattedPhone = `+${contactPhone}`;
  }
  
  let formattedWhatsapp = contactWhatsapp;
  if (contactWhatsapp) {
    if (contactWhatsapp.startsWith('0')) {
      formattedWhatsapp = `+256${contactWhatsapp.substring(1)}`;
    } else if (!contactWhatsapp.startsWith('+')) {
      formattedWhatsapp = `+${contactWhatsapp}`;
    }
  }
  
  // Update hostel with contact information
  await prisma.hostel.update({
    where: { id: hostelId },
    data: {
      contactPhone: formattedPhone,
      contactEmail,
      contactWhatsapp: formattedWhatsapp || formattedPhone, // If WhatsApp not provided, use phone number
      contactHidden: true, // Default to hidden until payment
    },
  });

  // Process form data to extract categories
  const formEntries = Array.from(formData.entries());
  const categoryData = new Map<string, { name: string; count: number; price: number; description: string }>();

  // Extract all categories from form data
  for (const [key, value] of formEntries) {
    if (key.startsWith("categories[")) {
      // Parse the category name and property from the key
      // Example: categories[shared][count] -> categoryName = shared, property = count
      const match = key.match(/categories\[([^\]]+)\]\[([^\]]+)\]/);
      if (match) {
        const [_, categoryName, property] = match;
        
        if (!categoryData.has(categoryName)) {
          categoryData.set(categoryName, {
            name: categoryName,
            count: 0,
            price: 0,
            description: "",
          });
        }
        
        const category = categoryData.get(categoryName)!;
        
        if (property === "name") {
          category.name = value as string;
        } else if (property === "count") {
          category.count = parseInt(value as string, 10);
        } else if (property === "price") {
          category.price = parseInt(value as string, 10);
        } else if (property === "description") {
          category.description = value as string;
        }
      }
    }
  }

  // Ensure at least one category is selected
  if (categoryData.size === 0) {
    throw new Error("Please select at least one room category");
  }

  // Create room categories in database
  for (const category of categoryData.values()) {
    await prisma.roomCategory.create({
      data: {
        name: category.name,
        availableRooms: category.count,
        totalRooms: category.count,
        price: category.price,
        description: category.description || undefined,
        hostelId: hostelId,
        photos: [], // Initial empty array for photos
      },
    });
  }

  return redirect(`/create/${hostelId}/description`);
}

export async function CreateDescription(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const hostelId = formData.get("hostelId") as string;

  // Check ownership
  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
    select: { UserId: true },
  });

  if (!hostel || hostel.UserId !== user?.id) {
    throw new Error("You are not authorized to update this listing.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string; // Corrected from File to string
  const imageFiles = formData.getAll("imageFiles") as File[];
  const guestNumber = formData.get("guest") as string;
  const roomNumber = formData.get("room") as string;
  const kitchenNumber = formData.get("kitchen") as string;
  const bathroomsNumber = formData.get("bathroom") as string;

  const imagePaths = await Promise.all(
    imageFiles.map(async (imageFile) => {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${imageFile.name}-${Date.now()}`, imageFile, {
          cacheControl: "2592000",
          contentType: imageFile.type,
        });

      if (error) {
        console.error("Supabase upload error:", error);
        throw new Error("Failed to upload image");
      }

      return data.path;
    })
  );

  await prisma.hostel.update({
    where: { id: hostelId },
    data: {
      title,
      description,
      price: Number(price),
      // Remove the rooms field as it's now handled by room categories
      Kitchen: kitchenNumber,
      bathrooms: bathroomsNumber,
      guests: guestNumber,
      photos: { set: imagePaths },
      addedDescription: true,
    },
  });

  return redirect(`/create/${hostelId}/address`);
}

export async function createLocation(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  const hostelId = formData.get("hostelId") as string;

  // Check ownership
  const hostel = await prisma.hostel.findUnique({
    where: { id: hostelId },
    select: { UserId: true },
  });

  if (!hostel || hostel.UserId !== user?.id) {
    throw new Error("You are not authorized to update this listing.");
  }

  const countryValue = formData.get("countryValue") as string;
  const latitudeValue = formData.get("latitude") as string;
  const longitudeValue = formData.get("longitude") as string;
  
  // Create the update data object - type safe approach
  const updateData: {
    addedLocation: boolean;
    location: string;
    latitude?: number;
    longitude?: number;
    location_name?: string;
  } = { 
    addedLocation: true, 
    location: countryValue
  };
  
  // Only add latitude/longitude if they exist (prevents type errors)
  if (latitudeValue && longitudeValue) {
    const lat = parseFloat(latitudeValue);
    const lng = parseFloat(longitudeValue);
    updateData.latitude = lat;
    updateData.longitude = lng;
    
    // Try to get location name based on coordinates
    try {
      // Import the necessary functions
      const { useCountries } = require("./lib/getCountries");
      const { useDistricts } = require("./lib/getDistricts");
      
      const { getCountryByValue } = useCountries();
      const { getLocationNameFromCoordinates } = useDistricts();
      
      // Get a detailed location name using our enhanced function
      const locationName = await getLocationNameFromCoordinates(lat, lng, countryValue);
      
      // Set the location name in our update data
      if (locationName) {
        updateData.location_name = locationName;
      } else {
        // Get country info as fallback
        const country = getCountryByValue(countryValue);
        // Fallback to a generic location name with country reference
        updateData.location_name = `${country?.label || 'Unknown location'}`;
      }
    } catch (error) {
      console.error("Error getting location name:", error);
      // Fallback: Use coordinates as location name with better formatting
      updateData.location_name = `Location at ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    }
  } else {
    // If no coordinates provided, set a generic location name
    try {
      const { useCountries } = require("./lib/getCountries");
      const { getCountryByValue } = useCountries();
      const country = getCountryByValue(countryValue);
      updateData.location_name = country?.label || 'Unknown location';
    } catch (error) {
      console.error("Error getting country name:", error);
      updateData.location_name = 'Location unavailable';
    }
  }
  
  // Update with all location data
  await prisma.hostel.update({
    where: { id: hostelId },
    data: updateData,
  });

  return redirect("/");
}

export async function addToFavorite(formData: FormData) {
  const hostelId = formData.get("hostelId") as string;
  const userId = formData.get("userId") as string;
  const pathName = formData.get("pathName") as string;

  await prisma.favorite.create({
    data: { hostelId: hostelId, userId: userId },
  });

  revalidatePath(pathName);
}

export async function DeleteFromFavorite(formData: FormData) {
  const favoriteId = formData.get("favoriteId") as string;
  const pathName = formData.get("pathName") as string;
  const userId = formData.get("userId") as string;

  await prisma.favorite.delete({
    where: { id: favoriteId, userId: userId },
  });

  revalidatePath(pathName);
}

export async function createBooking(formData: FormData) {
  const userId = formData.get("userId") as string;
  const hostelId = formData.get("hostelId") as string;
  const roomCategoryId = formData.get("roomCategoryId") as string;
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  // Check user's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "STUDENT") {
    throw new Error("Only Students can book hostels.");
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
    throw new Error("Invalid date format.");
  }

  if (parsedStartDate >= parsedEndDate) {
    throw new Error("startDate must be earlier than endDate.");
  }

  // Get the room category and check if rooms are available
  const roomCategory = await prisma.roomCategory.findUnique({
    where: { id: roomCategoryId },
  });

  if (!roomCategory) {
    throw new Error("Room category not found.");
  }

  if (roomCategory.availableRooms <= 0) {
    throw new Error("No rooms available in this category.");
  }

  // Create booking and update available rooms in a transaction
  await prisma.$transaction(async (tx) => {
    // Create booking
    await tx.booking.create({
      data: {
        userId: userId,
        endDate: parsedEndDate,
        startDate: parsedStartDate,
        hostelId: hostelId,
        roomCategoryId: roomCategoryId,
      },
    });

    // Decrement available rooms
    await tx.roomCategory.update({
      where: { id: roomCategoryId },
      data: {
        availableRooms: {
          decrement: 1,
        },
      },
    });
  });

  return redirect("/");
}
