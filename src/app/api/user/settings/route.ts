import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user settings database - in production, use a real database
const userSettings = new Map<string, any>();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Default user settings
const defaultSettings = {
  profile: {
    name: '',
    email: '',
    bio: '',
    location: '',
    website: '',
    twitter: '',
    linkedin: '',
    avatar: ''
  },
  notifications: {
    email: true,
    push: false,
    trades: true,
    priceAlerts: true,
    news: false,
    marketing: false,
    frequency: 'daily'
  },
  privacy: {
    profileVisibility: 'public',
    showTradeHistory: true,
    showWatchlist: false,
    allowDataExport: true,
    analyticsOptOut: false
  },
  display: {
    theme: 'dark',
    defaultView: 'grid',
    itemsPerPage: 20,
    autoRefresh: true,
    compactMode: false,
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    currency: 'USD'
  },
  trading: {
    riskTolerance: 'moderate',
    defaultPortfolioView: 'summary',
    showPaperTrading: true,
    alertThresholds: {
      priceChange: 5,
      volumeChange: 50,
      newsImpact: 'medium'
    },
    autoSync: true
  },
  mobile: {
    pushNotifications: false,
    biometricAuth: false,
    offlineMode: true,
    dataUsage: 'wifi-only',
    location: false
  }
};

function getUserIdFromToken(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    // Get user settings or return defaults
    const settings = userSettings.get(userId) || defaultSettings;
    
    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const updates = await request.json();
    
    // Get existing settings or defaults
    const existingSettings = userSettings.get(userId) || defaultSettings;
    
    // Deep merge the updates with existing settings
    const updatedSettings = {
      ...existingSettings,
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    // Validate settings structure
    if (updates.display && updates.display.theme && !['light', 'dark', 'system'].includes(updates.display.theme)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid theme value'
      }, { status: 400 });
    }
    
    if (updates.privacy && updates.privacy.profileVisibility && !['public', 'private', 'friends'].includes(updates.privacy.profileVisibility)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid profile visibility value'
      }, { status: 400 });
    }
    
    // Store updated settings
    userSettings.set(userId, updatedSettings);
    
    console.log('User settings updated for:', userId);
    
    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }
    
    // Reset to default settings
    userSettings.set(userId, defaultSettings);
    
    return NextResponse.json({
      success: true,
      message: 'Settings reset to defaults',
      settings: defaultSettings
    });
  } catch (error) {
    console.error('Error resetting user settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset settings' },
      { status: 500 }
    );
  }
}
