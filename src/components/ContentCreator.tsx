import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2, Brain, Loader2, Globe, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const ContentCreator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const [contentType, setContentType] = useState('post');
  const [platform, setPlatform] = useState('general');
  const [tone, setTone] = useState('professional');

  // Check authentication on mount and when user changes
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login', { state: { from: '/dashboard/content/create' } });
      }
    };

    checkAuth();
  }, [user, navigate]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        navigate('/login', { state: { from: '/dashboard/content/create' } });
        throw new Error('Please log in to generate content');
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          type: contentType,
          platform,
          tone,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const data = await response.json();

      if (!data?.content) {
        throw new Error('No content received from generation service');
      }

      setContent(data.content);
      toast.success('Content generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate content');
      
      if (error.message.includes('log in') || error.message.includes('Unauthorized')) {
        navigate('/login', { state: { from: '/dashboard/content/create' } });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // If not authenticated, show loading state
  if (!user) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
    </div>;
  }

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

      {/* Content Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Content Type
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          >
            <option value="post">Social Post</option>
            <option value="thread">Thread</option>
            <option value="caption">Image Caption</option>
            <option value="article">Article</option>
            <option value="email">Email</option>
            <option value="ad">Advertisement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          >
            <option value="general">General</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="humorous">Humorous</option>
            <option value="formal">Formal</option>
          </select>
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

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !topic.trim()}
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

          <div className="flex space-x-4">
            <button
              onClick={() => {
                setContent('');
                setTopic('');
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