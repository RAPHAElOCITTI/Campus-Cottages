"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useEffect } from "react"; // Import useEffect
import { useRouter, useSearchParams } from "next/navigation"; // Import useRouter and useSearchParams

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
  const router = useRouter();
  const searchParams = useSearchParams(); // Get current search params
  
  // Initialize state from URL searchParams or first available category
  const initialCategoryId = searchParams.get('roomCategoryId') || 
                            (roomCategories.length > 0 ? roomCategories[0].id : null);
  
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(initialCategoryId);

  // Effect to update URL when selectedCategoryId changes
  useEffect(() => {
    if (selectedCategoryId) {
      const selectedCategory = roomCategories.find(cat => cat.id === selectedCategoryId);
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('roomCategoryId', selectedCategoryId);
      if (selectedCategory) {
        newSearchParams.set('roomPrice', selectedCategory.price.toString());
      } else {
        newSearchParams.delete('roomPrice'); // Remove if category not found or deselected
      }
      
      // Update URL without a full page refresh
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    } else {
      // If no category is selected, remove the params from the URL
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete('roomCategoryId');
      newSearchParams.delete('roomPrice');
      router.replace(`?${newSearchParams.toString()}`, { scroll: false });
    }
  }, [selectedCategoryId, roomCategories, router, searchParams]);


  if (roomCategories.length === 0) {
    return <div className="text-gray-500">No room categories available</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Room Categories</h3>
      
      <RadioGroup 
        value={selectedCategoryId || undefined} 
        onValueChange={(value) => {
          setSelectedCategoryId(value);
          // When a category is selected, ensure it's logged for debugging
          const categoryPrice = roomCategories.find(c => c.id === value)?.price;
          console.log("Selected Room Category ID:", value, "Price:", categoryPrice);
        }}
      >
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

      {/* The hidden input in RoomCategories is no longer strictly necessary for PaymentFormComponent
          since PaymentFormComponent will now read from searchParams itself.
          However, it can be useful if you're submitting this form to a Server Action
          that directly reads form data. If not, you can remove it.
          For clarity, let's keep it for now as it's harmless. */}
      {/* <input 
        type="hidden" 
        name="roomCategoryId" 
        value={selectedCategoryId || ""} 
      /> */}
    </div>
  );
}