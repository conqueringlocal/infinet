import React, { useEffect, useRef } from 'react';
import { CheckCircle, Users, Award, Star, Target, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import EditableContent from '@/components/editor/EditableContent';

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "About Us | Infi-Net LLC";

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
      <main className="flex-grow">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="reveal text-4xl md:text-5xl font-bold mb-4">About Infi-Net LLC</h1>
              <p className="reveal text-xl text-blue-100">
                Founded on principles of quality and reliability, we bring decades of experience to every fiber and low-voltage project.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="reveal">
                  <span className="text-sm font-semibold text-infinet-600 uppercase tracking-wider">Our Story</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                    35+ Years of Network Infrastructure Excellence
                  </h2>
                </div>

                <div className="reveal">
                  <p className="text-gray-600 text-lg">
                    Infi-Net LLC was founded by industry veterans with a shared vision: to deliver network infrastructure solutions of uncompromising quality, completed on time and on budget. Based in Lakeland, Florida, we've built our reputation on technical expertise, attention to detail, and exceptional customer service.
                  </p>
                  <p className="text-gray-600 text-lg mt-4">
                    Our team has over 35 years of combined experience in the fiber optic and low-voltage industry, having worked on projects ranging from small office installations to large-scale enterprise networks and campus-wide infrastructure deployments.
                  </p>
                  <EditableContent 
                    id="about-nationwide-paragraph" 
                    tag="p" 
                    className="text-gray-600 text-lg mt-4"
                  >
                    Today, we continue to provide the highest standard of service nationwide, leveraging our technical expertise, traditional values of craftsmanship, and commitment to innovation to serve businesses across the United States.
                  </EditableContent>
                </div>
              </div>

              <div className="reveal">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-infinet-100 rounded-lg -z-10"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-infinet-50 rounded-lg -z-10"></div>
                  <div className="bg-gray-200 rounded-lg overflow-hidden shadow-2xl">
                    <img 
                      src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                      alt="Team of Infi-Net technicians"
                      className="w-full h-96 object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Our Values</span>
              <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2">
                The Principles That Guide Our Work
              </h2>
              <p className="reveal text-gray-600 mt-4 text-lg">
                These core values shape our approach to every project and interaction, ensuring we deliver the highest quality service.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Award,
                  title: 'Excellence',
                  description: 'We strive for excellence in every fiber we splice and every cable we install, maintaining the highest standards of quality.'
                },
                {
                  icon: Target,
                  title: 'Precision',
                  description: 'Attention to detail is crucial in our industry. We approach each task with focus and precision to ensure optimal performance.'
                },
                {
                  icon: Users,
                  title: 'Partnership',
                  description: 'We view ourselves as partners in your success, working collaboratively to understand and meet your unique requirements.'
                },
                {
                  icon: Heart,
                  title: 'Integrity',
                  description: 'We operate with transparency and honesty, building trust through consistent ethical practices and reliability.'
                },
                {
                  icon: Star,
                  title: 'Innovation',
                  description: 'We embrace new technologies and methods, continuously improving our solutions to stay ahead of industry developments.'
                },
                {
                  icon: CheckCircle,
                  title: 'Accountability',
                  description: 'We take responsibility for our work and stand behind every installation with comprehensive warranties and support.'
                }
              ].map((value, index) => (
                <div 
                  key={index} 
                  className="reveal bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-infinet-600 mb-4">
                    <value.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <span className="reveal text-sm font-semibold text-infinet-600 uppercase tracking-wider">Our Mission</span>
              <h2 className="reveal text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Building a More Connected Future
              </h2>
              <div className="reveal text-xl text-gray-600 leading-relaxed">
                <p>
                  "Our mission at Infi-Net LLC is to deliver exceptional fiber optic and low-voltage solutions that enable our clients to thrive in an increasingly connected world. We are committed to combining technical expertise with outstanding customer service, ensuring that every project is completed to the highest standards of quality and reliability.
                </p>
                <p className="mt-4">
                  We strive to be the most trusted partner for network infrastructure needs, contributing to the advancement of connectivity while maintaining our core values of excellence, integrity, and innovation."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-infinet-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="reveal text-3xl font-bold text-gray-900 mb-4">
                Ready to Work With Our Expert Team?
              </h2>
              <p className="reveal text-lg text-gray-600 mb-6">
                Contact us today to discuss your project needs and discover how our expertise can support your connectivity goals.
              </p>
              <div className="reveal">
                <Link to="/contact">
                  <Button size="lg">
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
