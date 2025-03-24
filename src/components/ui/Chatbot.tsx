
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: 1,
    text: "👋 Hi there! I'm the Infi-Net virtual assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const suggestionButtons = [
  "Tell me about your services",
  "Request a quote",
  "Fiber optic installation",
  "Contact support"
];

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      sendMessage();
    }
  };

  const sendMessage = (text = inputValue) => {
    if (!text.trim()) return;
    
    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages([...messages, newUserMessage]);
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse = getBotResponse(text.trim());
      const newBotMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (text: string): string => {
    text = text.toLowerCase();
    
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      return "Hello! How can I assist you with Infi-Net's services today?";
    }
    
    if (text.includes('services') || text.includes('what do you offer')) {
      return "We specialize in fiber optic installations, low-voltage data cabling, and point-to-point applications. Would you like more details about any specific service?";
    }
    
    if (text.includes('fiber') || text.includes('optic')) {
      return "Our fiber optic services include installation, testing, and maintenance of fiber optic networks for businesses of all sizes. We use only the highest quality materials and follow strict industry standards.";
    }
    
    if (text.includes('price') || text.includes('cost') || text.includes('quote')) {
      return "Pricing depends on your specific needs and project scope. I'd be happy to connect you with one of our specialists who can provide a detailed quote. Would you like to leave your contact information?";
    }
    
    if (text.includes('contact') || text.includes('talk to someone') || text.includes('human')) {
      return "You can reach our team at (555) 123-4567 or email info@infi-net.com. Alternatively, fill out the contact form on our website and we'll get back to you within 24 hours.";
    }
    
    return "I'm not sure I understand. Could you please rephrase your question? Or you can ask about our services, request a quote, or contact information.";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full shadow-lg bg-infinet-600 hover:bg-infinet-700 text-white"
          aria-label="Open chat"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-40 w-80 md:w-96 rounded-2xl shadow-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '500px'
            }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {/* Chat header */}
            <div className="bg-infinet-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                <h3 className="font-medium">Infi-Net Assistant</h3>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={toggleMinimize}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button 
                  onClick={toggleChat}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat body */}
            {!isMinimized && (
              <>
                <div className="p-4 h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "mb-4 max-w-[80%]",
                        message.sender === 'user'
                          ? "ml-auto"
                          : "mr-auto"
                      )}
                    >
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-2",
                          message.sender === 'user'
                            ? "bg-infinet-600 text-white rounded-tr-none"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-tl-none"
                        )}
                      >
                        {message.text}
                      </div>
                      <div
                        className={cn(
                          "text-xs mt-1 text-gray-500",
                          message.sender === 'user'
                            ? "text-right"
                            : "text-left"
                        )}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex space-x-1 ml-2 mb-4">
                      <div className="bg-gray-300 dark:bg-gray-600 rounded-full w-2 h-2 animate-bounce"></div>
                      <div className="bg-gray-300 dark:bg-gray-600 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="bg-gray-300 dark:bg-gray-600 rounded-full w-2 h-2 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick response buttons */}
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex gap-2 overflow-x-auto pb-3 scrollbar-thin">
                  {suggestionButtons.map((text, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(text)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-full whitespace-nowrap"
                    >
                      {text}
                    </button>
                  ))}
                </div>

                {/* Chat input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-infinet-500"
                  />
                  <Button
                    onClick={() => sendMessage()}
                    disabled={!inputValue.trim()}
                    className="ml-2 rounded-full h-10 w-10 p-0 flex items-center justify-center bg-infinet-600 hover:bg-infinet-700 text-white"
                    aria-label="Send message"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
