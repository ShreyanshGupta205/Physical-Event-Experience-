import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id: eventId } = await params;
    
    if (!eventId) {
      return NextResponse.json({ error: 'Event ID required' }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        id: true,
        capacity: true,
        registered: true,
        checkedIn: true
      }
    });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json(event);

  } catch (error) {
    console.error(`Error fetching telemetry for event ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch telemetry' }, { status: 500 });
  }
}
