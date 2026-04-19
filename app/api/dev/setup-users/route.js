import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const testUsers = [
  { name: 'Test Explorer', email: 'student@eventra.ai', password: 'password123', role: 'student' },
  { name: 'Test Creator', email: 'organizer@eventra.ai', password: 'password123', role: 'organizer' },
  { name: 'Test Overseer', email: 'admin@eventra.ai', password: 'password123', role: 'admin' },
  { name: 'Test Guardian', email: 'staff@eventra.ai', password: 'password123', role: 'staff' },
];

export async function GET() {
  const results = [];
  
  for (const u of testUsers) {
    try {
      // 1. Try to create in Firebase
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, u.email, u.password);
        await updateProfile(userCredential.user, { displayName: u.name });
        results.push({ email: u.email, firebase: 'created' });
      } catch (fbError) {
        if (fbError.code === 'auth/email-already-in-use') {
           results.push({ email: u.email, firebase: 'already-exists' });
        } else {
           throw fbError;
        }
      }

      // 2. Upsert in Prisma
      await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          role: u.role,
          status: 'active'
        },
        create: {
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'active'
        }
      });
      
      results[results.length - 1].prisma = 'upserted';
    } catch (err) {
      console.error('Failed for', u.email, err);
      results.push({ email: u.email, error: err.message });
    }
  }

  return NextResponse.json({ success: true, results });
}
