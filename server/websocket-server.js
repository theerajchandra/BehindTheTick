const WebSocket = require('ws');
const http = require('http');

console.log('Loading WebSocket server...');

// Create HTTP server
const server = http.createServer();

console.log('HTTP server created');

// Create WebSocket server
const wss = new WebSocket.Server({ 
  server,
  path: '/ws'
});

console.log('WebSocket server created');

// Store active subscriptions
const subscriptions = new Map();

// Mock data for real-time updates
const mockStockData = {
  'AAPL': { price: 175.50, volume: 45230000 },
  'MSFT': { price: 378.20, volume: 23450000 },
  'GOOGL': { price: 142.30, volume: 18760000 },
  'TSLA': { price: 245.80, volume: 67890000 },
  'NVDA': { price: 456.30, volume: 34560000 },
  'META': { price: 324.70, volume: 21340000 },
  'AMZN': { price: 156.80, volume: 19870000 },
  'NFLX': { price: 478.90, volume: 8760000 }
};

const mockTrades = [
  {
    id: 1,
    politician: 'Nancy Pelosi',
    symbol: 'AAPL',
    action: 'BUY',
    amount: 250000,
    price: 175.50,
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    politician: 'Dan Crenshaw',
    symbol: 'TSLA',
    action: 'SELL',
    amount: 150000,
    price: 245.80,
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    politician: 'Austin Scott',
    symbol: 'NVDA',
    action: 'BUY',
    amount: 300000,
    price: 456.30,
    timestamp: new Date().toISOString()
  }
];

const mockNews = [
  {
    id: 1,
    title: 'Pelosi Makes Major Tech Investment',
    urgency: 'high',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Senate Banking Committee Activity Increases',
    urgency: 'medium',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    title: 'New Insider Trading Rules Proposed',
    urgency: 'low',
    timestamp: new Date().toISOString()
  }
];

// Handle WebSocket connections
wss.on('connection', (ws, request) => {
  console.log('Client connected:', request.socket.remoteAddress);
  
  const clientSubscriptions = new Set();
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);
      
      if (data.action === 'subscribe') {
        clientSubscriptions.add(data.type);
        console.log(`Client subscribed to: ${data.type}`);
        
        // Send initial data for the subscription
        sendInitialData(ws, data.type);
        
      } else if (data.action === 'unsubscribe') {
        clientSubscriptions.delete(data.type);
        console.log(`Client unsubscribed from: ${data.type}`);
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });
  
  // Handle client disconnect
  ws.on('close', () => {
    console.log('Client disconnected');
    clientSubscriptions.clear();
  });
  
  // Store client with its subscriptions
  subscriptions.set(ws, clientSubscriptions);
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'system',
    data: { message: 'Connected to BehindTheTick WebSocket server' },
    timestamp: new Date().toISOString()
  }));
});

// Send initial data based on subscription type
function sendInitialData(ws, type) {
  let data;
  
  switch (type) {
    case 'trade':
      data = {
        type: 'trade',
        data: mockTrades[0],
        timestamp: new Date().toISOString()
      };
      break;
      
    case 'price':
      data = {
        type: 'price',
        data: mockStockData,
        timestamp: new Date().toISOString()
      };
      break;
      
    case 'news':
      data = {
        type: 'news',
        data: mockNews[0],
        timestamp: new Date().toISOString()
      };
      break;
      
    case 'alert':
      data = {
        type: 'alert',
        data: {
          message: 'New insider trading activity detected',
          urgency: 'medium',
          politician: 'Nancy Pelosi',
          symbol: 'AAPL'
        },
        timestamp: new Date().toISOString()
      };
      break;
      
    case 'market':
      data = {
        type: 'market',
        data: {
          status: 'open',
          indices: {
            'S&P 500': { value: 4567.89, change: 12.34 },
            'NASDAQ': { value: 14234.56, change: 45.67 },
            'DOW': { value: 34567.89, change: 123.45 }
          }
        },
        timestamp: new Date().toISOString()
      };
      break;
  }
  
  if (data) {
    ws.send(JSON.stringify(data));
  }
}

// Broadcast message to all subscribed clients
function broadcast(type, data) {
  const message = JSON.stringify({
    type,
    data,
    timestamp: new Date().toISOString()
  });
  
  subscriptions.forEach((clientSubs, ws) => {
    if (ws.readyState === WebSocket.OPEN && 
        (clientSubs.has(type) || clientSubs.has('all'))) {
      ws.send(message);
    }
  });
}

// Simulate real-time data updates
function startDataSimulation() {
  // Simulate price changes every 5 seconds
  setInterval(() => {
    Object.keys(mockStockData).forEach(symbol => {
      const stock = mockStockData[symbol];
      const changePercent = (Math.random() - 0.5) * 0.1; // +/- 5% change
      stock.price = Math.round((stock.price * (1 + changePercent)) * 100) / 100;
      stock.volume += Math.floor(Math.random() * 100000);
    });
    
    broadcast('price', mockStockData);
  }, 5000);
  
  // Simulate new trades every 15 seconds
  setInterval(() => {
    const politicians = ['Nancy Pelosi', 'Dan Crenshaw', 'Austin Scott', 'Ro Khanna', 'Patrick McHenry'];
    const symbols = Object.keys(mockStockData);
    const actions = ['BUY', 'SELL'];
    
    const newTrade = {
      id: Date.now(),
      politician: politicians[Math.floor(Math.random() * politicians.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      amount: Math.floor(Math.random() * 500000) + 50000,
      price: mockStockData[symbols[Math.floor(Math.random() * symbols.length)]].price,
      timestamp: new Date().toISOString()
    };
    
    mockTrades.unshift(newTrade);
    if (mockTrades.length > 50) mockTrades.pop(); // Keep only recent trades
    
    broadcast('trade', newTrade);
  }, 15000);
  
  // Simulate news updates every 30 seconds
  setInterval(() => {
    const headlines = [
      'Major Investment Activity Detected',
      'Congressional Committee Meeting Scheduled',
      'New SEC Regulations Under Review',
      'Insider Trading Investigation Ongoing',
      'Market Volatility Increases',
      'Tech Sector Sees Heavy Activity'
    ];
    
    const urgencies = ['low', 'medium', 'high'];
    
    const newNews = {
      id: Date.now(),
      title: headlines[Math.floor(Math.random() * headlines.length)],
      urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
      timestamp: new Date().toISOString()
    };
    
    mockNews.unshift(newNews);
    if (mockNews.length > 20) mockNews.pop(); // Keep only recent news
    
    broadcast('news', newNews);
  }, 30000);
  
  // Simulate alerts every 20 seconds
  setInterval(() => {
    const politicians = ['Nancy Pelosi', 'Dan Crenshaw', 'Austin Scott'];
    const symbols = Object.keys(mockStockData);
    
    const alert = {
      message: 'Significant trading activity detected',
      urgency: Math.random() > 0.7 ? 'high' : 'medium',
      politician: politicians[Math.floor(Math.random() * politicians.length)],
      symbol: symbols[Math.floor(Math.random() * symbols.length)]
    };
    
    broadcast('alert', alert);
  }, 20000);
  
  // Simulate market data updates every 10 seconds
  setInterval(() => {
    const marketData = {
      status: 'open',
      indices: {
        'S&P 500': { 
          value: 4567.89 + (Math.random() - 0.5) * 50, 
          change: (Math.random() - 0.5) * 30 
        },
        'NASDAQ': { 
          value: 14234.56 + (Math.random() - 0.5) * 200, 
          change: (Math.random() - 0.5) * 100 
        },
        'DOW': { 
          value: 34567.89 + (Math.random() - 0.5) * 300, 
          change: (Math.random() - 0.5) * 150 
        }
      }
    };
    
    // Round values
    Object.values(marketData.indices).forEach(index => {
      index.value = Math.round(index.value * 100) / 100;
      index.change = Math.round(index.change * 100) / 100;
    });
    
    broadcast('market', marketData);
  }, 10000);
}

// Start the server
const PORT = process.env.WS_PORT || 3003;

console.log('Attempting to start WebSocket server...');

server.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
  console.log(`WebSocket server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  
  // Start data simulation
  startDataSimulation();
  console.log('Real-time data simulation started');
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('Shutting down WebSocket server...');
  wss.close(() => {
    server.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });
});
