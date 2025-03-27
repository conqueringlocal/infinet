import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, CheckCircle, Send, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const services = [
  { id: 'fiber', label: 'Fiber Optic Installation' },
  { id: 'data-cabling', label: 'Low-Voltage Data Cabling' },
  { id: 'ptp', label: 'Point-to-Point Applications' },
  { id: 'greenfield', label: 'Greenfield Site Build' },
  { id: 'brownfield', label: 'Brownfield Site Build' },
  { id: 'other', label: 'Other Services' }
];

const Contact = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Form submitted successfully!",
        description: "We'll get back to you as soon as possible.",
        variant: "default",
      });
      setIsSubmitting(false);
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      });
    }, 1500);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Contact Us | Infi-Net LLC";

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
      
      
      <main className="flex-grow pt-20">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-infinet-800 to-infinet-950 py-16 md:py-20 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="reveal text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="reveal text-xl text-blue-100">
                Reach out to discuss your project needs or request a quote for our services.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: 'Our Location',
                  content: 'Nationwide Service',
                  detail: 'Based in Lakeland, Florida with projects across the United States',
                  color: 'text-blue-600 bg-blue-100'
                },
                {
                  icon: Phone,
                  title: 'Phone Number',
                  content: '(727) 417-7050',
                  detail: 'Monday-Friday, 8am-6pm ET',
                  link: 'tel:+17274177050',
                  color: 'text-green-600 bg-green-100'
                },
                {
                  icon: Mail,
                  title: 'Email Address',
                  content: 'info@infi-net.net',
                  detail: 'We respond promptly to all inquiries',
                  link: 'mailto:info@infi-net.net',
                  color: 'text-purple-600 bg-purple-100'
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="reveal text-center bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex justify-center mb-4">
                    <div className={cn("w-14 h-14 rounded-full flex items-center justify-center", item.color)}>
                      <item.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      className="text-infinet-600 hover:text-infinet-700 font-medium text-lg"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-800 font-medium text-lg">{item.content}</p>
                  )}
                  <p className="text-gray-500 mt-2">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-3 reveal">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formState.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formState.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                            placeholder="Your email address"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formState.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                            placeholder="Your phone number"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                            Company
                          </label>
                          <input
                            type="text"
                            id="company"
                            name="company"
                            value={formState.company}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                          Service Interested In *
                        </label>
                        <select
                          id="service"
                          name="service"
                          value={formState.service}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                        >
                          <option value="">Select a service</option>
                          {services.map(service => (
                            <option key={service.id} value={service.id}>
                              {service.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-infinet-500 focus:border-infinet-500"
                          placeholder="Please describe your project or requirements"
                        />
                      </div>
                      
                      <div>
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full md:w-auto"
                        >
                          {isSubmitting ? (
                            <>Processing...</>
                          ) : (
                            <>
                              Send Message
                              <Send className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
                
                {/* Info Section */}
                <div className="lg:col-span-2 reveal">
                  <div className="bg-infinet-800 text-white rounded-lg shadow-md p-8 h-full">
                    <h2 className="text-2xl font-bold mb-6">Get a Quote</h2>
                    
                    <div className="space-y-6">
                      <p>
                        Ready to get started with your project? Fill out the form to request a quote or contact us directly using the information provided.
                      </p>
                      
                      <div className="space-y-4 pt-4">
                        {[
                          'Detailed project assessment',
                          'Competitive pricing',
                          'Flexible scheduling options',
                          'Comprehensive service plans',
                          'Free initial consultation'
                        ].map((item, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-infinet-400 mt-1 mr-3 flex-shrink-0" />
                            <p>{item}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t border-blue-700">
                        <p className="font-medium mb-2">Our Response Commitment:</p>
                        <p className="text-blue-200">
                          We respond to all inquiries within 24 business hours. For urgent matters, please call us directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="reveal text-3xl font-bold text-gray-900 mb-6">Nationwide Service</h2>
              <p className="reveal text-lg text-gray-600 mb-8">
                Based in Lakeland, Florida, we provide fiber optic and low-voltage services throughout the entire United States, including:
              </p>
              
              <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-2xl mx-auto">
                {[
                  'Florida', 'Texas', 'California', 'Virginia', 
                  'Massachusetts', 'Colorado', 'New York', 'Illinois'
                ].map((state, index) => (
                  <div key={index} className="bg-gray-50 py-3 px-2 rounded-md shadow-sm">
                    <span className="font-medium text-gray-800">{state}</span>
                  </div>
                ))}
              </div>
              
              <p className="reveal text-gray-600 mt-6">
                We serve clients across all 50 states. <Link to="/contact" className="text-infinet-600 hover:text-infinet-700">Contact us</Link> to discuss your project needs.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      
    </div>
  );
};

export default Contact;
