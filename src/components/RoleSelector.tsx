import React from 'react';
import { Building2, Users, User } from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  features: string[];
}

const roles: Role[] = [
  {
    id: 'individual',
    name: 'Individual',
    description: 'Perfect for freelancers and solo marketers',
    icon: User,
    features: [
      'Create and manage content',
      'Basic analytics',
      'AI content generation',
      'Standard support',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For small to medium-sized businesses',
    icon: Building2,
    features: [
      'Everything in Individual, plus:',
      'Team collaboration',
      'Advanced analytics',
      'Priority support',
      'Custom templates',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'For marketing agencies and large teams',
    icon: Users,
    features: [
      'Everything in Business, plus:',
      'Client management',
      'White-label reports',
      'API access',
      'Dedicated support',
    ],
  },
];

interface RoleSelectorProps {
  selectedRole?: string;
  onSelect: (roleId: string) => void;
  disabled?: boolean;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onSelect,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {roles.map((role) => {
        const Icon = role.icon;
        const isSelected = selectedRole === role.id;

        return (
          <button
            key={role.id}
            onClick={() => !disabled && onSelect(role.id)}
            disabled={disabled}
            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${
              isSelected
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
            }`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {role.name}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {role.description}
            </p>
            <ul className="mt-4 space-y-2">
              {role.features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
};

export default RoleSelector;