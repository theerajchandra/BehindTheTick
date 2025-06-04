'use client';

import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Card className="p-8">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">Something went wrong</h1>
          
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            We encountered an unexpected error while loading this page. 
            This could be due to a temporary issue with our servers or a network problem.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg text-left">
              <h3 className="text-red-400 font-semibold mb-2">Error Details (Development)</h3>
              <p className="text-red-300 text-sm font-mono">{error.message}</p>
              {error.digest && (
                <p className="text-red-300 text-sm font-mono mt-2">
                  Digest: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="space-y-4">
            <Button
              onClick={reset}
              className="inline-flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </Button>
            
            <p className="text-gray-500 text-sm">
              If the problem persists, please{' '}
              <a href="/contact" className="text-blue-400 hover:text-blue-300">
                contact our support team
              </a>
            </p>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
}
