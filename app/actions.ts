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
import { prisma } from "./lib/db";
import { supabase } from "./lib/supabase";
import { revalidatePath } from "next/cache";
import MyComponent from "@/app/UploadHandling"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function createcampuscottagesHostel({ userId }: { userId: string }) {
  // Check user's role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== "HOSTEL_OWNER") {
    throw new Error("Only Hostel-Owners can create hostel listings.");
  }

  const data = await prisma.hostel.findFirst({
    where: { UserId: userId },
    orderBy: { createdAT: "desc" },
  });

  if (data === null) {
    const data = await prisma.hostel.create({
      data: { UserId: userId },
    });
    return redirect(`/create/${data.id}/structure`);
  } else if (!data.addedCategory && !data.addedDescription && !data.addedLocation) {
    return redirect(`/create/${data.id}/structure`);
  } else if (data.addedCategory && !data.addedDescription) {
    return redirect(`/create/${data.id}/description`);
  } else if (data.addedCategory && data.addedDescription && !data.addedLocation) {
    return redirect(`/create/${data.id}/address`);
  } else {
    const data = await prisma.hostel.create({
      data: { UserId: userId },
    });
    return redirect(`/create/${data.id}/structure`);
  }
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
      rooms: roomNumber,
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
  await prisma.hostel.update({
    where: { id: hostelId },
    data: { addedLocation: true, location: countryValue },
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

  await prisma.booking.create({
    data: {
      userId: userId,
      endDate: parsedEndDate,
      startDate: parsedStartDate,
      hostelId: hostelId,
    },
  });

  return redirect("/");
}
