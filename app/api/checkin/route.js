import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CheckInSchema } from '@/lib/validations';
import { verifyAuth } from '@/lib/auth';

// POST /api/checkin
export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    
    // Validate request body
    const validation = CheckInSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json({ 
        success: false, 
        message: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const data = validation.data;

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

    if (registration.checkedInAt) {
      return NextResponse.json({ success: false, message: 'Pass already checked in' }, { status: 400 });
    }
    
    // Increment Event Check-in count and mark registration as checked in
    await prisma.$transaction([
      prisma.event.update({
        where: { id: data.eventId },
        data: { checkedIn: { increment: 1 } }
      }),
      prisma.registration.update({
        where: { id: registration.id },
        data: { checkedInAt: new Date() }
      })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: `Checked in successfully for ${registration.event.title} (Pass: ${registration.passId})` 
    });

  } catch (error) {
    console.error('Error handling check-in:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
