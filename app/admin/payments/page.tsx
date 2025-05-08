"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, AlertTriangle, Clock } from "lucide-react";
import { format } from "date-fns";

// Mock payment data for demonstration - in a real app, this would come from an API call
interface PaymentEntry {
  id: string;
  referenceCode: string;
  amount: number;
  status: 'PENDING' | 'PENDING_CONFIRMATION' | 'COMPLETED' | 'FAILED';
  userId: string;
  userName: string;
  userPhone: string;
  hostelId: string;
  hostelTitle: string;
  roomCategory: string;
  roomPrice: number;
  createdAt: Date;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load payments (mock data for now)
  useEffect(() => {
    // Simulate API call to fetch payments
    setTimeout(() => {
      const mockPayments: PaymentEntry[] = [
        {
          id: "pay_123456",
          referenceCode: "MM-ABC12",
          amount: 5000,
          status: 'PENDING_CONFIRMATION',
          userId: "user_123",
          userName: "John Doe",
          userPhone: "+256700000001",
          hostelId: "hostel_123",
          hostelTitle: "Sunshine Hostel",
          roomCategory: "Single Room",
          roomPrice: 450000,
          createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
        },
        {
          id: "pay_123457",
          referenceCode: "MM-DEF34",
          amount: 5000,
          status: 'PENDING_CONFIRMATION',
          userId: "user_124",
          userName: "Jane Smith",
          userPhone: "+256700000002",
          hostelId: "hostel_124",
          hostelTitle: "Campus Heights",
          roomCategory: "Double Room",
          roomPrice: 350000,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
        },
        {
          id: "pay_123458",
          referenceCode: "MM-GHI56",
          amount: 5000,
          status: 'COMPLETED',
          userId: "user_125",
          userName: "Tom Wilson",
          userPhone: "+256700000003",
          hostelId: "hostel_123",
          hostelTitle: "Sunshine Hostel",
          roomCategory: "Deluxe Room",
          roomPrice: 550000,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        }
      ];

      setPayments(mockPayments);
      setLoading(false);
    }, 1500);
  }, []);

  // Handle verifying a payment
  const verifyPayment = async (paymentId: string) => {
    setProcessingId(paymentId);

    // Simulate API call to verify payment
    setTimeout(() => {
      // Update the local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'COMPLETED' } 
          : payment
      ));
      setProcessingId(null);
    }, 1500);
  };

  // Handle rejecting a payment
  const rejectPayment = async (paymentId: string) => {
    setProcessingId(paymentId);

    // Simulate API call to reject payment
    setTimeout(() => {
      // Update the local state
      setPayments(payments.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: 'FAILED' } 
          : payment
      ));
      setProcessingId(null);
    }, 1500);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: PaymentEntry['status'] }) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-gray-100"><Clock className="mr-1 h-3 w-3" /> Pending</Badge>;
      case 'PENDING_CONFIRMATION':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="mr-1 h-3 w-3" /> Needs Verification</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Completed</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-100 text-red-800"><XCircle className="mr-1 h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-lg">Loading payment records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <XCircle className="h-10 w-10 text-red-500 mb-4" />
          <p className="text-lg text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">Try Again</Button>
        </div>
      </div>
    );
  }

  // Filter to get pending confirmations
  const pendingConfirmations = payments.filter(p => p.status === 'PENDING_CONFIRMATION');
  const otherPayments = payments.filter(p => p.status !== 'PENDING_CONFIRMATION');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Mobile Money Payments</h1>
        <p className="text-gray-500 mt-2">Verify and manage Mobile Money payments from students</p>
      </div>

      <div className="space-y-8">
        {/* Payments needing verification */}
        <div>
          <h2 className="text-xl font-medium mb-4">Payments Needing Verification</h2>
          
          {pendingConfirmations.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-gray-500">No payments currently need verification</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingConfirmations.map(payment => (
                <Card key={payment.id} className="border-yellow-200">
                  <CardHeader className="pb-2 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg font-medium">{payment.referenceCode}</CardTitle>
                      <CardDescription>
                        {format(payment.createdAt, 'PPP p')}
                      </CardDescription>
                    </div>
                    <StatusBadge status={payment.status} />
                  </CardHeader>
                  
                  <CardContent className="py-2">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Amount:</span>
                        <span className="font-medium">{payment.amount.toLocaleString()} UGX</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Student:</span>
                        <span className="font-medium">{payment.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="font-medium">{payment.userPhone}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between">
                        <span className="text-gray-500">Hostel:</span>
                        <span className="font-medium">{payment.hostelTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Room:</span>
                        <span className="font-medium">{payment.roomCategory} ({payment.roomPrice.toLocaleString()} UGX)</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => verifyPayment(payment.id)}
                      disabled={processingId === payment.id}
                    >
                      {processingId === payment.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>Verify Payment</>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => rejectPayment(payment.id)}
                      disabled={processingId === payment.id}
                    >
                      Reject
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Payment history */}
        <div>
          <h2 className="text-xl font-medium mb-4">Payment History</h2>
          
          {otherPayments.length === 0 ? (
            <div className="bg-gray-50 border rounded-lg p-8 text-center">
              <p className="text-gray-500">No payment history available</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-left border-b">
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Reference</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Student</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Hostel</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Room</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                    <th className="px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {otherPayments.map(payment => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">{payment.referenceCode}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{format(payment.createdAt, 'PPP')}</td>
                      <td className="px-4 py-3 text-sm">{payment.userName}</td>
                      <td className="px-4 py-3 text-sm">{payment.hostelTitle}</td>
                      <td className="px-4 py-3 text-sm">{payment.roomCategory}</td>
                      <td className="px-4 py-3 text-sm">{payment.amount.toLocaleString()} UGX</td>
                      <td className="px-4 py-3 text-sm">
                        <StatusBadge status={payment.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}