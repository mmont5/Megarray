import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import SignupSteps from '../../components/SignupSteps';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
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
  const [formData, setFormData] = useState({
    language: 'en',
    region: 'na',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userPreferences', JSON.stringify(formData));
    navigate('/signup/complete');
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
                focus:border-[#00E5BE] focus:ring-[#00E5BE]"
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
                focus:border-[#00E5BE] focus:ring-[#00E5BE]"
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
            className="w-full py-3 px-4 rounded-lg font-semibold bg-[#00E5BE] 
              text-white hover:bg-[#00D1AD] transition-colors duration-300"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;