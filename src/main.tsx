
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Polyfill for requestIdleCallback for browsers that don't support it
if (!window.requestIdleCallback) {
  window.requestIdleCallback = function(callback, options) {
    const start = Date.now();
    // setTimeout returns a number ID when used in Node.js or a Timeout object in the browser
    // We need to return a number to match the type definition
    return setTimeout(function() {
      callback({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, options?.timeout || 1) as unknown as number; // Cast to number to satisfy TypeScript
  };
}

if (!window.cancelIdleCallback) {
  window.cancelIdleCallback = function(id) {
    clearTimeout(id);
  };
}

// Measure initial load performance
if (process.env.NODE_ENV !== 'production') {
  console.time('App mount');
}

// Create a container for measuring hydration performance
const container = document.getElementById("root");
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

// Render the app
root.render(<App />);

// Report performance metrics in development
if (process.env.NODE_ENV !== 'production') {
  // Using setTimeout as a safe fallback even with the polyfill above
  setTimeout(() => {
    console.timeEnd('App mount');
    
    // Report FCP (First Contentful Paint)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log(`FCP: ${entry.startTime}ms`);
      });
      observer.disconnect();
    });
    
    observer.observe({ type: 'paint', buffered: true });
  }, 0);
}
