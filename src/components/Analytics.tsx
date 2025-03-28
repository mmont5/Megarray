import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, ArrowUp, ArrowDown, Heart, MessageCircle, Share2, Eye, Target, Clock, Globe, Filter, Video, Image as ImageIcon, Repeat, Bookmark, ThumbsUp, UserPlus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Default data
const audienceData = [
  { age: '13-17', male: 2100, female: 2400 },
  { age: '18-24', male: 5400, female: 6100 },
  { age: '25-34', male: 7200, female: 7800 },
  { age: '35-44', male: 4300, female: 4600 },
  { age: '45-54', male: 2800, female: 3100 },
  { age: '55+', male: 1900, female: 2200 },
];

// Platform-specific metrics
const platformMetrics = {
  instagram: {
    overview: {
      followers: { value: '125.4K', change: 12.5 },
      engagement: { value: '5.2%', change: -2.3 },
      reach: { value: '458.2K', change: 15.8 },
      impressions: { value: '287.1K', change: 8.4 },
    },
    engagement: {
      likes: { value: '24.5K', change: 5.7 },
      comments: { value: '3.2K', change: 12.3 },
      saves: { value: '1.8K', change: -4.2 },
      shares: { value: '892', change: 18.5 },
    },
    contentTypes: {
      reels: { value: '45%', change: 15.2 },
      posts: { value: '35%', change: -2.1 },
      stories: { value: '20%', change: 5.8 },
    },
  },
  facebook: {
    overview: {
      followers: { value: '89.2K', change: 8.3 },
      engagement: { value: '4.8%', change: 3.2 },
      reach: { value: '325.1K', change: 12.4 },
      impressions: { value: '198.3K', change: 6.7 },
    },
    engagement: {
      likes: { value: '18.3K', change: 4.2 },
      comments: { value: '2.8K', change: 8.9 },
      shares: { value: '1.5K', change: 15.3 },
      clicks: { value: '756', change: 12.1 },
    },
    contentTypes: {
      videos: { value: '40%', change: 18.5 },
      photos: { value: '45%', change: -3.2 },
      links: { value: '15%', change: 2.4 },
    },
  },
  x: {
    overview: {
      followers: { value: '45.6K', change: 5.8 },
      engagement: { value: '3.9%', change: 2.1 },
      reach: { value: '245.8K', change: 9.3 },
      impressions: { value: '156.2K', change: 4.5 },
    },
    engagement: {
      likes: { value: '12.4K', change: 7.8 },
      reposts: { value: '3.5K', change: 15.2 },
      replies: { value: '892', change: 4.7 },
      clicks: { value: '456', change: 9.3 },
    },
    contentTypes: {
      posts: { value: '65%', change: 5.4 },
      threads: { value: '25%', change: 12.8 },
      media: { value: '10%', change: -2.3 },
    },
  },
  linkedin: {
    overview: {
      followers: { value: '34.8K', change: 7.2 },
      engagement: { value: '4.5%', change: 5.8 },
      reach: { value: '178.3K', change: 11.2 },
      impressions: { value: '134.5K', change: 8.9 },
    },
    engagement: {
      likes: { value: '8.9K', change: 6.4 },
      comments: { value: '1.2K', change: 9.7 },
      shares: { value: '645', change: 12.3 },
      clicks: { value: '892', change: 7.8 },
    },
    contentTypes: {
      articles: { value: '35%', change: 8.9 },
      posts: { value: '45%', change: 4.2 },
      documents: { value: '20%', change: 6.7 },
    },
  },
  tiktok: {
    overview: {
      followers: { value: '256.7K', change: 25.4 },
      engagement: { value: '8.9%', change: 15.7 },
      reach: { value: '892.4K', change: 28.9 },
      impressions: { value: '567.8K', change: 22.3 },
    },
    engagement: {
      likes: { value: '45.6K', change: 18.9 },
      comments: { value: '8.9K', change: 22.4 },
      shares: { value: '12.3K', change: 25.7 },
      saves: { value: '3.4K', change: 19.8 },
    },
    contentTypes: {
      videos: { value: '85%', change: 12.4 },
      duets: { value: '10%', change: 8.9 },
      stitches: { value: '5%', change: 5.6 },
    },
  },
};

// Default engagement data
const defaultEngagementData = [
  { date: 'Mon', likes: 3000, comments: 1500, shares: 700 },
  { date: 'Tue', likes: 2800, comments: 1400, shares: 650 },
  { date: 'Wed', likes: 3200, comments: 1600, shares: 750 },
  { date: 'Thu', likes: 3500, comments: 1800, shares: 800 },
  { date: 'Fri', likes: 3300, comments: 1700, shares: 780 },
  { date: 'Sat', likes: 2500, comments: 1200, shares: 550 },
  { date: 'Sun', likes: 2700, comments: 1300, shares: 600 },
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [platform, setPlatform] = useState('all');

  // Get metrics for selected platform or use combined metrics for 'all'
  const getMetrics = () => {
    if (platform === 'all') {
      // Combine metrics from all platforms
      return {
        overview: {
          followers: { value: '551.7K', change: 11.8 },
          engagement: { value: '5.5%', change: 4.9 },
          reach: { value: '2.1M', change: 15.5 },
          impressions: { value: '1.3M', change: 10.2 },
        },
        engagement: {
          likes: { value: '109.7K', change: 8.6 },
          comments: { value: '19.6K', change: 13.1 },
          shares: { value: '17.1K', change: 14.2 },
          saves: { value: '5.2K', change: 16.8 },
        },
        contentTypes: {
          videos: { value: '45%', change: 12.8 },
          images: { value: '35%', change: 5.4 },
          text: { value: '20%', change: -2.1 },
        },
      };
    }
    return platformMetrics[platform as keyof typeof platformMetrics];
  };

  const metrics = getMetrics();

  // Platform-specific engagement data
  const getEngagementData = () => {
    switch (platform) {
      case 'instagram':
        return [
          { date: 'Mon', likes: 5000, comments: 2800, saves: 1200 },
          { date: 'Tue', likes: 4200, comments: 2100, saves: 980 },
          { date: 'Wed', likes: 4800, comments: 2400, saves: 1100 },
          { date: 'Thu', likes: 5200, comments: 2900, saves: 1300 },
          { date: 'Fri', likes: 4900, comments: 2600, saves: 1150 },
          { date: 'Sat', likes: 3800, comments: 1900, saves: 850 },
          { date: 'Sun', likes: 4100, comments: 2200, saves: 950 },
        ];
      case 'tiktok':
        return [
          { date: 'Mon', likes: 12000, comments: 4500, shares: 2800 },
          { date: 'Tue', likes: 15000, comments: 5200, shares: 3100 },
          { date: 'Wed', likes: 13500, comments: 4800, shares: 2900 },
          { date: 'Thu', likes: 14200, comments: 5000, shares: 3000 },
          { date: 'Fri', likes: 16000, comments: 5500, shares: 3400 },
          { date: 'Sat', likes: 18000, comments: 6000, shares: 3800 },
          { date: 'Sun', likes: 17000, comments: 5800, shares: 3600 },
        ];
      case 'facebook':
        return [
          { date: 'Mon', likes: 8500, comments: 3200, shares: 1500 },
          { date: 'Tue', likes: 9200, comments: 3500, shares: 1650 },
          { date: 'Wed', likes: 8800, comments: 3300, shares: 1550 },
          { date: 'Thu', likes: 9500, comments: 3600, shares: 1700 },
          { date: 'Fri', likes: 9800, comments: 3700, shares: 1800 },
          { date: 'Sat', likes: 7500, comments: 2800, shares: 1300 },
          { date: 'Sun', likes: 8000, comments: 3000, shares: 1400 },
        ];
      case 'x':
        return [
          { date: 'Mon', likes: 4200, comments: 1800, retweets: 900 },
          { date: 'Tue', likes: 4500, comments: 2000, retweets: 950 },
          { date: 'Wed', likes: 4300, comments: 1900, retweets: 920 },
          { date: 'Thu', likes: 4600, comments: 2100, retweets: 980 },
          { date: 'Fri', likes: 4800, comments: 2200, retweets: 1000 },
          { date: 'Sat', likes: 3800, comments: 1600, retweets: 800 },
          { date: 'Sun', likes: 4000, comments: 1700, retweets: 850 },
        ];
      case 'linkedin':
        return [
          { date: 'Mon', likes: 2800, comments: 1200, shares: 450 },
          { date: 'Tue', likes: 3000, comments: 1300, shares: 480 },
          { date: 'Wed', likes: 2900, comments: 1250, shares: 460 },
          { date: 'Thu', likes: 3100, comments: 1350, shares: 490 },
          { date: 'Fri', likes: 3200, comments: 1400, shares: 500 },
          { date: 'Sat', likes: 2500, comments: 1000, shares: 380 },
          { date: 'Sun', likes: 2600, comments: 1100, shares: 400 },
        ];
      default:
        return defaultEngagementData;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-white">Analytics</h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          >
            <option value="all">All Platforms</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="x">X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(metrics.overview).map(([key, data]) => (
          <div key={key} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {key === 'followers' && <Users className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'engagement' && <Heart className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'impressions' && <Eye className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'reach' && <Target className="w-5 h-5 text-[#00E5BE]" />}
                <span className="text-sm text-gray-300 capitalize">{key}</span>
              </div>
              <span className={`flex items-center text-sm ${
                data.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {Math.abs(data.change)}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{data.value}</p>
          </div>
        ))}
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(metrics.engagement).map(([key, data]) => (
          <div key={key} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {key === 'likes' && <Heart className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'comments' && <MessageCircle className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'shares' && <Share2 className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'saves' && <Bookmark className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'reposts' && <Repeat className="w-5 h-5 text-[#00E5BE]" />}
                {key === 'clicks' && <Target className="w-5 h-5 text-[#00E5BE]" />}
                <span className="text-sm text-gray-300 capitalize">{key}</span>
              </div>
              <span className={`flex items-center text-sm ${
                data.change > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {data.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                {Math.abs(data.change)}%
              </span>
            </div>
            <p className="mt-2 text-2xl font-bold text-white">{data.value}</p>
          </div>
        ))}
      </div>

      {/* Engagement Chart */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-medium text-white mb-4">Engagement Over Time</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getEngagementData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="likes" stroke="#00E5BE" strokeWidth={2} />
              <Line type="monotone" dataKey="comments" stroke="#6366F1" strokeWidth={2} />
              <Line type="monotone" dataKey={platform === 'instagram' ? 'saves' : 'shares'} stroke="#F59E0B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Content Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-medium text-white mb-4">Content Type Performance</h4>
          <div className="space-y-4">
            {Object.entries(metrics.contentTypes).map(([type, data]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300 capitalize">{type}</span>
                  <span className={`flex items-center text-sm ${
                    data.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.change > 0 ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
                    {Math.abs(data.change)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-[#00E5BE] h-2 rounded-full"
                      style={{ width: data.value }}
                    />
                  </div>
                  <span className="ml-4 text-sm font-medium text-white">{data.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h4 className="text-lg font-medium text-white mb-4">Audience Growth</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="age" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                  }}
                />
                <Legend />
                <Bar dataKey="male" fill="#00E5BE" />
                <Bar dataKey="female" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Best Performing Content */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h4 className="text-lg font-medium text-white mb-4">Best Performing Content</h4>
        <div className="space-y-4">
          {[
            { title: platform === 'tiktok' ? 'Viral Dance Challenge' : 'Product Launch Video', engagement: '12.5K', type: 'video', platform },
            { title: platform === 'linkedin' ? 'Industry Insights Article' : 'Behind the Scenes', engagement: '8.2K', type: 'image', platform },
            { title: platform === 'x' ? 'Trending Topic Thread' : 'Customer Story', engagement: '6.7K', type: 'carousel', platform },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-white">{item.title}</p>
                <p className="text-sm text-gray-400">{item.platform} • {item.type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-[#00E5BE]">{item.engagement}</p>
                <p className="text-sm text-gray-400">engagements</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;