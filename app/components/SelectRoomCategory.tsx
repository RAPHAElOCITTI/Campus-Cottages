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

  // Phone number validation
  const validatePhoneNumber = (phone: string) => {
    // Basic validation for Ugandan phone numbers
    // Allow formats like: +256700000000, 256700000000, 0700000000
    const phoneRegex = /^(?:\+256|256|0)[7][0-9]{8}$/;
    return phone === "" || phoneRegex.test(phone);
  };

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email === "" || emailRegex.test(email);
  };

  // Form validation state
  const [validation, setValidation] = useState({
    phoneValid: true,
    emailValid: true,
    whatsappValid: true,
    phoneError: "",
    emailError: "",
    whatsappError: "",
  });

  // Form data state
  const [contactForm, setContactForm] = useState({
    phone: "",
    email: "",
    whatsapp: "",
  });

  // Handle input changes
  const handleContactChange = (field: string, value: string) => {
    setContactForm({
      ...contactForm,
      [field]: value,
    });

    // Validate as user types
    if (field === "phone") {
      const isValid = validatePhoneNumber(value);
      setValidation({
        ...validation,
        phoneValid: isValid,
        phoneError: isValid ? "" : "Please enter a valid Ugandan phone number",
      });
    } else if (field === "email") {
      const isValid = validateEmail(value);
      setValidation({
        ...validation,
        emailValid: isValid,
        emailError: isValid ? "" : "Please enter a valid email address",
      });
    } else if (field === "whatsapp") {
      const isValid = validatePhoneNumber(value);
      setValidation({
        ...validation,
        whatsappValid: isValid,
        whatsappError: isValid ? "" : "Please enter a valid WhatsApp number",
      });
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
      
      {/* Contact details section */}
      <div className="mt-8 border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Contact Information</h3>
        <p className="text-sm text-gray-500 mb-4">
          Please provide your contact details. These will be revealed to students only after they
          complete the Mobile Money payment.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactPhone" className="mb-1 block">Phone Number*</Label>
            <Input 
              id="contactPhone"
              name="contactPhone"
              type="tel"
              placeholder="+256 700 000 000"
              required
              value={contactForm.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className={!validation.phoneValid ? "border-red-500" : ""}
            />
            {!validation.phoneValid && (
              <p className="text-red-500 text-xs mt-1">{validation.phoneError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Format: +256700000000 or 0700000000</p>
          </div>
          
          <div>
            <Label htmlFor="contactEmail" className="mb-1 block">Email Address</Label>
            <Input 
              id="contactEmail"
              name="contactEmail"
              type="email"
              placeholder="your@email.com"
              value={contactForm.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className={!validation.emailValid ? "border-red-500" : ""}
            />
            {!validation.emailValid && (
              <p className="text-red-500 text-xs mt-1">{validation.emailError}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="contactWhatsapp" className="mb-1 block">WhatsApp Number</Label>
            <Input 
              id="contactWhatsapp"
              name="contactWhatsapp"
              type="tel"
              placeholder="+256 700 000 000"
              value={contactForm.whatsapp}
              onChange={(e) => handleContactChange("whatsapp", e.target.value)}
              className={!validation.whatsappValid ? "border-red-500" : ""}
            />
            {!validation.whatsappValid && (
              <p className="text-red-500 text-xs mt-1">{validation.whatsappError}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Leave empty if same as phone number</p>
          </div>
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