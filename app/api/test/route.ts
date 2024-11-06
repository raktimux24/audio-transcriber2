import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.GOOGLE_API_KEY,
    keyLength: process.env.GOOGLE_API_KEY?.length || 0,
  });
} 