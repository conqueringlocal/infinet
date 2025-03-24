
import React, { useEffect, useRef } from 'react';
import { Award, Clock, Users, Shield, Zap, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Award,
    title: '35+ Years Experience',
    description: 'Our team brings decades of combined experience in the fiber optic and low-voltage industry.',
    color: 'text-blue-600 bg-blue-100'
  },
  {
    icon: ThumbsUp,
    title: 'Quality Guaranteed',
    description: 'We stand behind our work with comprehensive testing and verification procedures.',
    color: 'text-purple-600 bg-purple-100'
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'We understand that time is critical, and we pride ourselves on meeting deadlines.',
    color: 'text-green-600 bg-green-100'
  },
  {
    icon: Shield,
    title: 'Certified Professionals',
    description: 'Our technicians are certified, trained, and experienced in all aspects of network infrastructure.',
    color: 'text-red-600 bg-red-100'
  },
  {
    icon: Users,
    title: 'Client-First Approach',
    description: 'We prioritize clear communication and tailor our services to your specific needs.',
    color: 'text-amber-600 bg-amber-100'
  },
  {
    icon: Zap,
    title: 'Future-Proof Solutions',
    description: 'Our installations are designed to support both current and future technology requirements.',
    color: 'text-teal-600 bg-teal-100'
  }
];

const WhyChooseUs = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll('.reveal');
    if (elements) {
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (elements) {
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-24 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Why Choose Us</span>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            What Sets Infi-Net Apart
          </h2>
          <p className="reveal text-gray-600 mt-4 text-lg">
            We're not just contractors – we're partners in your success, committed to delivering exceptional quality and service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="reveal flex flex-col items-start"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center mb-4", feature.color)}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
