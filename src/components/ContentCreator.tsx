import React, { useState } from 'react';
import { Calendar, Image, Link as LinkIcon, Save, Eye, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  contentTypes: string[];
}

const platforms: Platform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    contentTypes: ['post', 'story', 'reel', 'image', 'video'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>,
    contentTypes: ['post', 'story', 'reel', 'carousel', 'image', 'video'],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>,
    contentTypes: ['video', 'story', 'duet', 'stitch'],
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    contentTypes: ['post', 'thread', 'image', 'video'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path></svg>,
    contentTypes: ['post', 'article', 'newsletter', 'image', 'video'],
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/></svg>,
    contentTypes: ['post', 'thread', 'image', 'video', 'poll'],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    contentTypes: ['video', 'shorts', 'post', 'playlist'],
  },
  {
    id: 'email',
    name: 'Email',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>,
    contentTypes: ['newsletter', 'campaign', 'announcement', 'promotion'],
  },
  {
    id: 'sms',
    name: 'SMS',
    icon: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v12H5.17L4 17.17V4m0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4zm2 10h12v2H6v-2zm0-3h12v2H6V9zm0-3h12v2H6V6z"/></svg>,
    contentTypes: ['promotional', 'transactional', 'campaign'],
  },
];

const ContentCreator = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [contentType, setContentType] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [preview, setPreview] = useState(false);

  const handleImageAdd = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      setImages([...images, url]);
    }
  };

  const handleLinkAdd = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      setLinks([...links, url]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleLinkRemove = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success('Content saved successfully!');
  };

  const handleSchedule = () => {
    if (!scheduledTime) {
      toast.error('Please select a scheduled time');
      return;
    }
    // TODO: Implement scheduling functionality
    toast.success('Content scheduled successfully!');
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Content Creator</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreview(!preview)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <Save className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => setSelectedPlatform(platform)}
            className={`p-4 rounded-lg border ${
              selectedPlatform?.id === platform.id
                ? 'border-[#00E5BE] bg-[#00E5BE]/10'
                : 'border-gray-200 hover:border-[#00E5BE]'
            } transition-colors duration-300`}
          >
            <div className="flex flex-col items-center space-y-2">
              {platform.icon}
              <span className="font-medium text-sm">{platform.name}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedPlatform && (
        <>
          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            >
              <option value="">Select type...</option>
              {selectedPlatform.contentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your content here..."
              className="w-full h-32 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            />
          </div>

          {/* Media and Links */}
          <div className="space-y-4">
            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Images
                </label>
                <button
                  onClick={handleImageAdd}
                  className="text-[#00E5BE] hover:text-[#00D1AD]"
                >
                  <Image className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt=""
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Links
                </label>
                <button
                  onClick={handleLinkAdd}
                  className="text-[#00E5BE] hover:text-[#00D1AD]"
                >
                  <LinkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2">
                {links.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00E5BE] hover:text-[#00D1AD] truncate"
                    >
                      {url}
                    </a>
                    <button
                      onClick={() => handleLinkRemove(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Schedule
              </label>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00E5BE] focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSchedule}
              disabled={!content || !scheduledTime}
              className="flex-1 px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Post
            </button>
          </div>
        </>
      )}

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Preview</h4>
              <button
                onClick={() => setPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {selectedPlatform && (
                <div className="flex items-center space-x-2">
                  {selectedPlatform.icon}
                  <span className="font-medium">{selectedPlatform.name}</span>
                  {contentType && (
                    <span className="text-gray-500">
                      • {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
                    </span>
                  )}
                </div>
              )}
              <div className="whitespace-pre-wrap">{content}</div>
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt=""
                      className="w-full h-40 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}
              {links.length > 0 && (
                <div className="space-y-2">
                  {links.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 bg-gray-50 rounded-lg text-[#00E5BE] hover:text-[#00D1AD]"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}
              {scheduledTime && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Scheduled for {new Date(scheduledTime).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCreator;