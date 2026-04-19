import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/checkin
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.eventId || !data.passId) {
      return NextResponse.json({ success: false, message: 'eventId and passId are required' }, { status: 400 });
    }

    // Optional: add a tiny delay to naturally simulate scan processing
    await new Promise(res => setTimeout(res, 400));

    // Verify registration exists
    const registration = await prisma.registration.findUnique({
      where: { passId: data.passId },
      include: { event: true, user: true }
    });

    if (!registration) {
      return NextResponse.json({ success: false, message: 'Invalid Pass ID' }, { status: 404 });
    }

    if (registration.eventId !== data.eventId) {
      return NextResponse.json({ success: false, message: 'Pass does not belong to this event' }, { status: 400 });
    }

    // Check if already checked in? Our MVP just increments event counts for now, 
    // but in a production app we'd add "checkedInAt" to Registration.
    
    // Increment Event Check-in count safely
    await prisma.event.update({
      where: { id: data.eventId },
      data: { checkedIn: { increment: 1 } }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Checked in successfully for ${registration.event.title} (Pass: ${registration.passId})` 
    });

  } catch (error) {
    console.error('Error handling check-in:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
