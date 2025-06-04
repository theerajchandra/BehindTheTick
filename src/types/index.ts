export interface Profile {
  id: string;
  slug: string;
  name: string;
  title: string;
  avatar: string;
  type: 'politician' | 'trader' | 'investor';
  biography: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  stats: {
    totalTrades: number;
    netProfitLoss: number;
    winRate: number;
    lastTradeDate: string;
  };
}

export interface Trade {
  id: string;
  profileId: string;
  date: string;
  ticker: string;
  company: string;
  shares: number;
  price: number;
  type: 'Buy' | 'Sell';
  source: 'Official Filing' | 'Social Media' | 'News Report';
  formType?: string;
  confidence: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
}

export interface SocialPost {
  id: string;
  content: string;
  url: string;
  publishedAt: string;
  platform: 'twitter' | 'instagram' | 'linkedin';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

export interface Recommendation {
  action: 'Buy' | 'Hold' | 'Sell';
  ticker: string;
  confidence: number;
  reasoning: string;
  targetPrice?: number;
  timeHorizon?: string;
}

export interface PricePoint {
  date: string;
  price: number;
  volume?: number;
}

export interface MarketData {
  ticker: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
}

export interface WatchlistItem {
  profileId: string;
  addedAt: string;
  notifications: boolean;
}
