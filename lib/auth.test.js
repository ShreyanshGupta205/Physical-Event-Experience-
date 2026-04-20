import admin from 'firebase-admin';
import { verifyAuth, hasRole } from './auth';

jest.mock('firebase-admin', () => {
  const verifyIdToken = jest.fn();
  return {
    apps: { length: 1 },
    auth: () => ({ verifyIdToken }),
    credential: { cert: jest.fn() },
    initializeApp: jest.fn(),
  };
});

describe('auth lib', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyAuth', () => {
    it('returns null if no Authorization header', async () => {
      const mockRequest = { headers: new Map() };
      const result = await verifyAuth(mockRequest);
      expect(result).toBeNull();
    });

    it('returns null if header is not Bearer', async () => {
      const mockRequest = { headers: new Map([['Authorization', 'Basic 123']]) };
      const result = await verifyAuth(mockRequest);
      expect(result).toBeNull();
    });

    it('returns decoded token if valid', async () => {
      const mockToken = { uid: '123', email: 'test@example.com' };
      admin.auth().verifyIdToken.mockResolvedValue(mockToken);
      const mockRequest = { headers: new Map([['Authorization', 'Bearer valid-token']]) };
      const result = await verifyAuth(mockRequest);
      expect(result).toEqual(mockToken);
    });

    it('returns null if verification fails', async () => {
      admin.auth().verifyIdToken.mockRejectedValue(new Error('Invalid token'));
      const mockRequest = { headers: new Map([['Authorization', 'Bearer invalid-token']]) };
      const result = await verifyAuth(mockRequest);
      expect(result).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('returns true if roles match', () => {
      const token = { role: 'organizer' };
      expect(hasRole(token, 'organizer')).toBe(true);
    });

    it('returns true if user is admin regardless of required role', () => {
      const token = { role: 'admin' };
      expect(hasRole(token, 'staff')).toBe(true);
    });

    it('returns false if roles do not match', () => {
      const token = { role: 'student' };
      expect(hasRole(token, 'staff')).toBe(false);
    });

    it('returns false if no token', () => {
      expect(hasRole(null, 'staff')).toBe(false);
    });
  });
});
