
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
  requestIdleCallback(() => {
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
  });
}
