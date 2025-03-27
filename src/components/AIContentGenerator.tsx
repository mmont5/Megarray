import React, { useState } from 'react';
import { Wand2, Loader2, CheckCircle, AlertCircle, Hash, Search, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ContentGeneratorProps {
  type: 'post' | 'blog' | 'caption' | 'email' | 'script' | 'thread' | 'ad' | 'newsletter';
  prompt?: string;
  onGenerate?: (content: string) => void;
}

interface TrendingKeyword {
  keyword: string;
  volume: number;
  trending: boolean;
}

const AIContentGenerator: React.FC<ContentGeneratorProps> = ({ type, prompt = '', onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [isHumanized, setIsHumanized] = useState(false);
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('');
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [step, setStep] = useState<'input' | 'keywords' | 'generate'>('input');

  const fetchTrendingKeywords = async () => {
    setLoading(true);
    try {
      // This would be replaced with actual API call to your Edge Function
      const response = await fetch('/api/trending-keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          industry,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch keywords');

      const data = await response.json();
      setTrendingKeywords(data.keywords);
      setStep('keywords');
      toast.success('Trending keywords fetched successfully!');
    } catch (error) {
      toast.error('Failed to fetch keywords. Please try again.');
      console.error('Error fetching keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          topic,
          industry,
          keywords: selectedKeywords,
          humanize: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate content');

      const data = await response.json();
      setContent(data.content);
      setIsHumanized(true);
      setStep('generate');
      
      if (onGenerate) {
        onGenerate(data.content);
      }

      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content. Please try again.');
      console.error('Error generating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeyword = (keyword: string) => {
    setSelectedKeywords(prev => 
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">AI Content Generator</h3>
        {isHumanized && (
          <span className="flex items-center text-sm text-green-600">
            <CheckCircle className="w-4 h-4 mr-1" />
            Humanized
          </span>
        )}
      </div>

      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your content topic"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Enter your industry"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            />
          </div>
          <button
            onClick={fetchTrendingKeywords}
            disabled={loading || !topic || !industry}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Search className="w-5 h-5 mr-2" />
            )}
            Find Trending Keywords
          </button>
        </div>
      )}

      {step === 'keywords' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Select Keywords</h4>
            <span className="text-sm text-gray-500">{selectedKeywords.length} selected</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trendingKeywords.map((kw, index) => (
              <button
                key={index}
                onClick={() => toggleKeyword(kw.keyword)}
                className={`flex items-center p-2 rounded-lg border ${
                  selectedKeywords.includes(kw.keyword)
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10 text-[#00E5BE]'
                    : 'border-gray-200 hover:border-[#00E5BE] text-gray-700'
                } transition-colors duration-300`}
              >
                <Hash className="w-4 h-4 mr-2" />
                <span className="text-sm">{kw.keyword}</span>
                {kw.trending && (
                  <span className="ml-auto flex items-center text-orange-500">
                    <Clock className="w-3 h-3" />
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            onClick={generateContent}
            disabled={loading || selectedKeywords.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-5 h-5 mr-2" />
            )}
            Generate Content
          </button>
        </div>
      )}

      {step === 'generate' && (
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`Your generated ${type} will appear here...`}
            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          />
          <div className="flex items-start space-x-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>
              Content is automatically humanized to ensure natural tone and style.
              You can edit the generated content directly in the text area above.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-[#00E5BE]/10 text-[#00E5BE] text-sm"
              >
                <Hash className="w-3 h-3 mr-1" />
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator;