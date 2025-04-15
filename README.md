# Campus Cottages

Campus Cottages is a platform connecting students with hostel accommodations near educational institutions. The platform enables students to easily find and book hostels, while hostel owners can list and manage their properties.

## User Roles

The application supports two distinct user roles with different permissions:

### Student Role
- Browse available hostels and view detailed information
- Add hostels to favorites list
- Book rooms in hostels for specific date ranges
- Manage their bookings

### Hostel Owner Role
- Create and list hostel properties
- Add detailed information including photos, description, and location
- Define room categories with different prices and availability
- Manage their hostel listings

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Authentication and Role Selection

Users can register and log in using Kinde authentication. After registration, they can switch between Student and Hostel Owner roles through the user menu.

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: Kinde Auth
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: Supabase for image storage
- **Styling**: Tailwind CSS with Shadcn UI components
- **Maps**: Integration for hostel location display

## Features

- **User Management**: Authentication, role-based access control
- **Hostel Management**: Creation, editing, and detailed hostel information
- **Room Categories**: Different room types with varying prices
- **Booking System**: Date selection, room category booking
- **Location Services**: Map integration for hostel locations
- **Responsive Design**: Mobile and desktop friendly UI

## Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for Prisma)
- Kinde Auth configuration variables
- Supabase configuration for image storage
