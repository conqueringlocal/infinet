
import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const { toast } = useToast();
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Infi-NET LLC',
    siteDescription: 'Fiber & Low-Voltage Solutions',
    contactEmail: 'info@infi-net.net',
    contactPhone: '(555) 123-4567',
    twitterHandle: '@infinetllc',
    facebookPage: 'infinetllc',
  });
  
  const [apiSettings, setApiSettings] = useState({
    highLevelApiKey: '',
    flowTrackApiKey: '',
    zapierWebhook: '',
  });
  
  const handleGeneralFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings saved",
      description: "Your general settings have been updated",
    });
  };
  
  const handleApiFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "API settings saved",
      description: "Your API keys have been updated",
    });
  };
  
  const handleInputChange = (
    section: 'general' | 'api',
    key: string,
    value: string
  ) => {
    if (section === 'general') {
      setGeneralSettings(prev => ({
        ...prev,
        [key]: value
      }));
    } else {
      setApiSettings(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="api">API Integration</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">General Settings</h2>
            <form onSubmit={handleGeneralFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="siteName" className="text-sm font-medium text-gray-700">
                    Site Name
                  </label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="siteDescription" className="text-sm font-medium text-gray-700">
                    Site Description
                  </label>
                  <Input
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-sm font-medium text-gray-700">
                    Contact Email
                  </label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="text-sm font-medium text-gray-700">
                    Contact Phone
                  </label>
                  <Input
                    id="contactPhone"
                    value={generalSettings.contactPhone}
                    onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="twitterHandle" className="text-sm font-medium text-gray-700">
                    Twitter Handle
                  </label>
                  <Input
                    id="twitterHandle"
                    value={generalSettings.twitterHandle}
                    onChange={(e) => handleInputChange('general', 'twitterHandle', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="facebookPage" className="text-sm font-medium text-gray-700">
                    Facebook Page
                  </label>
                  <Input
                    id="facebookPage"
                    value={generalSettings.facebookPage}
                    onChange={(e) => handleInputChange('general', 'facebookPage', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#003366] hover:bg-[#002244]"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-6">API Integration Settings</h2>
            <form onSubmit={handleApiFormSubmit} className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-3">CRM Integration</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="highLevelApiKey" className="text-sm font-medium text-gray-700">
                        HighLevel API Key
                      </label>
                      <Input
                        id="highLevelApiKey"
                        type="password"
                        value={apiSettings.highLevelApiKey}
                        onChange={(e) => handleInputChange('api', 'highLevelApiKey', e.target.value)}
                        placeholder="Enter your HighLevel API key"
                      />
                      <p className="text-xs text-gray-500">Used to sync customer data with HighLevel CRM.</p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="flowTrackApiKey" className="text-sm font-medium text-gray-700">
                        FlowTrack API Key
                      </label>
                      <Input
                        id="flowTrackApiKey"
                        type="password"
                        value={apiSettings.flowTrackApiKey}
                        onChange={(e) => handleInputChange('api', 'flowTrackApiKey', e.target.value)}
                        placeholder="Enter your FlowTrack API key"
                      />
                      <p className="text-xs text-gray-500">Used to sync customer data with FlowTrack CRM.</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-3">Zapier Integration</h3>
                  <div className="space-y-2">
                    <label htmlFor="zapierWebhook" className="text-sm font-medium text-gray-700">
                      Zapier Webhook URL
                    </label>
                    <Input
                      id="zapierWebhook"
                      value={apiSettings.zapierWebhook}
                      onChange={(e) => handleInputChange('api', 'zapierWebhook', e.target.value)}
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                    />
                    <p className="text-xs text-gray-500">Enter your Zapier webhook URL to automate workflows.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="bg-[#003366] hover:bg-[#002244]"
                >
                  Save API Settings
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>
        
        <TabsContent value="users">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">User Management Settings</h3>
              <p className="text-gray-500 mt-2">
                Manage user roles, permissions and access control
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast({
                  title: "Coming soon",
                  description: "This feature is under development",
                })}
              >
                Configure User Roles
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <p className="text-gray-500 mt-2">
                Configure advanced options like caching, backups, and more
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => toast({
                  title: "Coming soon",
                  description: "Advanced settings are under development",
                })}
              >
                Configure Advanced Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
