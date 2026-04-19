import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/admin/users/create-guardian
export async function POST(request) {
  try {
    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    // In a real app, we would create a Firebase user here too.
    // For this version, we will upsert in Prisma.
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        role: 'staff',
        status: 'active'
      },
      create: {
        name,
        email,
        role: 'staff',
        status: 'active'
      }
    });

    await prisma.auditLog.create({
      data: {
        action: 'CREATE_GUARDIAN',
        details: `Created staff account for ${email}`,
        performerId: 'system-admin',
        targetId: user.id,
        targetType: 'user'
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Guardian creation error:', error);
    return NextResponse.json({ error: 'Failed to create guardian' }, { status: 500 });
  }
}
