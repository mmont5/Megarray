import React, { useState, useEffect } from 'react';
import { Link2, Copy, ExternalLink, BarChart2, DollarSign, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface AffiliateLink {
  id: string;
  code: string;
  description: string;
  commission_rate: number;
  created_at: string;
  stats: {
    clicks: number;
    conversions: number;
    earnings: number;
  };
}

const AffiliateLinks = () => {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newLink, setNewLink] = useState({
    description: '',
    commission_rate: 0.1,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data: linksData, error: linksError } = await supabase
        .from('affiliate_links')
        .select('*')
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;

      // Get stats for each link
      const linksWithStats = await Promise.all(linksData.map(async (link) => {
        const [clicks, conversions] = await Promise.all([
          supabase
            .from('affiliate_clicks')
            .select('count', { count: 'exact' })
            .eq('link_id', link.id),
          supabase
            .from('affiliate_conversions')
            .select('commission_amount')
            .eq('link_id', link.id)
            .eq('status', 'completed'),
        ]);

        const earnings = conversions.data?.reduce((sum, conv) => sum + conv.commission_amount, 0) || 0;

        return {
          ...link,
          stats: {
            clicks: clicks.count || 0,
            conversions: conversions.data?.length || 0,
            earnings,
          },
        };
      }));

      setLinks(linksWithStats);
    } catch (error) {
      console.error('Error fetching affiliate links:', error);
      toast.error('Failed to load affiliate links');
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('affiliate_links')
        .insert({
          description: newLink.description,
          commission_rate: newLink.commission_rate,
          code: generateUniqueCode(),
        })
        .select()
        .single();

      if (error) throw error;

      setLinks([...links, { ...data, stats: { clicks: 0, conversions: 0, earnings: 0 } }]);
      setIsCreating(false);
      setNewLink({ description: '', commission_rate: 0.1 });
      toast.success('Affiliate link created successfully');
    } catch (error) {
      console.error('Error creating affiliate link:', error);
      toast.error('Failed to create affiliate link');
    }
  };

  const generateUniqueCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8;
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/ref/${code}`);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link2 className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Affiliate Links</h3>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          Create Link
        </button>
      </div>

      {isCreating && (
        <div className="p-6 bg-gray-50 rounded-lg">
          <form onSubmit={handleCreateLink} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={newLink.description}
                onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Campaign or promotion description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Commission Rate</label>
              <div className="mt-1 relative rounded-lg">
                <input
                  type="number"
                  value={newLink.commission_rate}
                  onChange={(e) => setNewLink({ ...newLink, commission_rate: parseFloat(e.target.value) })}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-12"
                  step="0.01"
                  min="0"
                  max="1"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {links.map((link) => (
          <div
            key={link.id}
            className="p-6 bg-white rounded-lg border border-gray-200 hover:border-[#00E5BE] transition-colors duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{link.description || 'Untitled Campaign'}</h4>
                <p className="mt-1 text-sm text-gray-600">
                  Created on {new Date(link.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => copyToClipboard(link.code)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`/ref/${link.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Clicks</span>
                  <BarChart2 className="w-4 h-4 text-gray-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {link.stats.clicks.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Conversions</span>
                  <AlertTriangle className="w-4 h-4 text-gray-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {link.stats.conversions.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Earnings</span>
                  <DollarSign className="w-4 h-4 text-gray-400" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  ${link.stats.earnings.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-800">Commission Rate:</span>
                <span className="text-sm text-blue-800">{(link.commission_rate * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AffiliateLinks;