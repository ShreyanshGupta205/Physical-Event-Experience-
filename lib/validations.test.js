import { UserSyncSchema, EventSchema } from './validations';

describe('Validation Schemas', () => {
  describe('UserSyncSchema', () => {
    it('should validate a correct user object', () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student'
      };
      const result = UserSyncSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid email', () => {
      const result = UserSyncSchema.safeParse({ email: 'not-an-email' });
      expect(result.success).toBe(false);
    });
  });

  describe('EventSchema', () => {
    it('should validate a minimal valid event', () => {
      const validEvent = {
        title: 'Tech Hackathon',
        type: 'Hackathon',
        venue: 'Main Hall',
        date: '2026-05-20',
        time: '10:00 AM',
        capacity: 100,
        organizerId: 'uuid-123',
        organizerName: 'Alice'
      };
      const result = EventSchema.safeParse(validEvent);
      expect(result.success).toBe(true);
    });

    it('should fail if capacity is negative', () => {
      const result = EventSchema.safeParse({
        title: 'Bad Event',
        capacity: -10
      });
      expect(result.success).toBe(false);
    });
  });
});
