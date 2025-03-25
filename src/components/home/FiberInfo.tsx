
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, Building2, Clock, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/separator';
import { InteractiveCard } from '@/components/ui/InteractiveCard';

const FiberInfo = () => {
  return (
    <div className="space-y-10">
      {/* Business Solutions Section */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Enterprise-Grade Connectivity Solutions</h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Infi-Net provides tailored connectivity infrastructure that meets the demands of modern businesses. Our solutions deliver reliability, security, and the performance your organization needs to stay competitive.
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
                We understand that different industries have unique connectivity requirements. Our expert team develops customized solutions that address the specific challenges and needs of your sector.
              </p>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Healthcare:</span> 
                  <span>Secure, reliable networks for critical patient data and telemedicine applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Education:</span> 
                  <span>Scalable infrastructure supporting digital learning environments and campus-wide connectivity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Manufacturing:</span> 
                  <span>Industrial-grade networks enabling IoT, automation, and real-time monitoring</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Finance:</span> 
                  <span>Ultra-low latency solutions for trading and high-security data transmission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-infinet-700 dark:text-infinet-400 min-w-24">Hospitality:</span> 
                  <span>Guest and operations networks that enhance experience and efficiency</span>
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
                  Our expert team evaluates your current infrastructure and business requirements to develop a customized solution that optimizes performance while controlling costs.
                </p>
                <Button variant="default" size="sm" className="mt-2" onClick={() => window.location.href = '/contact'}>
                  Schedule a Consultation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Business Benefits Section */}
      <div className="mt-10">
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Why Businesses Choose Infi-Net</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinet-100 dark:bg-infinet-900/40 p-3 rounded-full mb-3">
                <Briefcase className="h-6 w-6 text-infinet-600 dark:text-infinet-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Turnkey Solutions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                End-to-end design, installation, and maintenance services
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinetYellow-100 dark:bg-infinetYellow-900/40 p-3 rounded-full mb-3">
                <Clock className="h-6 w-6 text-infinetYellow-600 dark:text-infinetYellow-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Minimal Disruption</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Implementation strategies designed to minimize business impact
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinet-100 dark:bg-infinet-900/40 p-3 rounded-full mb-3">
                <CheckCircle2 className="h-6 w-6 text-infinet-600 dark:text-infinet-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Quality Assurance</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Rigorous testing and certification of all installations
              </p>
            </div>
          </InteractiveCard>
          
          <InteractiveCard variant="default" hoverEffect="lift" className="text-center">
            <div className="flex flex-col items-center">
              <div className="bg-infinetYellow-100 dark:bg-infinetYellow-900/40 p-3 rounded-full mb-3">
                <Award className="h-6 w-6 text-infinetYellow-600 dark:text-infinetYellow-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Certified Expertise</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Industry-certified technicians with proven experience
              </p>
            </div>
          </InteractiveCard>
        </div>
        
        <div className="mt-8 text-center">
          <Button size="lg" variant="default" onClick={() => window.location.href = '/contact'}>
            Contact Our Business Solutions Team
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiberInfo;
