import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Run all count aggregations concurrently
    const [totalUsers, totalEvents, totalRegistrations] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.registration.count(),
    ]);

    // Fetch latest users for the Governance Table
    const recentUsers = await prisma.user.findMany({
      orderBy: { joined: 'desc' },
      take: 5,
      // We explicitly include count of their registrations for the UI
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    // Fetch events requiring admin action
    const pendingEvents = await prisma.event.findMany({
      where: {
        status: { in: ['pending', 'upcoming'] } // Treating upcoming as needing review for demo
      },
      orderBy: { date: 'asc' },
      take: 5,
      select: {
        id: true,
        title: true,
        organizerName: true,
        status: true
      }
    });

    // Structure the data to match the UI expectations
    const stats = {
      totalUsers,
      totalEvents,
      totalRegistrations,
      pendingApprovals: pendingEvents.length
    };

    const formattedUsers = recentUsers.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      registrations: user._count.registrations
    }));

    return NextResponse.json({
      stats,
      users: formattedUsers,
      pendingEvents
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch platform metrics' }, { status: 500 });
  }
}
