import { NextRequest, NextResponse } from 'next/server';

// In production, these would be stored securely in environment variables
const VAPID_KEYS = {
  publicKey: 'BEl62iUYgUivxIkv69yViEuiBIa40HI0PO2HbOgYbRE3VlWh3UFFdBrAO4Q6xE7DuZJHoaGFW7t_XU2Dq7Z9mDo',
  privateKey: 'YourPrivateVapidKeyHere' // This should be in environment variables
};

// Store subscriptions (in production, use a database)
const subscriptions = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const { subscription, preferences } = await request.json();
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: 'Invalid subscription data' },
        { status: 400 }
      );
    }

    // Store subscription with preferences
    const subscriptionData = {
      subscription,
      preferences: preferences || {},
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    subscriptions.set(subscription.endpoint, subscriptionData);
    
    console.log('New push subscription registered:', subscription.endpoint);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to push notifications'
    });
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
