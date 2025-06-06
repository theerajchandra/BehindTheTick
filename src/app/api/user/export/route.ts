import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

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

export async function POST(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request);
    
    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const { format = 'json', includeWatchlist = true, includePreferences = true, includeActivity = false } = await request.json();

    // In production, fetch actual user data from database
    const userData = {
      userId,
      profile: {
        name: 'Demo User',
        email: 'demo@behindthetick.com',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      preferences: includePreferences ? {
        theme: 'dark',
        notifications: {
          email: true,
          push: false,
          frequency: 'daily'
        },
        privacy: {
          profileVisibility: 'public',
          showTradeHistory: true,
          showWatchlist: false
        },
        display: {
          defaultView: 'grid',
          itemsPerPage: 20,
          autoRefresh: true
        }
      } : null,
      watchlist: includeWatchlist ? [
        { symbol: 'AAPL', addedAt: new Date().toISOString() },
        { symbol: 'TSLA', addedAt: new Date().toISOString() },
        { symbol: 'NVDA', addedAt: new Date().toISOString() }
      ] : null,
      activity: includeActivity ? {
        loginHistory: [
          { timestamp: new Date().toISOString(), ip: '192.168.1.1', userAgent: 'Demo Browser' }
        ],
        searchHistory: [
          { query: 'AAPL', timestamp: new Date().toISOString() },
          { query: 'Nancy Pelosi', timestamp: new Date().toISOString() }
        ]
      } : null,
      exportDate: new Date().toISOString(),
      format
    };

    // Filter out null values
    const filteredData = Object.fromEntries(
      Object.entries(userData).filter(([_, value]) => value !== null)
    );

    if (format === 'csv') {
      // Convert to CSV format for watchlist
      let csvContent = 'Symbol,Date Added\n';
      if (filteredData.watchlist) {
        filteredData.watchlist.forEach((item: any) => {
          csvContent += `${item.symbol},${item.addedAt}\n`;
        });
      }
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="behindthetick-data-${userId}-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    // Return JSON format
    return NextResponse.json({
      success: true,
      data: filteredData
    });

  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
