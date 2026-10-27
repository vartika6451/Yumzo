import { NextResponse } from 'next/server';
import connectDB from '../../../lib/db.js';
import Restaurant from '../../../models/Restaurant.js';

export async function GET() {
  try {
    await connectDB();
    const restaurants = await Restaurant.find({});
    return NextResponse.json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
