'use client';

import { useWebSocket } from '@/lib/websocket';
import { useState, useEffect } from 'react';

export function WebSocketTest() {
  const [priceData, setPriceData] = useState<any>(null);
  const [tradeData, setTradeData] = useState<any>(null);
  const [newsData, setNewsData] = useState<any>(null);
  const [alertData, setAlertData] = useState<any>(null);
  const [marketData, setMarketData] = useState<any>(null);

  // Subscribe to different data types
  const { connectionState: priceConnectionState } = useWebSocket('price', (data) => {
    console.log('Price update received:', data);
    setPriceData(data);
  });

  const { connectionState: tradeConnectionState } = useWebSocket('trade', (data) => {
    console.log('Trade update received:', data);
    setTradeData(data);
  });

  const { connectionState: newsConnectionState } = useWebSocket('news', (data) => {
    console.log('News update received:', data);
    setNewsData(data);
  });

  const { connectionState: alertConnectionState } = useWebSocket('alert', (data) => {
    console.log('Alert received:', data);
    setAlertData(data);
  });

  const { connectionState: marketConnectionState } = useWebSocket('market', (data) => {
    console.log('Market update received:', data);
    setMarketData(data);
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">WebSocket Test Dashboard</h2>
        <div className="flex items-center space-x-4 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm ${
            priceConnectionState === 'connected' 
              ? 'bg-green-600 text-white' 
              : 'bg-red-600 text-white'
          }`}>
            Connection: {priceConnectionState}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Price Data */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Stock Prices</h3>
          {priceData ? (
            <div className="space-y-2">
              {Object.entries(priceData).map(([symbol, data]: [string, any]) => (
                <div key={symbol} className="flex justify-between text-sm">
                  <span className="text-gray-300">{symbol}</span>
                  <div className="text-right">
                    <div className="text-white">${data.price}</div>
                    <div className="text-gray-400 text-xs">Vol: {data.volume?.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Waiting for price data...</p>
          )}
        </div>

        {/* Trade Data */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Latest Trade</h3>
          {tradeData ? (
            <div className="space-y-2">
              <div className="text-white font-medium">{tradeData.politician}</div>
              <div className="flex justify-between">
                <span className="text-gray-300">{tradeData.symbol}</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  tradeData.action === 'BUY' ? 'bg-green-600' : 'bg-red-600'
                } text-white`}>
                  {tradeData.action}
                </span>
              </div>
              <div className="text-gray-300">${tradeData.amount?.toLocaleString()}</div>
              <div className="text-gray-400 text-xs">
                {new Date(tradeData.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Waiting for trade data...</p>
          )}
        </div>

        {/* News Data */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Latest News</h3>
          {newsData ? (
            <div className="space-y-2">
              <div className="text-white">{newsData.title}</div>
              <div className={`inline-block px-2 py-1 rounded text-xs ${
                newsData.urgency === 'high' ? 'bg-red-600' :
                newsData.urgency === 'medium' ? 'bg-yellow-600' : 'bg-blue-600'
              } text-white`}>
                {newsData.urgency?.toUpperCase()}
              </div>
              <div className="text-gray-400 text-xs">
                {new Date(newsData.timestamp).toLocaleString()}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Waiting for news data...</p>
          )}
        </div>

        {/* Alert Data */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Latest Alert</h3>
          {alertData ? (
            <div className="space-y-2">
              <div className="text-white">{alertData.message}</div>
              <div className="text-gray-300">
                {alertData.politician} - {alertData.symbol}
              </div>
              <div className={`inline-block px-2 py-1 rounded text-xs ${
                alertData.urgency === 'high' ? 'bg-red-600' : 'bg-orange-600'
              } text-white`}>
                {alertData.urgency?.toUpperCase()}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Waiting for alerts...</p>
          )}
        </div>

        {/* Market Data */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Market Indices</h3>
          {marketData?.indices ? (
            <div className="space-y-2">
              {Object.entries(marketData.indices).map(([index, data]: [string, any]) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-300">{index}</span>
                  <div className="text-right">
                    <div className="text-white">{data.value?.toFixed(2)}</div>
                    <div className={`text-xs ${
                      data.change >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Waiting for market data...</p>
          )}
        </div>

        {/* Connection Debug Info */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Debug Info</h3>
          <div className="space-y-1 text-sm">
            <div className="text-gray-300">Price: {priceConnectionState}</div>
            <div className="text-gray-300">Trade: {tradeConnectionState}</div>
            <div className="text-gray-300">News: {newsConnectionState}</div>
            <div className="text-gray-300">Alert: {alertConnectionState}</div>
            <div className="text-gray-300">Market: {marketConnectionState}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
