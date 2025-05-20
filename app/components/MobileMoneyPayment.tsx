"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { nanoid } from "nanoid";



interface MobileMoneyPaymentProps {
  className?: string;
  hostelId: string;
  roomCategoryId: string;
  roomCategoryName: string;
  roomPrice: number;
}

interface PaymentStatus {
  status: 'PENDING' | 'PENDING_CONFIRMATION' | 'COMPLETED' | 'FAILED';
  referenceCode: string;
  paymentId: string;
}

export function MobileMoneyPayment({ hostelId, roomCategoryId, roomCategoryName, roomPrice }: MobileMoneyPaymentProps) {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentStatus | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [contactInfo, setContactInfo] = useState<{
    contactPhone?: string;
    contactEmail?: string;
    contactWhatsapp?: string;
  } | null>(null);

  // Generate a reference code for display
  // Note: In production, this would be generated and tracked server-side
  const generateReference = () => {
    // Format: MM-XXXXX where X is alphanumeric
    return `MM-${nanoid(5).toUpperCase()}`;
  };

  const [referenceCode] = useState(generateReference());

  // Simulate creating a payment record
  const createPayment = async () => {
    setLoading(true);
    
    try {
      // In production, this would be an actual API call
      // For this example, we'll simulate a successful response
      setTimeout(() => {
        setPaymentInfo({
          status: 'PENDING',
          referenceCode: referenceCode,
          paymentId: nanoid(10)
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to create payment record. Please try again.");
      setLoading(false);
    }
  };

  // Simulate marking payment as sent
  const markAsSent = async () => {
    if (!paymentInfo) return;
    
    setSending(true);
    
    try {
      // In production, this would be an actual API call
      // For this example, we'll simulate a successful response
      setTimeout(() => {
        setPaymentInfo({
          ...paymentInfo,
          status: 'PENDING_CONFIRMATION'
        });
        setSending(false);
      }, 1500);
    } catch (err) {
      setError("Failed to update payment status. Please try again.");
      setSending(false);
    }
  };

  // Simulate checking payment status (for demo purposes, we'll auto-complete after 10 seconds)
  useEffect(() => {
    if (paymentInfo?.status === 'PENDING_CONFIRMATION') {
      const timer = setTimeout(() => {
        // In production, this would poll a real API endpoint
        setPaymentInfo({
          ...paymentInfo,
          status: 'COMPLETED'
        });
        
        // Show contact info when payment is completed
        setShowContactInfo(true);
        setContactInfo({
          contactPhone: "+256700000000",
          contactEmail: "owner@example.com",
          contactWhatsapp: "+256700000000"
        });
      }, 10000); // Auto-complete after 10 seconds for demo purposes
      
      return () => clearTimeout(timer);
    }
  }, [paymentInfo]);

  // Initialize payment on component mount
  useEffect(() => {
    createPayment();
  }, []);

  // Render different content based on payment status
  const renderPaymentContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p>Initializing payment...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-6">
          <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => { setError(null); createPayment(); }} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      );
    }

    if (!paymentInfo) return null;

    if (paymentInfo.status === 'COMPLETED') {
      return (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg text-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <h3 className="font-semibold text-green-700">Payment Verified!</h3>
            <p className="text-green-600">Your payment has been confirmed.</p>
          </div>
          
          {contactInfo && (
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">Hostel Owner Contact Information</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Phone:</strong> {contactInfo.contactPhone}</p>
                {contactInfo.contactEmail && (
                  <p><strong>Email:</strong> {contactInfo.contactEmail}</p>
                )}
                {contactInfo.contactWhatsapp && (
                  <p><strong>WhatsApp:</strong> {contactInfo.contactWhatsapp}</p>
                )}
              </div>
            </div>
          )}
          
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Proceed to Book
          </Button>
        </div>
      );
    }

    if (paymentInfo.status === 'PENDING_CONFIRMATION') {
      return (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <Loader2 className="h-8 w-8 text-blue-500 mx-auto mb-2 animate-spin" />
            <h3 className="font-semibold text-blue-700">Payment Pending Verification</h3>
            <p className="text-blue-600">We're verifying your payment. This may take a few minutes.</p>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-2">Payment Details</h3>
            <p className="text-sm text-gray-600">Reference: {paymentInfo.referenceCode}</p>
            <p className="text-sm text-gray-600">Amount: 5,000 UGX</p>
            <p className="text-sm text-gray-600">Status: Pending confirmation</p>
          </div>
          
          <Button disabled className="w-full opacity-70">
            Please Wait...
          </Button>
        </div>
      );
    }

    // Default PENDING state
    return (
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Mobile Money Payment Instructions</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Send <strong>5,000 UGX</strong> to <strong>+256700000000</strong> (MTN Mobile Money)</li>
            <li>Include reference code <strong>{paymentInfo.referenceCode}</strong> in the reason/note</li>
            <li>Click the button below once you've sent the payment</li>
          </ol>
        </div>
        
        <div className="flex items-center justify-between border rounded-lg p-3 bg-gray-50">
          <div>
            <p className="text-sm font-semibold">Reference Code:</p>
            <p className="text-lg font-mono">{paymentInfo.referenceCode}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Amount:</p>
            <p className="text-lg">5,000 UGX</p>
          </div>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-lg">
          <p className="text-xs text-amber-700">
            <Lock className="inline h-3 w-3 mr-1" />
            This one-time fee gives you access to contact the hostel owner and book this room.
          </p>
        </div>
        
        <Button 
          onClick={markAsSent} 
          disabled={sending} 
          className="w-full bg-primary"
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "I Have Sent the Payment"
          )}
        </Button>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Access Booking</CardTitle>
        <CardDescription>
          Pay a small fee to unlock contact details and booking
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderPaymentContent()}
      </CardContent>
      <CardFooter className="text-xs text-gray-500 pt-0">
        <p>Room: {roomCategoryName} - {roomPrice} USh/semester</p>
      </CardFooter>
    </Card>
  );
}