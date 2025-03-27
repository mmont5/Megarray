import React, { useState } from 'react';
import { Beaker, BarChart2, Users, Clock, ChevronRight, Award, Brain } from 'lucide-react';
import { toast } from 'sonner';

interface Variation {
  id: string;
  content: string;
  audience: string;
  platform: string;
  metrics: {
    impressions: number;
    clicks: number;
    saves: number;
    conversions: number;
  };
}

interface TestResult {
  winningVariation: string;
  confidence: number;
  improvement: number;
}

const ABTesting = () => {
  const [variations, setVariations] = useState<Variation[]>([]);
  const [currentVariation, setCurrentVariation] = useState<Partial<Variation>>({
    content: '',
    audience: 'all',
    platform: 'facebook',
  });
  const [testDuration, setTestDuration] = useState('24');
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [step, setStep] = useState<'create' | 'configure' | 'running' | 'complete'>('create');

  const handleAddVariation = () => {
    if (!currentVariation.content) {
      toast.error('Please add content for the variation');
      return;
    }

    const newVariation: Variation = {
      id: `var-${variations.length + 1}`,
      content: currentVariation.content!,
      audience: currentVariation.audience!,
      platform: currentVariation.platform!,
      metrics: {
        impressions: 0,
        clicks: 0,
        saves: 0,
        conversions: 0,
      },
    };

    setVariations([...variations, newVariation]);
    setCurrentVariation({ content: '', audience: 'all', platform: 'facebook' });
    toast.success('Variation added successfully');
  };

  const startTest = () => {
    if (variations.length < 2) {
      toast.error('Please create at least 2 variations');
      return;
    }

    setStep('running');
    toast.success('A/B test started successfully');

    // Simulate test completion after duration
    setTimeout(() => {
      const simulatedResult: TestResult = {
        winningVariation: variations[0].id,
        confidence: 95.7,
        improvement: 23.4,
      };
      setTestResult(simulatedResult);
      setStep('complete');
    }, 3000); // Simulated delay
  };

  const selectWinner = (variationId: string) => {
    toast.success('Winner selected! The winning variation will be used for future posts.');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Beaker className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-gray-900">A/B Testing</h3>
        </div>
      </div>

      {step === 'create' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Create Variations</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={currentVariation.content}
                  onChange={(e) => setCurrentVariation({ ...currentVariation, content: e.target.value })}
                  placeholder="Enter content variation..."
                  className="w-full h-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Platform
                  </label>
                  <select
                    value={currentVariation.platform}
                    onChange={(e) => setCurrentVariation({ ...currentVariation, platform: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audience
                  </label>
                  <select
                    value={currentVariation.audience}
                    onChange={(e) => setCurrentVariation({ ...currentVariation, audience: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="new">New Users</option>
                    <option value="returning">Returning Users</option>
                    <option value="engaged">Highly Engaged</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddVariation}
                className="w-full py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
              >
                Add Variation
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Current Variations</h4>
              <div className="space-y-3">
                {variations.map((variation, index) => (
                  <div
                    key={variation.id}
                    className="p-4 rounded-lg border border-gray-200 hover:border-[#00E5BE] transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Variation {index + 1}
                      </span>
                      <span className="text-xs text-gray-500">
                        {variation.platform} • {variation.audience}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {variation.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {variations.length >= 2 && (
            <div className="flex justify-end">
              <button
                onClick={() => setStep('configure')}
                className="flex items-center px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
              >
                Configure Test
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      )}

      {step === 'configure' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Test Configuration</h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Duration
                </label>
                <select
                  value={testDuration}
                  onChange={(e) => setTestDuration(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                >
                  <option value="24">24 hours</option>
                  <option value="48">48 hours</option>
                  <option value="72">72 hours</option>
                  <option value="168">1 week</option>
                </select>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-900">Metrics Tracked</h5>
                <ul className="mt-2 space-y-2">
                  <li className="flex items-center text-sm text-blue-700">
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Click-through Rate (CTR)
                  </li>
                  <li className="flex items-center text-sm text-blue-700">
                    <Users className="w-4 h-4 mr-2" />
                    Engagement Rate
                  </li>
                  <li className="flex items-center text-sm text-blue-700">
                    <Award className="w-4 h-4 mr-2" />
                    Conversion Rate
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Test Summary</h4>
              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-900">
                    {variations.length} Variations
                  </span>
                  <span className="text-sm text-gray-500">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {testDuration} hours
                  </span>
                </div>
                <div className="space-y-2">
                  {variations.map((variation, index) => (
                    <div key={variation.id} className="text-sm text-gray-600">
                      • Variation {index + 1}: {variation.audience} audience on {variation.platform}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setStep('create')}
              className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors duration-300"
            >
              Back
            </button>
            <button
              onClick={startTest}
              className="flex items-center px-6 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
            >
              Start Test
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}

      {step === 'running' && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00E5BE] mx-auto"></div>
          <h4 className="mt-4 font-medium text-gray-900">Test in Progress</h4>
          <p className="mt-2 text-sm text-gray-600">
            Collecting data and analyzing results...
          </p>
        </div>
      )}

      {step === 'complete' && testResult && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Test Results</h4>
              <div className="p-6 rounded-lg border-2 border-[#00E5BE] bg-[#00E5BE]/5">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-[#00E5BE]" />
                  <div>
                    <h5 className="font-medium text-gray-900">AI Recommendation</h5>
                    <p className="text-sm text-gray-600">
                      Based on the test results, Variation 1 performed significantly better
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Confidence</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      {testResult.confidence}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Improvement</div>
                    <div className="text-2xl font-semibold text-gray-900">
                      +{testResult.improvement}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Actions</h4>
              <div className="space-y-3">
                <button
                  onClick={() => selectWinner(testResult.winningVariation)}
                  className="w-full py-3 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300"
                >
                  Select Winner
                </button>
                <button
                  onClick={() => setStep('create')}
                  className="w-full py-3 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-300"
                >
                  Start New Test
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ABTesting;