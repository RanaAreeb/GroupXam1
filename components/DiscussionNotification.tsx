"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, X, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

interface DiscussionNotificationProps {
  onClose: () => void;
  discussionTitle?: string;
  authorName?: string;
}

export default function DiscussionNotification({ 
  onClose, 
  discussionTitle, 
  authorName 
}: DiscussionNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Play notification sound (optional)
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore errors if audio file doesn't exist or autoplay is blocked
      });
    } catch (error) {
      // Ignore audio errors
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation to complete
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <Card className="border-0 shadow-none">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    New Discussion Started!
                  </h3>
                  <p className="text-sm text-gray-500">
                    Someone is asking for help
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700">
                    {authorName || "A student"} started a discussion
                  </span>
                </div>
                {discussionTitle && (
                  <p className="text-gray-800 font-medium text-sm">
                    "{discussionTitle}"
                  </p>
                )}
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                Join the conversation and help fellow students with their questions. 
                Your knowledge and experience can make a real difference!
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Link href="/discussions" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Check It Out
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            
            {/* Footer note */}
            <p className="text-xs text-gray-400 text-center mt-3">
              This notification will only show once per day
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
