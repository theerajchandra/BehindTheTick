import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json();
    
    // In production, save to database with user authentication
    // For now, we'll just validate and return success
    
    const validPreferences = {
      tradeAlerts: Boolean(preferences.tradeAlerts),
      priceTargets: Boolean(preferences.priceTargets),
      newsAlerts: Boolean(preferences.newsAlerts),
      marketUpdates: Boolean(preferences.marketUpdates),
      politicianActivity: Boolean(preferences.politicianActivity),
      urgentOnly: Boolean(preferences.urgentOnly),
      quietHours: {
        enabled: Boolean(preferences.quietHours?.enabled),
        start: preferences.quietHours?.start || '22:00',
        end: preferences.quietHours?.end || '08:00'
      }
    };
    
    console.log('Notification preferences updated:', validPreferences);
    
    return NextResponse.json({
      success: true,
      message: 'Notification preferences updated successfully',
      preferences: validPreferences
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database based on authenticated user
    const defaultPreferences = {
      tradeAlerts: true,
      priceTargets: true,
      newsAlerts: false,
      marketUpdates: true,
      politicianActivity: true,
      urgentOnly: false,
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
    
    return NextResponse.json({
      success: true,
      preferences: defaultPreferences
    });
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch preferences' },
      { status: 500 }
    );
  }
}
