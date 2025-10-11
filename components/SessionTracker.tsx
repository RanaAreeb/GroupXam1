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
  const lastActiveTime = useRef<number>(Date.now());
  const isPageVisible = useRef<boolean>(true);

  console.log('SessionTracker mounted:', { isLoggedIn, user: user?.email, loading });

  // Reset session tracking when user logs in or out
  useEffect(() => {
    if (isLoggedIn && user && !loading) {
      console.log('User logged in, starting new session');
      
      // Always reset session start time to prevent long sessions
      const now = Date.now();
      sessionStartTime.current = now;
      lastActiveTime.current = now;
      pageViews.current = 0;
      actions.current = [];
      isTracking.current = false;
      lastSessionTime.current = 0;
      pageVisits.current = [];
      currentPageStartTime.current = now;
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

  // Reset session on page load/refresh to prevent long sessions
  useEffect(() => {
    if (isLoggedIn && user && !loading) {
      const now = Date.now();
      
      // Check if session has been idle for more than 30 minutes (1800 seconds)
      const maxIdleTime = 30 * 60 * 1000; // 30 minutes in milliseconds
      const currentSessionDuration = now - sessionStartTime.current;
      
      if (currentSessionDuration > maxIdleTime) {
        console.log('Long session detected, resetting session start time');
        sessionStartTime.current = now;
        lastActiveTime.current = now;
        pageViews.current = 0;
        actions.current = [];
        pageVisits.current = [];
        currentPageStartTime.current = now;
      }
    }
  }, []);

  // Track page visibility and user activity
  useEffect(() => {
    if (!isLoggedIn || !user || loading) return;

    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
      if (!document.hidden) {
        // Page became visible, update last active time
        lastActiveTime.current = Date.now();
      }
    };

    const handleUserActivity = () => {
      lastActiveTime.current = Date.now();
    };

    // Listen for page visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Listen for user activity
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
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

    // Calculate actual active time by accounting for periods of inactivity
    const now = Date.now();
    const timeSinceLastActivity = now - lastActiveTime.current;
    const maxInactiveTime = 10 * 60 * 1000; // 10 minutes max inactive time
    
    // If user has been inactive for more than 10 minutes, subtract that inactive time
    let activeSessionDuration = sessionDuration;
    if (timeSinceLastActivity > maxInactiveTime) {
      activeSessionDuration = sessionDuration - (timeSinceLastActivity - maxInactiveTime);
    }
    
    // Cap maximum session duration at 4 hours (14400 seconds)
    const maxSessionDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
    const cappedSessionDuration = Math.min(Math.max(activeSessionDuration, 0), maxSessionDuration);

    console.log('Session duration calculation:', {
      raw: sessionDuration,
      active: activeSessionDuration,
      capped: cappedSessionDuration,
      rawSeconds: Math.floor(sessionDuration / 1000),
      activeSeconds: Math.floor(activeSessionDuration / 1000),
      cappedSeconds: Math.floor(cappedSessionDuration / 1000),
      timeSinceLastActivity: Math.floor(timeSinceLastActivity / 1000)
    });

    // Only track if we have some activity
    if (pageViews.current === 0 && actions.current.length === 0) {
      console.log('No activity detected, not tracking session');
      isTracking.current = false;
      return;
    }

    // Prevent multiple rapid submissions (minimum 30 seconds between sessions)
    const currentTime = Date.now();
    if (currentTime - lastSessionTime.current < 30000) {
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
      sessionDuration: Math.floor(cappedSessionDuration / 1000), // Convert to seconds and use capped duration
      pageViews: pageViews.current,
      actions: actions.current || [],
      pageVisits: pageVisits.current || []
    };

    console.log('Sending session data:', sessionData);

    try {
      // Use keepalive to ensure request completes even if page is closing
      const response = await fetch('/api/activity/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
        keepalive: true, // Ensures request completes even during page unload
      });

      if (!response.ok) {
        if (response.status === 401) {
          console.log('Session tracking stopped - user logged out');
          isTracking.current = false;
          return;
        }
        console.error('Session API error:', response.status, response.statusText);
        try {
          const errorText = await response.text();
          console.error('Error response:', errorText);
        } catch (e) {
          console.error('Could not read error response');
        }
        isTracking.current = false;
      } else {
        console.log('Session data sent successfully');
        lastSessionTime.current = currentTime;
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
