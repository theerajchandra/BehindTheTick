import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database - in production, use a real database
const users = [
  {
    id: '1',
    email: 'demo@behindthetick.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    name: 'Demo User',
    subscription: 'premium',
    preferences: {
      theme: 'dark',
      notifications: {
        email: true,
        push: false,
        frequency: 'daily'
      },
      watchlist: ['AAPL', 'TSLA', 'NVDA'],
      defaultView: 'grid',
      riskTolerance: 'moderate'
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'Authorization token required'
      }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Find user by ID
      const userIndex = users.findIndex(u => u.id === decoded.userId);
      
      if (userIndex === -1) {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      const updates = await request.json();
      
      // Merge updates with existing user data
      const updatedUser = {
        ...users[userIndex],
        ...updates,
        id: users[userIndex].id, // Prevent ID changes
        email: users[userIndex].email, // Prevent email changes via this endpoint
        password: users[userIndex].password // Prevent password changes via this endpoint
      };

      users[userIndex] = updatedUser;

      // Return updated user data (excluding password)
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      return NextResponse.json({
        success: true,
        user: userWithoutPassword
      });

    } catch (jwtError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
