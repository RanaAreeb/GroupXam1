import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

interface PaymentAccess {
  hasAccess: boolean;
  packageType: string | null;
  expiresAt: string | null;
  isLoading: boolean;
}

export function usePaymentAccess() {
  const { user, isLoggedIn } = useAuth();
  const [paymentAccess, setPaymentAccess] = useState<PaymentAccess>({
    hasAccess: false,
    packageType: null,
    expiresAt: null,
    isLoading: true
  });

  useEffect(() => {
    const checkPaymentAccess = async () => {
      if (!isLoggedIn || !user) {
        setPaymentAccess({
          hasAccess: false,
          packageType: null,
          expiresAt: null,
          isLoading: false
        });
        return;
      }

      try {
        // Check if user has IELTS access directly from user object
        const hasIELTSAccess = user.access?.ielts === true;
        const packageType = user.packageType || null;
        const expiresAt = user.accessExpiresAt || null;
        
        setPaymentAccess({
          hasAccess: hasIELTSAccess,
          packageType,
          expiresAt,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to check payment access:', error);
        setPaymentAccess({
          hasAccess: false,
          packageType: null,
          expiresAt: null,
          isLoading: false
        });
      }
    };

    checkPaymentAccess();
  }, [isLoggedIn, user]);

  return paymentAccess;
}
