import React, { useState } from 'react';
import { BarChart2, Clock, Share2, Bookmark, Mail, MousePointer, ArrowDown, Brain, TrendingUp, Users } from 'lucide-react';

interface AnalyticsMetrics {
  posts: {
    reach: number;
    clicks: number;
    shares: number;
    saves: number;
    timeOfDay: { [key: string]: number };
    platformPerformance: { [key: string]: number };
  };
  emails: {
    opens: number;
    clicks: number;
    bounces: number;
    unsubscribes: number;
    clickHeatmap: { [key: string]: number };
    engagementTrends: { [key: string]: number };
  };
  funnels: {
    stages: {
      name: string;
      visitors: number;
      conversionRate: number;
    }[];
  };
  heatmaps: {
    scrollDepth: { [key: string]: number };
    clickDensity: { [key: string]: number };
  };
}

const mockData: AnalyticsMetrics = {
  posts: {
    reach: 125000,
    clicks: 12500,
    shares: 3200,
    saves: 2800,
    timeOfDay: {
      '9am': 850,
      '12pm': 1200,
      '3pm': 1500,
      '6pm': 950,
      '9pm': 700,
    },
    platformPerformance: {
      instagram: 85,
      facebook: 72,
      twitter: 68,
      linkedin: 78,
      tiktok: 92,
    },
  },
  emails: {
    opens: 45000,
    clicks: 8500,
    bounces: 250,
    unsubscribes: 120,
    clickHeatmap: {
      'header-cta': 2500,
      'main-image': 1800,
      'pricing-section': 3200,
      'testimonials': 1200,
    },
    engagementTrends: {
      'Week 1': 72,
      'Week 2': 75,
      'Week 3': 82,
      'Week 4': 88,
    },
  },
  funnels: {
    stages: [
      { name: 'Pageview', visitors: 100000, conversionRate: 100 },
      { name: 'Click', visitors: 25000, conversionRate: 25 },
      { name: 'Form Submit', visitors: 5000, conversionRate: 20 },
      { name: 'Purchase', visitors: 1000, conversionRate: 20 },
    ],
  },
  heatmaps: {
    scrollDepth: {
      'top': 100,
      'middle': 75,
      'bottom': 45,
    },
    clickDensity: {
      'hero-section': 2500,
      'features': 1800,
      'pricing': 2200,
      'cta': 3000,
    },
  },
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'emails' | 'funnels' | 'heatmaps'>('posts');
  const [timeRange, setTimeRange] = useState('7d');

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const renderPostsAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">Total Reach</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-blue-900">
            {formatNumber(mockData.posts.reach)}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">Clicks</span>
            <MousePointer className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-green-900">
            {formatNumber(mockData.posts.clicks)}
          </div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-purple-600">Shares</span>
            <Share2 className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-purple-900">
            {formatNumber(mockData.posts.shares)}
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-600">Saves</span>
            <Bookmark className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-orange-900">
            {formatNumber(mockData.posts.saves)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Best Posting Times</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.posts.timeOfDay).map(([time, value]) => (
              <div key={time} className="flex items-center">
                <Clock className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 w-12">{time}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${(value / 1500) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{value} engagements</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Platform Performance</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.posts.platformPerformance).map(([platform, score]) => (
              <div key={platform} className="flex items-center">
                <span className="text-sm text-gray-600 capitalize w-20">{platform}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{score}% effective</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailsAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-600">Opens</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-blue-900">
            {formatNumber(mockData.emails.opens)}
          </div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">Clicks</span>
            <MousePointer className="w-4 h-4 text-green-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-green-900">
            {formatNumber(mockData.emails.clicks)}
          </div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-600">Bounces</span>
            <ArrowDown className="w-4 h-4 text-red-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-red-900">
            {formatNumber(mockData.emails.bounces)}
          </div>
        </div>
        <div className="p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-600">Unsubscribes</span>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
          <div className="mt-2 text-2xl font-semibold text-orange-900">
            {formatNumber(mockData.emails.unsubscribes)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Click Heatmap</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.emails.clickHeatmap).map(([element, clicks]) => (
              <div key={element} className="flex items-center">
                <span className="text-sm text-gray-600 capitalize w-32">{element.replace('-', ' ')}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${(clicks / 3200) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{formatNumber(clicks)} clicks</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Engagement Trends</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.emails.engagementTrends).map(([week, rate]) => (
              <div key={week} className="flex items-center">
                <span className="text-sm text-gray-600 w-20">{week}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{rate}% engaged</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFunnelsAnalytics = () => (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium text-gray-900">Conversion Funnel</h4>
        <div className="mt-8 space-y-6">
          {mockData.funnels.stages.map((stage, index) => (
            <div key={stage.name} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{stage.name}</span>
                <span className="text-sm text-gray-600">{formatNumber(stage.visitors)} visitors</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00E5BE] rounded-full"
                  style={{ width: `${stage.conversionRate}%` }}
                />
              </div>
              {index < mockData.funnels.stages.length - 1 && (
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <ArrowDown className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{stage.conversionRate}%</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHeatmapsAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Scroll Depth</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.heatmaps.scrollDepth).map(([section, percentage]) => (
              <div key={section} className="flex items-center">
                <span className="text-sm text-gray-600 capitalize w-20">{section}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{percentage}% viewed</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Click Density</h4>
          <div className="mt-4 space-y-3">
            {Object.entries(mockData.heatmaps.clickDensity).map(([section, clicks]) => (
              <div key={section} className="flex items-center">
                <span className="text-sm text-gray-600 capitalize w-32">{section.replace('-', ' ')}</span>
                <div className="flex-1 ml-4">
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#00E5BE] rounded-full"
                      style={{ width: `${(clicks / 3000) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-600">{formatNumber(clicks)} clicks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">Analytics</h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['posts', 'emails', 'funnels', 'heatmaps'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-[#00E5BE] text-[#00E5BE]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'posts' && renderPostsAnalytics()}
      {activeTab === 'emails' && renderEmailsAnalytics()}
      {activeTab === 'funnels' && renderFunnelsAnalytics()}
      {activeTab === 'heatmaps' && renderHeatmapsAnalytics()}

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-blue-600 mt-1" />
          <div>
            <h5 className="font-medium text-blue-900">AI Insights</h5>
            <p className="mt-1 text-sm text-blue-700">
              This week, posts with lists outperformed visuals by 32%. The best engagement was seen at 3PM EST.
              Email campaigns showed a 15% improvement in CTR when using personalized subject lines.
              The product page's hero section generates 45% of all clicks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;