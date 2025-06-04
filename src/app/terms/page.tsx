import { Metadata } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'Terms of Service | BehindTheTick',
  description: 'Terms of service and user agreement for BehindTheTick',
};

export default function TermsPage() {
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
          <p className="text-gray-300">
            By accessing and using BehindTheTick ("the Service"), you agree to be bound by these Terms of Service 
            ("Terms"). If you disagree with any part of these terms, you may not access the Service.
          </p>
        </Card>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Description of Service</h2>
            <p className="text-gray-300 mb-4">
              BehindTheTick is a financial information platform that provides:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Analysis of publicly disclosed trading information</li>
              <li>AI-powered investment insights and recommendations</li>
              <li>Real-time alerts and notifications</li>
              <li>Portfolio tracking and watchlist features</li>
              <li>Market research and analysis tools</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">User Accounts</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Account Creation</h3>
            <ul className="text-gray-300 mb-4 space-y-2 list-disc list-inside">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 18 years old to create an account</li>
              <li>One account per person or entity</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Account Responsibilities</h3>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Keep your login credentials confidential</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>You are liable for all activities under your account</li>
              <li>Provide accurate payment information for subscriptions</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Acceptable Use</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Permitted Uses</h3>
            <ul className="text-gray-300 mb-4 space-y-2 list-disc list-inside">
              <li>Personal investment research and analysis</li>
              <li>Educational purposes</li>
              <li>Professional investment management (with appropriate license)</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Prohibited Uses</h3>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Reproducing, distributing, or selling our data without permission</li>
              <li>Using automated tools to scrape or download data</li>
              <li>Attempting to reverse engineer our algorithms</li>
              <li>Creating derivative works without authorization</li>
              <li>Using the service for illegal activities</li>
              <li>Sharing account credentials with others</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Subscription and Payment</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Billing</h3>
            <ul className="text-gray-300 mb-4 space-y-2 list-disc list-inside">
              <li>Subscriptions are billed in advance on a recurring basis</li>
              <li>Prices are subject to change with 30 days notice</li>
              <li>All fees are non-refundable unless required by law</li>
              <li>Failed payments may result in service suspension</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Cancellation</h3>
            <p className="text-gray-300">
              You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. 
              You will retain access to paid features until the end of your billing period.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Investment Disclaimer</h2>
            <div className="bg-yellow-900/20 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-200 font-semibold mb-2">IMPORTANT INVESTMENT DISCLAIMER</p>
              <p className="text-gray-300">
                BehindTheTick provides information and analysis for educational purposes only. This is not investment advice, 
                and we are not a registered investment advisor.
              </p>
            </div>
            
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>All investment decisions are your sole responsibility</li>
              <li>Past performance does not guarantee future results</li>
              <li>Trading involves substantial risk of loss</li>
              <li>Consult with qualified professionals before making investment decisions</li>
              <li>We do not guarantee the accuracy of any recommendations or analysis</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Our Rights</h3>
            <p className="text-gray-300 mb-4">
              The Service, including all content, features, and functionality, is owned by BehindTheTick and is 
              protected by copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3">Your Rights</h3>
            <p className="text-gray-300">
              You retain ownership of any content you submit to the Service. By submitting content, you grant us 
              a license to use, modify, and display such content in connection with the Service.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Accuracy and Availability</h2>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>We strive for accuracy but cannot guarantee error-free data</li>
              <li>Data sources may have delays or inaccuracies</li>
              <li>Service availability is not guaranteed (target: 99.9% uptime)</li>
              <li>We may suspend service for maintenance or technical issues</li>
              <li>Historical data may be subject to revisions</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, BEHINDTHETICK SHALL NOT BE LIABLE FOR:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Any investment losses resulting from use of our Service</li>
              <li>Indirect, incidental, or consequential damages</li>
              <li>Data inaccuracies or service interruptions</li>
              <li>Actions taken based on our analysis or recommendations</li>
              <li>Third-party content or services</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">By You</h3>
            <p className="text-gray-300 mb-4">
              You may terminate your account at any time by canceling your subscription and deleting your account.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3">By Us</h3>
            <p className="text-gray-300">
              We may terminate or suspend your account immediately for violations of these Terms, illegal activity, 
              or non-payment of fees.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
            <p className="text-gray-300">
              These Terms are governed by the laws of the State of New York, without regard to conflict of law principles. 
              Any disputes will be resolved in the courts of New York County, New York.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-300">
              We reserve the right to modify these Terms at any time. Material changes will be communicated via 
              email or platform notification. Continued use of the Service after changes constitutes acceptance of new Terms.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
            <p className="text-gray-300 mb-4">
              For questions about these Terms, please contact us:
            </p>
            <div className="text-gray-300 space-y-2">
              <p>Email: legal@behindthetick.com</p>
              <p>Address: 123 Financial District, New York, NY 10004</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
