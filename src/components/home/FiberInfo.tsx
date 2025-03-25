
import React from 'react';
import { ArrowRight } from 'lucide-react';
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
            Infi-NET delivers reliable infrastructure solutions that meet the demands of modern businesses, with industry-leading uptime and dedicated technical expertise.
          </p>
          
          <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg max-w-[200px]">
            <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400 mb-1">35+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Years combined experience</div>
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
    </div>
  );
};

export default FiberInfo;
