import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/events/approvals - List events pending review
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { status: 'pending' },
      orderBy: { submittedAt: 'desc' }
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch queue' }, { status: 500 });
  }
}

// PATCH /api/admin/events/approvals - Approve or Reject an event
export async function PATCH(request) {
  try {
    const { id, status, reason } = await request.json();

    if (!id || !['approved', 'rejected', 'upcoming'].includes(status)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    // Maps to the business workflow: Approved events move to 'upcoming' status for students to see
    const finalStatus = status === 'approved' ? 'upcoming' : 'rejected';

    const event = await prisma.event.update({
      where: { id },
      data: {
        status: finalStatus,
        rejectionReason: reason || null,
        approvedAt: status === 'approved' ? new Date() : null
      }
    });

    await prisma.auditLog.create({
      data: {
        action: status === 'approved' ? 'APPROVE_EVENT' : 'REJECT_EVENT',
        details: `${status.toUpperCase()} event: ${event.title}. Note: ${reason || 'None'}`,
        performerId: 'system-admin',
        targetId: id,
        targetType: 'event'
      }
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Approval Error:', error);
    return NextResponse.json({ error: 'Failed to process approval' }, { status: 500 });
  }
}
