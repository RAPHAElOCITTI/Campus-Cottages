"use client";
import { CreateDescription } from "@/app/actions";
import { Counter } from "@/app/components/counter";
import { CreateBottomBar } from "@/app/components/CreationBottomBar";
import { CreateSubmit } from "@/app/components/SubmitButtons";
import MyComponent from "@/app/UploadHandling";
import uploadHandler  from "@/app/UploadHandler"; // Import uploadHandler
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";










// Next.js handles dynamic params automatically with the App Router
export interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: any;
}

export default function DescriptionPage({ params }: PageProps) {
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
          Please describe your hostel as good as you can!
        </h2>
      </div>

      <form action={CreateDescription}>
        <div>
          <input type="hidden" name="hostelId" value={resolvedParams.id} />
        </div>

        <div className="mx-auto w-3/5 mt-10 flex flex-col gap-y-5 mb-36">
          <div className="flex flex-col gap-y-2">
            <Label>Title</Label>
            <Input
              name="title"
              type="text"
              required
              placeholder="Short and simple..."
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              required
              placeholder="Please describe your hostel..."
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Price</Label>
            <Input
              name="price"
              type="number"
              required
              placeholder="Price per Semester in UGX"
              min={600000}
            />
          </div>

          
                        
            <MyComponent /> {/* Use MyComponent here */}
                    


          <Card>
            <CardHeader className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Guests</h3>
                  <p className="text-muted-foreground text-sm">
                    How many guests do you want?
                  </p>
                </div>
                <Counter name="guest" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Rooms</h3>
                  <p className="text-muted-foreground text-sm">
                    How many rooms do you have?
                  </p>
                </div>
                <Counter name="room" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Kitchen</h3>
                  <p className="text-muted-foreground text-sm">
                    Does it have a Kitchen?
                  </p>
                </div>
                <Counter name="kitchen" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <h3 className="underline font-medium">Bathrooms</h3>
                  <p className="text-muted-foreground text-sm">
                    Does it have a bathroom?
                  </p>
                </div>
                <Counter name="bathroom" />
              </div>
            </CardHeader>
          </Card>
        </div>

        <CreateBottomBar />
      </form>
    </>
  );
}

