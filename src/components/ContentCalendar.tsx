import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Filter, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  platform: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'draft';
}

interface SortablePostProps {
  post: Post;
}

const platformColors = {
  facebook: 'bg-blue-100 border-blue-300 text-blue-800',
  instagram: 'bg-pink-100 border-pink-300 text-pink-800',
  twitter: 'bg-sky-100 border-sky-300 text-sky-800',
  linkedin: 'bg-blue-100 border-blue-300 text-blue-800',
  tiktok: 'bg-gray-100 border-gray-300 text-gray-800',
  youtube: 'bg-red-100 border-red-300 text-red-800',
  reddit: 'bg-orange-100 border-orange-300 text-orange-800',
  email: 'bg-purple-100 border-purple-300 text-purple-800',
  sms: 'bg-green-100 border-green-300 text-green-800',
};

const statusColors = {
  scheduled: 'bg-yellow-500',
  posted: 'bg-green-500',
  draft: 'bg-gray-500',
};

const SortablePost = ({ post }: SortablePostProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 rounded-lg border ${platformColors[post.platform as keyof typeof platformColors]} cursor-move`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${statusColors[post.status]}`} />
          <span className="text-sm font-medium">{post.title}</span>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        {format(new Date(post.scheduledTime), 'h:mm a')}
      </div>
    </div>
  );
};

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: 'Product Launch',
      platform: 'facebook',
      scheduledTime: '2025-03-15T10:00:00',
      status: 'scheduled',
    },
    {
      id: '2',
      title: 'Behind the Scenes',
      platform: 'instagram',
      scheduledTime: '2025-03-15T14:00:00',
      status: 'draft',
    },
    {
      id: '3',
      title: 'Industry News',
      platform: 'twitter',
      scheduledTime: '2025-03-16T09:00:00',
      status: 'posted',
    },
    // Add more sample posts as needed
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPosts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(startOfWeek(currentDate), i);
    return day;
  });

  const filteredPosts = posts.filter((post) => {
    if (selectedFilter === 'all') return true;
    return post.status === selectedFilter;
  });

  const getPostsForDay = (date: Date) => {
    return filteredPosts.filter((post) =>
      isSameDay(new Date(post.scheduledTime), date)
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="text-xl font-semibold text-gray-900">Content Calendar</h3>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="text-sm border-none focus:ring-0 text-gray-600"
            >
              <option value="all">All Posts</option>
              <option value="scheduled">Scheduled</option>
              <option value="posted">Posted</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-600">
              {format(day, 'EEE')}
            </div>
            <div className="mt-1 text-sm text-gray-900">
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div
              key={index}
              className="min-h-[200px] bg-gray-50 rounded-lg p-2 space-y-2"
            >
              <SortableContext items={getPostsForDay(day).map(post => post.id)}>
                {getPostsForDay(day).map((post) => (
                  <SortablePost key={post.id} post={post} />
                ))}
              </SortableContext>
            </div>
          ))}
        </div>
      </DndContext>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm text-gray-600">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Posted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-gray-600">Draft</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentCalendar;