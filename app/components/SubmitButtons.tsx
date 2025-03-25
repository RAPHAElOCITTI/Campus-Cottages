"use client";

import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { useState } from "react";
// Adjust the import based on your project structure
import { PaymentService } from 'daraza';

export function CreateSubmit() {
    const { pending } = useFormStatus();
    const [isSubmitted, setIsSubmitted] = useState(false);
    return (
        <>
            {pending ? (
                <Button disabled size="lg">
                    <Loader2 className="mr-2 h-4 animate-spin"/>
                    Please wait 
                </Button>
            ):(
                <Button type="submit" size="lg" >
                    Next
                </Button>
            )}
        </>
    );
}

export function AddToFavoriteButton() {
    const { pending } = useFormStatus();
    return (
        <>
        {pending ? (
    <Button
     variant="outline"
     size="icon" 
     disabled 
     className="br-primary-foreground"
     >
        <Loader2 className="h-4 w-4 animate-spin text-primary"/>
    </Button>

        ): (
 <Button 
  variant="outline"
  size="icon" 
  className="bg-primary-foreground" 
  type="submit"
  >
    <Heart className="w-4 h-4"/>
 </Button>           
        )}
        </>
    );
}

export function DeleteFromFavoriteButton() {
    const { pending } = useFormStatus();
    return (
        <>
        {pending ? (
    <Button
     variant="outline"
     size="icon" 
     disabled 
     className="br-primary-foreground"
     >
        <Loader2 className="h-4 w-4 animate-spin text-primary"/>
    </Button>

        ): (
 <Button 
  variant="outline"
  size="icon" 
  className="bg-primary-foreground" 
  type="submit"
  >
    <Heart className="w-4 h-4 text-primary" fill="#E21C49"/>
 </Button>           
        )}
        </>
    );
}

export function BookingSubmitButton() {
    const { pending } = useFormStatus();

    const handlePayment = async () => {
        const paymentService = new PaymentService({
            apiKey: 'YOUR_API_KEY' // Replace with your actual API key
        });

        try {
            // Validate phone number and amount
            const validatedPhone = paymentService.validatePhoneNumber('762038491'); // Replace with the actual phone number
            const validatedAmount = paymentService.validateAmount(1000); // Replace with the actual amount

            // Prepare payment data
            const paymentData = {
                method: 1,
                amount: validatedAmount,
                phone: validatedPhone,
                note: 'Payment for reservation'
            };

            // Request to pay
            const response = await paymentService.requestToPay(paymentData);

            if (response.code === 'Success') {
                console.log('Payment successful:', response);
                // Handle successful payment (e.g., redirect to a success page)
            } else {
                console.error('Payment failed:', response.details);
                // Handle payment failure (e.g., show an error message)
            }
        } catch (error) {
            console.error('Payment error:', error);
            // Handle payment error (e.g., show an error message)
        }
    };

    return (
        <>
         {pending ? (
            <Button className="w-full" disabled>
             <Loader2 className="w-4 h-4 animate-spin mr-2"/> Please wait...
        </Button>

         ): (
            <Button className="w-full" type="submit" onClick={handlePayment}>
                            Make a Reservation!
            </Button>
         )}
        </>
    );
} 