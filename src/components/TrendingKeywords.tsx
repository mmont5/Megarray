import React, { useState, useEffect } from 'react';
import { Search, Hash, TrendingUp, Loader2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Keyword {
  keyword: string;
  volume: number;
  trending: boolean;
}

interface Hashtag {
  tag: string;
  volume: number;
  trending: boolean;
}

interface TrendingKeywordsProps {
  topic: string;
  onKeywordsSelected: (keywords: string[], hashtags: string[]) => void;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({ topic, onKeywordsSelected }) => {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  useEffect(() => {
    if (topic) {
      fetchTrendingData();
    }
  }, [topic]);

  const fetchTrendingData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('trending-keywords', {
        body: { topic },
      });

      if (error) throw error;

      // Process keywords and hashtags
      const processedKeywords = data.keywords.filter((k: any) => !k.keyword.startsWith('#'));
      const processedHashtags = data.keywords
        .filter((k: any) => k.keyword.startsWith('#'))
        .map((k: any) => ({
          tag: k.keyword,
          volume: k.volume,
          trending: k.trending,
        }));

      setKeywords(processedKeywords);
      setHashtags(processedHashtags);
    } catch (error) {
      console.error('Error fetching trending data:', error);
      toast.error('Failed to fetch trending data');
    } finally {
      setLoading(false);
    }
  };

  const handleKeywordToggle = (keyword: string) => {
    setSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleHashtagToggle = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const handleConfirm = () => {
    onKeywordsSelected(selectedKeywords, selectedHashtags);
  };

  if (!topic) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Enter a topic to see trending keywords and hashtags</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Trending Keywords & Hashtags</h3>
        <button
          onClick={handleConfirm}
          disabled={selectedKeywords.length === 0 && selectedHashtags.length === 0}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
        >
          Confirm Selection
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00E5BE] animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Keywords */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Keywords</h4>
            <div className="grid grid-cols-1 gap-2">
              {keywords.map((keyword) => (
                <button
                  key={keyword.keyword}
                  onClick={() => handleKeywordToggle(keyword.keyword)}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedKeywords.includes(keyword.keyword)
                      ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                      : 'border-gray-200 hover:border-[#00E5BE]'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{keyword.keyword}</span>
                    {keyword.trending && (
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {keyword.volume.toLocaleString()} searches
                    </span>
                    {selectedKeywords.includes(keyword.keyword) && (
                      <CheckSquare className="w-4 h-4 text-[#00E5BE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-700">Hashtags</h4>
            <div className="grid grid-cols-1 gap-2">
              {hashtags.map((hashtag) => (
                <button
                  key={hashtag.tag}
                  onClick={() => handleHashtagToggle(hashtag.tag)}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    selectedHashtags.includes(hashtag.tag)
                      ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                      : 'border-gray-200 hover:border-[#00E5BE]'
                  } transition-colors duration-200`}
                >
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{hashtag.tag}</span>
                    {hashtag.trending && (
                      <TrendingUp className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {hashtag.volume.toLocaleString()} posts
                    </span>
                    {selectedHashtags.includes(hashtag.tag) && (
                      <CheckSquare className="w-4 h-4 text-[#00E5BE]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingKeywords;