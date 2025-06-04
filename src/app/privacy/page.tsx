import { Metadata } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';

export const metadata: Metadata = {
  title: 'Privacy Policy | BehindTheTick',
  description: 'Privacy policy and data protection information for BehindTheTick',
};

export default function PrivacyPage() {
  return (
    <DefaultLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
          <p className="text-gray-300 mb-4">
            At BehindTheTick ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal data. 
            This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
          </p>
        </Card>

        <div className="space-y-8">
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Personal Information</h3>
            <ul className="text-gray-300 mb-6 space-y-2 list-disc list-inside">
              <li>Name and email address when you create an account</li>
              <li>Payment information for subscription services</li>
              <li>Communication preferences and settings</li>
              <li>Profile information you choose to provide</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Usage Information</h3>
            <ul className="text-gray-300 mb-6 space-y-2 list-disc list-inside">
              <li>Pages visited and features used</li>
              <li>Time spent on the platform</li>
              <li>Search queries and watchlist selections</li>
              <li>Device information and IP address</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Financial Data</h3>
            <p className="text-gray-300">
              We aggregate publicly available financial disclosure data from government sources and financial institutions. 
              This data is already in the public domain and is processed to provide insights and analysis.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
            <ul className="text-gray-300 space-y-3 list-disc list-inside">
              <li>Provide and maintain our platform services</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send service updates and security notifications</li>
              <li>Personalize your experience and recommendations</li>
              <li>Analyze usage patterns to improve our services</li>
              <li>Comply with legal obligations and prevent fraud</li>
              <li>Respond to customer support inquiries</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Sharing and Disclosure</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">We Do Not Sell Your Data</h3>
            <p className="text-gray-300 mb-4">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>

            <h3 className="text-lg font-semibold text-white mb-3">Limited Sharing</h3>
            <p className="text-gray-300 mb-4">We may share your information only in these circumstances:</p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>With service providers who help us operate our platform</li>
              <li>To comply with legal obligations or court orders</li>
              <li>To protect our rights, property, or safety</li>
              <li>With your explicit consent</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="text-gray-300 space-y-2 list-disc list-inside">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure data centers with physical security measures</li>
              <li>Regular employee training on data protection</li>
            </ul>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Your Rights and Choices</h2>
            
            <h3 className="text-lg font-semibold text-white mb-3">Account Management</h3>
            <ul className="text-gray-300 mb-4 space-y-2 list-disc list-inside">
              <li>Access and update your account information</li>
              <li>Download your data in a portable format</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of marketing communications</li>
            </ul>

            <h3 className="text-lg font-semibold text-white mb-3">Cookie Controls</h3>
            <p className="text-gray-300">
              You can control cookie preferences through your browser settings. Note that disabling certain 
              cookies may affect platform functionality.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal data only as long as necessary to provide our services and comply with 
              legal obligations. Account data is typically deleted within 30 days of account closure, unless 
              longer retention is required by law.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">International Transfers</h2>
            <p className="text-gray-300">
              Your data may be processed in countries other than your own. We ensure appropriate safeguards 
              are in place to protect your data when it's transferred internationally, including standard 
              contractual clauses approved by relevant authorities.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
            <p className="text-gray-300">
              Our platform is not intended for users under 18 years of age. We do not knowingly collect 
              personal information from children under 18. If we become aware of such collection, we will 
              delete the information promptly.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
            <p className="text-gray-300">
              We may update this privacy policy periodically. We will notify you of material changes via 
              email or through our platform. Your continued use of our services after changes become 
              effective constitutes acceptance of the updated policy.
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about this privacy policy or our data practices, please contact us:
            </p>
            <div className="text-gray-300 space-y-2">
              <p>Email: privacy@behindthetick.com</p>
              <p>Address: 123 Financial District, New York, NY 10004</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
