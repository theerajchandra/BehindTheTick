'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ThemeToggle } from './ThemeToggle';
import LoginModal from './LoginModal';
import { cn } from '@/utils';
import { Eye, User, Star, LogOut, Settings, Menu, X } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Profiles', href: '/profiles' },
  { name: 'Market', href: '/market' },
  { name: 'News', href: '/news' },
  { name: 'Search', href: '/search' },
  { name: 'Watchlist', href: '/watchlist' },
  { name: 'Insights', href: '/insights' },
  { name: 'About', href: '/about' },
];

export function Navigation() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 rounded-lg bg-blue-600 group-hover:bg-blue-700 transition-colors duration-200">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors duration-200">
                BehindTheTick
              </span>
            </Link>

            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'relative px-3 py-2 text-sm font-medium transition-all duration-200',
                      'hover:text-blue-300',
                      isActive
                        ? 'text-blue-300'
                        : 'text-gray-300 hover:text-white'
                    )}
                  >
                    {item.name}
                    {isActive && (
                      <div className="absolute inset-x-0 -bottom-px h-px bg-blue-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              
              {/* User Menu */}
              {isLoading ? (
                <div className="w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <span className="hidden sm:block text-gray-300 text-sm">
                      {user.name}
                    </span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-400 text-sm">{user.email}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                          user.subscription === 'premium' 
                            ? 'bg-yellow-600 text-yellow-100' 
                            : user.subscription === 'pro'
                            ? 'bg-purple-600 text-purple-100'
                            : 'bg-gray-600 text-gray-100'
                        }`}>
                          {user.subscription.toUpperCase()}
                        </span>
                      </div>
                      
                      <Link
                        href="/watchlist"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Star className="w-4 h-4" />
                        <span>Watchlist</span>
                      </Link>
                      
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {showMobileMenu ? (
                  <X className="w-6 h-6 text-gray-300" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-800 bg-gray-900/95">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200',
                      isActive
                        ? 'text-blue-300 bg-gray-800'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    )}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              {!user && (
                <button
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-blue-300 hover:bg-gray-800 rounded-md transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}
