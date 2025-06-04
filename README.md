# BehindTheTick

A comprehensive Next.js application to track politician and trader insider moves in real-time.
Plans for the future: Introduce AI-powered investment recommendations and modern data visualization.

## 🚀 Features

- **Real-time Trading Data**: Track trades from politicians, institutional investors, and corporate insiders
- **AI-Powered Recommendations**: Get buy/sell recommendations based on historical trading patterns
- **Interactive Charts**: Visualize performance, sector allocation, trade volume, and more using Recharts
- **Profile Management**: Detailed profiles with trading history, news, and social media integration
- **Watchlist Functionality**: Save and track your favorite profiles
- **Modern Dark Theme**: Beautiful, responsive design with dark theme as default
- **Market Insights**: AI-generated market analysis and trend identification
- **Search & Filter**: Find profiles quickly with advanced search capabilities

## 🛠 Tech Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4.1.8 with custom animations
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Context for theme and watchlist
- **Development**: ESLint, TypeScript strict mode

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── profiles/          # Profile pages
│   ├── insights/          # Market insights
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── Navigation.tsx     # Main navigation
│   ├── Footer.tsx         # Footer component
│   ├── Charts.tsx         # Chart components
│   ├── Card.tsx           # Card components
│   ├── Button.tsx         # Button component
│   ├── Badge.tsx          # Badge component
│   ├── ProfileCard.tsx    # Profile display card
│   ├── TradeTable.tsx     # Trading data table
│   └── RecommendationWidget.tsx # AI recommendations
├── hooks/                 # Custom React hooks
│   ├── useTheme.tsx       # Theme management
│   └── useWatchlist.tsx   # Watchlist management
├── layouts/               # Layout components
│   └── DefaultLayout.tsx  # Default page layout
├── types/                 # TypeScript type definitions
│   └── index.ts           # All type interfaces
└── utils/                 # Utility functions
    ├── index.ts           # General utilities
    ├── dateUtils.ts       # Date formatting
    ├── buySellLogic.ts    # AI recommendation algorithms
    └── sampleData.ts      # Sample data and generators
```

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BehindTheTick
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your API keys and configuration:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   QUIVER_API_KEY=your_quiver_quantitative_api_key
   TWITTER_API_KEY=your_twitter_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Sample Data

The application includes comprehensive sample data featuring:
- 12 detailed profiles (politicians and traders)
- Realistic trading data with buy/sell transactions
- News articles and social media posts
- Performance metrics and sector allocations
- Generated chart data for demonstrations

## 🎨 Design System

- **Colors**: Custom color palette with blue/purple gradients
- **Typography**: System fonts with clear hierarchy
- **Components**: Consistent design language across all UI elements
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first approach with breakpoints for all screen sizes

## 📈 Chart Components

- **Performance Chart**: Line/area charts for portfolio performance
- **Sector Allocation**: Pie charts for investment distribution
- **Trade Volume**: Bar charts for trading activity
- **Holdings Comparison**: Horizontal bar charts for top positions
- **Trading Frequency**: Line charts for activity patterns

## 🔧 API Routes

- `GET /api/profiles` - List all profiles with filtering
- `GET /api/profiles/[slug]` - Get specific profile details
- `GET /api/recommendation/[slug]` - Get AI recommendations for profile

## 🚀 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   npm start
   ```

3. **Deploy to Vercel** (recommended)
   ```bash
   npm install -g vercel
   vercel
   ```

## 🔮 Future Enhancements

- **Real-time Data Integration**: Connect to live data sources
- **WebSocket Support**: Real-time updates for trades and prices
- **Push Notifications**: Alert users about important trades
- **Advanced Analytics**: More sophisticated AI models
- **Social Features**: User comments and discussion threads
- **Mobile App**: React Native companion app
- **Portfolio Simulation**: Paper trading features
- **Email Newsletters**: Automated insights delivery

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

This application is for educational and informational purposes only. It is not financial advice. Always consult with qualified professionals before making investment decisions. Trading involves substantial risk of loss.

---

Built with ❤️ using Next.js and modern web technologies.
