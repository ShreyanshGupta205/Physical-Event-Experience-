import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/registrations?userId=123
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { bookedAt: 'desc' }
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

// POST /api/registrations
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.eventId || !data.userId) {
      return NextResponse.json({ error: 'eventId and userId are required' }, { status: 400 });
    }

    // Resolve the real MongoDB user — by ID first, then fall back to email
    let user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (!user && data.userEmail) {
      user = await prisma.user.findUnique({ where: { email: data.userEmail } });
    }
    if (!user) {
      return NextResponse.json({ error: 'User account not found in database. Please sign out and sign in again.' }, { status: 404 });
    }

    // Resolve the event
    const event = await prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    if (event.registered >= event.capacity) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 });
    }

    // Check if already registered using the resolved user's ID
    const existing = await prisma.registration.findFirst({
      where: { eventId: data.eventId, userId: user.id }
    });
    
    if (existing) {
      return NextResponse.json({ error: 'You are already registered for this event.' }, { status: 400 });
    }


    // Create Registration using Transaction (to increment event count simultaneously)
    const result = await prisma.$transaction(async (tx) => {
      const reg = await tx.registration.create({
        data: {
          userId: user.id,       // always use the resolved DB user ID
          eventId: data.eventId,
          qrCode: `${event.id.toUpperCase()}-${user.id.toUpperCase()}-REG${Date.now()}`,
          passId: `PASS-${event.id.slice(-3).toUpperCase()}-${Date.now()}`,
          status: 'confirmed'
        },
        include: { event: true }
      });


      await tx.event.update({
        where: { id: event.id },
        data: { registered: { increment: 1 } }
      });

      return reg;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('CRITICAL REGISTRATION FAILURE:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Unique constraint failed - you are likely already registered or have a duplicate pass.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to process registration', details: error.message }, { status: 500 });
  }
}
