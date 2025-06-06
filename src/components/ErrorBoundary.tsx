'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi, WifiOff, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  isOffline: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      isOffline: typeof window !== 'undefined' ? !navigator.onLine : false 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Check if error is related to network issues
    if (error.message.includes('fetch') || error.message.includes('network') || !navigator.onLine) {
      this.setState({ isOffline: true });
    }
    
    // Log to error reporting service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  componentDidMount() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  handleOnline = () => {
    this.setState({ isOffline: false });
    
    // Auto-retry after coming back online
    if (this.state.hasError) {
      this.retryTimeoutId = setTimeout(() => {
        this.handleRetry();
      }, 1000);
    }
  };

  handleOffline = () => {
    this.setState({ isOffline: true });
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              {this.state.isOffline ? (
                <WifiOff className="w-16 h-16 text-red-400" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-yellow-400" />
              )}
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">
              {this.state.isOffline ? 'Connection Lost' : 'Something went wrong'}
            </h2>
            <p className="text-gray-400 mb-6">
              {this.state.isOffline
                ? 'Please check your internet connection and try again.'
                : 'We encountered an unexpected error. Please try refreshing the page.'}
            </p>

            {/* Network Status */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm mb-6 ${
              this.state.isOffline 
                ? 'bg-red-900 text-red-300' 
                : 'bg-green-900 text-green-300'
            }`}>
              {this.state.isOffline ? (
                <WifiOff className="w-4 h-4" />
              ) : (
                <Wifi className="w-4 h-4" />
              )}
              <span>{this.state.isOffline ? 'Offline' : 'Online'}</span>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-left">
                <h3 className="text-red-300 font-semibold mb-2">Error Details:</h3>
                <pre className="text-red-400 text-sm overflow-auto">
                  {this.state.error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={this.state.isOffline}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </div>

            {/* Offline Message */}
            {this.state.isOffline && (
              <div className="mt-6 p-4 bg-orange-900/20 border border-orange-800 rounded-lg">
                <p className="text-orange-300 text-sm">
                  🔄 Will automatically retry when connection is restored
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Smaller error component for inline errors
export function InlineError({ 
  message, 
  onRetry, 
  className = '' 
}: { 
  message: string; 
  onRetry?: () => void; 
  className?: string; 
}) {
  return (
    <div className={`bg-red-900/20 border border-red-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-300 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
