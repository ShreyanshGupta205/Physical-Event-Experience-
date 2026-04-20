const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCreator() {
  console.log("🛠️  Linking Master Creator Account...");
  
  try {
    const user = await prisma.user.upsert({
      where: { email: 'shreyansh@eventra.com' },
      update: { role: 'organizer', name: 'Shreyansh (Master Creator)' },
      create: { 
        email: 'shreyansh@eventra.com', 
        name: 'Shreyansh (Master Creator)', 
        role: 'organizer' 
      }
    });
    
    console.log("✅ SUCCESS: 'shreyansh@eventra.com' is now a Master Organizer.");
  } catch (err) {
    console.error("❌ FAILED:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

createCreator();
