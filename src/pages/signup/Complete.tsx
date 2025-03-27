import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import SignupSteps from '../../components/SignupSteps';

const steps = ['Role', 'Plan', 'Setup', 'Complete'];

const Complete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <SignupSteps currentStep={4} steps={steps} />
        
        <div className="mt-12 text-center">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-[#00E5BE]" />
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Setup Complete!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your account has been successfully created. You'll be redirected to your dashboard in a moment.
          </p>
        </div>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900">What's next?</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0" />
              <span className="ml-3 text-gray-600">
                Explore the dashboard and familiarize yourself with the interface
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0" />
              <span className="ml-3 text-gray-600">
                Connect your social media accounts
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-[#00E5BE] shrink-0" />
              <span className="ml-3 text-gray-600">
                Create your first AI-powered content
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Complete;