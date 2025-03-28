import React from 'react';
import { Shield } from 'lucide-react';
import SecuritySettings from './SecuritySettings';

const Security = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-5 h-5 text-[#00E5BE]" />
        <h2 className="text-2xl font-bold text-white">Security</h2>
      </div>

      <SecuritySettings />
    </div>
  );
};

export default Security;