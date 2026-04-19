import { z } from 'zod';

// MongoDB ObjectId regex (24 character hex string)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format');

// --- User Validations ---
export const UserSyncSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'organizer', 'admin', 'staff']).default('student'),
});

// --- Event Validations ---
export const EventSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  type: z.string(),
  category: z.string().optional().default('other'),
  description: z.string().optional().default(''),
  venue: z.string(),
  date: z.string(),
  time: z.string(),
  capacity: z.coerce.number().int().positive(),
  organizerId: z.string(),
  organizerName: z.string(),
  color: z.string().optional().default('#6C63FF'),
  tags: z.union([z.string(), z.array(z.string())]).optional().default([]),
});

// --- Registration Validations ---
export const RegistrationSchema = z.object({
  eventId: objectIdSchema,
  userId: objectIdSchema.optional(),
  userEmail: z.string().email().optional(),
});

// --- Check-in Validations ---
export const CheckInSchema = z.object({
  eventId: objectIdSchema,
  passId: z.string().min(5, 'Invalid Pass ID format'),
});
