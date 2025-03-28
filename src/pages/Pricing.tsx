import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Shield, Brain, Users, Zap } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    description: 'Perfect for trying out Megarray',
    features: [
      'AI content generation (100 credits/mo)',
      'Basic analytics',
      'Single user',
      'Standard support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '49',
    description: 'For growing businesses',
    features: [
      'AI content generation (1000 credits/mo)',
      'Advanced analytics',
      'Up to 3 team members',
      'Priority support',
      'Custom templates',
    ],
    popular: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: '99',
    description: 'For larger teams',
    features: [
      'AI content generation (unlimited)',
      'Enterprise analytics',
      'Unlimited team members',
      '24/7 priority support',
      'Custom templates',
      'API access',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Custom solutions for large organizations',
    features: [
      'Custom AI models',
      'Dedicated support team',
      'Custom integrations',
      'SLA guarantees',
      'Training & onboarding',
      'Advanced security features',
      'Custom analytics',
      'Unlimited everything',
    ],
  },
];

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'AI-Powered Content',
    description: 'Generate high-quality content with advanced AI models',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with role-based access',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Enterprise Security',
    description: 'Bank-grade security and data protection',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Fast Integration',
    description: 'Connect with your existing tools in minutes',
  },
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that best fits your needs. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-xl bg-primary-50 text-primary-600">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Pricing Plans */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl bg-white border-2 
                ${plan.popular ? 'border-primary-500 shadow-primary-100' : 'border-gray-100'} 
                shadow-xl hover:shadow-2xl hover:-translate-y-1 
                transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 
                  bg-primary-500 text-white text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}

              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                {plan.price === 'Custom' ? (
                  <span className="text-4xl font-bold text-gray-900">Custom</span>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="ml-2 text-gray-600">/month</span>
                  </>
                )}
              </div>
              <p className="mt-4 text-gray-600">{plan.description}</p>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-primary-500 shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === 'enterprise' ? (
                <Link
                  to="/contact"
                  className="mt-8 block w-full py-3 px-4 rounded-lg text-center font-semibold 
                    bg-gray-100 text-gray-900 hover:bg-gray-200 transition-colors duration-200"
                >
                  Contact Sales
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className={`mt-8 block w-full py-3 px-4 rounded-lg text-center font-semibold 
                    ${plan.popular 
                      ? 'bg-primary-500 text-white hover:bg-primary-600' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} 
                    transition-colors duration-200`}
                >
                  Get Started
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently asked questions
            </h2>
            <dl className="space-y-8">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <dt className="text-lg font-semibold text-gray-900">
                  Can I change plans later?
                </dt>
                <dd className="mt-2 text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </dd>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <dt className="text-lg font-semibold text-gray-900">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-gray-600">
                  We accept all major credit cards, Apple Pay, Google Pay, and cryptocurrency (ETH, USDC, BTC, MATIC).
                </dd>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <dt className="text-lg font-semibold text-gray-900">
                  What happens if I exceed my plan limits?
                </dt>
                <dd className="mt-2 text-gray-600">
                  You'll be notified when you're approaching your limits. You can choose to upgrade your plan or purchase additional credits as needed.
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact our sales team for custom pricing options or any other questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-primary-500 hover:bg-primary-600 transition-colors duration-200"
            >
              Contact Sales
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;