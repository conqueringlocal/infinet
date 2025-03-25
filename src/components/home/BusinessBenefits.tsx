
import React from 'react';
import { Briefcase, Clock, CheckCircle2, Award } from 'lucide-react';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { Button } from '@/components/ui/Button';

const BusinessBenefits = () => {
  return (
    <section className="py-16 md:py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="reveal text-sm font-semibold text-infinet-600 dark:text-infinet-400 uppercase tracking-wider">Business Solutions</span>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Why Businesses Choose Infi-NET
          </h2>
          <p className="reveal text-gray-600 dark:text-gray-300 mt-4 text-lg">
            Companies across industries trust our expertise, reliability, and commitment to delivering superior connectivity solutions.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Our enterprise solutions are backed by extensive industry knowledge and a commitment to excellence, ensuring your business receives the highest quality service and support.
          </p>
          <Button variant="accent" size="lg" onClick={() => window.location.href = '/contact'}>
            Schedule a Business Consultation
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BusinessBenefits;
