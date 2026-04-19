import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventSchema } from '@/lib/validations';

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
    const json = await request.json();
    
    // Validate request body
    const validation = EventSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const data = validation.data;

    // Normalize tags to array
    const tagsArray = Array.isArray(data.tags) 
      ? data.tags 
      : data.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    const event = await prisma.event.create({
      data: {
        title: data.title,
        type: data.type,
        category: data.category,
        description: data.description,
        venue: data.venue,
        date: data.date,
        time: data.time,
        capacity: data.capacity,
        organizerId: data.organizerId,
        organizerName: data.organizerName,
        color: data.color,
        tags: tagsArray,
        status: 'pending' // Enforce approval workflow
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
