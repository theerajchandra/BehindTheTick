'use client';

import { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface NewsletterFormProps {
  title?: string;
  description?: string;
  placeholder?: string;
  source?: string;
  className?: string;
}

export default function NewsletterForm({
  title = "Stay Informed",
  description = "Get the latest insider trading alerts and market insights delivered to your inbox.",
  placeholder = "Enter your email address",
  source = "website",
  className = ""
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState({
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    categories: ['market', 'politics'] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          preferences,
          source
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Successfully subscribed! Check your email for confirmation.');
        setEmail('');
        setShowPreferences(false);
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  const handleCategoryToggle = (category: string) => {
    setPreferences(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const resetForm = () => {
    setStatus('idle');
    setMessage('');
    setEmail('');
    setShowPreferences(false);
  };

  if (status === 'success') {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Welcome to BehindTheTick!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
          <button
            onClick={resetForm}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            Subscribe another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-center mb-4">
        <Mail className="w-6 h-6 text-blue-500 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={status === 'loading'}
          />
        </div>

        {/* Preferences Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowPreferences(!showPreferences)}
            className="text-sm text-blue-500 hover:text-blue-600"
          >
            {showPreferences ? 'Hide' : 'Show'} preferences
          </button>
        </div>

        {/* Preferences Panel */}
        {showPreferences && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequency
              </label>
              <select
                value={preferences.frequency}
                onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {['market', 'politics', 'trading', 'insider', 'regulation'].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryToggle(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      preferences.categories.includes(category)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Subscribing...
            </>
          ) : (
            'Subscribe to Newsletter'
          )}
        </button>
      </form>

      {status === 'error' && (
        <div className="mt-4 flex items-center text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 mr-2" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
        By subscribing, you agree to our{' '}
        <a href="/privacy" className="text-blue-500 hover:text-blue-600">privacy policy</a>{' '}
        and{' '}
        <a href="/terms" className="text-blue-500 hover:text-blue-600">terms of service</a>.
        You can unsubscribe at any time.
      </p>
    </div>
  );
}
