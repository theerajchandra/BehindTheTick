'use client';

import { useState, useMemo } from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { sampleProfiles } from '@/utils/sampleData';
import { Search, Filter } from 'lucide-react';

export default function ProfilesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'politician' | 'trader' | 'investor'>('all');

  const filteredProfiles = useMemo(() => {
    return sampleProfiles.filter(profile => {
      const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           profile.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || profile.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, selectedType]);

  const typeOptions = [
    { value: 'all', label: 'All Types', count: sampleProfiles.length },
    { value: 'politician', label: 'Politicians', count: sampleProfiles.filter(p => p.type === 'politician').length },
    { value: 'trader', label: 'Traders', count: sampleProfiles.filter(p => p.type === 'trader').length },
    { value: 'investor', label: 'Investors', count: sampleProfiles.filter(p => p.type === 'investor').length },
  ];

  return (
    <DefaultLayout>
      <div className="min-h-screen bg-gray-950 py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              All Profiles
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track the trading activity of politicians, traders, and investors
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search profiles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="h-5 w-5 text-gray-400" />
                {typeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedType === option.value ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedType(option.value as any)}
                    className="flex items-center gap-2"
                  >
                    {option.label}
                    <Badge variant="secondary" className="text-xs">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-gray-400">
              Showing {filteredProfiles.length} of {sampleProfiles.length} profiles
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          </div>

          {/* Profiles Grid */}
          {filteredProfiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProfiles.map((profile, index) => (
                <div
                  key={profile.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProfileCard profile={profile} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No profiles found</h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </DefaultLayout>
  );
}
