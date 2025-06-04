import { NextRequest, NextResponse } from 'next/server';

// Sample news data generator
function generateNewsData(limit: number = 20, category?: string, profileId?: string) {
  const categories = ['market', 'politics', 'trading', 'insider', 'regulation'];
  const sources = ['Financial Times', 'Wall Street Journal', 'Reuters', 'Bloomberg', 'CNBC', 'MarketWatch'];
  const authors = ['Sarah Johnson', 'Michael Chen', 'David Rodriguez', 'Emily Thompson', 'James Wilson'];
  
  const sampleNews = [];
  
  for (let i = 0; i < limit; i++) {
    const randomCategory = category || categories[Math.floor(Math.random() * categories.length)];
    const publishedDate = new Date();
    publishedDate.setDate(publishedDate.getDate() - Math.floor(Math.random() * 30));
    
    sampleNews.push({
      id: `news-${i + 1}`,
      title: generateNewsTitle(randomCategory),
      summary: generateNewsSummary(randomCategory),
      category: randomCategory,
      source: sources[Math.floor(Math.random() * sources.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      publishedAt: publishedDate.toISOString(),
      url: `https://example.com/news/${i + 1}`,
      imageUrl: `https://images.unsplash.com/photo-${1600000000 + i}?w=400&h=200&fit=crop`,
      readingTime: Math.floor(Math.random() * 8) + 2,
      tags: generateNewsTags(randomCategory),
      relatedProfiles: profileId ? [profileId] : generateRelatedProfiles(),
      sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
      views: Math.floor(Math.random() * 10000) + 100,
      likes: Math.floor(Math.random() * 500) + 10
    });
  }
  
  return sampleNews;
}

function generateNewsTitle(category: string): string {
  const titles = {
    market: [
      'Stock Market Hits New Highs Amid Economic Uncertainty',
      'Tech Stocks Rally Following Positive Earnings Reports',
      'Federal Reserve Signals Interest Rate Changes',
      'Market Volatility Increases Ahead of Election',
      'Cryptocurrency Markets Show Mixed Signals'
    ],
    politics: [
      'Congress Debates New Financial Regulations',
      'Senator Proposes Stock Trading Ban for Politicians',
      'Political Insider Trading Under Investigation',
      'New Transparency Rules for Government Officials',
      'Congressional Ethics Committee Reviews Trading Policies'
    ],
    trading: [
      'Hedge Fund Manager Makes Billion-Dollar Bet',
      'Insider Trading Scandal Rocks Wall Street',
      'Algorithmic Trading Dominates Market Activity',
      'Retail Investors Challenge Traditional Trading',
      'Options Activity Reaches Record Levels'
    ],
    insider: [
      'Corporate Executive Sells Major Holdings',
      'Insider Trading Alerts Trigger SEC Investigation',
      'Board Members Disclose Significant Transactions',
      'Executive Stock Options Exercise Creates Waves',
      'Insider Activity Signals Market Direction'
    ],
    regulation: [
      'SEC Proposes New Disclosure Requirements',
      'Financial Regulators Tighten Oversight',
      'New Rules Target High-Frequency Trading',
      'Compliance Costs Rise for Financial Firms',
      'International Regulatory Coordination Increases'
    ]
  };
  
  const categoryTitles = titles[category as keyof typeof titles] || titles.market;
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
}

function generateNewsSummary(category: string): string {
  const summaries = {
    market: 'Market analysis reveals significant trends in investor behavior and economic indicators pointing to potential shifts in trading patterns.',
    politics: 'Political developments continue to impact financial markets as lawmakers debate new regulations affecting trading practices.',
    trading: 'Trading activity shows unusual patterns as institutional and retail investors adjust their strategies amid changing market conditions.',
    insider: 'Recent insider trading activity has drawn attention from regulators and market participants monitoring compliance requirements.',
    regulation: 'Regulatory changes are being implemented to enhance transparency and protect investors in an evolving financial landscape.'
  };
  
  return summaries[category as keyof typeof summaries] || summaries.market;
}

function generateNewsTags(category: string): string[] {
  const tagMap = {
    market: ['stocks', 'trading', 'market-analysis', 'economics'],
    politics: ['congress', 'policy', 'regulation', 'government'],
    trading: ['hedge-funds', 'options', 'retail-trading', 'algorithms'],
    insider: ['sec', 'compliance', 'disclosure', 'investigation'],
    regulation: ['fintech', 'oversight', 'rules', 'enforcement']
  };
  
  return tagMap[category as keyof typeof tagMap] || tagMap.market;
}

function generateRelatedProfiles(): string[] {
  const profiles = ['nancy-pelosi', 'warren-buffett', 'michael-burry', 'elon-musk'];
  const count = Math.floor(Math.random() * 3) + 1;
  return profiles.sort(() => 0.5 - Math.random()).slice(0, count);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category') || undefined;
    const profileId = searchParams.get('profile') || undefined;
    const search = searchParams.get('search') || '';
    
    let news = generateNewsData(limit, category, profileId);
    
    // Filter by search term if provided
    if (search) {
      news = news.filter(article => 
        article.title.toLowerCase().includes(search.toLowerCase()) ||
        article.summary.toLowerCase().includes(search.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
      );
    }
    
    // Sort by published date (newest first)
    news.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
      filters: {
        categories: ['market', 'politics', 'trading', 'insider', 'regulation'],
        sources: ['Financial Times', 'Wall Street Journal', 'Reuters', 'Bloomberg', 'CNBC', 'MarketWatch']
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}
