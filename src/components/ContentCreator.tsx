import React, { useState, useEffect, useRef } from 'react';
import { Wand2, Brain, Search, Hash, TrendingUp, Loader2, CheckSquare } from 'lucide-react';
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

const ContentCreator = () => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(false);
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [useAI, setUseAI] = useState(true);
  
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (topic.trim().length >= 3) {
      typingTimeoutRef.current = setTimeout(() => {
        fetchTrendingData();
      }, 1500);
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [topic]);

  const fetchTrendingData = async () => {
    if (!topic.trim()) {
      console.warn('Topic is empty, skipping fetchTrendingData');
      return;
    }
    
    setIsLoadingKeywords(true);
    try {
      const { data, error } = await supabase.functions.invoke('trending-keywords', {
        body: { topic: topic.trim() },
      });

      if (error) {
        console.error('Error fetching trending data:', error);
        toast.error(`Failed to fetch trending data: ${error.message}`);
        setKeywords([]);
        setHashtags([]);
        return;
      }

      if (!data?.keywords) {
        console.warn('No keywords data received');
        setKeywords([]);
        setHashtags([]);
        return;
      }

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
    } catch (error: any) {
      console.error('Error fetching trending data:', error);
      toast.error(error.message || 'Failed to fetch trending data');
      setKeywords([]);
      setHashtags([]);
    } finally {
      setIsLoadingKeywords(false);
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate', {
        body: {
          topic,
          keywords: selectedKeywords,
          hashtags: selectedHashtags,
        },
      });

      if (error) throw error;

      setContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Brain className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-white">Content Creator</h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">
            {useAI ? 'AI-Powered' : 'Manual'}
          </span>
          <button
            onClick={() => setUseAI(!useAI)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#00E5BE] focus:ring-offset-2 ${
              useAI ? 'bg-[#00E5BE]' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                useAI ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          placeholder="Enter your content topic..."
        />
      </div>

      {/* Loading indicator */}
      {isLoadingKeywords && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-6 h-6 text-[#00E5BE] animate-spin" />
          <span className="ml-2 text-gray-400">Finding trending keywords...</span>
        </div>
      )}

      {/* Keywords */}
      {keywords.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Trending Keywords</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keywords.map((keyword) => (
              <button
                key={keyword.keyword}
                onClick={() => handleKeywordToggle(keyword.keyword)}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedKeywords.includes(keyword.keyword)
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                    : 'border-gray-600 hover:border-[#00E5BE]'
                } transition-colors duration-200`}
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{keyword.keyword}</span>
                  {keyword.trending && (
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
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
      )}

      {/* Hashtags */}
      {hashtags.length > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-4">Trending Hashtags</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hashtags.map((hashtag) => (
              <button
                key={hashtag.tag}
                onClick={() => handleHashtagToggle(hashtag.tag)}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  selectedHashtags.includes(hashtag.tag)
                    ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                    : 'border-gray-600 hover:border-[#00E5BE]'
                } transition-colors duration-200`}
              >
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="text-white">{hashtag.tag}</span>
                  {hashtag.trending && (
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
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
      )}

      {/* Generate Button */}
      {(selectedKeywords.length > 0 || selectedHashtags.length > 0) && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full flex items-center justify-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating content...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Content
            </>
          )}
        </button>
      )}

      {/* Generated Content */}
      {content && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Generated Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-48 bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
            {selectedHashtags.map((hashtag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[#00E5BE]/10 text-[#00E5BE] rounded-full text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setContent('');
                setSelectedKeywords([]);
                setSelectedHashtags([]);
              }}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Start Over
            </button>
            <button
              onClick={handleGenerate}
              className="flex-1 px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
            >
              Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;