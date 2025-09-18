"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import AlertPopup from './AlertPopup';

interface AlertProviderProps {
  children: React.ReactNode;
}

export default function AlertProvider({ children }: AlertProviderProps) {
  const { isLoggedIn, user } = useAuth();
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    // Only show alerts for logged-in users
    if (isLoggedIn && user?.email) {
      setShowAlerts(true);
    } else {
      setShowAlerts(false);
    }
  }, [isLoggedIn, user]);

  return (
    <>
      {children}
      {showAlerts && user?.email && (
        <AlertPopup userEmail={user.email} />
      )}
    </>
  );
}
