import { NextResponse } from 'next/server';
import { profiles } from '@/utils/sampleData';

export async function GET() {
  try {
    // In production, this would fetch from a database
    // For now, return the sample data
    return NextResponse.json({
      success: true,
      data: profiles,
      total: profiles.length
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 500 }
    );
  }
}
