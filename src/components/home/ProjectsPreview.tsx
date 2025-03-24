
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const projects = [
  {
    id: 1,
    title: 'Corporate Headquarters Network',
    category: 'Fiber Optic Installation',
    description: 'Complete fiber optic backbone installation for a multi-story corporate headquarters.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    title: 'Healthcare Facility Infrastructure',
    category: 'Low-Voltage Cabling',
    description: 'Comprehensive data and voice network cabling for a new medical center.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    title: 'Multi-Building Campus Connection',
    category: 'Point-to-Point',
    description: 'High-bandwidth point-to-point connection linking multiple campus buildings.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const ProjectsPreview = () => {
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
      className="py-16 md:py-24 bg-gray-50"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Our Work</span>
          <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Recent Projects
          </h2>
          <p className="reveal text-gray-600 mt-4 text-lg">
            Explore some of our recent installations and see the quality of our work firsthand.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="reveal group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-60 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute top-0 left-0 m-4">
                <span className="bg-infinet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <Link 
                  to={`/projects/${project.id}`} 
                  className="inline-flex items-center text-infinet-600 hover:text-infinet-700 font-medium"
                >
                  View Project <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="reveal text-center mt-12">
          <Link to="/projects">
            <Button size="lg" variant="outline">
              View All Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
