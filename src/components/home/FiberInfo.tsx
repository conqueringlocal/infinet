
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FiberInfo = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="reveal">
        <img 
          src="/lovable-uploads/f3e6c9f7-b849-4255-84ee-0d5681586a86.png"
          alt="Fiber Optic Cable Cross-section"
          className="w-full rounded-lg shadow-lg"
        />
      </div>
      
      <div className="reveal space-y-6">
        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-infinet-100 dark:bg-infinet-900/40 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-infinet-600 dark:text-infinet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Fiber Cable Structure</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fiber optic cables consist of several layers, each with a specific purpose:
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Core:</span> 
                    <span>The central glass fiber where light travels (8-10 microns for single-mode, 50-62.5 microns for multi-mode)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Cladding:</span> 
                    <span>Surrounds the core, reflects light back into the core using total internal reflection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Buffer coating:</span> 
                    <span>Protects the fiber from moisture and physical damage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Strength members:</span> 
                    <span>Kevlar or similar material to provide tensile strength</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold min-w-24">Outer jacket:</span> 
                    <span>Final protective layer, often color-coded for identification</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Advantages of Fiber Optics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Higher Bandwidth</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Fiber can carry significantly more data than copper cables
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Longer Distances</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Signals can travel 40-100km without amplification
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h4 className="font-medium text-infinet-700 dark:text-infinet-400">EMI Immunity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Immune to electromagnetic interference
                </p>
              </div>
              
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Enhanced Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Difficult to tap without detection
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button size="sm" variant="accent" onClick={() => window.location.href = '/services'}>
                Explore Our Fiber Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FiberInfo;
