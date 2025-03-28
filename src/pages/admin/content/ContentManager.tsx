import React, { useState, useEffect } from 'react';
import { FileText, Search, Filter, Plus, Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

interface Content {
  id: string;
  title: string;
  type: string;
  status: string;
  platform: string;
  created_at: string;
  creator: {
    name: string;
  };
}

const ContentManager = () => {
  const [content, setContent] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content_items')
        .select(`
          *,
          creator:profiles(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContent(data);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setContent(content.filter(item => item.id !== id));
      toast.success('Content deleted successfully');
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5BE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Management</h2>
        <button className="flex items-center px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD]">
          <Plus className="w-5 h-5 mr-2" />
          Create Content
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
            />
          </div>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
        >
          <option value="all">All Types</option>
          <option value="post">Posts</option>
          <option value="article">Articles</option>
          <option value="video">Videos</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-[#00E5BE] focus:border-[#00E5BE]"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-white">{item.title}</div>
                      <div className="text-sm text-gray-400">By {item.creator.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-300">{item.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center">
                      {item.status === 'published' ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                          <span className="text-green-500">Published</span>
                        </>
                      ) : item.status === 'scheduled' ? (
                        <>
                          <Clock className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="text-yellow-500">Scheduled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-gray-500 mr-1" />
                          <span className="text-gray-500">Draft</span>
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-sm text-gray-300">{item.platform}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-white">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;