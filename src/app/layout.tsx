import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/hooks/useTheme';
import { WatchlistProvider } from '@/hooks/useWatchlist';
import AuthProvider from '@/components/AuthProvider';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BehindTheTick - Track Politician & Trader Insider Moves',
  description: 'Track politician and trader insider moves in real time. Start with Nancy Pelosi—add Buffett, Burry & more.',
  keywords: 'insider trading, politicians, traders, stock tracking, nancy pelosi, warren buffett',
  manifest: '/manifest.json',
  themeColor: '#1f2937',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <WatchlistProvider>
                {children}
              </WatchlistProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
