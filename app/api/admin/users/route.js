import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/users - List all users with registration counts
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { joined: 'desc' },
      include: {
        _count: {
          select: { registrations: true }
        }
      }
    });

    const formatted = users.map(u => ({
      ...u,
      registrations: u._count.registrations,
      _count: undefined
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}

// POST /api/admin/users - Update user role or status
export async function PATCH(request) {
  try {
    const { id, role, status } = await request.json();

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: role || undefined,
        status: status || undefined
      }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_USER',
        details: `Updated ${user.email}: role=${role || 'N/A'}, status=${status || 'N/A'}`,
        performerId: 'system-admin', // Ideally from session
        targetId: id,
        targetType: 'user'
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
