import React, { useState } from 'react';
import { Target, DollarSign, Users, Clock, Image as ImageIcon, Link as LinkIcon, BarChart2, Trash2, Edit2, Copy, CheckCircle, Brain } from 'lucide-react';
import { toast } from 'sonner';

const platforms = [
  {
    id: 'meta',
    name: 'Meta Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    formats: ['image', 'video', 'carousel', 'story'],
  },
  {
    id: 'google',
    name: 'Google Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.18 10.382L12.392 4.737a.699.699 0 0 0-.785 0L1.82 10.382a.702.702 0 0 0-.393.63v11.576c0 .387.314.702.702.702h19.742a.702.702 0 0 0 .702-.702V11.012a.702.702 0 0 0-.393-.63zM9.237 20.035h-4.93v-8.244l4.93 2.843v5.401zm9.456 0h-4.93v-5.401l4.93-2.843v8.244z"/></svg>,
    formats: ['search', 'display', 'video', 'shopping'],
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
    formats: ['in-feed', 'topview', 'branded-effects'],
  },
  {
    id: 'x',
    name: 'X Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    formats: ['promoted-posts', 'thread', 'image', 'video'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>,
    formats: ['sponsored-content', 'message-ads', 'dynamic-ads'],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>,
    formats: ['post', 'thread', 'image', 'video', 'poll'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    formats: ['video', 'shorts', 'post', 'playlist'],
  },
  {
    id: 'email',
    name: 'Email',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>,
    formats: ['newsletter', 'campaign', 'announcement', 'promotion'],
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"/></svg>,
    formats: ['promotional', 'transactional', 'campaign'],
  },
];

interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  status: 'active' | 'paused' | 'completed';
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    spend: number;
  };
}

const AdManager = () => {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([
    {
      id: '1',
      name: 'Summer Sale Campaign',
      platform: 'facebook',
      status: 'active',
      performance: {
        impressions: 12500,
        clicks: 450,
        ctr: 3.6,
        spend: 250,
      },
    },
    {
      id: '2',
      name: 'Product Launch',
      platform: 'instagram',
      status: 'paused',
      performance: {
        impressions: 8200,
        clicks: 320,
        ctr: 3.9,
        spend: 180,
      },
    },
  ]);

  const handleDuplicateCampaign = (campaign: AdCampaign) => {
    const newCampaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (Copy)`,
      status: 'paused' as const,
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        spend: 0,
      },
    };
    setCampaigns([...campaigns, newCampaign]);
    toast.success('Campaign duplicated successfully');
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success('Campaign deleted successfully');
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-white">Ad Manager</h3>
        </div>
        <button className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]">
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-[#00E5BE]" />
              <span className="text-sm text-gray-300">Total Reach</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">45.2K</p>
          <p className="text-sm text-gray-400">+12% from last month</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-[#00E5BE]" />
              <span className="text-sm text-gray-300">CTR</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">3.8%</p>
          <p className="text-sm text-gray-400">+0.5% from last month</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-[#00E5BE]" />
              <span className="text-sm text-gray-300">Total Spend</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">$430</p>
          <p className="text-sm text-gray-400">Under budget by 15%</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-[#00E5BE]" />
              <span className="text-sm text-gray-300">Conversions</span>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">128</p>
          <p className="text-sm text-gray-400">+24% from last month</p>
        </div>
      </div>

      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="p-4 bg-gray-700 rounded-lg border border-gray-600 hover:border-[#00E5BE] transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  campaign.status === 'active' ? 'bg-green-500' :
                  campaign.status === 'paused' ? 'bg-yellow-500' :
                  'bg-blue-500'
                }`} />
                <span className="font-medium text-white">{campaign.name}</span>
                <span className="text-sm text-gray-400">{campaign.platform}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDuplicateCampaign(campaign)}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCampaign(campaign.id)}
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {campaign.performance && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-gray-400">Impressions</div>
                  <div className="font-medium text-white">
                    {campaign.performance.impressions.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Clicks</div>
                  <div className="font-medium text-white">
                    {campaign.performance.clicks.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">CTR</div>
                  <div className="font-medium text-white">
                    {campaign.performance.ctr.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Spend</div>
                  <div className="font-medium text-white">
                    ${campaign.performance.spend.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-[#00E5BE] mt-1" />
          <div>
            <h5 className="font-medium text-white">AI Recommendations</h5>
            <ul className="mt-2 space-y-2 text-sm text-gray-300">
              <li>• Increase budget allocation for best performing campaigns</li>
              <li>• Test new audience segments for better targeting</li>
              <li>• Optimize ad creatives based on engagement data</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdManager;