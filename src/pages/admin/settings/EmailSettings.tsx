import React, { useState } from 'react';
import { Mail, RefreshCw, Settings, Send, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

const EmailSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    smtp: {
      host: 'smtp.example.com',
      port: '587',
      username: '',
      password: '',
      encryption: 'tls',
    },
    sender: {
      name: 'Megarray',
      email: 'notifications@megarray.com',
    },
    templates: {
      welcome: {
        subject: 'Welcome to Megarray',
        enabled: true,
      },
      passwordReset: {
        subject: 'Reset Your Password',
        enabled: true,
      },
      teamInvite: {
        subject: 'You\'ve Been Invited',
        enabled: true,
      },
    },
    notifications: {
      contentApproval: true,
      teamActivity: true,
      securityAlerts: true,
      systemUpdates: true,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_settings')
        .upsert({
          category: 'email',
          settings: settings,
        });

      if (error) throw error;
      toast.success('Email settings updated successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update email settings');
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    try {
      const { error } = await supabase.functions.invoke('send-test-email', {
        body: { settings },
      });

      if (error) throw error;
      toast.success('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-[#00E5BE]" />
          <h2 className="text-2xl font-bold text-white">Email Settings</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTestEmail}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            <Send className="w-5 h-5 inline mr-2" />
            Send Test Email
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#00E5BE] text-white rounded-lg hover:bg-[#00D1AD] disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 inline mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 inline mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SMTP Configuration */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">SMTP Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">SMTP Host</label>
              <input
                type="text"
                value={settings.smtp.host}
                onChange={(e) => setSettings({
                  ...settings,
                  smtp: { ...settings.smtp, host: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">SMTP Port</label>
              <input
                type="text"
                value={settings.smtp.port}
                onChange={(e) => setSettings({
                  ...settings,
                  smtp: { ...settings.smtp, port: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Username</label>
              <input
                type="text"
                value={settings.smtp.username}
                onChange={(e) => setSettings({
                  ...settings,
                  smtp: { ...settings.smtp, username: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Password</label>
              <input
                type="password"
                value={settings.smtp.password}
                onChange={(e) => setSettings({
                  ...settings,
                  smtp: { ...settings.smtp, password: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Encryption</label>
              <select
                value={settings.smtp.encryption}
                onChange={(e) => setSettings({
                  ...settings,
                  smtp: { ...settings.smtp, encryption: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              >
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sender Settings */}
        <div className="p-6 bg-gray-800 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">Sender Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Sender Name</label>
              <input
                type="text"
                value={settings.sender.name}
                onChange={(e) => setSettings({
                  ...settings,
                  sender: { ...settings.sender, name: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Sender Email</label>
              <input
                type="email"
                value={settings.sender.email}
                onChange={(e) => setSettings({
                  ...settings,
                  sender: { ...settings.sender, email: e.target.value }
                })}
                className="mt-1 block w-full rounded-lg bg-gray-700 border-gray-600 text-white focus:ring-[#00E5BE] focus:border-[#00E5BE]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Templates */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Email Templates</h3>
        <div className="space-y-4">
          {Object.entries(settings.templates).map(([key, template]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <div>
                <h4 className="text-white font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <p className="text-sm text-gray-400">{template.subject}</p>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      templates: {
                        ...settings.templates,
                        [key]: { ...template, enabled: e.target.checked }
                      }
                    })}
                    className="rounded bg-gray-600 border-gray-500 text-[#00E5BE] focus:ring-[#00E5BE]"
                  />
                  <span className="ml-2 text-sm text-gray-300">Enabled</span>
                </label>
                <button className="text-[#00E5BE] hover:text-[#00D1AD]">
                  Edit Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className="p-6 bg-gray-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4">Notification Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(settings.notifications).map(([key, enabled]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
              <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [key]: e.target.checked
                    }
                  })}
                  className="rounded bg-gray-600 border-gray-500 text-[#00E5BE] focus:ring-[#00E5BE]"
                />
                <span className="ml-2 text-sm text-gray-300">Enabled</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-blue-500 mt-1" />
          <div>
            <h5 className="text-white font-medium">Email Delivery Notice</h5>
            <p className="mt-1 text-sm text-gray-400">
              Changes to email settings will affect all outgoing emails. Make sure to test the configuration
              before saving changes to production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSettings;