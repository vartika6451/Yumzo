import { NextResponse } from 'next/server';
import { createClient } from '../../../lib/supabase/server.js';
import { isSupabaseConfigured } from '../../../lib/supabase/helpers.js';

// Fictional Delhi NCR fallback restaurants
const FALLBACK_RESTAURANTS = [
  {
    id: 'res-delhi-01',
    name: 'The Indian Spice',
    cuisine: 'Indian',
    address: 'Block M, Connaught Place, New Delhi',
    city: 'New Delhi',
    rating: 4.8,
    delivery_time: '25-35 min',
    image: '/images/indian.jpeg',
  },
  {
    id: 'res-delhi-02',
    name: 'Wok This Way',
    cuisine: 'Chinese',
    address: 'DLF Cyber Hub, Sector 24, Gurugram',
    city: 'Gurugram',
    rating: 4.6,
    delivery_time: '20-30 min',
    image: '/images/chinese.jpeg',
  },
  {
    id: 'res-delhi-03',
    name: 'Tokyo Dreams',
    cuisine: 'Japanese',
    address: 'Worldmark 2, Aerocity, New Delhi',
    city: 'New Delhi',
    rating: 4.9,
    delivery_time: '30-40 min',
    image: '/images/japanese.jpg',
  },
  {
    id: 'res-delhi-04',
    name: 'Bella Trattoria',
    cuisine: 'Italian',
    address: 'Middle Lane, Khan Market, New Delhi',
    city: 'New Delhi',
    rating: 4.7,
    delivery_time: '25-35 min',
    image: '/images/italian.png',
  },
];

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('restaurants')
          .select('*')
          .order('name');

        if (!error && data && data.length > 0) {
          return NextResponse.json(data);
        }
      }
    }

    // Fallback if Supabase is not yet populated
    return NextResponse.json(FALLBACK_RESTAURANTS);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(FALLBACK_RESTAURANTS);
  }
}
