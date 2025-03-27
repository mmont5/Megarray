import React, { useState } from 'react';
import { CreditCard, Wallet, Shield, ArrowUpRight } from 'lucide-react';
import PaymentMethodForm from '../../components/PaymentMethodForm';
import SubscriptionManager from '../../components/SubscriptionManager';

const Billing = () => {
  const [showAddPayment, setShowAddPayment] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <button
          onClick={() => setShowAddPayment(true)}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          Add Payment Method
        </button>
      </div>

      {showAddPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Payment Method</h3>
              <button
                onClick={() => setShowAddPayment(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <PaymentMethodForm
              onSuccess={() => setShowAddPayment(false)}
            />
          </div>
        </div>
      )}

      <SubscriptionManager />

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h3 className="font-medium text-blue-900">Payment Security</h3>
            <p className="mt-1 text-sm text-blue-700">
              All payment information is encrypted and securely stored. We use industry-standard security measures to protect your data.
            </p>
            <a
              href="/security"
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
            >
              Learn more about our security measures
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;