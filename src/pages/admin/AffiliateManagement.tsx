import React, { useState, useEffect } from 'react';
import { Users, DollarSign, BarChart2, Settings, Search, Download, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';

interface AffiliateUser {
  id: string;
  name: string;
  email: string;
  totalEarnings: number;
  pendingPayout: number;
  conversionRate: number;
  status: 'active' | 'suspended' | 'pending';
  joinedAt: string;
}

interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  method: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

const AffiliateManagement = () => {
  const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchAffiliates();
    fetchPayoutRequests();
  }, []);

  const fetchAffiliates = async () => {
    try {
      const { data: affiliateLinks, error: linksError } = await supabase
        .from('affiliate_links')
        .select(`
          *,
          user:profiles(
            id,
            first_name,
            last_name,
            email
          ),
          clicks:affiliate_clicks(count),
          conversions:affiliate_conversions(amount, commission_amount)
        `);

      if (linksError) throw linksError;

      // Process data
      const affiliateData = affiliateLinks.map((link: any) => {
        const totalEarnings = link.conversions.reduce((sum: number, conv: any) => sum + conv.commission_amount, 0);
        const clicks = link.clicks.length;
        const conversions = link.conversions.length;
        const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;

        return {
          id: link.user.id,
          name: `${link.user.first_name} ${link.user.last_name || ''}`.trim(),
          email: link.user.email,
          totalEarnings,
          pendingPayout: 0, // Will be calculated from pending conversions
          conversionRate,
          status: 'active',
          joinedAt: link.created_at,
        };
      });

      setAffiliates(affiliateData);
    } catch (error) {
      console.error('Error fetching affiliates:', error);
      toast.error('Failed to load affiliate data');
    }
  };

  const fetchPayoutRequests = async () => {
    try {
      const { data: payouts, error: payoutsError } = await supabase
        .from('affiliate_payouts')
        .select(`
          *,
          user:profiles(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });

      if (payoutsError) throw payoutsError;

      const formattedPayouts = payouts.map((payout: any) => ({
        id: payout.id,
        userId: payout.user_id,
        userName: `${payout.user.first_name} ${payout.user.last_name || ''}`.trim(),
        amount: payout.amount,
        method: payout.payout_method,
        status: payout.status,
        requestedAt: payout.created_at,
      }));

      setPayoutRequests(formattedPayouts);
    } catch (error) {
      console.error('Error fetching payout requests:', error);
      toast.error('Failed to load payout requests');
    }
  };

  const handlePayoutAction = async (payoutId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('affiliate_payouts')
        .update({
          status: action === 'approve' ? 'completed' : 'rejected',
          processed_at: new Date().toISOString(),
        })
        .eq('id', payoutId);

      if (error) throw error;

      setPayoutRequests(payoutRequests.map(request =>
        request.id === payoutId
          ? { ...request, status: action === 'approve' ? 'approved' : 'rejected' }
          : request
      ));

      toast.success(`Payout ${action}d successfully`);
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast.error('Failed to update payout status');
    }
  };

  const filteredAffiliates = affiliates.filter(affiliate => {
    const matchesSearch = 
      affiliate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      affiliate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || affiliate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Affiliate Management</h2>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </button>
          <button className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Total Affiliates</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{affiliates.length}</p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Total Earnings</h3>
            <DollarSign className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            ${affiliates.reduce((sum, aff) => sum + aff.totalEarnings, 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Pending Payouts</h3>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            ${affiliates.reduce((sum, aff) => sum + aff.pendingPayout, 0).toLocaleString()}
          </p>
        </div>

        <div className="p-6 bg-gray-800 rounded-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400">Avg. Conversion</h3>
            <BarChart2 className="w-5 h-5 text-gray-400" />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">
            {(affiliates.reduce((sum, aff) => sum + aff.conversionRate, 0) / affiliates.length).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Affiliate Partners</h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search affiliates..."
                  className="pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-red-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Affiliate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Total Earnings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Pending Payout</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Conversion Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredAffiliates.map((affiliate) => (
                <tr key={affiliate.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{affiliate.name}</div>
                      <div className="text-sm text-gray-400">{affiliate.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      affiliate.status === 'active' ? 'bg-green-100 text-green-800' :
                      affiliate.status === 'suspended' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {affiliate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${affiliate.totalEarnings.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${affiliate.pendingPayout.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {affiliate.conversionRate.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(affiliate.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-white">
                      <Settings className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Requests */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">Pending Payout Requests</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Affiliate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {payoutRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 text-white">
                    {request.userName}
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${request.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {request.method}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(request.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePayoutAction(request.id, 'approve')}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handlePayoutAction(request.id, 'reject')}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AffiliateManagement;