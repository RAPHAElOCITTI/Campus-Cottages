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
      // If the hostel has rooms data, use it to create a room category
      if (hostel.rooms) {
        const roomCount = parseInt(hostel.rooms, 10) || 1;
        
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
      } else {
        console.log(`Skipping hostel ${hostel.id} - no rooms data`);
      }
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