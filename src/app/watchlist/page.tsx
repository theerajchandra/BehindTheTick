'use client';

import { DefaultLayout } from '@/layouts/DefaultLayout';
import WatchlistManager from '@/components/WatchlistManager';

export default function WatchlistPage() {
  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <WatchlistManager />
        </div>
      </div>
    </DefaultLayout>
  );
}
