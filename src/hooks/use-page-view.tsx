
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { recordPageView } from '@/lib/analytics-service';
import { useAuth } from '@/hooks/use-auth';

/**
 * Hook to record page views for analytics
 */
export const usePageView = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const recordView = async () => {
      try {
        const pagePath = location.pathname;
        await recordPageView(pagePath, user?.id);
      } catch (error) {
        console.error('Error recording page view:', error);
      }
    };

    recordView();
  }, [location.pathname, user?.id]);
};
