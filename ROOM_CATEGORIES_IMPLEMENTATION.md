# Room Categories Implementation Guide

This document outlines the implementation of the new room categories feature for the Campus Cottages application.

## Overview

The hostel booking system now supports multiple room categories per hostel (e.g., "shared," "single," "deluxe"), allowing hostel owners to define different types of rooms with varying prices and available quantities.

## Database Schema Changes

1. Created a new `RoomCategory` model with the following attributes:
   - `id`: Primary key
   - `name`: String (e.g., "shared", "single", "deluxe")
   - `price`: Integer (price per semester)
   - `availableRooms`: Integer (number of available rooms)
   - `totalRooms`: Integer (total number of rooms in that category)
   - `hostelId`: Foreign key referencing the Hostel table
   - `description`: Optional string
   - `photos`: Array of strings

2. Modified the `Hostel` model:
   - Removed the `rooms` and `price` fields (price is now per room category)
   - Added a one-to-many relationship with `RoomCategory`

3. Updated the `Booking` model:
   - Added `roomCategoryId` field to track which category a room was booked from

## New Components

1. `SelectRoomCategory.tsx`: Component for hostel owners to select and configure room categories
2. `RoomCategories.tsx`: Component for students to select a room category when booking
3. `RoomCategoryDisplay.tsx`: Component to display room categories on the hostel detail page
4. `BookingDetails.tsx`: Updated component to show which room category was booked

## Workflow Changes

### For Hostel Owners:

1. When creating a hostel, owners now go through an additional "rooms" step where they:
   - Select which room categories they want to offer
   - Specify the number of rooms available in each category
   - Set the price for each category
   - Provide optional descriptions for each category

2. When viewing their listings, owners can see:
   - The total number of rooms across all categories
   - Availability status per category
   - Income reports per room category (future enhancement)

### For Students:

1. When browsing hostel listings, students can see:
   - Price ranges based on room categories
   - Total room availability across categories

2. When viewing a hostel detail page, students can:
   - See all available room categories with descriptions and prices
   - Select a specific room category when booking
   - See availability per room category

3. In their bookings list, students can see:
   - Which room category they booked
   - The price they paid based on the selected category

## Implementation Notes

### Data Migration

A migration script (`scripts/migrate-to-room-categories.ts`) has been created to:
- Identify existing hostels without room categories
- Create a default room category for each existing hostel based on their current data
- Set the availableRooms and totalRooms based on the hostel's original rooms value

Run this script to migrate existing data:
```bash
npx ts-node scripts/migrate-to-room-categories.ts
```

### Booking Process

1. When a booking is created, it now references both the hostel and the specific room category
2. The booking process automatically decrements the `availableRooms` count in the corresponding category
3. Error handling prevents bookings when no rooms are available in a category

### Transaction Safety

The booking process uses Prisma transactions to ensure data consistency, preventing race conditions where multiple users might try to book the last available room simultaneously.

## Future Enhancements

1. Room category-specific photos
2. More detailed room descriptions with amenities
3. Ability for hostel owners to add/edit/remove room categories after initial creation
4. Reporting and analytics per room category
5. Add specific features/amenities per room category