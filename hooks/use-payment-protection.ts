"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./use-auth";
import { useRouter } from "next/navigation";

interface PaymentStatus {
  hasAccess: boolean;
  packageType: "students" | "k12" | "universities" | null;
  expiryDate: string | null;
  isLoading: boolean;
}

export function usePaymentProtection(requiredPackage: "students" | "k12" | "universities") {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({
    hasAccess: false,
    packageType: null,
    expiryDate: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!isLoggedIn || !user) {
        setPaymentStatus({
          hasAccess: false,
          packageType: null,
          expiryDate: null,
          isLoading: false,
        });
        return;
      }

      try {
        const response = await fetch("/api/user/payment-status", {
          credentials: 'include', // Include cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          setPaymentStatus({
            hasAccess: false,
            packageType: null,
            expiryDate: null,
            isLoading: false,
          });
          return;
        }

        const data = await response.json();
        
        // Debug logging
        console.log('Payment protection check:', {
          userEmail: user?.email,
          requiredPackage,
          data,
          hasAccess: data.hasAccess,
          packageType: data.packageType,
          expiryDate: data.expiryDate,
          isExpired: data.expiryDate ? new Date(data.expiryDate) <= new Date() : false
        });
        
        const hasAccess = data.hasAccess && 
                         data.packageType === requiredPackage && 
                         (!data.expiryDate || new Date(data.expiryDate) > new Date());

        setPaymentStatus({
          hasAccess,
          packageType: data.packageType,
          expiryDate: data.expiryDate,
          isLoading: false,
        });

        // If no access, redirect to packages section
        if (!hasAccess) {
          router.push(`/services?package=${requiredPackage}`);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setPaymentStatus({
          hasAccess: false,
          packageType: null,
          expiryDate: null,
          isLoading: false,
        });
        router.push(`/services?package=${requiredPackage}`);
      }
    };

    checkPaymentStatus();
  }, [isLoggedIn, user, requiredPackage, router]);

  return paymentStatus;
}

// Hook for checking if user can access proctoring features
export function useProctoringAccess() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [hasProctoringAccess, setHasProctoringAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkProctoringAccess = async () => {
      if (!isLoggedIn || !user) {
        setHasProctoringAccess(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/user/proctoring-access");
        if (!response.ok) {
          setHasProctoringAccess(false);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        setHasProctoringAccess(data.hasAccess);
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking proctoring access:", error);
        setHasProctoringAccess(false);
        setIsLoading(false);
      }
    };

    checkProctoringAccess();
  }, [isLoggedIn, user]);

  return { hasProctoringAccess, isLoading };
}

