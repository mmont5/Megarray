import React from 'react';
import { Link } from 'react-router-dom';
import {
  Wand2, Brain, Calendar, BarChart2, Target, Users,
  Bot, Sparkles, Zap, Globe, Lock, Shield, Link2
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: 'AI Content Generation',
      description: 'Create engaging content in seconds with advanced AI that understands your brand voice.',
      icon: Brain,
      details: [
        'GPT-4 powered content creation',
        'Brand voice customization',
        'Multi-language support',
        'Content humanization',
      ],
    },
    {
      title: 'Smart Scheduling',
      description: 'Schedule content at optimal times across all platforms for maximum engagement.',
      icon: Calendar,
      details: [
        'AI-powered timing optimization',
        'Cross-platform scheduling',
        'Visual content calendar',
        'Bulk scheduling',
      ],
    },
    {
      title: 'Advanced Analytics',
      description: 'Track performance and get AI-powered insights to optimize your strategy.',
      icon: BarChart2,
      details: [
        'Real-time performance tracking',
        'AI-driven recommendations',
        'Custom report generation',
        'Competitor analysis',
      ],
    },
    {
      title: 'A/B Testing',
      description: 'Test different variations of your content to maximize performance.',
      icon: Target,
      details: [
        'Automated testing',
        'Statistical analysis',
        'Performance insights',
        'Winner implementation',
      ],
    },
    {
      title: 'Team Collaboration',
      description: 'Work seamlessly with your team with advanced collaboration features.',
      icon: Users,
      details: [
        'Role-based access control',
        'Content approval workflows',
        'Team performance analytics',
        'Real-time collaboration',
      ],
    },
    {
      title: 'AI Assistant',
      description: 'Get help with content creation, scheduling, and analytics from your AI assistant.',
      icon: Bot,
      details: [
        'Natural language interface',
        'Context-aware suggestions',
        'Task automation',
        'Learning capabilities',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-primary-900 px-4 sm:px-6 lg:px-8 py-28">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful Features for
            <span className="block text-primary-400">Modern Marketing</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300">
            Everything you need to create, manage, and optimize your marketing content with AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 text-base font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-900 transform hover:-translate-y-1 transition-all duration-200"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-white border border-gray-100 shadow-soft hover:shadow-medium transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center text-gray-600">
                        <Wand2 className="w-4 h-4 text-primary-500 mr-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of marketers already using our platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/signup"
              className="px-8 py-3 text-base font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 text-base font-medium rounded-lg border-2 border-white text-white hover:bg-white hover:text-primary-900 transform hover:-translate-y-1 transition-all duration-200"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;