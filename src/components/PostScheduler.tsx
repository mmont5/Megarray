import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Clock, Globe, Hash, AlertCircle, CheckCircle } from 'lucide-react';
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
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

interface Post {
  id: string;
  title: string;
  content: string;
  platform: string;
  scheduledTime: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  language: string;
  tags: string[];
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
  draft: 'bg-gray-500',
  scheduled: 'bg-yellow-500',
  published: 'bg-green-500',
  failed: 'bg-red-500',
};

const SortablePost: React.FC<SortablePostProps> = ({ post, onEdit, onDelete }) => {
  const { t } = useTranslation();
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
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-xs text-gray-600">{post.language}</span>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-600">
        {format(new Date(post.scheduledTime), 'h:mm a')}
      </div>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white bg-opacity-50"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const PostScheduler = () => {
  const { t, i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
        toast.error(t('scheduler.error.updateOrder'));
      }
    }
  };

  const weekDays = [...Array(7)].map((_, i) => {
    const day = addDays(startOfWeek(currentDate), i);
    return day;
  });

  const filteredPosts = posts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return post.platform === selectedPlatform;
  });

  const getPostsForDay = (date: Date) => {
    return filteredPosts.filter((post) =>
      isSameDay(new Date(post.scheduledTime), date)
    );
  };

  const handleSchedulePost = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('content_schedules')
        .insert({
          content_id: post.id,
          scheduled_time: post.scheduledTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        });

      if (error) throw error;
      toast.success(t('scheduler.success.scheduled'));
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast.error(t('scheduler.error.schedule'));
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            {t('scheduler.title')}
          </h3>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t('scheduler.allPlatforms')}</option>
            <option value="facebook">Facebook</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter/X</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
          </select>
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
                    onEdit={(post) => {
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
                        toast.success(t('scheduler.success.deleted'));
                      } catch (error) {
                        console.error('Error deleting post:', error);
                        toast.error(t('scheduler.error.delete'));
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
            <span className="text-sm text-gray-600">{t('scheduler.status.scheduled')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">{t('scheduler.status.published')}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-sm text-gray-600">{t('scheduler.status.draft')}</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{t('scheduler.timezone', { zone: Intl.DateTimeFormat().resolvedOptions().timeZone })}</span>
        </div>
      </div>
    </div>
  );
};

export default PostScheduler;