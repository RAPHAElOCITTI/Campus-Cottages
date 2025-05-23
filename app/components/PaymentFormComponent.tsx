// app/components/PaymentFormComponent.tsx
"use client"; // This makes it a Client Component

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useFormStatus } from "react-dom"; // Hook to get form submission status
import { useRouter } from "next/navigation"; // <-- IMPORT useRouter
import { PaymentResponse } from "daraza"; // Import Daraza's PaymentResponse interface

// Define the server action function for payment
// This will be passed from the parent server component
interface PaymentFormComponentProps {
  hostelId: string;
  selectedRoomCategoryId: string;
  selectedRoomPrice: number;
  // This function will be defined in the server component and passed down
  initiateDarazaPayment: (
    hostelId: string,
    roomCategoryId: string,
    amount: number,
    phone: string
  ) => Promise<{ success: boolean; message: string }>;
  //onPaymentSuccess: () => void; // Callback for parent to update UI
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Processing Payment..." : "Pay Now (UGX 5,000)"}
    </Button>
  );
}

export function PaymentFormComponent({
  hostelId,
  selectedRoomCategoryId,
  selectedRoomPrice,
  initiateDarazaPayment,
  
}: PaymentFormComponentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const router = useRouter(); // Initialize the router
  // We are assuming a fixed "access fee" of 5000 UGX for now
  const accessFee = 5000; // As per your existing message

  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPaymentStatus("Initiating payment...");
    setPaymentError(null);

    if (!phoneNumber) {
      setPaymentError("Please enter your phone number.");
      setPaymentStatus(null);
      return;
    }
    if (!selectedRoomCategoryId || selectedRoomPrice === 0) {
      setPaymentError("Please select a room category first.");
      setPaymentStatus(null);
      return;
    }

    try {
      // Call the server action to initiate payment
      const result = await initiateDarazaPayment(
        hostelId,
        selectedRoomCategoryId,
        accessFee, // Send the fixed access fee
        phoneNumber
      );

      if (result.success) {
        setPaymentStatus(result.message);
       // onPaymentSuccess(); // Notify parent of success
       router.refresh(); // <-- THE KEY CHANGE HERE
      } else {
        setPaymentError(result.message);
        setPaymentStatus(null);
      }
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      setPaymentError(error.message || "An unexpected error occurred.");
      setPaymentStatus(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Mobile Money Payment Required</h3>
      <p className="text-sm text-gray-600 mb-2">
        To proceed with booking, you need to send a {accessFee} UGX fee via
        Mobile Money. This gives you access to the hostel owner's contact info
        and booking ability.
      </p>

      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Your Mobile Money Phone Number (e.g., 2567XXXXXX)
          </label>
          <Input
            id="phone"
            type="tel" // Use tel for phone numbers
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 2567XXXXXXXX"
            className="w-full"
            required
            pattern="^256(7[0-9]{8})$" // Basic Ugandan mobile number pattern
            title="Please enter a valid Ugandan mobile number starting with 2567"
          />
          <p className="text-xs text-gray-500 mt-1">Make sure this is your active Mobile Money number.</p>
        </div>
        <SubmitButton />
      </form>

      {paymentStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-700">
          {paymentStatus}
        </div>
      )}
      {paymentError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
          Error: {paymentError}
        </div>
      )}

      <Separator className="my-4" />
    </div>
  );
  console.log()
}