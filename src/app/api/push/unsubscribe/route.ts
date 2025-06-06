import { NextRequest, NextResponse } from 'next/server';

// Store subscriptions (in production, use a database)
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json();
    
    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: 'Endpoint required' },
        { status: 400 }
      );
    }

    // Remove subscription
    const removed = subscriptions.delete(endpoint);
    
    console.log('Push subscription removed:', endpoint, 'Found:', removed);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from push notifications'
    });
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}
