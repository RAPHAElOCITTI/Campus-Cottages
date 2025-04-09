"use client";

import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingDetailsProps {
  startDate: Date;
  endDate: Date;
  hostelTitle: string | null;
  roomCategoryName: string | null;
  roomCategoryPrice: number | null;
  createdAt: Date;
}

export function BookingDetails({
  startDate,
  endDate,
  hostelTitle,
  roomCategoryName,
  roomCategoryPrice,
  createdAt
}: BookingDetailsProps) {
  // Format dates
  const formattedStartDate = format(new Date(startDate), "dd MMM yyyy");
  const formattedEndDate = format(new Date(endDate), "dd MMM yyyy");
  const bookingDate = format(new Date(createdAt), "dd MMM yyyy");

  // Calculate duration in days
  const duration = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="bg-blue-50 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{hostelTitle || "Unnamed Hostel"}</CardTitle>
            <CardDescription className="mt-1">Booked on {bookingDate}</CardDescription>
          </div>
          <Badge variant="success" className="border-green-200">
            Confirmed
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 pb-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Check-in</p>
            <p className="font-medium">{formattedStartDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Check-out</p>
            <p className="font-medium">{formattedEndDate}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Room Category</p>
              <p className="font-medium capitalize">{roomCategoryName || "Standard Room"}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">USh {roomCategoryPrice?.toLocaleString() || "N/A"}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Duration: {duration} day{duration !== 1 ? "s" : ""}
          </p>
        </div>
      </CardContent>

      <CardFooter className="bg-gray-50 py-3 flex justify-end">
        <Button variant="outline" size="sm" className="mr-2">
          Contact Host
        </Button>
        <Button size="sm">View Details</Button>
      </CardFooter>
    </Card>
  );
}