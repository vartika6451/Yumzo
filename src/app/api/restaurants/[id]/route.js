import { NextResponse } from 'next/server';
import connectDB from '../../../../lib/db.js';
import Restaurant from '../../../../models/Restaurant.js';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
    }
    return NextResponse.json(restaurant);
  } catch (error) {
    console.error('Error fetching restaurant by id:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
