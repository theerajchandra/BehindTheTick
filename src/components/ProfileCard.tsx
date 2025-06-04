'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Profile } from '@/types';
import { formatCurrency } from '@/utils';
import { formatDate } from '@/utils/dateUtils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const isPositive = profile.stats.netProfitLoss > 0;
  const isNeutral = profile.stats.netProfitLoss === 0;

  return (
    <Card className="group">
      <CardContent className="p-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="relative">
            <Image
              src={profile.avatar}
              alt={profile.name}
              width={64}
              height={64}
              className="rounded-full ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all duration-300"
            />
            <Badge 
              variant={profile.type === 'politician' ? 'secondary' : 'primary'}
              className="absolute -bottom-1 -right-1 text-xs px-2 py-1"
            >
              {profile.type}
            </Badge>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-100 truncate group-hover:text-blue-300 transition-colors duration-200">
              {profile.name}
            </h3>
            <p className="text-sm text-gray-400 truncate">{profile.title}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Total Trades</span>
            <span className="text-sm font-medium text-gray-200">{profile.stats.totalTrades}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">P/L</span>
            <div className="flex items-center space-x-1">
              {isNeutral ? (
                <Minus className="h-3 w-3 text-gray-400" />
              ) : isPositive ? (
                <TrendingUp className="h-3 w-3 text-green-400" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-400" />
              )}
              <span className={`text-sm font-medium ${
                isNeutral ? 'text-gray-400' : isPositive ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(profile.stats.netProfitLoss)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Win Rate</span>
            <span className="text-sm font-medium text-gray-200">{profile.stats.winRate.toFixed(1)}%</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Last Trade</span>
            <span className="text-xs text-gray-500">{formatDate(profile.stats.lastTradeDate)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/profiles/${profile.slug}`} className="w-full">
          <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-200">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
