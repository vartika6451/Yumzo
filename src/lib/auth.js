import { cookies, headers } from 'next/headers';
import User from '../models/User.js';
import { verifyTokenString } from './jwt.js';
import connectDB from './db.js';

export async function getAuthenticatedUser() {
  await connectDB();
  let token = null;

  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (tokenCookie) {
      token = tokenCookie.value;
    }
  } catch {
    // Ignore cookie read error
  }

  if (!token) {
    try {
      const headerList = await headers();
      const authHeader = headerList.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    } catch {
      // Ignore header read error
    }
  }

  if (!token) return null;

  const decoded = verifyTokenString(token);
  if (!decoded || !decoded.id) return null;

  try {
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    console.error('Error fetching authenticated user:', err);
    return null;
  }
}
