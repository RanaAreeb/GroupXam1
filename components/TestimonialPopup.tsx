"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestimonialPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertShown?: (alertId: string) => void;
  alertId?: string;
}

export default function TestimonialPopup({ isOpen, onClose, onAlertShown, alertId }: TestimonialPopupProps) {
  const [formData, setFormData] = useState({
    name: '',
    quote: '',
    details: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quote || !formData.details || formData.rating === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and provide a rating.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          quote: formData.quote,
          details: formData.details,
          rating: formData.rating
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Review submitted successfully! It will be reviewed by our team before being published.",
          variant: "default",
        });
        
        // Reset form
        setFormData({
          name: '',
          quote: '',
          details: '',
          rating: 0
        });
        
        onClose();
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to submit testimonial. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Record that this alert was shown
    if (alertId && onAlertShown) {
      onAlertShown(alertId);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
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
            Share Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Your name"
              />
            </div>

            <div>
              <Label>Rating *</Label>
              <div className="flex gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({...formData, rating: star})}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= formData.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.rating} star{formData.rating !== 1 ? 's' : ''} - {
                    formData.rating === 1 ? 'Poor' :
                    formData.rating === 2 ? 'Fair' :
                    formData.rating === 3 ? 'Good' :
                    formData.rating === 4 ? 'Very Good' : 'Excellent'
                  }
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="quote">Testimonial Quote *</Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => setFormData({...formData, quote: e.target.value})}
                required
                placeholder="Share your experience in a few words..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="details">Additional Details *</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                required
                placeholder="Tell us more about your experience..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Testimonial'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
