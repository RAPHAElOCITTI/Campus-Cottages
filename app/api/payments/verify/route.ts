import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// API endpoint for hostel owners to verify payments
export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  // Verify user is a hostel owner
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "HOSTEL_OWNER") {
    return NextResponse.json(
      { error: "Only hostel owners can verify payments" },
      { status: 403 }
    );
  }

  try {
    const { paymentId, action } = await request.json();

    if (!paymentId || !action) {
      return NextResponse.json(
        { error: "Payment ID and action are required" },
        { status: 400 }
      );
    }

    // Get the payment attempt
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        hostel: {
          select: { UserId: true },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Verify the hostel owner is the one who owns this hostel
    if (payment.hostel.UserId !== user.id) {
      return NextResponse.json(
        { error: "You can only verify payments for your own hostels" },
        { status: 403 }
      );
    }

    let newStatus;
    if (action === "verify") {
      // Mark as completed
      if (payment.status !== "PENDING_CONFIRMATION") {
        return NextResponse.json(
          { error: "This payment is not awaiting verification" },
          { status: 400 }
        );
      }
      newStatus = "COMPLETED";
    } else if (action === "reject") {
      // Mark as failed
      if (payment.status !== "PENDING_CONFIRMATION") {
        return NextResponse.json(
          { error: "This payment is not awaiting verification" },
          { status: 400 }
        );
      }
      newStatus = "FAILED";
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: newStatus },
    });

    // If payment is completed, update the hostel to show contact info
    if (newStatus === "COMPLETED") {
      await prisma.hostel.update({
        where: { id: payment.hostelId },
        data: {
          contactHidden: false,
        },
      });
    }

    return NextResponse.json({
      message: `Payment ${action === "verify" ? "verified" : "rejected"} successfully`,
      paymentId: updatedPayment.id,
      status: updatedPayment.status,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}