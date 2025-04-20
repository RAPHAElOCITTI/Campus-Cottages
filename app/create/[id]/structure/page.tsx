"use client";

import { createCategoryPage } from "@/app/actions";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { SelectCategory } from "@/app/components/SelectedCategory";
import { useEffect, useState } from "react";

export interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: any;
  }

export default function StructureRoute({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params
      .then((result) => {
        setResolvedParams(result);
      })
      .catch((err) => {
        console.error("Error resolving params:", err);
        setError("Failed to load hostel details.");
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
          <h2 className="text-2xl font-semibold tracking-tight transition-colors mb-2">
            Which of the best describes your Hostel?
          </h2>
          <p className="text-gray-600">
            Select a category and click Continue to start listing your hostel. Your selection is pre-filled to make the process faster.
          </p>
        </div>
        
        <form action={createCategoryPage} className="relative">
          <input type="hidden" name="hostelId" value={resolvedParams.id} />
          <SelectCategory />
          <CreateBottomBar />
        </form>
      </>
    );
}
