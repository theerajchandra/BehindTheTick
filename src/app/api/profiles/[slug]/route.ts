import { NextResponse } from 'next/server';
import { profiles, trades, newsArticles } from '@/utils/sampleData';

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

    // Get trades for this profile
    const profileTrades = trades.filter(trade => trade.profileId === profile.id);
    
    // Get news articles for this profile
    const profileNews = newsArticles.filter(article => 
      article.tags.includes(profile.name) || 
      article.tags.includes('politics') || 
      article.tags.includes('finance')
    );

    // Calculate additional metrics
    const totalTrades = profileTrades.length;
    const totalValue = profileTrades.reduce((sum, trade) => sum + trade.value, 0);
    const avgTradeValue = totalTrades > 0 ? totalValue / totalTrades : 0;
    
    const recentTrades = profileTrades
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    const response = {
      success: true,
      data: {
        profile,
        trades: recentTrades,
        news: profileNews.slice(0, 10),
        metrics: {
          totalTrades,
          totalValue,
          avgTradeValue,
          successRate: profile.successRate
        }
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile data' },
      { status: 500 }
    );
  }
}
