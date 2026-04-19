import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/users - Upsert user from Firebase
export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Upsert user based on email (Firebase's primary unique identifier)
    const user = await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name || undefined,
      },
      create: {
        name: data.name || 'Eventra Member',
        email: data.email,
        role: data.role || 'student',
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
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

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
