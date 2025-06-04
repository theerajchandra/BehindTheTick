import { Metadata } from 'next';
import DefaultLayout from '@/layouts/DefaultLayout';
import Card from '@/components/Card';
import { Users, Target, TrendingUp, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | BehindTheTick',
  description: 'Learn about BehindTheTick and our mission to democratize financial transparency',
};

const team = [
  {
    name: 'Theeraj Chandra',
    role: 'Founding Engineer',
    description: 'Former Software Engineer @ SuperWorld, UWaterloo ECE Student.',
  },
]

const values = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Transparency',
    description: 'We believe in making financial markets more transparent and accessible to everyone.'
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Accuracy',
    description: 'Our AI models are rigorously tested to provide the most accurate insights possible.'
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Democracy',
    description: 'Democratizing access to the same information that institutional investors have.'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Innovation',
    description: 'Continuously pushing the boundaries of what\'s possible in financial technology.'
  }
];

export default function AboutPage() {
  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About BehindTheTick
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to democratize financial transparency by providing real-time insights 
            into politician and institutional trading moves, powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
            Financial markets have long been dominated by those with access to privileged information. 
            Politicians, institutional investors, and corporate insiders often have advantages that 
            retail investors simply don't possess. BehindTheTick levels the playing field by aggregating, 
            analyzing, and presenting this information in an accessible, actionable format.
          </p>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-blue-400 mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-blue-400 mb-3 text-sm">{member.role}</p>
                <p className="text-gray-400 text-sm">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Section */}
        <Card className="p-8 mb-16">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Our Technology</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Real-Time Data Processing</h3>
              <p className="text-gray-400 mb-6">
                Our platform processes millions of data points in real-time, from SEC filings to social 
                media posts, ensuring you never miss a critical move.
              </p>
              <h3 className="text-xl font-semibold text-white mb-4">Advanced AI Algorithms</h3>
              <p className="text-gray-400">
                Machine learning models trained on historical data to identify patterns and predict 
                market movements with industry-leading accuracy.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">Comprehensive Coverage</h3>
              <p className="text-gray-400 mb-6">
                We track over 500 politicians, institutional investors, and corporate insiders across 
                all major markets and asset classes.
              </p>
              <h3 className="text-xl font-semibold text-white mb-4">User-Centric Design</h3>
              <p className="text-gray-400">
                Our platform is designed with the user in mind, providing complex financial data in 
                an intuitive, easy-to-understand interface.
              </p>
            </div>
          </div>
        </Card>

        {/* Contact CTA */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6">
            Join thousands of investors who are already using BehindTheTick to make better investment decisions.
          </p>
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
}
