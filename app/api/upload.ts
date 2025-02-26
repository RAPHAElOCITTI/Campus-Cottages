import { NextApiRequest, NextApiResponse } from "next";


import formidable from "formidable"; // Assuming you're using formidable for file handling
import { prisma } from "../lib/db";
import { supabase } from "../lib/supabase";

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle FormData
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse)  {
  const form = formidable({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "File parsing error." });
    }

    const { imageFiles } = files;
    const hostelId = fields.hostelId as string;
    

    if (Array.isArray(imageFiles)) {
      // Handle multiple file uploads
      const imageUrls = await Promise.all(
        imageFiles.map(async (file: any) => {
          const { data, error } = await supabase.storage
            .from("images")
            .upload(`${file.name}-${new Date()}`, file, {
              cacheControl: "2592000",
              contentType: "image/png",
            });

            

          if (error) {
            console.error(error);
            return null;
          }

          // Get the public URL after upload
          const publicUrl = supabase.storage
            .from("images")
            .getPublicUrl(data?.path);
            if (!publicUrl) {
              console.error("Error getting public URL");
              return null; // Or throw an error
          }


          return publicUrl;
        })
      );
      const filteredImageUrls = imageUrls.filter((url) => url); // Filter out null values

      const publicUrls = filteredImageUrls.map((urlObj) => urlObj.data.publicUrl);
      
      type ImageUrl = {
        publicUrl: string;
      };

      // Update the hostel in the database with the image URLs
      const updatedHostel = await prisma.hostel.update({
        where: {
          id: hostelId,
        },
        data: {
          photos: { set: publicUrls }, // Set the photos field to an array of URLs
          addedDescription: true, // Assuming you're also setting this flag
        },
      });

      return res.status(200).json({ success: true, data: updatedHostel });
    }

    return res.status(400).json({ error: "No images uploaded" });
  });
};


