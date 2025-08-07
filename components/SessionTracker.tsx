"use client";

import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/use-auth';

interface SessionTrackerProps {
  children: React.ReactNode;
}

export default function SessionTracker({ children }: SessionTrackerProps) {
  const { isLoggedIn, user, loading } = useAuth();
  const sessionStartTime = useRef<number>(Date.now());
  const pageViews = useRef<number>(0);
  const actions = useRef<string[]>([]);
  const isTracking = useRef<boolean>(false);
  const lastSessionTime = useRef<number>(0);
  const pageVisits = useRef<any[]>([]);
  const currentPageStartTime = useRef<number>(Date.now());
  const currentPage = useRef<string>('');

  console.log('SessionTracker mounted:', { isLoggedIn, user: user?.email, loading });

  // Reset session tracking when user logs in or out
  useEffect(() => {
    if (isLoggedIn && user && !loading) {
      console.log('User logged in, starting new session');
      sessionStartTime.current = Date.now();
      pageViews.current = 0;
      actions.current = [];
      isTracking.current = false;
      lastSessionTime.current = 0;
      pageVisits.current = [];
      currentPageStartTime.current = Date.now();
      currentPage.current = typeof window !== 'undefined' ? window.location.pathname : '';
      
      // Send session start immediately
      sendSessionStart();
    } else if (!isLoggedIn && !loading) {
      console.log('User logged out, cleaning up session tracking');
      // Clean up session tracking when user logs out
      isTracking.current = false;
      sessionStartTime.current = Date.now();
      pageViews.current = 0;
      actions.current = [];
      lastSessionTime.current = 0;
      pageVisits.current = [];
    }
  }, [isLoggedIn, user, loading]);

  // Send session start notification
  const sendSessionStart = async () => {
    if (!isLoggedIn || !user || loading) return;
    
    try {
      const response = await fetch('/api/activity/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer
        }),
      });
      
      if (response.ok) {
        console.log('Session start recorded successfully');
      } else {
        console.error('Failed to record session start:', response.status);
      }
    } catch (error) {
      console.error('Failed to record session start:', error);
    }
  };

  // Track page views and page visits
  useEffect(() => {
    if (isLoggedIn && user && !loading && typeof window !== 'undefined') {
      pageViews.current += 1;
      
      // Record the previous page visit if it exists
      if (currentPage.current !== window.location.pathname) {
        const pageDuration = Date.now() - currentPageStartTime.current;
        if (pageDuration > 1000) { // Only record if spent more than 1 second
          pageVisits.current.push({
            page: currentPage.current,
            url: window.location.href,
            duration: pageDuration,
            entryTime: new Date(currentPageStartTime.current).toISOString(),
            actions: actions.current.filter(action => action.includes('page:'))
          });
        }
        
        // Reset for new page
        currentPage.current = window.location.pathname;
        currentPageStartTime.current = Date.now();
        actions.current = actions.current.filter(action => !action.includes('page:'));
      }
    }
  }, [isLoggedIn, user, loading]);

  // Track user actions
  const trackAction = (action: string) => {
    if (isLoggedIn && user && !loading) {
      actions.current.push(action);
    }
  };

  // Track page-specific actions
  const trackPageAction = (action: string) => {
    if (isLoggedIn && user && !loading) {
      actions.current.push(`page:${action}`);
    }
  };

  // Send session data when user leaves or component unmounts
  const sendSessionData = async () => {
    if (!isLoggedIn || !user || isTracking.current || loading) {
      console.log('Session tracking skipped - user not logged in or tracking disabled');
      return;
    }

    isTracking.current = true;
    const sessionDuration = Date.now() - sessionStartTime.current;

    // Only track sessions longer than 10 seconds
    if (sessionDuration < 10000) {
      console.log('Session too short, not tracking:', sessionDuration);
      isTracking.current = false;
      return;
    }

    // Only track if we have some activity
    if (pageViews.current === 0 && actions.current.length === 0) {
      console.log('No activity detected, not tracking session');
      isTracking.current = false;
      return;
    }

    // Prevent multiple rapid submissions (minimum 30 seconds between sessions)
    const now = Date.now();
    if (now - lastSessionTime.current < 30000) {
      console.log('Session submitted too recently, skipping');
      isTracking.current = false;
      return;
    }

    // Record current page visit before sending
    if (typeof window !== 'undefined') {
      const currentPageDuration = Date.now() - currentPageStartTime.current;
      if (currentPageDuration > 1000) {
        pageVisits.current.push({
          page: currentPage.current,
          url: window.location.href,
          duration: currentPageDuration,
          entryTime: new Date(currentPageStartTime.current).toISOString(),
          actions: actions.current.filter(action => action.includes('page:'))
        });
      }
    }

    // Validate session data before sending
    const sessionData = {
      sessionDuration: Math.floor(sessionDuration / 1000), // Convert to seconds
      pageViews: pageViews.current,
      actions: actions.current || [],
      pageVisits: pageVisits.current || []
    };

    console.log('Sending session data:', sessionData);

    try {
      const response = await fetch('/api/activity/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Session tracking stopped - user logged out');
          isTracking.current = false;
          return;
        }
        console.error('Session API error:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        isTracking.current = false;
      } else {
        console.log('Session data sent successfully');
        lastSessionTime.current = now;
        isTracking.current = false;
      }
    } catch (error) {
      console.error('Failed to send session data:', error);
      isTracking.current = false;
    }
  };

  // Set up event listeners for tracking
  useEffect(() => {
    console.log('Setting up session tracking:', { isLoggedIn, user: user?.email, loading });
    if (!isLoggedIn || !user || loading) return;

    // Track various user actions
    const trackClick = () => trackAction('click');
    const trackScroll = () => trackAction('scroll');
    const trackKeyPress = () => trackAction('keypress');

    // Add event listeners
    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', trackScroll);
    document.addEventListener('keypress', trackKeyPress);

    // Send session data when user leaves
    const handleBeforeUnload = () => {
      if (isLoggedIn && user) {
        sendSessionData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isLoggedIn && user) {
        sendSessionData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Send session data every 2 minutes while active (more frequent for real-time tracking)
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && isLoggedIn && user) {
        sendSessionData();
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => {
      document.removeEventListener('click', trackClick);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('keypress', trackKeyPress);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      if (isLoggedIn && user) {
        sendSessionData();
      }
    };
  }, [isLoggedIn, user, loading]);

  return <>{children}</>;
}
