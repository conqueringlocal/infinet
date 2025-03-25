
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';

const FiberInfo = () => {
  return (
    <div className="space-y-10">
      {/* Business Solutions Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Connectivity</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Infi-Net delivers reliable infrastructure solutions that meet the demands of modern businesses, with industry-leading uptime and dedicated technical expertise.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg">
              <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400 mb-1">99.9%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Uptime guarantee</div>
            </div>
            <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg">
              <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400 mb-1">35+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Years combined experience</div>
            </div>
          </div>
          
          <Button size="lg" variant="accent" onClick={() => window.location.href = '/services'}>
            View Business Solutions
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-infinet-500/30 to-infinetYellow-400/30 rounded-lg transform rotate-3 blur-[2px]"></div>
          <img 
            src="/lovable-uploads/2d58718b-9a89-4dde-b37e-43621ecf8a95.png"
            alt="Business Network Infrastructure" 
            className="w-full h-auto rounded-lg shadow-xl relative z-10"
          />
        </div>
      </div>
      
      <Separator className="my-10 bg-infinet-100 dark:bg-infinet-900/30" />
      
      {/* Industry Solutions */}
      <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tailored Solutions For Every Industry</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We develop customized solutions that address the specific connectivity requirements of your industry.
              </p>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Healthcare:</span> 
                  <span>Secure networks for patient data and telemedicine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Education:</span> 
                  <span>Campus-wide connectivity for digital learning</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Manufacturing:</span> 
                  <span>Industrial networks for IoT and automation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Finance:</span> 
                  <span>Low-latency solutions for secure transactions</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-infinet-50 to-infinetYellow-50 dark:from-infinet-900/20 dark:to-infinetYellow-900/20 p-6 flex flex-col justify-center">
              <div className="text-center space-y-2">
                <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-md mb-2">
                  <Building2 className="h-12 w-12 text-infinet-500" />
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white">Consultation Services</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our team evaluates your infrastructure and requirements to develop cost-effective solutions.
                </p>
                <Button variant="default" size="sm" className="mt-2" onClick={() => window.location.href = '/contact'}>
                  Schedule a Consultation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FiberInfo;
