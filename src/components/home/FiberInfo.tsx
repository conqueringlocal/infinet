
import React, { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const FiberInfo = () => {
  return (
    <div className="space-y-10">
      {/* Business Solutions Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">Enterprise Connectivity</h3>
          <p className="text-gray-600 leading-relaxed">
            Infi-NET delivers reliable infrastructure solutions that meet the demands of modern businesses, with industry-leading uptime and dedicated technical expertise.
          </p>
          
          <div className="flex flex-col">
            <div className="p-4 max-w-[200px] space-y-1">
              <div className="font-bold text-3xl text-infinet-600">35+</div>
              <div className="text-sm text-gray-600">Years combined experience</div>
            </div>
          </div>
          
          <Button size="lg" variant="accent" asChild>
            <Link to="/services">
              View Business Solutions
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-infinet-500/30 to-infinetYellow-400/30 rounded-lg transform rotate-3 blur-[2px]"></div>
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
            alt="Business Professional using technology" 
            className="w-full h-auto rounded-lg shadow-xl relative z-10 object-cover"
            loading="lazy"
            width="600"
            height="400"
          />
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FiberInfo);
