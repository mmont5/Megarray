import React, { useState } from 'react';
import { FileText, Grid, List } from 'lucide-react';
import ContentManager from './ContentManager';

const Content = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">Content Management</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg ${
              viewMode === 'grid'
                ? 'bg-[#00E5BE] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg ${
              viewMode === 'list'
                ? 'bg-[#00E5BE] text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ContentManager viewMode={viewMode} />
    </div>
  );
};

export default Content;