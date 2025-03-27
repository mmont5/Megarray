import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import SignupSteps from '../../components/SignupSteps';

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
];

const steps = ['Role', 'Plan', 'Setup', 'Complete'];

const PlanSelection = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (planId: string) => {
    localStorage.setItem('selectedPlan', planId);
    navigate('/signup/setup');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <SignupSteps currentStep={1} steps={steps} />
        
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose your plan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the plan that best fits your needs
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-2xl bg-white border-2 
                ${plan.popular ? 'border-[#00E5BE]' : 'border-gray-100'} 
                shadow-xl hover:border-[#00E5BE] hover:shadow-2xl hover:-translate-y-1 
                transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 -translate-y-1/2 px-4 py-1 
                  bg-[#00E5BE] text-white text-sm font-semibold rounded-full">
                  Popular
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                <span className="ml-2 text-gray-600">/month</span>
              </div>
              <p className="mt-4 text-gray-600">{plan.description}</p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-[#00E5BE] shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`mt-8 w-full py-3 px-4 rounded-lg font-semibold 
                  ${plan.popular 
                    ? 'bg-[#00E5BE] text-white hover:bg-[#00D1AD]' 
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} 
                  transition-colors duration-300`}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanSelection;