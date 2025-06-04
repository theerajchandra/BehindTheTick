import { Metadata } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us | BehindTheTick',
  description: 'Get in touch with the BehindTheTick team',
};

const contactMethods = [
  {
    icon: <Mail className="w-6 h-6" />,
    title: 'Email Support',
    description: 'Get help with your account or technical issues',
    contact: 'support@behindthetick.com',
    availability: 'Response within 24 hours'
  },
  {
    icon: <Phone className="w-6 h-6" />,
    title: 'Phone Support',
    description: 'Speak directly with our support team',
    contact: '+1 (555) 123-4567',
    availability: 'Mon-Fri, 9AM-6PM EST'
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: 'Live Chat',
    description: 'Get instant help with our live chat feature',
    contact: 'Available in app',
    availability: '24/7 automated, human support 9AM-6PM EST'
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: 'Office',
    description: 'Visit our headquarters',
    contact: '123 Financial District, New York, NY 10004',
    availability: 'By appointment only'
  }
];

export default function ContactPage() {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="feature">Feature Request</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="press">Press Inquiry</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Send Message
              </button>
            </form>
          </Card>

          {/* Contact Methods */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Get in touch</h2>
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-blue-400 mt-1">
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                    <p className="text-gray-400 mb-2">{method.description}</p>
                    <p className="text-blue-400 font-medium mb-1">{method.contact}</p>
                    <p className="text-sm text-gray-500">{method.availability}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* FAQ Link */}
            <Card className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-2">Frequently Asked Questions</h3>
              <p className="text-gray-400 mb-4">
                Check our FAQ section for quick answers to common questions.
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                View FAQ →
              </button>
            </Card>
          </div>
        </div>

        {/* Response Time Notice */}
        <div className="mt-12 text-center">
          <Card className="p-6 bg-gray-800/50">
            <p className="text-gray-400">
              <span className="font-semibold text-white">Average response time:</span> We typically respond to all inquiries within 24 hours during business days. 
              For urgent technical issues, please use our live chat feature for faster assistance.
            </p>
          </Card>
        </div>
      </div>
    </DefaultLayout>
  );
}
