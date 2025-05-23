// app/api/payments/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db'; // Your Prisma client
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

// Corrected type definition for dynamic route parameters (now a Promise)
interface RouteContext {
  params: Promise<{
    id: string; // This matches your dynamic segment [id]
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext // Use the defined interface for context
) {
  try {
    // AWAIT the params object to get its actual value
    const awaitedParams = await context.params;
    const { id: paymentId } = awaitedParams;

    // --- Start: Logic for handling this route as `api/payments/[paymentId]` ---
    // If this route is to check a specific payment's status by its ID:
    const userSession = getKindeServerSession();
    const { getUser } = userSession;
    const user = await getUser();

    if (!user || !user.id) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    // Example: Fetch a specific payment record by ID
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
        userId: user.id, // Ensure the user owns this payment record for security
      },
      select: {
        id: true,
        status: true,
        amount: true,
        transactionId: true,
        hostelId: true,
        roomCategoryId: true,
        // ... include other relevant fields
      }
    });

    if (!payment) {
      return NextResponse.json({ message: 'Payment record not found or unauthorized' }, { status: 404 });
    }

    // Customize the response based on the payment status
    return NextResponse.json({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      transactionId: payment.transactionId,
      hostelId: payment.hostelId,
      roomCategoryId: payment.roomCategoryId,
      // Add more details if needed
    }, { status: 200 });

    // --- End: Logic for handling this route as `api/payments/[paymentId]` ---

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }

  console.log()
}
