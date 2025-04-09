"use client";

import { addRoomCategories } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { SelectRoomCategory } from "@/app/components/SelectRoomCategory";
import { useEffect, useState } from "react";

export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: any;
}

export default function RoomsRoute({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params
      .then((result) => {
        console.log("Params resolved:", result);
        setResolvedParams(result);
      })
      .catch((err) => {
        console.error("Error resolving params:", err);
        setError("Failed to load hostel details.");
      })
      .finally(() => {
        console.log("Params resolution completed.");
      });
  }, [params]);

  // If an error occurred, display it
  if (error) return <div>{error}</div>;

  // Show loading state while params are resolving
  if (!resolvedParams) return <div>Loading...</div>;

  // Ensure we have an ID
  if (!resolvedParams?.id) {
    return <div>Error: Hostel ID is missing!</div>;
  }

  return (
    <>
      <div className="w-3/5 mx-auto">
        <h2 className="text-2xl font-semibold tracking-tight transition-colors">
          Add Room Categories to Your Hostel
        </h2>
        <p className="text-gray-500 mt-2">
          Select the types of rooms you offer and specify how many are available.
        </p>
      </div>

      <form action={addRoomCategories}>
        <input type="hidden" name="hostelId" value={resolvedParams.id} />
        <SelectRoomCategory hostelId={resolvedParams.id} />
        <CreateBottomBar />
      </form>
    </>
  );
}