import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SignupSteps from '../../components/SignupSteps';
import { supabase } from '../../lib/supabase';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
];

const regions = [
  { code: 'na', name: 'North America' },
  { code: 'eu', name: 'Europe' },
  { code: 'as', name: 'Asia' },
  { code: 'sa', name: 'South America' },
  { code: 'af', name: 'Africa' },
];

const steps = ['Role', 'Plan', 'Setup', 'Complete'];

const Setup = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [formData, setFormData] = useState({
    language: i18n.language || 'en',
    region: 'na',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'language') {
      i18n.changeLanguage(value);
      localStorage.setItem('megarray.language', value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Update user preferences
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          language: formData.language,
          region: formData.region,
          timezone: formData.timezone,
        });

      if (prefsError) throw prefsError;

      navigate('/signup/complete');
    } catch (error) {
      console.error('Setup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <SignupSteps currentStep={2} steps={steps} />
        
        <div className="mt-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Setup your account</h1>
          <p className="mt-4 text-lg text-gray-600">
            Configure your language and region preferences
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-12 space-y-8">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700">
              Region
            </label>
            <select
              id="region"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="mt-2 block w-full rounded-lg border-gray-300 shadow-sm 
                focus:border-blue-500 focus:ring-blue-500"
            >
              {regions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
              Timezone
            </label>
            <div className="mt-2 flex items-center space-x-2 text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Globe className="w-5 h-5" />
              <span>{formData.timezone}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-lg font-semibold bg-blue-500 
              text-white hover:bg-blue-600 transition-colors duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="w-5 h-5 mr-2 animate-spin" />
                Saving preferences...
              </span>
            ) : (
              'Continue'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;