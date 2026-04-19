import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/broadcast - Fetch active broadcasts
export async function GET() {
  try {
    const broadcasts = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(broadcasts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 });
  }
}

// POST /api/admin/broadcast - Create new announcement
export async function POST(request) {
  try {
    const { title, message, type } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message required' }, { status: 400 });
    }

    const broadcast = await prisma.announcement.create({
      data: {
        title,
        message,
        type: type || 'info',
        createdBy: 'system-admin',
        active: true
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_BROADCAST',
        details: `Broadcast: ${title}`,
        performerId: 'system-admin',
        targetId: broadcast.id,
        targetType: 'system'
      }
    });

    return NextResponse.json(broadcast);
  } catch (error) {
    console.error('BROADCAST_ERROR:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}
