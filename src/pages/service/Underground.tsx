
import React, { useEffect, useRef } from 'react';
import { Construction, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import EditableContent from '@/components/editor/EditableContent';

const UndergroundServicePage = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Underground Services | Infi-NET LLC";

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
              <h1 className="reveal text-4xl md:text-5xl font-bold mb-4">Underground Services</h1>
              <p className="reveal text-xl text-blue-100">
                Professional underground utility installation, directional boring, and trenching solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Service Overview */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <div className="reveal bg-blue-50 p-6 rounded-lg mb-10">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Construction className="h-8 w-8 text-infinet-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Underground Infrastructure</h2>
                    <p className="text-gray-700">
                      Infi-NET provides specialized underground utility services for the installation of fiber optic cables, conduits, and low-voltage infrastructure with minimal disruption to surrounding areas.
                    </p>
                  </div>
                </div>
              </div>

              <div className="reveal space-y-6">
                <EditableContent
                  id="underground-overview"
                >
                  <p>Our underground services provide a comprehensive solution for installing telecommunications, data, and power infrastructure beneath the surface. Using advanced directional boring and trenching technologies, we ensure minimal disruption to existing landscaping, pavements, and structures while establishing reliable underground pathways for essential utilities.</p>
                  <p>Whether you need to connect multiple buildings across a campus, establish new infrastructure for a commercial development, or upgrade existing underground systems, our teams deliver precise, code-compliant installations that meet the highest industry standards.</p>
                </EditableContent>
              </div>
            </div>
          </div>
        </section>

        {/* Service Features */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="reveal text-3xl font-bold text-gray-900 mb-10 text-center">Our Underground Service Capabilities</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="reveal bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Directional Boring</h3>
                  <EditableContent
                    id="directional-boring"
                  >
                    <p>Our directional boring (horizontal drilling) services allow for the installation of underground utilities with minimal surface disruption:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Precise installation under roads, sidewalks, landscaping, and waterways</li>
                      <li>Reduced restoration costs compared to traditional trenching</li>
                      <li>Environmentally friendly approach with minimal ecosystem impact</li>
                      <li>Ideal for congested areas with existing underground utilities</li>
                    </ul>
                  </EditableContent>
                </div>
                
                <div className="reveal bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Trenching & Excavation</h3>
                  <EditableContent
                    id="trenching-excavation"
                  >
                    <p>When open trenching is the most appropriate method, our teams provide:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Precise excavation with minimal footprint</li>
                      <li>Proper bedding and backfill procedures</li>
                      <li>Conduit and cable installation to exact specifications</li>
                      <li>Full surface restoration including asphalt, concrete, and landscaping</li>
                    </ul>
                  </EditableContent>
                </div>
                
                <div className="reveal bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Utility Locating & Mapping</h3>
                  <EditableContent
                    id="utility-locating"
                  >
                    <p>Before any underground work begins, we utilize advanced utility locating tools:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>Ground-penetrating radar (GPR) surveys</li>
                      <li>Electromagnetic detection systems</li>
                      <li>Comprehensive mapping of existing underground infrastructure</li>
                      <li>3D visualization of underground conditions</li>
                    </ul>
                  </EditableContent>
                </div>
                
                <div className="reveal bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Conduit & Duct Bank Installation</h3>
                  <EditableContent
                    id="conduit-installation"
                  >
                    <p>We install robust underground pathways for your infrastructure:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-2">
                      <li>PVC, HDPE, and flexible conduit systems</li>
                      <li>Multi-conduit duct bank configurations</li>
                      <li>Reinforced concrete encasement where required</li>
                      <li>Pull boxes, hand holes, and access points for maintenance</li>
                    </ul>
                  </EditableContent>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Benefits */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="reveal text-3xl font-bold text-gray-900 mb-8 text-center">Why Choose Our Underground Services</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Minimal disruption to business operations and public access",
                  "Protection from weather, vandalism, and accidental damage",
                  "Extended infrastructure lifespan compared to aerial installations",
                  "Reduced long-term maintenance requirements",
                  "Enhanced aesthetic appeal with hidden infrastructure",
                  "Comprehensive documentation and as-built drawings",
                  "Nationwide service capabilities",
                  "Permitting and compliance management"
                ].map((benefit, index) => (
                  <div key={index} className="reveal flex items-start">
                    <CheckCircle className="h-5 w-5 text-infinet-600 mt-1 mr-3 flex-shrink-0" />
                    <p className="text-gray-700">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-infinet-800 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="reveal text-3xl font-bold mb-6">Ready to Discuss Your Underground Infrastructure Needs?</h2>
              <p className="reveal text-lg text-blue-100 mb-8">
                Contact our team today to learn more about how our underground services can provide reliable, long-lasting infrastructure for your organization.
              </p>
              <div className="reveal">
                <Link to="/contact">
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white text-infinet-800 hover:bg-blue-50"
                  >
                    Request a Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
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

export default UndergroundServicePage;
