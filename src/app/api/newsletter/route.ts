import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would integrate with email services like:
// - SendGrid, Mailchimp, ConvertKit, etc.
// - Database to store subscribers
// - Email validation services

interface NewsletterSubscription {
  email: string;
  preferences?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    categories: string[];
    profiles: string[];
  };
  source?: string;
}

// Mock database for demonstration
const subscribers = new Set<string>();
const subscriptionData = new Map<string, NewsletterSubscription>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences, source } = body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }
    
    // Check if already subscribed
    if (subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Email already subscribed' },
        { status: 409 }
      );
    }
    
    // Add subscriber
    const subscription: NewsletterSubscription = {
      email: email.toLowerCase(),
      preferences: {
        frequency: preferences?.frequency || 'weekly',
        categories: preferences?.categories || ['market', 'politics', 'insider'],
        profiles: preferences?.profiles || []
      },
      source: source || 'website'
    };
    
    subscribers.add(email.toLowerCase());
    subscriptionData.set(email.toLowerCase(), subscription);
    
    // In production, you would:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Add to email service provider
    // 4. Log analytics event
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        email: subscription.email,
        preferences: subscription.preferences
      }
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe to newsletter' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, preferences } = body;
    
    if (!email || !subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    // Update preferences
    const existingSubscription = subscriptionData.get(email.toLowerCase());
    if (existingSubscription) {
      existingSubscription.preferences = {
        ...existingSubscription.preferences,
        ...preferences
      };
      subscriptionData.set(email.toLowerCase(), existingSubscription);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Newsletter preferences updated',
      data: existingSubscription
    });
  } catch (error) {
    console.error('Error updating newsletter preferences:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email || !subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    // Remove subscriber
    subscribers.delete(email.toLowerCase());
    subscriptionData.delete(email.toLowerCase());
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      // Return subscription statistics (for admin)
      return NextResponse.json({
        success: true,
        data: {
          totalSubscribers: subscribers.size,
          frequencyBreakdown: getFrequencyBreakdown(),
          categoryBreakdown: getCategoryBreakdown(),
          sourceBreakdown: getSourceBreakdown()
        }
      });
    }
    
    // Get specific subscription
    if (!subscribers.has(email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    const subscription = subscriptionData.get(email.toLowerCase());
    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching newsletter data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch newsletter data' },
      { status: 500 }
    );
  }
}

function getFrequencyBreakdown() {
  const breakdown = { daily: 0, weekly: 0, monthly: 0 };
  subscriptionData.forEach(sub => {
    if (sub.preferences?.frequency) {
      breakdown[sub.preferences.frequency]++;
    }
  });
  return breakdown;
}

function getCategoryBreakdown() {
  const breakdown: Record<string, number> = {};
  subscriptionData.forEach(sub => {
    sub.preferences?.categories.forEach(category => {
      breakdown[category] = (breakdown[category] || 0) + 1;
    });
  });
  return breakdown;
}

function getSourceBreakdown() {
  const breakdown: Record<string, number> = {};
  subscriptionData.forEach(sub => {
    const source = sub.source || 'unknown';
    breakdown[source] = (breakdown[source] || 0) + 1;
  });
  return breakdown;
}
