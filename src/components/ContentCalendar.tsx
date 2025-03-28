import React, { useState } from 'react';
import { Calendar, Clock, Filter } from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

const ContentCalendar = () => {
  const [currentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState('all');

  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(startOfWeek(currentDate), i);
    return day;
  });

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#00E5BE]" />
          <h3 className="text-xl font-semibold text-white">Content Calendar</h3>
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
        >
          <option value="all">All Content</option>
          <option value="scheduled">Scheduled</option>
          <option value="draft">Drafts</option>
        </select>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-400">
              {format(day, 'EEE')}
            </div>
            <div className="mt-1 text-sm text-white">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className="min-h-[120px] bg-gray-700 rounded-lg p-2 border border-gray-600"
          >
            {/* Placeholder for content items */}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-[#00E5BE]" />
            <span className="text-sm text-gray-400">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-gray-400">Draft</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Clock className="w-4 h-4" />
          <span>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;