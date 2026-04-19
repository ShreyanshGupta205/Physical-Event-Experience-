const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding demo events...');

  const demoEvents = [
    {
      title: 'National Hackathon 2026',
      type: 'Innovation',
      category: 'technology',
      description: 'The flagship event for young developers to build the future of decentralization and AI.',
      venue: 'Pragati Maidan, New Delhi',
      date: '2026-05-15',
      time: '09:00',
      endDate: '2026-05-17',
      endTime: '18:00',
      capacity: 500,
      status: 'upcoming',
      featured: true,
      color: '#6366f1',
      organizerId: 'org-001',
      organizerName: 'Tech Council',
      tags: 'ai,blockchain,dev',
      gates: {
        create: [
          { name: 'Alpha Gate', capacity: 200, queue: 15, throughput: 120 },
          { name: 'Beta Gate (VIP)', capacity: 100, queue: 5, throughput: 80 }
        ]
      },
      zones: {
        create: [
          { name: 'Main Hall', capacity: 300, occupancy: 45, color: '#6366f1' },
          { name: 'Workshop Arena', capacity: 150, occupancy: 20, color: '#10b981' },
          { name: 'Chill Zone', capacity: 50, occupancy: 10, color: '#f59e0b' }
        ]
      },
      schedule: {
        create: [
          { time: '09:00', title: 'Opening Ceremony', type: 'ceremony' },
          { time: '11:00', title: 'Hacking Begins', type: 'main' },
          { time: '14:00', title: 'Workshop: Next.js 16', type: 'workshop' }
        ]
      },
      speakers: {
        create: [
          { name: 'Dr. Sarah Chen', role: 'Head of AI', avatar: 'SC' },
          { name: 'Marcus Thorne', role: 'CTO, Sphere', avatar: 'MT' }
        ]
      }
    },
    {
      title: 'Sustaina-Con 2026',
      type: 'Summit',
      category: 'social',
      description: 'A global movement focusing on renewable energy and sustainable urban architecture.',
      venue: 'Convention Centre, Bangalore',
      date: '2026-06-20',
      time: '10:00',
      endDate: '2026-06-20',
      endTime: '20:00',
      capacity: 1200,
      status: 'upcoming',
      trending: true,
      color: '#10b981',
      organizerId: 'org-002',
      organizerName: 'Green Earth Found',
      tags: 'nature,future,energy',
      gates: {
        create: [
          { name: 'Primary Entry', capacity: 600, queue: 10, throughput: 450 },
          { name: 'Side Entrance', capacity: 600, queue: 5, throughput: 300 }
        ]
      },
      zones: {
        create: [
          { name: 'Solar Expo', capacity: 800, occupancy: 200, color: '#10b981' },
          { name: 'Bio-Tech Lab', capacity: 400, occupancy: 150, color: '#3b82f6' }
        ]
      },
      schedule: {
        create: [
          { time: '10:00', title: 'Keynote: The Green Shift', type: 'keynote' },
          { time: '13:00', title: 'Networking Lunch', type: 'networking' }
        ]
      },
      speakers: {
        create: [
          { name: 'Elon Green', role: 'Climate Scientist', avatar: 'EG' }
        ]
      }
    }
  ];

  try {
    // Clear existing data (optional, but good for a fresh start)
    await prisma.gate.deleteMany({});
    await prisma.zone.deleteMany({});
    await prisma.scheduleItem.deleteMany({});
    await prisma.speaker.deleteMany({});
    await prisma.registration.deleteMany({});
    await prisma.event.deleteMany({});

    for (const e of demoEvents) {
      await prisma.event.create({
        data: e
      });
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
