import { NextResponse } from 'next/server';

// Simplistic in-memory rate limiting for Edge Runtime
// Note: In a real production app with multiple instances, use Redis.
const rateLimitMap = new Map();

export function middleware(request) {
  const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  const requestData = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - requestData.startTime > windowMs) {
    requestData.count = 1;
    requestData.startTime = now;
  } else {
    requestData.count++;
  }

  rateLimitMap.set(ip, requestData);

  if (requestData.count > maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  const response = NextResponse.next();

  // Add extra security headers at the middleware level
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  return response;
}

export const config = {
  matcher: ['/api/:path*'], // Apply rate limiting specifically to API routes
};
