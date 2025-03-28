import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Wand2, Loader2, CheckCircle, AlertCircle, Hash, Search, Clock, Globe, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { generateContent } from '../lib/content-generation';
import { moderateContent } from '../lib/content-moderation';
import ContentModerationAlert from './ContentModerationAlert';
import AppealForm from './AppealForm';
import { useAuth } from '../contexts/AuthContext';

interface ContentGeneratorProps {
  type: 'post' | 'blog' | 'caption' | 'email' | 'script' | 'thread' | 'ad' | 'newsletter';
  onGenerate?: (content: string) => void;
}

const AIContentGenerator: React.FC<ContentGeneratorProps> = ({ type, onGenerate }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [isHumanized, setIsHumanized] = useState(true);
  const [topic, setTopic] = useState('');
  const [industry, setIndustry] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [step, setStep] = useState<'input' | 'keywords' | 'generate'>('input');
  const [moderationResult, setModerationResult] = useState<any>(null);
  const [showAppealForm, setShowAppealForm] = useState(false);

  const handleGenerateContent = async () => {
    if (!topic || !industry || selectedKeywords.length === 0) {
      toast.error(t('ai.generation.error.missingFields'));
      return;
    }

    setLoading(true);

    try {
      // Generate content
      const result = await generateContent({
        type,
        topic,
        industry,
        keywords: selectedKeywords,
        humanize: isHumanized,
        language: i18n.language,
      });

      // Moderate content
      const moderation = await moderateContent(result.content, user?.id || '');

      if (moderation.status === 'failed') {
        setModerationResult(moderation);
      } else {
        setContent(result.content);
        setStep('generate');
        
        if (onGenerate) {
          onGenerate(result.content);
        }

        toast.success(t('ai.generation.success'));
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error(error.message || t('ai.generation.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppealSubmit = () => {
    setShowAppealForm(false);
    toast.success(t('content.moderation.appealSubmitted'));
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Wand2 className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            {t('ai.generation.title')}
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-400" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="it">Italiano</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </div>
      </div>

      {moderationResult && (
        <ContentModerationAlert
          violations={moderationResult.violations}
          onAppeal={() => setShowAppealForm(true)}
          isEnterprise={user?.subscription?.plan === 'enterprise'}
        />
      )}

      {showAppealForm && (
        <AppealForm
          violationId={moderationResult.id}
          onSubmitted={handleAppealSubmit}
          onCancel={() => setShowAppealForm(false)}
        />
      )}

      {step === 'input' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('ai.generation.topic')}
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t('ai.generation.topicPlaceholder')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('ai.generation.industry')}
            </label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder={t('ai.generation.industryPlaceholder')}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="humanize"
              checked={isHumanized}
              onChange={(e) => setIsHumanized(e.target.checked)}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="humanize" className="text-sm text-gray-700">
              {t('ai.generation.humanize')}
            </label>
          </div>

          <button
            onClick={() => setStep('keywords')}
            disabled={!topic || !industry}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search className="w-5 h-5 mr-2" />
            {t('ai.generation.findKeywords')}
          </button>
        </div>
      )}

      {step === 'keywords' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              {t('ai.generation.selectKeywords')}
            </h4>
            <span className="text-sm text-gray-500">
              {selectedKeywords.length} {t('ai.generation.selected')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              `${topic.toLowerCase()}tips`,
              `${industry.toLowerCase()}trends`,
              `${topic.toLowerCase()}guide`,
              `${industry.toLowerCase()}insights`,
              `${topic.toLowerCase()}examples`,
              `${industry.toLowerCase()}best`,
              `${topic.toLowerCase()}tools`,
              `${industry.toLowerCase()}top`,
            ].map((keyword, index) => (
              <button
                key={index}
                onClick={() => {
                  if (selectedKeywords.includes(keyword)) {
                    setSelectedKeywords(selectedKeywords.filter(k => k !== keyword));
                  } else {
                    setSelectedKeywords([...selectedKeywords, keyword]);
                  }
                }}
                className={`flex items-center p-2 rounded-lg border ${
                  selectedKeywords.includes(keyword)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-500 text-gray-700'
                } transition-colors duration-300`}
              >
                <Hash className="w-4 h-4 mr-2" />
                <span className="text-sm">{keyword}</span>
                {index % 2 === 0 && (
                  <Clock className="w-3 h-3 ml-auto text-orange-500" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateContent}
            disabled={loading || selectedKeywords.length === 0}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {t('ai.generation.generating')}
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 mr-2" />
                {t('ai.generation.generate')}
              </>
            )}
          </button>
        </div>
      )}

      {step === 'generate' && (
        <div className="space-y-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('ai.generation.contentPlaceholder')}
            className="w-full h-48 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          <div className="flex items-start space-x-2 text-sm text-gray-500">
            <AlertCircle className="w-4 h-4 mt-0.5" />
            <p>{t('ai.generation.contentNote')}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedKeywords.map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm"
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