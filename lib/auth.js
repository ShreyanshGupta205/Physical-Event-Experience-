import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT missing. Auth verification will be disabled (DANGER).');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

/**
 * Verifies a Firebase ID Token from the Authorization header
 * @param {Request} request 
 * @returns {Promise<Object|null>} decoded token or null
 */
export async function verifyAuth(request) {
  // If not configured, we might want to fail-closed in production, 
  // but for development we'll allow an "unauthenticated" state or bypass if configured.
  if (!admin.apps.length) {
    console.warn('Auth check bypassed: Firebase Admin not initialized.');
    return { uid: 'dev-user', email: 'dev@example.com', role: 'admin' }; // MOCK for dev
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * helper to require a specific role
 */
export function hasRole(token, requiredRole) {
  if (!token) return false;
  // This assumes you add 'role' to custom claims during user sync or creation
  return token.role === requiredRole || token.role === 'admin';
}
