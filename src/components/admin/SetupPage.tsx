
import React from 'react';
import CMSSetup from './CMSSetup';

const SetupPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">CMS Setup</h1>
          <p className="text-gray-600 mt-2">
            Set up your content management system
          </p>
        </div>
        <CMSSetup />
      </div>
    </div>
  );
};

export default SetupPage;
