import React, { useState } from 'react';
import { Beaker, BarChart2, Brain, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ABTesting = () => {
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateTest = () => {
    setIsCreating(true);
    toast.success('A/B test created successfully');
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Beaker className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-white">A/B Testing</h3>
        </div>
        <button
          onClick={handleCreateTest}
          className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
        >
          New Test
        </button>
      </div>

      {isCreating ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Test Name
            </label>
            <input
              type="text"
              className="w-full bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
              placeholder="Enter test name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-white mb-2">Variation A</h4>
              <textarea
                className="w-full bg-gray-600 border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                rows={4}
                placeholder="Enter content for variation A"
              />
            </div>

            <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h4 className="text-sm font-medium text-white mb-2">Variation B</h4>
              <textarea
                className="w-full bg-gray-600 border-gray-500 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
                rows={4}
                placeholder="Enter content for variation B"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                toast.success('Test started successfully');
              }}
              className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]"
            >
              Start Test
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTest ? (
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-white">Active Test Results</h4>
                <span className="text-sm text-gray-400">Running for 3 days</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Variation A</span>
                    <span className="text-sm text-[#00E5BE]">54% CTR</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full">
                    <div className="h-2 bg-[#00E5BE] rounded-full" style={{ width: '54%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Variation B</span>
                    <span className="text-sm text-[#00E5BE]">46% CTR</span>
                  </div>
                  <div className="h-2 bg-gray-600 rounded-full">
                    <div className="h-2 bg-[#00E5BE] rounded-full" style={{ width: '46%' }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-300">No active A/B tests</p>
              <p className="text-sm text-gray-400 mt-2">
                Create a new test to optimize your content
              </p>
            </div>
          )}
        </div>
      )}

      <div className="border-t border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-white mb-4">Recent Tests</h4>
        <div className="space-y-3">
          {[
            { name: 'CTA Button Test', improvement: '+23%' },
            { name: 'Headline Variations', improvement: '+15%' },
            { name: 'Image Placement', improvement: '+8%' },
          ].map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-[#00E5BE]" />
                <span className="text-sm text-gray-300">{test.name}</span>
              </div>
              <span className="text-sm text-[#00E5BE]">{test.improvement}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ABTesting;