import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { nanoid } from "nanoid";

// Generate unique reference code
function generateReferenceCode() {
  // Format: MM-XXXXX where X is alphanumeric
  return `MM-${nanoid(5).toUpperCase()}`;
}

// Create a new payment attempt
export async function POST(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  // Verify user is a student
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== "STUDENT") {
    return NextResponse.json(
      { error: "Only students can make payments" },
      { status: 403 }
    );
  }

  try {
    const { hostelId, roomCategoryId } = await request.json();

    if (!hostelId || !roomCategoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if hostel and room category exist
    const hostel = await prisma.hostel.findUnique({
      where: { id: hostelId },
      include: { RoomCategory: true },
    });

    if (!hostel) {
      return NextResponse.json(
        { error: "Hostel not found" },
        { status: 404 }
      );
    }

    const roomCategory = hostel.RoomCategory.find(
      (cat) => cat.id === roomCategoryId
    );

    if (!roomCategory) {
      return NextResponse.json(
        { error: "Room category not found" },
        { status: 404 }
      );
    }

    // Check for an existing payment attempt that's not failed
    const existingPayment = await prisma.paymentAttempt.findFirst({
      where: {
        userId: user.id,
        hostelId: hostelId,
        roomCategoryId: roomCategoryId,
        status: { not: "FAILED" },
      },
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          message: "Payment attempt already exists",
          paymentId: existingPayment.id,
          referenceCode: existingPayment.referenceCode,
          status: existingPayment.status,
        },
        { status: 200 }
      );
    }

    // Create a new payment attempt
    const referenceCode = generateReferenceCode();
    const paymentAttempt = await prisma.paymentAttempt.create({
      data: {
        referenceCode,
        userId: user.id,
        hostelId: hostelId,
        roomCategoryId: roomCategoryId,
        status: "PENDING",
        // Fixed amount of 5000 UGX (default in schema)
      },
    });

    return NextResponse.json({
      message: "Payment attempt created",
      paymentId: paymentAttempt.id,
      referenceCode: paymentAttempt.referenceCode,
      status: paymentAttempt.status,
    });
  } catch (error) {
    console.error("Error creating payment attempt:", error);
    return NextResponse.json(
      { error: "Failed to create payment attempt" },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get("paymentId");
  const referenceCode = searchParams.get("referenceCode");
  const hostelId = searchParams.get("hostelId");
  const roomCategoryId = searchParams.get("roomCategoryId");

  // If specific payment ID or reference code is provided
  if (paymentId || referenceCode) {
    try {
      const payment = await prisma.paymentAttempt.findFirst({
        where: {
          ...(paymentId ? { id: paymentId } : {}),
          ...(referenceCode ? { referenceCode } : {}),
          userId: user.id,
        },
        include: {
          hostel: {
            select: {
              title: true,
              contactPhone: true,
              contactEmail: true,
              contactWhatsapp: true,
              contactHidden: true,
            },
          },
          roomCategory: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      });

      if (!payment) {
        return NextResponse.json(
          { error: "Payment not found" },
          { status: 404 }
        );
      }

      // Only include contact details if payment is completed
      const contactInfo = payment.status === "COMPLETED" && !payment.hostel.contactHidden
        ? {
            contactPhone: payment.hostel.contactPhone,
            contactEmail: payment.hostel.contactEmail,
            contactWhatsapp: payment.hostel.contactWhatsapp,
          }
        : null;

      return NextResponse.json({
        id: payment.id,
        referenceCode: payment.referenceCode,
        status: payment.status,
        amount: payment.amount,
        hostelTitle: payment.hostel.title,
        roomCategory: payment.roomCategory.name,
        roomPrice: payment.roomCategory.price,
        contactInfo,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      });
    } catch (error) {
      console.error("Error fetching payment:", error);
      return NextResponse.json(
        { error: "Failed to fetch payment" },
        { status: 500 }
      );
    }
  } 
  // If hostelId and roomCategoryId are provided, check if a payment exists
  else if (hostelId && roomCategoryId) {
    try {
      const payment = await prisma.paymentAttempt.findFirst({
        where: {
          hostelId,
          roomCategoryId,
          userId: user.id,
          status: { not: "FAILED" },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!payment) {
        return NextResponse.json({ exists: false });
      }

      return NextResponse.json({
        exists: true,
        paymentId: payment.id,
        referenceCode: payment.referenceCode,
        status: payment.status,
      });
    } catch (error) {
      console.error("Error checking payment:", error);
      return NextResponse.json(
        { error: "Failed to check payment" },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }
}

// Update payment status (mark as sent)
export async function PATCH(request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json(
      { error: "You must be logged in" },
      { status: 401 }
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

    // Verify payment belongs to user
    const payment = await prisma.paymentAttempt.findFirst({
      where: {
        id: paymentId,
        userId: user.id,
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    let newStatus;
    if (action === "markAsSent") {
      // Student marking payment as sent
      if (payment.status !== "PENDING") {
        return NextResponse.json(
          { error: "Payment is not in PENDING status" },
          { status: 400 }
        );
      }
      newStatus = "PENDING_CONFIRMATION";
    } else {
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    }

    // Update payment status
    const updatedPayment = await prisma.paymentAttempt.update({
      where: { id: paymentId },
      data: { status: newStatus },
    });

    return NextResponse.json({
      message: "Payment status updated",
      paymentId: updatedPayment.id,
      status: updatedPayment.status,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}