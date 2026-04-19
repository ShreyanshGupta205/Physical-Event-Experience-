const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const prisma = new PrismaClient();

// Explicit 24-character Hex ObjectIDs for MongoDB
const MOCK_IDS = {
  USER_AARAV: "650c1f11bcf86cd799439011",
  USER_KARAN: "650c1f11bcf86cd799439012",
  USER_ARJUN: "650c1f11bcf86cd799439013",
  EVT_HACK:   "650c1f11bcf86cd799439e01",
  EVT_AI:     "650c1f11bcf86cd799439e02",
  EVT_SPORTS: "650c1f11bcf86cd799439e03"
};

const USERS_MOCK = [
  { id: MOCK_IDS.USER_AARAV, name: "Aarav Sharma",  email: "aarav@email.com",  role: "student"   },
  { id: MOCK_IDS.USER_KARAN, name: "Karan Singh",   email: "karan@email.com",  role: "staff"     },
  { id: MOCK_IDS.USER_ARJUN, name: "Arjun Das",     email: "arjun@email.com",  role: "organizer" }
];

async function main() {
  console.log('Cleaning old data and Seeding MongoDB...');

  // Clear in dependency order
  await prisma.registration.deleteMany();
  await prisma.gate.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.scheduleItem.deleteMany();
  await prisma.speaker.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  for (const u of USERS_MOCK) {
    await prisma.user.create({ data: u });
  }

  // ── National Hackathon 2026 ─────────────────────────────────────────
  await prisma.event.create({
    data: {
      id: MOCK_IDS.EVT_HACK,
      title: "National Hackathon 2026",
      type: "Hackathon",
      category: "tech",
      description: "48-hour coding marathon to build solutions for smart cities.",
      venue: "NSIT Auditorium, New Delhi",
      date: "2026-05-10",
      time: "09:00",
      endDate: "2026-05-12",
      endTime: "09:00",
      capacity: 500,
      registered: 423,
      checkedIn: 317,
      status: "upcoming",
      featured: true,
      trending: true,
      color: "#6C63FF",
      organizerId: MOCK_IDS.USER_ARJUN,
      organizerName: "TechFest India",
      tags: ["coding", "innovation", "prizes"],
      gates: {
        create: [
          { name: "Gate A — Main Entry", queue: 28, capacity: 200, throughput: 42 },
          { name: "Gate B — Side Entry",  queue: 12, capacity: 150, throughput: 38 },
          { name: "Gate C — VIP Lounge",  queue: 6,  capacity: 50,  throughput: 22 }
        ]
      },
      zones: {
        create: [
          { name: "Hacking Floors 1-3", capacity: 300, occupancy: 0.72, color: "#6C63FF" },
          { name: "Food & Networking",  capacity: 100, occupancy: 0.55, color: "#00D4AA" },
          { name: "Sponsor Expo",       capacity: 80,  occupancy: 0.40, color: "#FF4757" },
          { name: "Mentors Hub",        capacity: 20,  occupancy: 0.90, color: "#fbbf24" }
        ]
      },
      schedule: {
        create: [
          { time: "09:00", title: "Gates Open & Registration", type: "logistics" },
          { time: "10:00", title: "Opening Keynote",           type: "main"      },
          { time: "11:00", title: "Hacking Begins",            type: "session"   },
          { time: "13:00", title: "Lunch Break",               type: "logistics" },
          { time: "18:00", title: "Mentor Sessions",           type: "workshop"  }
        ]
      },
      speakers: {
        create: [
          { name: "Dr. Priya Nair",    role: "AI Researcher, IIT Delhi"   },
          { name: "Rajan Mehta",       role: "CTO, SmartCity Corp"        },
          { name: "Ananya Krishnan",   role: "Lead Engineer, ISRO"        }
        ]
      }
    }
  });

  // ── AI & ML Summit 2026 ────────────────────────────────────────────
  await prisma.event.create({
    data: {
      id: MOCK_IDS.EVT_AI,
      title: "AI & ML Summit 2026",
      type: "Conference",
      category: "tech",
      description: "India's largest AI conference featuring keynotes from industry leads.",
      venue: "Pragati Maidan, New Delhi",
      date: "2026-05-18",
      time: "10:00",
      startDate: new Date("2026-05-18T10:00:00"),
      endDate: new Date("2026-05-19T18:00:00"),
      capacity: 2000,
      registered: 1876,
      checkedIn: 1200,
      status: "upcoming",
      featured: true,
      trending: true,
      color: "#00D4AA",
      organizerId: MOCK_IDS.USER_ARJUN,
      organizerName: "AI India Foundation",
      tags: ["AI", "machine learning", "conference"],
      gates: {
        create: [
          { name: "Hall 1 — Main",    queue: 45, capacity: 800, throughput: 120 },
          { name: "Hall 2 — Premium", queue: 22, capacity: 600, throughput: 95  },
          { name: "Hall 3 — General", queue: 60, capacity: 600, throughput: 80  }
        ]
      },
      zones: {
        create: [
          { name: "Keynote Arena",    capacity: 1200, occupancy: 0.88, color: "#00D4AA" },
          { name: "Workshop Rooms",   capacity: 400,  occupancy: 0.65, color: "#6C63FF" },
          { name: "Startup Village",  capacity: 300,  occupancy: 0.50, color: "#fbbf24" },
          { name: "Media Lounge",     capacity: 100,  occupancy: 0.30, color: "#FF4757" }
        ]
      },
      schedule: { create: [
        { time: "10:00", title: "Summit Opening",        type: "main"      },
        { time: "11:30", title: "Keynote: Future of AI", type: "main"      },
        { time: "14:00", title: "Hands-on Workshops",    type: "workshop"  },
        { time: "17:00", title: "Panel Discussion",      type: "session"   }
      ]},
      speakers: { create: [
        { name: "Sunder Patel",   role: "Head of AI, Google India" },
        { name: "Dr. Meera Shah", role: "AI Ethics Lead, TCS"      }
      ]}
    }
  });

  // ── IPL Watch Party ────────────────────────────────────────────────
  await prisma.event.create({
    data: {
      id: MOCK_IDS.EVT_SPORTS,
      title: "IPL Watch Party — Finals",
      type: "Sports",
      category: "sports",
      description: "Live screening of IPL 2026 Finals at the stadium.",
      venue: "DY Patil Stadium, Navi Mumbai",
      date: "2026-05-25",
      time: "19:30",
      startDate: new Date("2026-05-25T19:30:00"),
      endDate: new Date("2026-05-25T23:30:00"),
      capacity: 55000,
      registered: 52100,
      checkedIn: 48000,
      status: "upcoming",
      featured: false,
      trending: true,
      color: "#FF4757",
      organizerId: MOCK_IDS.USER_ARJUN,
      organizerName: "BCCI Events",
      tags: ["cricket", "sports", "IPL"],
      gates: {
        create: [
          { name: "North Stand Gate", queue: 120, capacity: 15000, throughput: 500 },
          { name: "South Stand Gate", queue: 95,  capacity: 15000, throughput: 480 },
          { name: "East VIP Gate",    queue: 35,  capacity: 5000,  throughput: 200 }
        ]
      },
      zones: {
        create: [
          { name: "North Stand",  capacity: 20000, occupancy: 0.95, color: "#FF4757" },
          { name: "South Stand",  capacity: 20000, occupancy: 0.90, color: "#FF6B35" },
          { name: "VIP Pavilion", capacity: 5000,  occupancy: 0.80, color: "#fbbf24" },
          { name: "Food Mall",    capacity: 10000, occupancy: 0.60, color: "#00D4AA" }
        ]
      },
      schedule: { create: [
        { time: "18:00", title: "Gates Open",       type: "logistics" },
        { time: "19:00", title: "Pre-match Show",   type: "main"      },
        { time: "19:30", title: "Match Begins",     type: "main"      },
        { time: "23:00", title: "Victory Ceremony", type: "main"      }
      ]},
      speakers: { create: [] }
    }
  });

  console.log('MongoDB Database seeded successfully with full relational data!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
