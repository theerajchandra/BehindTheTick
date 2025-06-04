import { Metadata } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';
import Badge from '@/components/Badge';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Market Insights | BehindTheTick',
  description: 'AI-powered insights and analysis of politician and trader moves',
};

const insights = [
  {
    id: 1,
    title: 'Tech Stocks Show Unusual Activity',
    description: 'Multiple politicians have increased their tech holdings by 23% this quarter',
    type: 'trend',
    impact: 'high',
    timestamp: '2 hours ago',
    metrics: {
      accuracy: 94,
      confidence: 87,
      followers: 12500
    }
  },
  {
    id: 2,
    title: 'Healthcare Sector Rotation Detected',
    description: 'Notable shift from biotech to medical devices among insider trades',
    type: 'alert',
    impact: 'medium',
    timestamp: '5 hours ago',
    metrics: {
      accuracy: 89,
      confidence: 92,
      followers: 8300
    }
  },
  {
    id: 3,
    title: 'Energy Stock Consolidation Pattern',
    description: 'Renewable energy stocks showing coordinated buying patterns',
    type: 'opportunity',
    impact: 'high',
    timestamp: '1 day ago',
    metrics: {
      accuracy: 91,
      confidence: 85,
      followers: 15600
    }
  },
  {
    id: 4,
    title: 'Defensive Positioning in Utilities',
    description: 'Increased utility sector allocation suggests market uncertainty',
    type: 'warning',
    impact: 'medium',
    timestamp: '2 days ago',
    metrics: {
      accuracy: 88,
      confidence: 79,
      followers: 7200
    }
  }
];

const getInsightIcon = (type: string) => {
  switch (type) {
    case 'trend':
      return <TrendingUp className="w-5 h-5" />;
    case 'alert':
      return <AlertTriangle className="w-5 h-5" />;
    case 'opportunity':
      return <Target className="w-5 h-5" />;
    case 'warning':
      return <TrendingDown className="w-5 h-5" />;
    default:
      return <TrendingUp className="w-5 h-5" />;
  }
};

const getInsightColor = (type: string) => {
  switch (type) {
    case 'trend':
      return 'text-blue-400';
    case 'alert':
      return 'text-yellow-400';
    case 'opportunity':
      return 'text-green-400';
    case 'warning':
      return 'text-red-400';
    default:
      return 'text-blue-400';
  }
};

export default function InsightsPage() {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Market Insights</h1>
          <p className="text-gray-400 text-lg max-w-3xl">
            AI-powered analysis of political and institutional trading patterns to identify market opportunities and risks.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">94.2%</div>
              <div className="text-sm text-gray-400">Prediction Accuracy</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">127</div>
              <div className="text-sm text-gray-400">Active Signals</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">$2.4M</div>
              <div className="text-sm text-gray-400">Avg Trade Size</div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">18.3%</div>
              <div className="text-sm text-gray-400">Monthly Alpha</div>
            </div>
          </Card>
        </div>

        {/* Insights List */}
        <div className="space-y-6">
          {insights.map((insight) => (
            <Card key={insight.id} className="p-6 hover:bg-gray-800 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`${getInsightColor(insight.type)} mt-1`}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
                      <Badge 
                        variant={insight.impact === 'high' ? 'destructive' : insight.impact === 'medium' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {insight.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-gray-400 mb-4">{insight.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span>Accuracy: {insight.metrics.accuracy}%</span>
                      <span>Confidence: {insight.metrics.confidence}%</span>
                      <span>{insight.metrics.followers.toLocaleString()} followers</span>
                      <span>{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors">
            Load More Insights
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}
