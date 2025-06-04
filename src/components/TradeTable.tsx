'use client';

import { useState } from 'react';
import { Trade } from '@/types';
import { formatCurrency, formatNumber } from '@/utils';
import { formatDate } from '@/utils/dateUtils';
import { Badge } from './Badge';
import { Button } from './Button';
import { ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);

  const sortedTrades = trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-gray-900 rounded-lg overflow-hidden">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Date</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ticker</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Company</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Shares</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Price</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Type</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Source</th>
              <th className="px-6 py-4 text-center text-sm font-medium text-gray-300">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {sortedTrades.map((trade) => (
              <tr
                key={trade.id}
                className="hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedTrade(trade)}
              >
                <td className="px-6 py-4 text-sm text-gray-300">{formatDate(trade.date)}</td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-blue-400">{trade.ticker}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">{trade.company}</td>
                <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatNumber(trade.shares)}</td>
                <td className="px-6 py-4 text-sm text-gray-300 text-right">{formatCurrency(trade.price)}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    {trade.type === 'Buy' ? (
                      <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                    )}
                    <Badge variant={trade.type === 'Buy' ? 'success' : 'danger'}>
                      {trade.type}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="secondary" className="text-xs">
                    {trade.source}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${trade.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{Math.round(trade.confidence * 100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {sortedTrades.map((trade) => (
          <div
            key={trade.id}
            className="bg-gray-900 rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => setSelectedTrade(trade)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-lg font-medium text-blue-400">{trade.ticker}</span>
                <p className="text-sm text-gray-400 truncate">{trade.company}</p>
              </div>
              <div className="flex items-center">
                {trade.type === 'Buy' ? (
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400 mr-1" />
                )}
                <Badge variant={trade.type === 'Buy' ? 'success' : 'danger'}>
                  {trade.type}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Shares:</span>
                <span className="text-gray-200 ml-1">{formatNumber(trade.shares)}</span>
              </div>
              <div>
                <span className="text-gray-400">Price:</span>
                <span className="text-gray-200 ml-1">{formatCurrency(trade.price)}</span>
              </div>
              <div>
                <span className="text-gray-400">Date:</span>
                <span className="text-gray-200 ml-1">{formatDate(trade.date)}</span>
              </div>
              <div>
                <span className="text-gray-400">Confidence:</span>
                <span className="text-gray-200 ml-1">{Math.round(trade.confidence * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trade Detail Modal */}
      {selectedTrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Trade Details</h3>
              <button
                onClick={() => setSelectedTrade(null)}
                className="text-gray-400 hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Ticker:</span>
                <span className="text-blue-400 font-medium">{selectedTrade.ticker}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Company:</span>
                <span className="text-gray-200 text-right">{selectedTrade.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <Badge variant={selectedTrade.type === 'Buy' ? 'success' : 'danger'}>
                  {selectedTrade.type}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shares:</span>
                <span className="text-gray-200">{formatNumber(selectedTrade.shares)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-gray-200">{formatCurrency(selectedTrade.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Value:</span>
                <span className="text-gray-200 font-medium">
                  {formatCurrency(selectedTrade.shares * selectedTrade.price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-gray-200">{formatDate(selectedTrade.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Source:</span>
                <Badge variant="secondary">{selectedTrade.source}</Badge>
              </div>
              {selectedTrade.formType && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Form Type:</span>
                  <span className="text-gray-200">{selectedTrade.formType}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-400">Confidence:</span>
                <span className="text-gray-200">{Math.round(selectedTrade.confidence * 100)}%</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setSelectedTrade(null)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Official Filing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
