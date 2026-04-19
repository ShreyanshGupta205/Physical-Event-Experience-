import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/admin/logs - Fetch latest audit logs
export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50 // Limit to latest 50 for performance
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
  }
}
