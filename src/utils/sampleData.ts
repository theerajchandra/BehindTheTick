import { Profile, Trade, NewsArticle, SocialPost } from '@/types';

// Generate sample chart data
export const generatePerformanceData = (profileId: string) => {
  const data = [];
  const startDate = new Date('2024-01-01');
  const startValue = 1000000;
  let currentValue = startValue;

  for (let i = 0; i < 365; i += 7) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const volatility = 0.02;
    const trend = 0.0003;
    const change = (Math.random() - 0.5) * volatility + trend;
    currentValue *= (1 + change);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue)
    });
  }
  
  return data;
};

export const generateSectorAllocation = (profileId: string) => {
  return [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Healthcare', value: 22, color: '#10B981' },
    { name: 'Finance', value: 18, color: '#F59E0B' },
    { name: 'Energy', value: 12, color: '#EF4444' },
    { name: 'Consumer', value: 8, color: '#8B5CF6' },
    { name: 'Other', value: 5, color: '#06B6D4' }
  ];
};

export const generateTradeVolumeData = (profileId: string) => {
  const data = [];
  const startDate = new Date('2024-01-01');

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    data.push({
      date: monthName,
      buys: Math.floor(Math.random() * 5000000) + 1000000,
      sells: Math.floor(Math.random() * 4000000) + 800000,
      volume: Math.floor(Math.random() * 8000000) + 2000000
    });
  }
  
  return data;
};

export const generateTopHoldings = (profileId: string) => {
  const stocks = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'META', 'AMZN', 'BRK.B'];
  
  return stocks.slice(0, 6).map(stock => ({
    stock,
    value: Math.floor(Math.random() * 2000000) + 500000
  }));
};

export const sampleProfiles: Profile[] = [
  {
    id: '1',
    slug: 'nancy-pelosi',
    name: 'Nancy Pelosi',
    title: 'Former Speaker of the House',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c6d37574?w=150&h=150&fit=crop&crop=face',
    type: 'politician',
    biography: 'Former Speaker of the United States House of Representatives and current member of Congress representing California.',
    socialLinks: {
      twitter: 'https://twitter.com/SpeakerPelosi',
      website: 'https://pelosi.house.gov',
    },
    stats: {
      totalTrades: 45,
      netProfitLoss: 2150000,
      winRate: 73.5,
      lastTradeDate: '2025-05-28T00:00:00Z',
    },
  },
  {
    id: '2',
    slug: 'warren-buffett',
    name: 'Warren Buffett',
    title: 'CEO of Berkshire Hathaway',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    type: 'investor',
    biography: 'American business magnate, investor, and philanthropist. Chairman and CEO of Berkshire Hathaway.',
    socialLinks: {
      website: 'https://www.berkshirehathaway.com',
    },
    stats: {
      totalTrades: 23,
      netProfitLoss: 15800000,
      winRate: 89.2,
      lastTradeDate: '2025-05-25T00:00:00Z',
    },
  },
  {
    id: '3',
    slug: 'michael-burry',
    name: 'Michael Burry',
    title: 'Founder of Scion Asset Management',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    type: 'trader',
    biography: 'American investor, hedge fund manager, and physician. Founder of Scion Asset Management.',
    socialLinks: {
      twitter: 'https://twitter.com/michaeljburry',
    },
    stats: {
      totalTrades: 67,
      netProfitLoss: -850000,
      winRate: 62.3,
      lastTradeDate: '2025-06-01T00:00:00Z',
    },
  },
  {
    id: '4',
    slug: 'alexandria-ocasio-cortez',
    name: 'Alexandria Ocasio-Cortez',
    title: 'U.S. Representative',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    type: 'politician',
    biography: 'U.S. Representative for New York\'s 14th congressional district.',
    socialLinks: {
      twitter: 'https://twitter.com/AOC',
      website: 'https://ocasio-cortez.house.gov',
    },
    stats: {
      totalTrades: 12,
      netProfitLoss: 45000,
      winRate: 58.3,
      lastTradeDate: '2025-05-30T00:00:00Z',
    },
  },
  {
    id: '5',
    slug: 'elon-musk',
    name: 'Elon Musk',
    title: 'CEO of Tesla & SpaceX',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    type: 'trader',
    biography: 'Entrepreneur and business magnate. CEO of Tesla and SpaceX.',
    socialLinks: {
      twitter: 'https://twitter.com/elonmusk',
      website: 'https://tesla.com',
    },
    stats: {
      totalTrades: 89,
      netProfitLoss: 8900000,
      winRate: 76.4,
      lastTradeDate: '2025-06-02T00:00:00Z',
    },
  },
  {
    id: '6',
    slug: 'chuck-grassley',
    name: 'Chuck Grassley',
    title: 'U.S. Senator',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&h=150&fit=crop&crop=face',
    type: 'politician',
    biography: 'U.S. Senator from Iowa serving since 1981.',
    socialLinks: {
      twitter: 'https://twitter.com/ChuckGrassley',
      website: 'https://grassley.senate.gov',
    },
    stats: {
      totalTrades: 34,
      netProfitLoss: 780000,
      winRate: 67.6,
      lastTradeDate: '2025-05-26T00:00:00Z',
    },
  },
  {
    id: '7',
    slug: 'cathie-wood',
    name: 'Cathie Wood',
    title: 'CEO of ARK Invest',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    type: 'investor',
    biography: 'American investor and founder of ARK Invest, focused on disruptive innovation.',
    socialLinks: {
      twitter: 'https://twitter.com/cathiedwood',
      website: 'https://ark-invest.com',
    },
    stats: {
      totalTrades: 156,
      netProfitLoss: -2300000,
      winRate: 45.8,
      lastTradeDate: '2025-06-01T00:00:00Z',
    },
  },
  {
    id: '8',
    slug: 'jamie-dimon',
    name: 'Jamie Dimon',
    title: 'CEO of JPMorgan Chase',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    type: 'trader',
    biography: 'American business executive and billionaire, CEO of JPMorgan Chase.',
    socialLinks: {
      website: 'https://jpmorganchase.com',
    },
    stats: {
      totalTrades: 41,
      netProfitLoss: 3200000,
      winRate: 78.9,
      lastTradeDate: '2025-05-29T00:00:00Z',
    },
  },
  {
    id: '9',
    slug: 'george-soros',
    name: 'George Soros',
    title: 'Chairman of Soros Fund Management',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    type: 'investor',
    biography: 'Hungarian-American billionaire investor and philanthropist.',
    socialLinks: {
      website: 'https://soros.com',
    },
    stats: {
      totalTrades: 28,
      netProfitLoss: 12500000,
      winRate: 85.7,
      lastTradeDate: '2025-05-27T00:00:00Z',
    },
  },
  {
    id: '10',
    slug: 'mark-cuban',
    name: 'Mark Cuban',
    title: 'Owner of Dallas Mavericks',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    type: 'trader',
    biography: 'American billionaire entrepreneur, television personality, and investor.',
    socialLinks: {
      twitter: 'https://twitter.com/mcuban',
      website: 'https://markcuban.com',
    },
    stats: {
      totalTrades: 73,
      netProfitLoss: 1850000,
      winRate: 69.8,
      lastTradeDate: '2025-06-01T00:00:00Z',
    },
  },
  {
    id: '11',
    slug: 'josh-hawley',
    name: 'Josh Hawley',
    title: 'U.S. Senator',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    type: 'politician',
    biography: 'U.S. Senator from Missouri serving since 2019.',
    socialLinks: {
      twitter: 'https://twitter.com/hawleymo',
      website: 'https://hawley.senate.gov',
    },
    stats: {
      totalTrades: 19,
      netProfitLoss: 320000,
      winRate: 63.2,
      lastTradeDate: '2025-05-31T00:00:00Z',
    },
  },
  {
    id: '12',
    slug: 'ray-dalio',
    name: 'Ray Dalio',
    title: 'Founder of Bridgewater Associates',
    avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
    type: 'investor',
    biography: 'American billionaire investor and hedge fund manager, founder of Bridgewater Associates.',
    socialLinks: {
      twitter: 'https://twitter.com/raydalio',
      website: 'https://principles.com',
    },
    stats: {
      totalTrades: 52,
      netProfitLoss: 7800000,
      winRate: 81.4,
      lastTradeDate: '2025-05-28T00:00:00Z',
    },
  },
];

export const sampleTrades: Trade[] = [
  {
    id: '1',
    profileId: '1', // Nancy Pelosi
    date: '2025-05-28T00:00:00Z',
    ticker: 'NVDA',
    company: 'NVIDIA Corporation',
    shares: 1000,
    price: 445.20,
    type: 'Buy',
    source: 'Official Filing',
    formType: 'Form 4',
    confidence: 0.95,
  },
  {
    id: '2',
    profileId: '1', // Nancy Pelosi
    date: '2025-05-25T00:00:00Z',
    ticker: 'AAPL',
    company: 'Apple Inc.',
    shares: 2500,
    price: 189.75,
    type: 'Sell',
    source: 'Official Filing',
    formType: 'Form 4',
    confidence: 0.98,
  },
  {
    id: '3',
    profileId: '2', // Warren Buffett
    date: '2025-05-25T00:00:00Z',
    ticker: 'BRK.B',
    company: 'Berkshire Hathaway Inc.',
    shares: 5000,
    price: 425.80,
    type: 'Buy',
    source: 'Official Filing',
    formType: '13F',
    confidence: 1.0,
  },
  {
    id: '4',
    profileId: '3', // Michael Burry
    date: '2025-06-01T00:00:00Z',
    ticker: 'TSLA',
    company: 'Tesla, Inc.',
    shares: 500,
    price: 210.45,
    type: 'Sell',
    source: 'Social Media',
    confidence: 0.75,
  },
];

export const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Pelosi Makes Major NVIDIA Purchase Ahead of AI Summit',
    excerpt: 'House Speaker Nancy Pelosi disclosed a significant purchase of NVIDIA shares just days before the major AI technology summit in Washington.',
    url: 'https://example.com/news/1',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
    publishedAt: '2025-05-29T08:00:00Z',
    source: 'Financial Times',
  },
  {
    id: '2',
    title: 'Warren Buffett Increases Berkshire Position',
    excerpt: 'The Oracle of Omaha continues to show confidence in his own company with another substantial purchase of Berkshire Hathaway shares.',
    url: 'https://example.com/news/2',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
    publishedAt: '2025-05-26T12:00:00Z',
    source: 'Bloomberg',
  },
];

export const sampleSocialPosts: SocialPost[] = [
  {
    id: '1',
    content: 'Just increased my position in $NVDA. The AI revolution is just getting started! 🚀',
    url: 'https://twitter.com/example/1',
    publishedAt: '2025-05-28T14:30:00Z',
    platform: 'twitter',
    engagement: {
      likes: 2540,
      shares: 834,
      comments: 156,
    },
  },
  {
    id: '2',
    content: 'Market volatility creates opportunities. Remember: time in the market beats timing the market.',
    url: 'https://twitter.com/example/2',
    publishedAt: '2025-05-25T09:15:00Z',
    platform: 'twitter',
    engagement: {
      likes: 8942,
      shares: 3201,
      comments: 445,
    },
  },
];
