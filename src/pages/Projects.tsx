
import React, { useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const projects = [
  {
    id: 1,
    title: 'Corporate Headquarters Network',
    category: 'Fiber Optic Installation',
    location: 'Tampa, FL',
    description: 'Complete fiber optic backbone installation for a multi-story corporate headquarters, including redundant pathways and high-density connectivity.',
    challenges: [
      'Complex pathway requirements through existing infrastructure',
      'Tight timeline to minimize business disruption',
      'Integration with existing network systems'
    ],
    solution: 'Implemented a strategic installation plan with after-hours work scheduling, utilizing pre-terminated fiber solutions where possible to reduce on-site splicing time.',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 2,
    title: 'Healthcare Facility Infrastructure',
    category: 'Low-Voltage Cabling',
    location: 'Orlando, FL',
    description: 'Comprehensive data and voice network cabling for a new medical center, including patient rooms, administrative areas, and specialized medical equipment connections.',
    challenges: [
      'Strict healthcare facility compliance requirements',
      'Critical system redundancy needs',
      'Integration with specialized medical systems'
    ],
    solution: 'Designed and implemented a structured cabling system exceeding healthcare industry standards, with dedicated pathways for critical systems and comprehensive testing and certification.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 3,
    title: 'Multi-Building Campus Connection',
    category: 'Point-to-Point',
    location: 'Lakeland, FL',
    description: 'High-bandwidth point-to-point connection linking multiple campus buildings for a educational institution, providing unified network access across facilities.',
    challenges: [
      'Long-distance spans between buildings',
      'Outdoor pathway construction requirements',
      'Maintaining consistent performance across all locations'
    ],
    solution: 'Implemented a hybrid aerial/underground fiber pathway system with appropriate environmental protection and robust single-mode fiber backbone to support current and future bandwidth needs.',
    image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 4,
    title: 'Data Center Upgrade',
    category: 'Fiber Optic Installation',
    location: 'Miami, FL',
    description: 'Comprehensive upgrade of an existing data center infrastructure to support increased capacity and improved redundancy requirements.',
    challenges: [
      'Working within an active data center environment',
      'Phased migration to minimize downtime',
      'High-density connectivity requirements'
    ],
    solution: 'Designed and executed a carefully staged migration plan, implementing high-density fiber solutions with comprehensive testing at each phase before transitioning live systems.',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 5,
    title: 'Manufacturing Facility Network',
    category: 'Low-Voltage Cabling',
    location: 'Jacksonville, FL',
    description: 'Industrial network infrastructure for a large manufacturing facility, supporting both office operations and production floor systems.',
    challenges: [
      'Harsh environmental conditions in production areas',
      'Long cable runs across large facility',
      'Integration with industrial control systems'
    ],
    solution: 'Implemented specialized industrial-grade cabling solutions with appropriate environmental protection, strategic IDF placement to minimize run lengths, and comprehensive testing in all environments.',
    image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: 6,
    title: 'Retail Chain Connectivity',
    category: 'Point-to-Point',
    location: 'Multiple Locations, FL',
    description: 'Standardized network implementation across multiple retail locations, providing consistent connectivity and centralized management.',
    challenges: [
      'Varying site conditions across locations',
      'Tight project timeline for multiple sites',
      'Maintaining consistency across all installations'
    ],
    solution: 'Developed a standardized implementation plan with location-specific adaptations, utilizing a dedicated team for consistent execution and comprehensive documentation for each site.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const Projects = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Our Projects | Infi-Net LLC";

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

    const elements = pageRef.current?.querySelectorAll('.reveal');
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
    <div className="min-h-screen flex flex-col" ref={pageRef}>
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="reveal text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
              <p className="reveal text-xl text-blue-100">
                Explore our portfolio of successful fiber optic and low-voltage installations across Florida.
              </p>
            </div>
          </div>
        </section>

        {/* Project Introduction */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="reveal text-lg text-gray-600">
                Each project represents our commitment to quality, attention to detail, and client satisfaction. From office buildings to healthcare facilities, our team has the expertise to handle diverse and complex network infrastructure needs.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <div 
                  key={project.id}
                  className="reveal bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-48 object-cover object-center"
                    />
                    <div className="absolute top-0 left-0 m-4">
                      <span className="bg-infinet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500 mb-3">{project.location}</div>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    
                    <button
                      className="text-infinet-600 hover:text-infinet-700 font-medium inline-flex items-center"
                      onClick={() => {
                        const projectDetails = document.getElementById(`project-${project.id}`);
                        projectDetails?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      View Project Details <ArrowRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Details Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-16">Project Details</h2>
            
            {projects.map((project, index) => (
              <div 
                key={project.id}
                id={`project-${project.id}`}
                className="reveal mb-20 last:mb-0 pb-16 last:pb-0 border-b last:border-0 border-gray-200 scroll-mt-24"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  <div>
                    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-80 object-cover object-center"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-1">
                        <span className="bg-infinet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {project.category}
                        </span>
                        <span className="text-sm text-gray-500 ml-3">{project.location}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mt-2">{project.title}</h3>
                    </div>
                    
                    <p className="text-gray-600">{project.description}</p>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Challenges:</h4>
                      <div className="space-y-2">
                        {project.challenges.map((challenge, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                            <p className="text-gray-700">{challenge}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Our Solution:</h4>
                      <p className="text-gray-600">{project.solution}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 bg-infinet-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="reveal text-lg text-gray-600 mb-8">
                Contact us today to discuss how our expertise can help bring your network infrastructure project to life.
              </p>
              <div className="reveal">
                <Link to="/contact">
                  <Button size="lg">
                    Contact Our Team
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Projects;
