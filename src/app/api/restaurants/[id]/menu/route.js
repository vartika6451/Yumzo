import { NextResponse } from 'next/server';
import connectDB from '../../../../../lib/db.js';
import MenuItem from '../../../../../models/MenuItem.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const menuItems = await MenuItem.find({ restaurant: id });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
