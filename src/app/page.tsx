'use client';

import { useState, useEffect } from 'react';
import { DefaultLayout } from '@/layouts/DefaultLayout';
import { ProfileCard } from '@/components/ProfileCard';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import Dashboard from '@/components/Dashboard';
import NewsletterForm from '@/components/NewsletterForm';
import { sampleProfiles } from '@/utils/sampleData';
import { TrendingUp, Search, Bell, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const featuredProfiles = sampleProfiles.slice(0, 6);

  return (
    <DefaultLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-950 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Track Politician & Trader
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Insider Moves
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time insights into high-profile trading activity. Track Nancy Pelosi, Warren Buffett, Michael Burry & more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/profiles">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/market">
                <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                  View Market Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Live Dashboard</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Real-time insights and analytics from the world's most watched traders
            </p>
          </div>
          <Dashboard />
        </div>
      </section>

      {/* Featured Profiles Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-bold text-white mb-4">Featured Profiles</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Track the trading activity of the most influential politicians and traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProfiles.map((profile, index) => (
              <div
                key={profile.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProfileCard profile={profile} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/profiles">
              <Button variant="outline" size="lg">
                View All Profiles
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our platform aggregates and analyzes insider trading data to provide actionable insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Data Aggregation</h3>
                <p className="text-gray-400 leading-relaxed">
                  We scrape social media posts, news feeds, official filings, and APIs to gather comprehensive trading data from multiple sources.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Trade Analysis</h3>
                <p className="text-gray-400 leading-relaxed">
                  Real-time buy/sell suggestions powered by advanced algorithms that analyze sentiment and historical patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Actionable Insights</h3>
                <p className="text-gray-400 leading-relaxed">
                  Get alerts, build watchlists, and access performance dashboards to stay ahead of market movements.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Ahead of the Market</h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Get weekly insights on the biggest insider trading moves, market trends, and exclusive analysis
            </p>
          </div>

          <NewsletterForm 
            title="Get Insider Alerts"
            description="Join thousands of investors getting real-time notifications about significant insider trading activity."
            source="homepage"
            className="max-w-lg mx-auto"
          />
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Link href="/search" className="group">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                <Search className="w-8 h-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Advanced Search</h3>
                <p className="text-gray-400 text-sm">Find specific traders and filter by performance metrics</p>
              </div>
            </Link>
            
            <Link href="/market" className="group">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
                <BarChart3 className="w-8 h-8 text-green-500 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Market Data</h3>
                <p className="text-gray-400 text-sm">Real-time market data and sentiment analysis</p>
              </div>
            </Link>
            
            <Link href="/news" className="group">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                <Bell className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Latest News</h3>
                <p className="text-gray-400 text-sm">Breaking news and analysis on insider trading</p>
              </div>
            </Link>
            
            <Link href="/insights" className="group">
              <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
                <TrendingUp className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">AI Insights</h3>
                <p className="text-gray-400 text-sm">AI-powered trading recommendations and analysis</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
