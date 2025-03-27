import React, { useState } from 'react';
import { Target, DollarSign, Users, Clock, Image as ImageIcon, Link as LinkIcon, BarChart2, Trash2, Edit2, Copy, CheckCircle, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface AdPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  formats: string[];
}

interface AdCampaign {
  id: string;
  name: string;
  platform: string;
  headline: string;
  caption: string;
  cta: string;
  audience: {
    location: string;
    interests: string[];
    demographics: {
      ageRange: string;
      gender: string;
    };
  };
  budget: {
    amount: number;
    duration: number;
  };
  status: 'draft' | 'active' | 'paused' | 'completed';
  performance?: {
    impressions: number;
    clicks: number;
    ctr: number;
    spend: number;
  };
}

const platforms: AdPlatform[] = [
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
    id: 'twitter',
    name: 'X Ads',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    formats: ['promoted-tweets', 'thread', 'image', 'video'],
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

const AdManager = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<AdPlatform | null>(null);
  const [campaigns, setCampaigns] = useState<AdCampaign[]>([]);
  const [step, setStep] = useState<'platform' | 'details' | 'audience' | 'budget' | 'review'>('platform');
  const [currentCampaign, setCurrentCampaign] = useState<Partial<AdCampaign>>({
    name: '',
    platform: '',
    headline: '',
    caption: '',
    cta: 'Learn More',
    audience: {
      location: '',
      interests: [],
      demographics: {
        ageRange: '18-65',
        gender: 'all',
      },
    },
    budget: {
      amount: 100,
      duration: 7,
    },
    status: 'draft',
  });

  const handlePlatformSelect = (platform: AdPlatform) => {
    setSelectedPlatform(platform);
    setCurrentCampaign({ ...currentCampaign, platform: platform.id });
    setStep('details');
  };

  const handleCreateCampaign = () => {
    const newCampaign: AdCampaign = {
      ...currentCampaign as AdCampaign,
      id: `campaign-${Date.now()}`,
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        spend: 0,
      },
    };

    setCampaigns([...campaigns, newCampaign]);
    toast.success('Campaign created successfully!');
    setStep('platform');
    setSelectedPlatform(null);
    setCurrentCampaign({
      name: '',
      platform: '',
      headline: '',
      caption: '',
      cta: 'Learn More',
      audience: {
        location: '',
        interests: [],
        demographics: {
          ageRange: '18-65',
          gender: 'all',
        },
      },
      budget: {
        amount: 100,
        duration: 7,
      },
      status: 'draft',
    });
  };

  const handleDuplicateCampaign = (campaign: AdCampaign) => {
    const duplicatedCampaign: AdCampaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      performance: {
        impressions: 0,
        clicks: 0,
        ctr: 0,
        spend: 0,
      },
    };

    setCampaigns([...campaigns, duplicatedCampaign]);
    toast.success('Campaign duplicated successfully!');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    toast.success('Campaign deleted successfully!');
  };

  const renderPlatformSelection = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900">Select Ad Platform</h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handlePlatformSelect(platform)}
            className="p-4 rounded-lg border border-gray-200 hover:border-[#00E5BE] transition-colors duration-300"
          >
            <div className="flex flex-col items-center space-y-2">
              {platform.icon}
              <span className="text-sm font-medium">{platform.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderCampaignDetails = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900">Campaign Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campaign Name
            </label>
            <input
              type="text"
              value={currentCampaign.name}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter campaign name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Headline
            </label>
            <input
              type="text"
              value={currentCampaign.headline}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, headline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter headline"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              value={currentCampaign.caption}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, caption: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter caption"
              rows={3}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Call to Action
            </label>
            <select
              value={currentCampaign.cta}
              onChange={(e) => setCurrentCampaign({ ...currentCampaign, cta: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            >
              <option value="Learn More">Learn More</option>
              <option value="Shop Now">Shop Now</option>
              <option value="Sign Up">Sign Up</option>
              <option value="Download">Download</option>
              <option value="Contact Us">Contact Us</option>
            </select>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-2">Ad Preview</h5>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-900">
                {currentCampaign.headline || 'Your Headline Here'}
              </div>
              <div className="text-sm text-gray-600">
                {currentCampaign.caption || 'Your caption will appear here...'}
              </div>
              <button className="px-4 py-1 text-sm bg-[#00E5BE] text-white rounded-full">
                {currentCampaign.cta}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => setStep('audience')}
          disabled={!currentCampaign.name || !currentCampaign.headline || !currentCampaign.caption}
          className="px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Audience
        </button>
      </div>
    </div>
  );

  const renderAudienceTargeting = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900">Audience Targeting</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={currentCampaign.audience?.location}
              onChange={(e) => setCurrentCampaign({
                ...currentCampaign,
                audience: { ...currentCampaign.audience!, location: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interests
            </label>
            <input
              type="text"
              value={currentCampaign.audience?.interests?.join(', ')}
              onChange={(e) => setCurrentCampaign({
                ...currentCampaign,
                audience: { ...currentCampaign.audience!, interests: e.target.value.split(',').map(i => i.trim()) }
              })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter interests (comma-separated)"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <select
              value={currentCampaign.audience?.demographics?.ageRange}
              onChange={(e) => setCurrentCampaign({
                ...currentCampaign,
                audience: {
                  ...currentCampaign.audience!,
                  demographics: { ...currentCampaign.audience!.demographics, ageRange: e.target.value }
                }
              })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            >
              <option value="18-24">18-24</option>
              <option value="25-34">25-34</option>
              <option value="35-44">35-44</option>
              <option value="45-54">45-54</option>
              <option value="55-64">55-64</option>
              <option value="65+">65+</option>
              <option value="18-65">All Ages (18-65+)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              value={currentCampaign.audience?.demographics?.gender}
              onChange={(e) => setCurrentCampaign({
                ...currentCampaign,
                audience: {
                  ...currentCampaign.audience!,
                  demographics: { ...currentCampaign.audience!.demographics, gender: e.target.value }
                }
              })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            >
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep('details')}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setStep('budget')}
          disabled={!currentCampaign.audience?.location}
          className="px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Budget
        </button>
      </div>
    </div>
  );

  const renderBudgetSettings = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900">Budget & Duration</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Daily Budget
          </label>
          <div className="relative">
            <span className="absolute left-4 top-2 text-gray-500">$</span>
            <input
              type="number"
              value={currentCampaign.budget?.amount}
              onChange={(e) => setCurrentCampaign({
                ...currentCampaign,
                budget: { ...currentCampaign.budget!, amount: Number(e.target.value) }
              })}
              className="w-full pl-8 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              min="1"
              step="1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (Days)
          </label>
          <input
            type="number"
            value={currentCampaign.budget?.duration}
            onChange={(e) => setCurrentCampaign({
              ...currentCampaign,
              budget: { ...currentCampaign.budget!, duration: Number(e.target.value) }
            })}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            min="1"
            step="1"
          />
        </div>
      </div>
      <div className="p-6 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-4">Campaign Summary</h5>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily Budget</span>
            <span className="text-sm font-medium text-gray-900">
              ${currentCampaign.budget?.amount}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Duration</span>
            <span className="text-sm font-medium text-gray-900">
              {currentCampaign.budget?.duration} days
            </span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-900">Total Budget</span>
            <span className="text-sm font-medium text-gray-900">
              ${(currentCampaign.budget?.amount || 0) * (currentCampaign.budget?.duration || 0)}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep('audience')}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={() => setStep('review')}
          disabled={!currentCampaign.budget?.amount || !currentCampaign.budget?.duration}
          className="px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Review Campaign
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6">
      <h4 className="font-medium text-gray-900">Review Campaign</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Campaign Details</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Platform:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {platforms.find(p => p.id === currentCampaign.platform)?.name}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Headline:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.headline}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Audience</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Location:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.audience?.location}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Age Range:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.audience?.demographics?.ageRange}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Interests:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.audience?.interests?.join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-medium text-gray-900 mb-3">Budget</h5>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Daily Budget:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  ${currentCampaign.budget?.amount}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Duration:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {currentCampaign.budget?.duration} days
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-600">Total Budget:</span>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  ${(currentCampaign.budget?.amount || 0) * (currentCampaign.budget?.duration || 0)}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Brain className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <h5 className="font-medium text-blue-900">AI Recommendations</h5>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                  <li>• Consider increasing budget by 20% to reach optimal audience size</li>
                  <li>• Add more specific interests to improve targeting precision</li>
                  <li>• Test multiple ad variations for better performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep('budget')}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
        >
          Back
        </button>
        <button
          onClick={handleCreateCampaign}
          className="px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
        >
          Create Campaign
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Ad Manager</h3>
        </div>
      </div>

      {step === 'platform' && renderPlatformSelection()}
      {step === 'details' && renderCampaignDetails()}
      {step === 'audience' && renderAudienceTargeting()}
      {step === 'budget' && renderBudgetSettings()}
      {step === 'review' && renderReview()}

      {campaigns.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Active Campaigns</h4>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-[#00E5BE] transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      campaign.status === 'active' ? 'bg-green-500' :
                      campaign.status === 'paused' ? 'bg-yellow-500' :
                      campaign.status === 'completed' ? 'bg-blue-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="font-medium text-gray-900">{campaign.name}</span>
                    <span className="text-sm text-gray-500">
                      {platforms.find(p => p.id === campaign.platform)?.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDuplicateCampaign(campaign)}
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCampaign(campaign.id)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {campaign.performance && (
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Impressions</div>
                      <div className="font-medium text-gray-900">
                        {campaign.performance.impressions.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Clicks</div>
                      <div className="font-medium text-gray-900">
                        {campaign.performance.clicks.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">CTR</div>
                      <div className="font-medium text-gray-900">
                        {campaign.performance.ctr.toFixed(2)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Spend</div>
                      <div className="font-medium text-gray-900">
                        ${campaign.performance.spend.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdManager;