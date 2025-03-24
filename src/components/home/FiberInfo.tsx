
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Layers, Zap, PackageCheck, Waves } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const FiberInfo = () => {
  const [activeTab, setActiveTab] = useState('structure');

  return (
    <Card className="w-full bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl text-infinet-800 dark:text-infinet-400">Understanding Fiber Optics</CardTitle>
        <CardDescription>Learn how fiber optic technology revolutionizes data transmission</CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <Tabs defaultValue="structure" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-infinet-100 dark:bg-infinet-900/40 p-2 rounded-lg">
                <Layers className="h-5 w-5 text-infinet-600 dark:text-infinet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Fiber Cable Structure</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fiber optic cables consist of several layers, each with a specific purpose:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400">
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
                <div className="mt-4">
                  <img 
                    src="/lovable-uploads/f3e6c9f7-b849-4255-84ee-0d5681586a86.png"
                    alt="Fiber Optic Cable Cross-section"
                    className="w-full max-w-md mx-auto rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="how-it-works" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-infinet-100 dark:bg-infinet-900/40 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-infinet-600 dark:text-infinet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Light Transmission Principles</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fiber optics use the principle of total internal reflection to transmit data as light pulses.
                </p>
                
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Step 1: Light Source</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      A laser or LED converts electrical signals into pulses of light, which are injected into the fiber core.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Step 2: Total Internal Reflection</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      When light passes from a higher to lower refractive index medium at a critical angle, it reflects completely instead of refracting. This keeps the light bouncing within the core.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Step 3: Light Propagation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Light travels through the fiber core by repeatedly bouncing off the cladding layer at angles that exceed the critical angle.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Step 4: Signal Reception</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      At the receiving end, a photodetector converts the light pulses back into electrical signals.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="benefits" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-infinet-100 dark:bg-infinet-900/40 p-2 rounded-lg">
                <PackageCheck className="h-5 w-5 text-infinet-600 dark:text-infinet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Advantages of Fiber Optics</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fiber optic technology offers numerous advantages over traditional copper-based systems:
                </p>
                
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Higher Bandwidth</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Fiber can carry significantly more data than copper cables, with modern systems supporting 100+ Gbps.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Longer Distances</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Signals can travel 40-100km without amplification, compared to copper's 100m limit.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Immunity to EMI</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Fiber is immune to electromagnetic interference that affects copper cables.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Enhanced Security</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Extremely difficult to tap without detection, making it ideal for secure communications.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Lower Attenuation</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Light signals in fiber degrade less over distance compared to electrical signals in copper.
                    </p>
                  </div>
                  
                  <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Lightweight Design</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Fiber cables are thinner and lighter than copper, making installation easier.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-infinet-100 dark:bg-infinet-900/40 p-2 rounded-lg">
                <Waves className="h-5 w-5 text-infinet-600 dark:text-infinet-400" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Industry Applications</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Fiber optic technology is transforming various industries with its high-performance capabilities:
                </p>
                
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Telecommunications</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Forms the backbone of the internet and global communications networks, enabling high-speed data transfer across continents.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Enterprise Networks</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Provides reliable, high-speed connectivity for businesses, from campus networks to data centers.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Healthcare</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Enables transmission of large medical images, telemedicine, and advanced medical instruments like endoscopes.
                    </p>
                  </div>
                  
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <h4 className="font-medium text-infinet-700 dark:text-infinet-400">Military & Aerospace</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Used in secure communications, aircraft systems, and weapons guidance systems due to immunity to interference.
                    </p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button size="sm" variant="accent" onClick={() => window.location.href = '/services'}>
                    Explore Our Fiber Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FiberInfo;
