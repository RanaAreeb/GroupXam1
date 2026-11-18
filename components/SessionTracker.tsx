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
  const isSending = useRef<boolean>(false);
  const lastSendTime = useRef<number>(0);
  const pageVisits = useRef<any[]>([]);
  const currentPageStartTime = useRef<number>(Date.now());
  const currentPage = useRef<string>('');
  const lastActiveTime = useRef<number>(Date.now());
  const hasActiveServerSession = useRef<boolean>(false);
  const finalized = useRef<boolean>(false);

  const resetLocalSession = () => {
    const now = Date.now();
    sessionStartTime.current = now;
    lastActiveTime.current = now;
    pageViews.current = 1;
    actions.current = [];
    pageVisits.current = [];
    currentPageStartTime.current = now;
    currentPage.current = typeof window !== 'undefined' ? window.location.pathname : '';
    finalized.current = false;
  };

  const sendSessionStart = async () => {
    if (!isLoggedIn || !user || loading) return;

    try {
      const response = await fetch('/api/activity/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });

      if (response.ok) {
        hasActiveServerSession.current = true;
        finalized.current = false;
      }
    } catch (error) {
      console.error('Failed to record session start:', error);
    }
  };

  const ensureSessionStarted = async () => {
    if (!hasActiveServerSession.current || finalized.current) {
      resetLocalSession();
      await sendSessionStart();
    }
  };

  // Start / reset when auth becomes ready
  useEffect(() => {
    if (isLoggedIn && user && !loading) {
      resetLocalSession();
      sendSessionStart();
    } else if (!isLoggedIn && !loading) {
      hasActiveServerSession.current = false;
      finalized.current = true;
      pageViews.current = 0;
      actions.current = [];
      pageVisits.current = [];
    }
  }, [isLoggedIn, user, loading]);

  // Activity + visibility listeners
  useEffect(() => {
    if (!isLoggedIn || !user || loading) return;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        lastActiveTime.current = Date.now();
      }
    };

    const handleUserActivity = () => {
      lastActiveTime.current = Date.now();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'] as const;
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [isLoggedIn, user, loading]);

  // Page views
  useEffect(() => {
    if (isLoggedIn && user && !loading && typeof window !== 'undefined') {
      pageViews.current += 1;

      if (currentPage.current && currentPage.current !== window.location.pathname) {
        const pageDuration = Date.now() - currentPageStartTime.current;
        if (pageDuration > 1000) {
          pageVisits.current.push({
            page: currentPage.current,
            url: window.location.href,
            duration: pageDuration,
            entryTime: new Date(currentPageStartTime.current).toISOString(),
            actions: actions.current.filter((action) => action.includes('page:')),
          });
        }

        currentPage.current = window.location.pathname;
        currentPageStartTime.current = Date.now();
        actions.current = actions.current.filter((action) => !action.includes('page:'));
      } else if (!currentPage.current) {
        currentPage.current = window.location.pathname;
        currentPageStartTime.current = Date.now();
      }
    }
  }, [isLoggedIn, user, loading]);

  const trackAction = (action: string) => {
    if (isLoggedIn && user && !loading) {
      actions.current.push(action);
    }
  };

  const buildDurationSeconds = () => {
    const now = Date.now();
    const raw = now - sessionStartTime.current;
    const timeSinceLastActivity = now - lastActiveTime.current;
    const maxInactiveTime = 10 * 60 * 1000;
    let active = raw;
    if (timeSinceLastActivity > maxInactiveTime) {
      active = raw - (timeSinceLastActivity - maxInactiveTime);
    }
    const maxSessionDuration = 4 * 60 * 60 * 1000;
    return Math.floor(Math.min(Math.max(active, 0), maxSessionDuration) / 1000);
  };

  const sendSessionData = async (finalize: boolean) => {
    if (!isLoggedIn || !user || loading || isSending.current) return;
    if (finalize && finalized.current) return;

    const sessionDuration = buildDurationSeconds();
    if (sessionDuration < 10 && finalize) return;
    if (sessionDuration < 10 && !finalize) return;

    // Throttle heartbeats
    const now = Date.now();
    if (!finalize && now - lastSendTime.current < 30 * 1000) return;

    isSending.current = true;

    if (typeof window !== 'undefined') {
      const currentPageDuration = Date.now() - currentPageStartTime.current;
      if (currentPageDuration > 1000) {
        const last = pageVisits.current[pageVisits.current.length - 1];
        if (!last || last.page !== currentPage.current || last.entryTime !== new Date(currentPageStartTime.current).toISOString()) {
          pageVisits.current.push({
            page: currentPage.current,
            url: window.location.href,
            duration: currentPageDuration,
            entryTime: new Date(currentPageStartTime.current).toISOString(),
            actions: actions.current.filter((action) => action.includes('page:')),
          });
        }
      }
    }

    const payload = {
      sessionDuration,
      pageViews: Math.max(pageViews.current, 1),
      actions: actions.current || [],
      pageVisits: pageVisits.current || [],
      finalize,
    };

    try {
      if (!hasActiveServerSession.current && !finalize) {
        await ensureSessionStarted();
      }

      const response = await fetch('/api/activity/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: finalize,
      });

      if (response.ok) {
        lastSendTime.current = now;
        if (finalize) {
          finalized.current = true;
          hasActiveServerSession.current = false;
        }
      }
    } catch (error) {
      console.error('Failed to send session data:', error);
    } finally {
      isSending.current = false;
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !user || loading) return;

    const trackClick = () => trackAction('click');
    const trackScroll = () => trackAction('scroll');
    const trackKeyPress = () => trackAction('keypress');

    document.addEventListener('click', trackClick);
    document.addEventListener('scroll', trackScroll);
    document.addEventListener('keypress', trackKeyPress);

    const handleBeforeUnload = () => {
      void sendSessionData(true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        void sendSessionData(true);
      } else if (document.visibilityState === 'visible') {
        // New visit segment after tab return
        void ensureSessionStarted();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Heartbeat only — does not create a new "spent X minutes" row each time
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        void sendSessionData(false);
      }
    }, 2 * 60 * 1000);

    return () => {
      document.removeEventListener('click', trackClick);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('keypress', trackKeyPress);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
      void sendSessionData(true);
    };
  }, [isLoggedIn, user, loading]);

  return <>{children}</>;
}
