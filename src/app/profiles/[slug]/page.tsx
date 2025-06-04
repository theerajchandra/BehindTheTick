'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { TradeTable } from '@/components/TradeTable';
import { RecommendationWidget } from '@/components/RecommendationWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { 
  PerformanceChart, 
  SectorAllocationChart, 
  TradeVolumeChart, 
  HoldingsComparisonChart 
} from '@/components/Charts';
import { useWatchlist } from '@/hooks/useWatchlist';
import { sampleProfiles, sampleTrades, sampleNews } from '@/utils/sampleData';
import { getRecommendation, calculatePortfolioMetrics } from '@/utils/buySellLogic';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils';
import { formatDate } from '@/utils/dateUtils';
import { 
  Star, 
  StarOff, 
  ExternalLink, 
  Twitter, 
  Globe, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  DollarSign
} from 'lucide-react';

interface ProfileDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProfileDetailPage({ params }: ProfileDetailPageProps) {
  const [activeTab, setActiveTab] = useState<'trades' | 'charts' | 'news' | 'social'>('trades');
  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const profile = sampleProfiles.find(p => p.slug === params.slug);
  
  if (!profile) {
    notFound();
  }

  const profileTrades = sampleTrades.filter(t => t.profileId === profile.id);
  const recommendation = getRecommendation(profileTrades, []);
  const portfolioMetrics = calculatePortfolioMetrics(profileTrades);
  const isWatched = isInWatchlist(profile.id);

  // Import chart data generators
  const { 
    generatePerformanceData, 
    generateSectorAllocation, 
    generateTradeVolumeData, 
    generateTopHoldings 
  } = require('@/utils/sampleData');

  const performanceData = generatePerformanceData(profile.id);
  const sectorData = generateSectorAllocation(profile.id);
  const volumeData = generateTradeVolumeData(profile.id);
  const holdingsData = generateTopHoldings(profile.id);

  const tabs = [
    { id: 'trades', label: 'Latest Trades', count: profileTrades.length },
    { id: 'charts', label: 'Charts & Analytics', count: null },
    { id: 'news', label: 'News', count: sampleNews.length },
    { id: 'social', label: 'Social Feed', count: 12 },
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-950">
        {/* Hero Banner */}
        <div className="relative h-64 bg-gradient-to-r from-blue-900 to-purple-900">
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative max-w-7xl mx-auto px-6 h-full flex items-end pb-8">
            <div className="flex items-end gap-6">
              <div className="relative">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-full ring-4 ring-white/20"
                />
                <Badge 
                  variant={profile.type === 'politician' ? 'secondary' : 'primary'}
                  className="absolute -bottom-2 -right-2 px-3 py-1"
                >
                  {profile.type}
                </Badge>
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
                <p className="text-xl text-gray-300 mb-4">{profile.title}</p>
                <div className="flex items-center gap-4">
                  {profile.socialLinks.twitter && (
                    <a
                      href={profile.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {profile.socialLinks.website && (
                    <a
                      href={profile.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
              <Button
                onClick={() => toggleWatchlist(profile.id)}
                variant={isWatched ? 'primary' : 'outline'}
                className="flex items-center gap-2"
              >
                {isWatched ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                {isWatched ? 'Watching' : 'Watch'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sticky Metrics Bar */}
        <div className="sticky top-16 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <BarChart3 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Total Trades</span>
                </div>
                <span className="text-lg font-semibold text-white">{profile.stats.totalTrades}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Net P/L</span>
                </div>
                <span className={`text-lg font-semibold ${
                  profile.stats.netProfitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formatCurrency(profile.stats.netProfitLoss)}
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Win Rate</span>
                </div>
                <span className="text-lg font-semibold text-white">{formatPercentage(profile.stats.winRate)}</span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Last Trade</span>
                </div>
                <span className="text-sm text-gray-300">{formatDate(profile.stats.lastTradeDate)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Biography */}
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{profile.biography}</p>
                </CardContent>
              </Card>

              {/* Tabs */}
              <div>
                <div className="flex border-b border-gray-800 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-400 text-blue-400'
                          : 'border-transparent text-gray-400 hover:text-gray-300'
                      }`}
                    >
                      {tab.label} {tab.count && `(${tab.count})`}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'trades' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Latest Trades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TradeTable trades={profileTrades} />
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'charts' && (
                  <div className="space-y-6">
                    {/* Performance Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <PerformanceChart 
                          data={performanceData} 
                          height={350}
                          showArea={true}
                          color="#3B82F6"
                        />
                      </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Sector Allocation */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Sector Allocation</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <SectorAllocationChart 
                            data={sectorData} 
                            height={300}
                          />
                        </CardContent>
                      </Card>

                      {/* Trade Volume */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Monthly Trade Volume</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <TradeVolumeChart 
                            data={volumeData} 
                            height={300}
                            showBuySell={true}
                          />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Top Holdings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Holdings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HoldingsComparisonChart 
                          data={holdingsData} 
                          height={300}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'news' && (
                  <div className="space-y-4">
                    {sampleNews.map((article) => (
                      <Card key={article.id} className="hover:border-gray-700 transition-colors">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            {article.imageUrl && (
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                width={120}
                                height={80}
                                className="rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                  {article.title}
                                </a>
                              </h3>
                              <p className="text-gray-400 text-sm mb-3">{article.excerpt}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500">{article.source}</span>
                                <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                              </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'social' && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-400 mb-4">Social feed integration coming soon</p>
                      <Badge variant="secondary">Twitter API Integration Pending</Badge>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recommendation Widget */}
              <RecommendationWidget 
                recommendation={recommendation} 
                profileName={profile.name}
              />

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Buy Trades</span>
                    <span className="text-green-400 font-medium">
                      {profileTrades.filter(t => t.type === 'Buy').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sell Trades</span>
                    <span className="text-red-400 font-medium">
                      {profileTrades.filter(t => t.type === 'Sell').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Buy Value</span>
                    <span className="text-gray-200">{formatCurrency(portfolioMetrics.totalBuyValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Sell Value</span>
                    <span className="text-gray-200">{formatCurrency(portfolioMetrics.totalSellValue)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
