
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

const FiberInfo = () => {
  return (
    <div className="space-y-10">
      {/* Main Overview Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">The Future of Connectivity</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Fiber optic technology transmits data as pulses of light through strands of fiber made of glass or plastic, 
            offering unparalleled speed and reliability compared to traditional copper cables.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg">
              <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400 mb-1">10Gb+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Potential bandwidth per line</div>
            </div>
            <div className="bg-infinet-50 dark:bg-infinet-900/20 p-4 rounded-lg">
              <div className="font-bold text-3xl text-infinet-600 dark:text-infinet-400 mb-1">70km</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Signal without amplification</div>
            </div>
          </div>
          
          <Button size="lg" variant="accent" onClick={() => window.location.href = '/services'}>
            Explore Our Fiber Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-infinet-500/30 to-infinetYellow-400/30 rounded-lg transform rotate-3 blur-[2px]"></div>
          <img 
            src="/lovable-uploads/f3e6c9f7-b849-4255-84ee-0d5681586a86.png"
            alt="Fiber Optic Cable Cross-section" 
            className="w-full h-auto rounded-lg shadow-xl relative z-10"
          />
        </div>
      </div>
      
      <Separator className="my-10 bg-infinet-100 dark:bg-infinet-900/30" />
      
      {/* Fiber Cable Anatomy */}
      <Card className="bg-white/80 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
        <CardContent className="p-6">
          <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Fiber Cable Anatomy</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Each fiber optic cable consists of several crucial layers that work together 
                to ensure optimal data transmission and physical protection.
              </p>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Core:</span> 
                  <span>The central glass fiber where light travels (8-10 microns for single-mode, 50-62.5 microns for multi-mode)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Cladding:</span> 
                  <span>Surrounds the core, reflects light back using total internal reflection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Buffer coating:</span> 
                  <span>Protects the fiber from moisture and physical damage</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Strength members:</span> 
                  <span>Kevlar or similar material to provide tensile strength</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Outer jacket:</span> 
                  <span>Final protective layer, often color-coded for identification</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg bg-gradient-to-br from-infinet-50 to-infinetYellow-50 dark:from-infinet-900/20 dark:to-infinetYellow-900/20 p-6 flex flex-col justify-center">
              <div className="text-center space-y-2">
                <div className="inline-block p-4 bg-white dark:bg-gray-800 rounded-full shadow-md mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-infinet-500">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <h5 className="font-semibold text-gray-900 dark:text-white">How Light Transmission Works</h5>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Data is transmitted as light pulses through the fiber core, bouncing off the cladding 
                  through a process called total internal reflection.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Benefits Section */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Key Benefits of Fiber Optic Technology</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinet-100 dark:bg-infinet-900/40 p-3 rounded-full mb-3">
                <Zap className="h-6 w-6 text-infinet-600 dark:text-infinet-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Higher Bandwidth</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Carries significantly more data than traditional copper cables
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinetYellow-100 dark:bg-infinetYellow-900/40 p-3 rounded-full mb-3">
                <Globe className="h-6 w-6 text-infinetYellow-600 dark:text-infinetYellow-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Longer Distances</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Signals can travel 40-100km without amplification
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinet-100 dark:bg-infinet-900/40 p-3 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-infinet-600 dark:text-infinet-400">
                  <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
                  <path d="m13 12-3 5h4l-3 5" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">EMI Immunity</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Immune to electromagnetic interference
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinetYellow-100 dark:bg-infinetYellow-900/40 p-3 rounded-full mb-3">
                <Shield className="h-6 w-6 text-infinetYellow-600 dark:text-infinetYellow-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Enhanced Security</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Difficult to tap without detection
              </p>
            </div>
          </InteractiveCard>
        </div>
        
        <div className="mt-8 text-center">
          <Button size="lg" variant="default" onClick={() => window.location.href = '/services'}>
            Learn More About Our Fiber Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiberInfo;
