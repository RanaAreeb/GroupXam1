"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Star } from 'lucide-react';
import TestimonialPopup from './TestimonialPopup';

interface Alert {
  _id: string;
  type: string;
  title: string;
  message: string;
  buttonText: string;
  buttonAction: string;
  showOnce: boolean;
}

interface AlertPopupProps {
  userEmail?: string;
}

export default function AlertPopup({ userEmail }: AlertPopupProps) {
  const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);
  const [showTestimonial, setShowTestimonial] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;
    
    fetchUserAlerts();
  }, [userEmail]);

  const fetchUserAlerts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/alerts?userEmail=${encodeURIComponent(userEmail || '')}`);
      const data = await response.json();
      
      if (data.success && data.alerts && data.alerts.length > 0) {
        // Show the first alert
        setCurrentAlert(data.alerts[0]);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAlertShown = async (alertId: string) => {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          alertId,
          userEmail
        }),
      });
    } catch (error) {
      console.error('Failed to record alert shown:', error);
    }
  };

  const handleButtonClick = () => {
    if (!currentAlert) return;

    switch (currentAlert.buttonAction) {
      case 'open_testimonial':
        setShowTestimonial(true);
        break;
      case 'redirect_to_page':
        // For now, just close the alert
        handleClose();
        break;
      case 'close_alert':
      default:
        handleClose();
        break;
    }
  };

  const handleClose = () => {
    if (currentAlert) {
      handleAlertShown(currentAlert._id);
    }
    setCurrentAlert(null);
  };

  const handleTestimonialClose = () => {
    setShowTestimonial(false);
    handleClose();
  };

  if (isLoading || !currentAlert) {
    return null;
  }

  return (
    <>
      {/* Main Alert Popup */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="absolute right-2 top-2 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-bold text-center pr-8">
              {currentAlert.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 text-center">
              {currentAlert.message}
            </p>
            
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Dismiss
              </Button>
              <Button
                onClick={handleButtonClick}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {currentAlert.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonial Popup */}
      <TestimonialPopup
        isOpen={showTestimonial}
        onClose={handleTestimonialClose}
        onAlertShown={handleAlertShown}
        alertId={currentAlert._id}
      />
    </>
  );
}
