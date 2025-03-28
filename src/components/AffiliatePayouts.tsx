import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, Clock, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Payout {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payout_method: string;
  processed_at: string | null;
  created_at: string;
}

const AffiliatePayouts = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [isRequesting, setIsRequesting] = useState(false);
  const [payoutMethod, setPayoutMethod] = useState('bank_transfer');
  const [payoutDetails, setPayoutDetails] = useState({
    bank_name: '',
    account_number: '',
    routing_number: '',
  });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('affiliate_payouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts(data);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast.error('Failed to load payout history');
    }
  };

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);

    try {
      // Calculate available earnings
      const { data: conversions, error: convError } = await supabase
        .from('affiliate_conversions')
        .select('commission_amount')
        .eq('status', 'completed');

      if (convError) throw convError;

      const totalEarnings = conversions.reduce((sum, conv) => sum + conv.commission_amount, 0);
      const { data: existingPayouts, error: payoutError } = await supabase
        .from('affiliate_payouts')
        .select('amount')
        .in('status', ['completed', 'processing']);

      if (payoutError) throw payoutError;

      const paidAmount = existingPayouts.reduce((sum, payout) => sum + payout.amount, 0);
      const availableAmount = totalEarnings - paidAmount;

      if (availableAmount < 50) {
        throw new Error('Minimum payout amount is $50');
      }

      const { data: payout, error } = await supabase
        .from('affiliate_payouts')
        .insert({
          amount: availableAmount,
          payout_method: payoutMethod,
          payout_details: payoutDetails,
        })
        .select()
        .single();

      if (error) throw error;

      setPayouts([payout, ...payouts]);
      setIsRequesting(false);
      toast.success('Payout request submitted successfully');
    } catch (error: any) {
      console.error('Error requesting payout:', error);
      toast.error(error.message || 'Failed to request payout');
      setIsRequesting(false);
    }
  };

  const getStatusIcon = (status: Payout['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Affiliate Payouts</h3>
        </div>
        <button
          onClick={() => setIsRequesting(true)}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          Request Payout
        </button>
      </div>

      {isRequesting && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <form onSubmit={handleRequestPayout} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Payout Method</label>
              <select
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>

            {payoutMethod === 'bank_transfer' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={payoutDetails.bank_name}
                    onChange={(e) => setPayoutDetails({ ...payoutDetails, bank_name: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Account Number</label>
                  <input
                    type="text"
                    value={payoutDetails.account_number}
                    onChange={(e) => setPayoutDetails({ ...payoutDetails, account_number: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Routing Number</label>
                  <input
                    type="text"
                    value={payoutDetails.routing_number}
                    onChange={(e) => setPayoutDetails({ ...payoutDetails, routing_number: e.target.value })}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                  />
                </div>
              </>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsRequesting(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {payouts.map((payout) => (
          <div
            key={payout.id}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[#00E5BE] transition-colors duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {getStatusIcon(payout.status)}
                <div>
                  <p className="font-medium text-gray-900">
                    ${payout.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    via {payout.payout_method.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                </p>
                <p className="text-sm text-gray-600">
                  {payout.processed_at
                    ? `Processed on ${new Date(payout.processed_at).toLocaleDateString()}`
                    : `Requested on ${new Date(payout.created_at).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-3">
          <DollarSign className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h5 className="font-medium text-blue-900">Payout Information</h5>
            <p className="mt-1 text-sm text-blue-700">
              Payouts are processed within 3-5 business days. Minimum payout amount is $50.
              Make sure your payment details are correct to avoid any delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePayouts;