
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

// Featured states where Infi-NET has completed projects
const featuredStates = [
  { name: 'Florida', abbr: 'FL', color: 'bg-blue-500' },
  { name: 'Texas', abbr: 'TX', color: 'bg-red-500' },
  { name: 'Virginia', abbr: 'VA', color: 'bg-purple-500' },
  { name: 'Massachusetts', abbr: 'MA', color: 'bg-green-500' },
  { name: 'Colorado', abbr: 'CO', color: 'bg-yellow-500' },
  { name: 'California', abbr: 'CA', color: 'bg-orange-500' }
];

const NationwideService = () => {
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Coast to Coast</span>
            <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Nationwide Service
            </h2>
            <p className="reveal text-gray-600 max-w-3xl mx-auto text-lg mb-8">
              From Florida to California, Texas to Massachusetts — Infi-NET delivers expert fiber and low-voltage solutions across the United States.
            </p>
          </div>
          
          <div className="reveal grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6 mb-12">
            {featuredStates.map((state, index) => (
              <div 
                key={index}
                className={cn(
                  "rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  "flex items-center justify-center text-white font-semibold py-6 text-center"
                )}
                style={{ backgroundColor: state.color.startsWith('bg-') ? `var(--${state.color.substring(3)})` : state.color }}
              >
                <span className="text-lg md:text-xl">{state.name}</span>
              </div>
            ))}
          </div>
          
          <div className="reveal text-center">
            <p className="text-gray-600 mb-6">
              Our team has the expertise and resources to deliver high-quality fiber and low-voltage solutions anywhere in the United States.
            </p>
            <Link to="/contact">
              <Button variant="default" size="lg">
                Discuss Your Project
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NationwideService;
