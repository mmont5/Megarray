import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, CheckCircle, BarChart2, MessageSquare, Calendar, Zap, Database, Shield,
  CreditCard, Wallet, Brain, Globe, Lock, Sparkles, Users, Bot
} from 'lucide-react';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-[#0A0F1C] px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80"
            alt="Marketing Analytics"
            className="w-full h-full object-cover opacity-5"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0F1C] via-[#0A0F1C] to-[#0A0F1C]/90"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 mb-8">
              <span className="px-3 py-1 text-sm font-medium text-[#00E5BE] bg-[#00E5BE]/10 rounded-full">
                New: Crypto Payments Now Available
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block font-extrabold mb-4">AI-Powered Marketing</span>
              <span className="block bg-gradient-to-r from-[#00E5BE] to-[#00ABC7] bg-clip-text text-transparent font-extrabold">Made Simple</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-[#8A96A8] font-normal leading-relaxed max-w-3xl mx-auto">
              Create, schedule, and analyze your marketing content with AI. Now with flexible payment options and usage-based pricing.
            </p>
            <div className="mt-12 flex justify-center gap-6">
              <Link 
                to="/signup" 
                className="group px-8 py-4 text-lg font-semibold rounded-lg bg-[#00E5BE] text-white hover:bg-[#00D1AD] transition-all duration-300 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                to="/features" 
                className="group px-8 py-4 text-lg font-semibold rounded-lg border-2 border-[#2A3547] text-white hover:border-[#00E5BE] hover:text-[#00E5BE] transition-all duration-300"
              >
                See Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="mt-4 text-xl text-gray-600">
              Powerful features to supercharge your marketing efforts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-lg bg-[#00E5BE]/10 flex items-center justify-center text-[#00E5BE] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Options */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Flexible Payment Options</h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose how you want to pay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-xl">
              <div className="flex items-center mb-6">
                <CreditCard className="w-8 h-8 text-[#00E5BE] mr-4" />
                <h3 className="text-xl font-semibold">Traditional Payments</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>All major credit cards accepted</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>Apple Pay and Google Pay</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>Secure payment processing</span>
                </li>
              </ul>
            </div>

            <div className="p-8 rounded-xl bg-white border border-gray-100 shadow-xl">
              <div className="flex items-center mb-6">
                <Wallet className="w-8 h-8 text-[#00E5BE] mr-4" />
                <h3 className="text-xl font-semibold">Crypto Payments</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>ETH, USDC, BTC, MATIC accepted</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>Connect any Web3 wallet</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-[#00E5BE] mr-2" />
                  <span>Instant processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Usage-Based Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Usage-Based Pricing</h2>
            <p className="mt-4 text-xl text-gray-600">
              Only pay for what you use
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#00E5BE]/10 flex items-center justify-center text-[#00E5BE] mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/pricing"
              className="inline-flex items-center px-6 py-3 text-lg font-semibold rounded-lg bg-[#00E5BE] text-white hover:bg-[#00D1AD]"
            >
              View Pricing
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Help & Support */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Help & Support</h2>
            <p className="mt-4 text-xl text-gray-600">
              We're here to help you succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link to="/docs" className="p-6 rounded-xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <Bot className="w-8 h-8 text-[#00E5BE] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600">Comprehensive guides and API documentation</p>
            </Link>

            <Link to="/support" className="p-6 rounded-xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <MessageSquare className="w-8 h-8 text-[#00E5BE] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Support</h3>
              <p className="text-gray-600">Chat with our support team 24/7</p>
            </Link>

            <Link to="/community" className="p-6 rounded-xl bg-white border border-gray-100 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <Users className="w-8 h-8 text-[#00E5BE] mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Join our community of marketers</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0A0F1C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to get started?</h2>
            <p className="mt-4 text-xl text-gray-400">
              Join thousands of marketers already using Megarray
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                to="/signup"
                className="px-8 py-4 text-lg font-semibold rounded-lg bg-[#00E5BE] text-white hover:bg-[#00D1AD]"
              >
                Start Free Trial
              </Link>
              <Link
                to="/demo"
                className="px-8 py-4 text-lg font-semibold rounded-lg border-2 border-gray-700 text-white hover:border-[#00E5BE]"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI Content Generation',
    description: 'Create engaging content in seconds with advanced AI that understands your brand voice.',
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: 'Smart Scheduling',
    description: 'Schedule content at optimal times across all platforms for maximum engagement.',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Advanced Analytics',
    description: 'Track performance and get AI-powered insights to optimize your strategy.',
  },
  {
    icon: <Bot className="w-6 h-6" />,
    title: 'A/B Testing',
    description: 'Test different variations of your content to maximize performance.',
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Multi-Platform',
    description: 'Manage all your social media accounts from one dashboard.',
  },
  {
    icon: <Lock className="w-6 h-6" />,
    title: 'Enterprise Security',
    description: 'Bank-level security with advanced encryption and access controls.',
  },
];

const pricingFeatures = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Pay-as-you-go',
    description: 'Only pay for the features and resources you actually use.',
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'Flexible Plans',
    description: 'Choose from monthly plans or usage-based pricing.',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'No Lock-in',
    description: 'Change or cancel your plan at any time.',
  },
];

export default Home;