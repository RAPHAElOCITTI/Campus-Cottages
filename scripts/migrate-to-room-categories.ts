import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

async function migrateToRoomCategories() {
  console.log('Starting migration of existing hostels to room categories...');
  
  try {
    // Get all hostels that don't have room categories yet
    const hostels = await prisma.hostel.findMany({
      where: {
        RoomCategory: {
          none: {}
        }
      }
    });
    
    console.log(`Found ${hostels.length} hostels to migrate`);
    
    for (const hostel of hostels) {
      // Use guests data as a fallback for estimating room count
      // since we don't have a direct 'rooms' property
      const guestsCount = hostel.guests ? parseInt(hostel.guests, 10) : null;
      const roomCount = guestsCount ? Math.ceil(guestsCount / 2) : 1; // Assume ~2 guests per room
      
      // Create a default room category based on the hostel's existing data
      await prisma.roomCategory.create({
          data: {
            name: hostel.categoryName === 'shared' || hostel.categoryName === 'single' 
              ? hostel.categoryName 
              : 'standard',
            price: hostel.price || 0,
            availableRooms: roomCount,
            totalRooms: roomCount,
            hostelId: hostel.id,
            description: `Standard ${hostel.categoryName || 'room'} in ${hostel.title || 'hostel'}`,
          }
        });
        
        console.log(`Created room category for hostel ${hostel.id}`);
      // No else clause needed - we're handling all hostels now
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the migration
migrateToRoomCategories();