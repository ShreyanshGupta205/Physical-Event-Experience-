import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
      include: {
        gates: true,
        zones: true,
        schedule: true,
        speakers: true
      }
    });
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// POST /api/events
export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.type || !data.venue || !data.capacity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        type: data.type,
        category: data.category || 'other',
        description: data.description || '',
        venue: data.venue,
        date: data.date || new Date().toISOString().split('T')[0],
        time: data.time || '10:00',
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        endTime: data.endTime || '18:00',
        capacity: parseInt(data.capacity),
        status: data.status || 'upcoming',
        organizerId: data.organizerId || 'org-001',
        organizerName: data.organizerName || 'Default Organizer',
        color: data.color || '#6C63FF',
        tags: data.tags || ''
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
