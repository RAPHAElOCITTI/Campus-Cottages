"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RoomCategory {
  id: string;
  name: string;
  price: number;
  availableRooms: number;
  totalRooms: number;
  description?: string | null;
}

interface RoomCategoryDisplayProps {
  roomCategories: RoomCategory[];
}

export function RoomCategoryDisplay({ roomCategories }: RoomCategoryDisplayProps) {
  if (roomCategories.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800 text-sm">
        No room categories available for this hostel.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Available Room Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roomCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg capitalize">{category.name} Room</CardTitle>
                <div className="text-lg font-semibold">{category.price.toLocaleString()} USh</div>
              </div>
              <CardDescription>
                <div className="flex justify-between mt-1">
                  <span>
                    {category.availableRooms} of {category.totalRooms} rooms available
                  </span>
                  <AvailabilityBadge available={category.availableRooms} />
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                {category.description || `Standard ${category.name} room accommodations.`}
              </p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium mb-2">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {category.name === 'shared' && (
                    <>
                      <FeatureBadge>Shared Space</FeatureBadge>
                      <FeatureBadge>Budget-friendly</FeatureBadge>
                      <FeatureBadge>Community</FeatureBadge>
                    </>
                  )}
                  {category.name === 'single' && (
                    <>
                      <FeatureBadge>Private Room</FeatureBadge>
                      <FeatureBadge>Single Bed</FeatureBadge>
                      <FeatureBadge>Privacy</FeatureBadge>
                    </>
                  )}
                  {category.name === 'deluxe' && (
                    <>
                      <FeatureBadge>Premium</FeatureBadge>
                      <FeatureBadge>Extra Space</FeatureBadge>
                      <FeatureBadge>Enhanced Amenities</FeatureBadge>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AvailabilityBadge({ available }: { available: number }) {
  if (available === 0) {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        Fully Booked
      </Badge>
    );
  }
  
  if (available < 3) {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
        Limited Availability
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
      Available
    </Badge>
  );
}

function FeatureBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
      {children}
    </span>
  );
}

function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium";
  const variantClasses = variant === "default" ? "bg-blue-100 text-blue-800" : "border border-blue-200";
  
  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}