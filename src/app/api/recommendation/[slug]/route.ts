import { NextResponse } from 'next/server';
import { profiles, trades } from '@/utils/sampleData';
import { buySellLogic } from '@/utils/buySellLogic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    // Find the profile by slug
    const profile = profiles.find(p => p.slug === slug);
    
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get recent trades for this profile
    const profileTrades = trades
      .filter(trade => trade.profileId === profile.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20);

    // Generate AI recommendations based on trading patterns
    const recommendations = await buySellLogic.generateRecommendations(
      profile,
      profileTrades
    );

    const response = {
      success: true,
      data: {
        profile: {
          id: profile.id,
          name: profile.name,
          slug: profile.slug
        },
        recommendations,
        lastUpdated: new Date().toISOString(),
        disclaimer: "This is not financial advice. AI recommendations are based on historical patterns and should not be used as the sole basis for investment decisions."
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
