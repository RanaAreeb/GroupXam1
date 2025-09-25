"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./use-auth";

interface Discussion {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
}

export function useDiscussionNotification() {
  const { user } = useAuth();
  const [showNotification, setShowNotification] = useState(false);
  const [latestDiscussion, setLatestDiscussion] = useState<Discussion | null>(null);
  const [hasShownNotification, setHasShownNotification] = useState(false);

  // Check if user has already seen a notification today
  const getNotificationKey = useCallback(() => {
    if (!user?.email) return null;
    const today = new Date().toDateString();
    return `discussion_notification_${user.email}_${today}`;
  }, [user?.email]);

  // Check if notification was already shown today
  const hasShownToday = useCallback(() => {
    const key = getNotificationKey();
    if (!key) return false;
    return localStorage.getItem(key) === 'true';
  }, [getNotificationKey]);

  // Mark notification as shown
  const markAsShown = useCallback(() => {
    const key = getNotificationKey();
    if (key) {
      localStorage.setItem(key, 'true');
      setHasShownNotification(true);
    }
  }, [getNotificationKey]);

  // Check for new discussions
  const checkForNewDiscussions = useCallback(async () => {
    if (!user || hasShownToday() || hasShownNotification) return;

    try {
      const response = await fetch('/api/discussions?limit=1');
      if (response.ok) {
        const discussions = await response.json();
        if (discussions && discussions.length > 0) {
          const latest = discussions[0];
          const discussionTime = new Date(latest.createdAt);
          const now = new Date();
          const timeDiff = now.getTime() - discussionTime.getTime();
          
          // Show notification if discussion was created within the last 5 minutes
          if (timeDiff < 5 * 60 * 1000) {
            setLatestDiscussion(latest);
            setShowNotification(true);
          }
        }
      }
    } catch (error) {
      console.error('Error checking for new discussions:', error);
    }
  }, [user, hasShownToday, hasShownNotification]);

  // Check for new discussions periodically
  useEffect(() => {
    if (!user) return;

    // Check immediately
    checkForNewDiscussions();

    // Check every 30 seconds
    const interval = setInterval(checkForNewDiscussions, 30000);

    return () => clearInterval(interval);
  }, [user, checkForNewDiscussions]);

  // Handle notification close
  const handleCloseNotification = useCallback(() => {
    setShowNotification(false);
    markAsShown();
  }, [markAsShown]);

  return {
    showNotification,
    latestDiscussion,
    handleCloseNotification,
  };
}
