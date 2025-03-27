import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, User } from 'lucide-react';
import SignupSteps from '../../components/SignupSteps';

const roles = [
  {
    id: 'individual',
    title: 'Individual',
    description: 'Perfect for freelancers and solo marketers',
    icon: User,
  },
  {
    id: 'business',
    title: 'Business',
    description: 'For small to medium-sized businesses',
    icon: Building2,
  },
  {
    id: 'agency',
    title: 'Agency',
    description: 'For marketing agencies and large teams',
    icon: Users,
  },
];

const steps = ['Role', 'Plan', 'Setup', 'Complete'];

const RoleSelection = () => {
  const navigate = useNavigate();

  const handleRoleSelect = (roleId: string) => {
    localStorage.setItem('selectedRole', roleId);
    navigate('/signup/plan');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <SignupSteps currentStep={0} steps={steps} />
        
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Choose your role</h1>
          <p className="mt-4 text-lg text-gray-600">
            Select the option that best describes your needs
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className="relative p-8 rounded-2xl bg-white border-2 border-gray-100 shadow-xl 
                  hover:border-[#00E5BE] hover:shadow-2xl hover:-translate-y-1 
                  transition-all duration-300 text-left group"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl 
                  bg-[#00E5BE]/10 text-[#00E5BE] group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {role.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {role.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;