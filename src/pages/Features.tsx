import React from 'react';
import { Wand2, Sparkles, Bot, Brain, Workflow, Shield } from 'lucide-react';
import AIContentGenerator from '../components/AIContentGenerator';
import AutoPilotToggle from '../components/AutoPilotToggle';
import ContentCreator from '../components/ContentCreator';
import ContentCalendar from '../components/ContentCalendar';
import ABTesting from '../components/ABTesting';
import Analytics from '../components/Analytics';
import AdManager from '../components/AdManager';
import Integrations from '../components/Integrations';

const Features = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Try It Yourself</h2>
            <p className="mt-4 text-xl text-gray-600">
              Experience our content creation tools in action
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12">
            <div className="space-y-8">
              <div className="flex items-center justify-center space-x-4 mb-8">
                <button className="px-6 py-2 text-[#00E5BE] border-b-2 border-[#00E5BE]">
                  Manual Mode
                </button>
                <button className="px-6 py-2 text-gray-500 border-b-2 border-transparent hover:text-[#00E5BE]">
                  AI Mode
                </button>
              </div>
              
              <ContentCreator />
              <ContentCalendar />
              <ABTesting />
              <Analytics />
              <AdManager />
              <Integrations />
              <AutoPilotToggle />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;