
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
          
          <div className="flex flex-col">
            <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg max-w-[200px] space-y-1">
              <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400">35+</div>
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
            src="/lovable-uploads/f3e6c9f7-b849-4255-84ee-0d5681586a86.png"
            alt="Enterprise Network Infrastructure" 
            className="w-full h-auto rounded-lg shadow-xl relative z-10"
          />
        </div>
      </div>
    </div>
  );
};

export default FiberInfo;
