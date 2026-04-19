const rateLimitMap = new Map();

/**
 * A basic in-memory rate limiter for API routes.
 * Suitable for single-instance stateless testing, but requires Redis mapping for multi-instance production.
 * @param {string} ip - User's IP address or identifier
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {boolean} - Returns true if request is allowed, false if rate limited
 */
export function basicRateLimit(ip, limit = 5, windowMs = 60 * 1000) {
  if (!ip) return true; // Fail open if no IP

  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const record = rateLimitMap.get(ip);
  if (now > record.resetAt) {
    record.count = 1;
    record.resetAt = now + windowMs;
    return true;
  }

  if (record.count >= limit) {
    return false; // Rate limited
  }

  record.count += 1;
  return true;
}
