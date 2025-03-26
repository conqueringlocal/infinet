import React from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableContent from '@/components/editor/EditableContent';

const FiberCmsInfo = () => {
  return (
    <section className="py-16 px-4 md:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="space-y-6">
              <EditableContent id="cms-subtitle" tag="span" className="text-sm font-semibold text-[#003366] uppercase tracking-wider">
                Managed By Conquering Local
              </EditableContent>
              
              <EditableContent id="cms-title" tag="h2" className="text-3xl md:text-4xl font-bold text-gray-900">
                Easy Content Management for Your Website
              </EditableContent>
              
              <EditableContent id="cms-description" tag="p" className="text-lg text-gray-600">
                Our custom CMS solution gives you full control over your website's content. Update text, images, and more without any technical knowledge.
              </EditableContent>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-[#003366] font-bold">✓</span>
                  </div>
                  <div className="ml-3">
                    <EditableContent id="cms-feature1-title" tag="h3" className="text-lg font-medium text-gray-900">
                      User-Friendly Interface
                    </EditableContent>
                    <EditableContent id="cms-feature1-desc" tag="p" className="mt-1 text-gray-500">
                      Intuitive dashboard designed for non-technical users
                    </EditableContent>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-[#003366] font-bold">✓</span>
                  </div>
                  <div className="ml-3">
                    <EditableContent id="cms-feature2-title" tag="h3" className="text-lg font-medium text-gray-900">
                      CRM Integration
                    </EditableContent>
                    <EditableContent id="cms-feature2-desc" tag="p" className="mt-1 text-gray-500">
                      Seamlessly connect with HighLevel or FlowTrack
                    </EditableContent>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mt-1">
                    <span className="text-[#003366] font-bold">✓</span>
                  </div>
                  <div className="ml-3">
                    <EditableContent id="cms-feature3-title" tag="h3" className="text-lg font-medium text-gray-900">
                      Multi-Site Management
                    </EditableContent>
                    <EditableContent id="cms-feature3-desc" tag="p" className="mt-1 text-gray-500">
                      Control all your websites from a single dashboard
                    </EditableContent>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Link to="/admin/login">
                  <Button 
                    className="group"
                    variant="default"
                  >
                    Access Admin Dashboard
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#003366] to-blue-600 rounded-lg blur-lg opacity-50"></div>
              <EditableContent 
                id="cms-main-image" 
                type="image" 
                imageSrc="/lovable-uploads/82c5769b-887a-49f8-a103-392bb5e996d5.png"
                imageAlt="Conquering Local CMS" 
                className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-14 right-20 rounded-xl overflow-hidden shadow-lg transform rotate-3 z-10 hidden lg:block">
        <EditableContent
          id="fiber-cms-image-1"
          type="image"
          imageSrc="/assets/cms-preview-1.jpg"
          imageAlt="CMS Preview 1"
          className="w-72 h-auto object-cover"
        />
      </div>

      <div className="absolute bottom-14 left-20 rounded-xl overflow-hidden shadow-lg transform -rotate-3 z-10 hidden lg:block">
        <EditableContent
          id="fiber-cms-image-2"
          type="image"
          imageSrc="/assets/cms-preview-2.jpg"
          imageAlt="CMS Preview 2"
          className="w-72 h-auto object-cover"
        />
      </div>
    </section>
  );
};

export default FiberCmsInfo;
