import React, { useState } from 'react';
import { Power, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AutoPilotToggleProps {
  onToggle?: (enabled: boolean) => void;
}

const AutoPilotToggle: React.FC<AutoPilotToggleProps> = ({ onToggle }) => {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    
    if (newState) {
      toast.success('Auto-Pilot mode enabled');
    } else {
      toast.info('Auto-Pilot mode disabled');
    }

    if (onToggle) {
      onToggle(newState);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Auto-Pilot Mode</h3>
          <p className="text-sm text-gray-500">Automate your content workflow with AI</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-10 w-20 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00E5BE] ${
            enabled ? 'bg-[#00E5BE]' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
              enabled ? 'translate-x-11' : 'translate-x-1'
            }`}
          >
            <Power className={`h-4 w-4 m-2 ${enabled ? 'text-[#00E5BE]' : 'text-gray-400'}`} />
          </span>
        </button>
      </div>

      {enabled && (
        <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-700">
            <p className="font-medium">Auto-Pilot is active</p>
            <p className="mt-1">Content will be automatically generated and scheduled based on your preferences. All content requires approval before publishing.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoPilotToggle;