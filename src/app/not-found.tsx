import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';
import { Home, Search, TrendingUp } from 'lucide-react';

export default function NotFound() {
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-blue-400 mb-4">404</div>
          <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track with your investment research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:bg-gray-800 transition-colors">
            <Link href="/" className="block">
              <Home className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Go Home</h3>
              <p className="text-gray-400 text-sm">Return to the main page and start exploring</p>
            </Link>
          </Card>

          <Card className="p-6 hover:bg-gray-800 transition-colors">
            <Link href="/profiles" className="block">
              <Search className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Browse Profiles</h3>
              <p className="text-gray-400 text-sm">Explore politician and trader profiles</p>
            </Link>
          </Card>

          <Card className="p-6 hover:bg-gray-800 transition-colors">
            <Link href="/insights" className="block">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Market Insights</h3>
              <p className="text-gray-400 text-sm">Check out the latest market analysis</p>
            </Link>
          </Card>
        </div>

        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Take Me Home
          </Link>
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-blue-400 hover:text-blue-300">
              contact our support team
            </Link>
          </p>
        </div>
      </div>
    </DefaultLayout>
  );
}
