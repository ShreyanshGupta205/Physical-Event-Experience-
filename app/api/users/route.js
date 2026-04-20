import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserSyncSchema } from '@/lib/validations';

// POST /api/users - Upsert user from Firebase
export async function POST(request) {
  try {
    const json = await request.json();
    
    // Validate request body
    const validation = UserSyncSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const data = validation.data;
    const email = data.email.toLowerCase();

    // Upsert user based on email (Firebase's primary unique identifier)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: data.name || undefined,
      },
      create: {
        name: data.name || 'Eventra Member',
        email,
        role: data.role,
        status: 'active'
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// GET /api/users?email=test@test.com
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get('email');

    if (!rawEmail) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
