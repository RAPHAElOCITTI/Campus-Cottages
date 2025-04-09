"use client";

import { Card, CardHeader } from "@/components/ui/card"
import { roomCategoryItems } from "../lib/categoryitems"
import Image from "next/image"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RoomCategoryFormProps {
  hostelId: string;
}

export function SelectRoomCategory({ hostelId }: RoomCategoryFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<Map<string, { count: number, price: number, description: string }>>(new Map());
  
  const toggleCategory = (name: string) => {
    const newSelectedCategories = new Map(selectedCategories);
    
    if (newSelectedCategories.has(name)) {
      newSelectedCategories.delete(name);
    } else {
      newSelectedCategories.set(name, { count: 1, price: 0, description: "" });
    }
    
    setSelectedCategories(newSelectedCategories);
  };

  const updateCategoryCount = (name: string, count: number) => {
    const newSelectedCategories = new Map(selectedCategories);
    const categoryData = newSelectedCategories.get(name);
    
    if (categoryData) {
      newSelectedCategories.set(name, { ...categoryData, count: Math.max(1, count) });
      setSelectedCategories(newSelectedCategories);
    }
  };

  const updateCategoryPrice = (name: string, price: number) => {
    const newSelectedCategories = new Map(selectedCategories);
    const categoryData = newSelectedCategories.get(name);
    
    if (categoryData) {
      newSelectedCategories.set(name, { ...categoryData, price: Math.max(0, price) });
      setSelectedCategories(newSelectedCategories);
    }
  };

  const updateCategoryDescription = (name: string, description: string) => {
    const newSelectedCategories = new Map(selectedCategories);
    const categoryData = newSelectedCategories.get(name);
    
    if (categoryData) {
      newSelectedCategories.set(name, { ...categoryData, description });
      setSelectedCategories(newSelectedCategories);
    }
  };

  return (
    <div className="space-y-6 w-3/5 mx-auto">
      <div>
        <h3 className="text-lg font-medium mb-4">Select Room Categories</h3>
        <div className="grid grid-cols-3 gap-4">
          {roomCategoryItems.map((item) => (
            <div key={item.id} className="cursor-pointer">
              <Card 
                className={selectedCategories.has(item.name) ? 'border-primary border-2': ""}
                onClick={() => toggleCategory(item.name)}
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <Image 
                    src={item.imageUrl}
                    alt={item.name}
                    height={32}
                    width={32}
                    className="w-8 h-8" 
                  />
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Show configurations for selected categories */}
      {[...selectedCategories.entries()].length > 0 && (
        <div className="mt-8 space-y-6 border rounded-lg p-6">
          <h3 className="text-lg font-medium">Configure Room Categories</h3>
          
          {[...selectedCategories.entries()].map(([name, data]) => {
            const category = roomCategoryItems.find(c => c.name === name);
            if (!category) return null;
            
            return (
              <div key={name} className="p-4 border rounded-md space-y-4">
                <div className="flex items-center gap-2">
                  <Image 
                    src={category.imageUrl}
                    alt={category.name}
                    height={24}
                    width={24}
                    className="w-6 h-6" 
                  />
                  <h4 className="font-medium">{category.title}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`${name}-count`}>Number of Rooms</Label>
                    <Input 
                      id={`${name}-count`}
                      type="number" 
                      min="1"
                      value={data.count}
                      onChange={(e) => updateCategoryCount(name, parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`${name}-price`}>Price per Semester (USh)</Label>
                    <Input 
                      id={`${name}-price`}
                      type="number" 
                      min="0"
                      value={data.price}
                      onChange={(e) => updateCategoryPrice(name, parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor={`${name}-description`}>Description (optional)</Label>
                  <Textarea 
                    id={`${name}-description`}
                    value={data.description}
                    onChange={(e) => updateCategoryDescription(name, e.target.value)}
                    placeholder="Describe the features of this room type..."
                    className="mt-1"
                  />
                </div>
                
                <input 
                  type="hidden" 
                  name={`categories[${name}][name]`} 
                  value={name} 
                />
                <input 
                  type="hidden" 
                  name={`categories[${name}][count]`} 
                  value={data.count} 
                />
                <input 
                  type="hidden" 
                  name={`categories[${name}][price]`} 
                  value={data.price} 
                />
                <input 
                  type="hidden" 
                  name={`categories[${name}][description]`} 
                  value={data.description} 
                />
              </div>
            );
          })}
        </div>
      )}
      
      <input 
        type="hidden" 
        name="hostelId" 
        value={hostelId} 
      />
    </div>
  );
}