import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
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
import { Calendar, Clock, Filter, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  platform: string;
  scheduledTime: string;
  status: 'scheduled' | 'posted' | 'draft';
}

interface SortablePostProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (id: string) => void;
}

const platformColors = {
  facebook: 'bg-blue-100 border-blue-300 text-blue-800',
  instagram: 'bg-pink-100 border-pink-300 text-pink-800',
  twitter: 'bg-sky-100 border-sky-300 text-sky-800',
  linkedin: 'bg-blue-100 border-blue-300 text-blue-800',
  tiktok: 'bg-gray-100 border-gray-300 text-gray-800',
};

const statusColors = {
  scheduled: 'bg-yellow-500',
  posted: 'bg-green-500',
  draft: 'bg-gray-500',
};

const SortablePost = ({ post, onEdit, onDelete }: SortablePostProps) => {
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

const ContentScheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchScheduledContent();
  }, []);

  const fetchScheduledContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_schedules')
        .select(`
          id,
          content_items (
            id,
            title,
            platform,
            status
          ),
          scheduled_time
        `)
        .order('scheduled_time');

      if (error) throw error;

      setPosts(data.map((schedule: any) => ({
        id: schedule.content_items.id,
        title: schedule.content_items.title,
        platform: schedule.content_items.platform,
        scheduledTime: schedule.scheduled_time,
        status: schedule.content_items.status,
      })));
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
      toast.error('Failed to load scheduled content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setPosts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });

      try {
        // Update post order in database
        const { error } = await supabase
          .from('content_schedules')
          .update({ order: newIndex })
          .eq('id', active.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating post order:', error);
        toast.error('Failed to update post order');
      }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-[#00E5BE]" />
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
                  <SortablePost
                    key={post.id}
                    post={post}
                    onEdit={async (post) => {
                      // Handle edit
                    }}
                    onDelete={async (id) => {
                      try {
                        const { error } = await supabase
                          .from('content_schedules')
                          .delete()
                          .eq('id', id);

                        if (error) throw error;
                        setPosts(posts.filter(p => p.id !== id));
                        toast.success('Post unscheduled successfully');
                      } catch (error) {
                        console.error('Error deleting schedule:', error);
                        toast.error('Failed to unschedule post');
                      }
                    }}
                  />
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

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentScheduler;