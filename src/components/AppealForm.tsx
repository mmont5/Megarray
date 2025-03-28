import React, { useState } from 'react';
import { Shield, Send } from 'lucide-react';
import { toast } from 'sonner';
import { submitAppeal } from '../lib/content-moderation';

interface AppealFormProps {
  violationId: string;
  onSubmitted?: () => void;
  onCancel?: () => void;
}

const AppealForm: React.FC<AppealFormProps> = ({
  violationId,
  onSubmitted,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitAppeal(violationId, reason);
      toast.success('Appeal submitted successfully');
      onSubmitted?.();
    } catch (error) {
      toast.error('Failed to submit appeal');
      console.error('Appeal submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="appeal-reason"
          className="block text-sm font-medium text-gray-700"
        >
          Appeal Reason
        </label>
        <div className="mt-1">
          <textarea
            id="appeal-reason"
            name="reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Please explain why this content should be reinstated..."
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !reason.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Shield className="h-4 w-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Appeal
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AppealForm;