import React from 'react';
import { Check } from 'lucide-react';

interface StepProps {
  currentStep: number;
  steps: string[];
}

const SignupSteps: React.FC<StepProps> = ({ currentStep, steps }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
            ${index < currentStep 
              ? 'bg-[#00E5BE] border-[#00E5BE] text-white' 
              : index === currentStep 
                ? 'border-[#00E5BE] text-[#00E5BE]' 
                : 'border-gray-300 text-gray-300'}`}
          >
            {index < currentStep ? (
              <Check className="w-5 h-5" />
            ) : (
              <span>{index + 1}</span>
            )}
          </div>
          <span className={`ml-2 ${
            index === currentStep ? 'text-[#00E5BE]' : 'text-gray-500'
          }`}>
            {step}
          </span>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-4 ${
              index < currentStep ? 'bg-[#00E5BE]' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SignupSteps;