'use client';

import { Recommendation } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { TrendingUp, TrendingDown, Minus, Target, Clock } from 'lucide-react';

interface RecommendationWidgetProps {
  recommendation: Recommendation;
  profileName: string;
}

export function RecommendationWidget({ recommendation, profileName }: RecommendationWidgetProps) {
  const getActionIcon = () => {
    switch (recommendation.action) {
      case 'Buy':
        return <TrendingUp className="h-5 w-5 text-green-400" />;
      case 'Sell':
        return <TrendingDown className="h-5 w-5 text-red-400" />;
      default:
        return <Minus className="h-5 w-5 text-gray-400" />;
    }
  };

  const getActionColor = () => {
    switch (recommendation.action) {
      case 'Buy':
        return 'success';
      case 'Sell':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const confidenceColor = recommendation.confidence >= 0.7 ? 'text-green-400' : 
                         recommendation.confidence >= 0.5 ? 'text-yellow-400' : 'text-red-400';

  return (
    <Card className="bg-gradient-to-br from-blue-950 to-purple-950 border-blue-800">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-white">
          <Target className="h-5 w-5 text-blue-400" />
          AI Recommendation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-2">
            Based on {profileName}'s sentiment & historical patterns
          </p>
          <div className="flex items-center justify-center gap-2 mb-3">
            {getActionIcon()}
            <Badge variant={getActionColor() as any} className="text-lg px-4 py-2 font-semibold">
              {recommendation.action}
            </Badge>
            <span className="text-lg font-medium text-blue-400">{recommendation.ticker}</span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Confidence</span>
            <span className={`text-sm font-medium ${confidenceColor}`}>
              {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                recommendation.confidence >= 0.7 ? 'bg-green-500' :
                recommendation.confidence >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${recommendation.confidence * 100}%` }}
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 text-sm">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <p className="text-gray-300 leading-relaxed">
              {recommendation.reasoning}
            </p>
          </div>

          {recommendation.targetPrice && (
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Target Price:</span>
              <span className="text-green-400 font-medium">
                ${recommendation.targetPrice.toFixed(2)}
              </span>
            </div>
          )}

          {recommendation.timeHorizon && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Time Horizon:</span>
              </div>
              <span className="text-gray-300">{recommendation.timeHorizon}</span>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            This is not financial advice. Always do your own research before making investment decisions.
          </p>
        </div>

        {/* Action Button */}
        <Button
          variant="primary"
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          Learn More About {recommendation.ticker}
        </Button>
      </CardContent>
    </Card>
  );
}
