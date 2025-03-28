import React from 'react';
import { AlertTriangle, Shield, XCircle } from 'lucide-react';

interface ContentModerationAlertProps {
  violations: {
    ruleId: string;
    severity: string;
    action: string;
    details: {
      category: string;
      matches: string[];
    };
  }[];
  onAppeal?: () => void;
  isEnterprise?: boolean;
}

const ContentModerationAlert: React.FC<ContentModerationAlertProps> = ({
  violations,
  onAppeal,
  isEnterprise,
}) => {
  const mostSevereViolation = violations.reduce((prev, curr) => {
    if (curr.action === 'ban') return curr;
    if (curr.action === 'suspend' && prev.action !== 'ban') return curr;
    return prev;
  }, violations[0]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3 w-full">
          <h3 className="text-sm font-medium text-red-800">
            Content Moderation Alert
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              Your content has been {isEnterprise ? 'suspended' : mostSevereViolation.action === 'ban' ? 'banned' : 'suspended'} due
              to the following violations:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {violations.map((violation, index) => (
                <li key={index}>
                  {violation.details.category.charAt(0).toUpperCase() + 
                   violation.details.category.slice(1)} content detected
                </li>
              ))}
            </ul>
          </div>
          {isEnterprise && onAppeal && (
            <div className="mt-4">
              <button
                onClick={onAppeal}
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Shield className="h-4 w-4 mr-2" />
                Submit Appeal
              </button>
            </div>
          )}
          {!isEnterprise && mostSevereViolation.action === 'ban' && (
            <div className="mt-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-sm text-red-700">
                Your account has been banned due to severe content violations.
                This decision is final and cannot be appealed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentModerationAlert;