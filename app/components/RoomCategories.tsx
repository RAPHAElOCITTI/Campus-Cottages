"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";

interface RoomCategory {
  id: string;
  name: string;
  price: number;
  availableRooms: number;
  totalRooms: number;
  description?: string | null;
  photos?: string[];
}

interface RoomCategoriesProps {
  roomCategories: RoomCategory[];
}

export function RoomCategories({ roomCategories }: RoomCategoriesProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    roomCategories.length > 0 ? roomCategories[0].id : null
  );

  if (roomCategories.length === 0) {
    return <div className="text-gray-500">No room categories available</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Room Categories</h3>
      
      <RadioGroup value={selectedCategoryId || undefined} onValueChange={setSelectedCategoryId}>
        <div className="grid gap-4">
          {roomCategories.map((category) => (
            <div key={category.id} className="flex items-start space-x-2">
              <RadioGroupItem 
                value={category.id} 
                id={category.id} 
                className="mt-1"
                disabled={category.availableRooms === 0}
              />
              <Label 
                htmlFor={category.id} 
                className={`flex-1 cursor-pointer ${category.availableRooms === 0 ? 'opacity-50' : ''}`}
              >
                <Card className={`border ${selectedCategoryId === category.id ? 'border-primary' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg capitalize">{category.name}</CardTitle>
                      <div className="text-lg font-semibold">{category.price} USh</div>
                    </div>
                    <CardDescription>
                      {category.availableRooms} of {category.totalRooms} rooms available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">
                      {category.description || `Standard ${category.name} room accommodations.`}
                    </p>
                  </CardContent>
                </Card>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>

      {/* Hidden input to submit the selected category */}
      <input 
        type="hidden" 
        name="roomCategoryId" 
        value={selectedCategoryId || ""} 
      />
    </div>
  );
}