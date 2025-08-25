"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Review {
  _id?: string;
  name: string;
  initial: string;
  quote: string;
  details: string;
  rating: number;
  createdAt?: string;
}

export default function TestimonialsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [form, setForm] = useState({
    name: "",
    quote: "",
    details: "",
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch reviews from API
  const fetchReviews = async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) {
      const data = await res.json();
      setReviews(data);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);

  // Carousel auto-advance
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(() => {
      setCarouselIdx((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess(true);
        setForm({ name: "", quote: "", details: "", rating: 5 });
        fetchReviews();
        // Show the success message from the API
        if (data.message) {
          alert(data.message);
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit review.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-2xl mx-auto mb-12 animate-fade-in-up relative">
        <div className="absolute top-4 left-4 z-10">
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/70 hover:bg-emerald-100 shadow"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
            </Button>
          </Link>
        </div>
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-8 text-center relative overflow-hidden">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
            What Students Say
          </h1>

          {/* Carousel */}
          <div className="relative h-56 flex items-center justify-center">
            {reviews.length > 0 && (
              <Card className="w-full max-w-md mx-auto bg-white/90 rounded-2xl shadow-xl border-0 transition-all duration-300 animate-fade-in">
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div className="flex mb-2 gap-1 justify-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < reviews[carouselIdx].rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } fill-current`}
                      />
                    ))}
                  </div>
                  <p className="text-lg text-gray-700 mb-4 italic">
                    {reviews[carouselIdx].quote}
                  </p>
                  <div className="flex items-center mt-auto">
                    <div
                      className={`w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 text-base`}
                    >
                      {reviews[carouselIdx].initial}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-base">
                        {reviews[carouselIdx].name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {reviews[carouselIdx].details}
                      </div>
                      {reviews[carouselIdx].createdAt && (
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(
                            reviews[carouselIdx].createdAt
                          ).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Carousel controls */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {reviews.map((_: any, idx: number) => (
                <button
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    carouselIdx === idx ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCarouselIdx(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Submission Form */}
      <div className="w-full max-w-lg mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/40 p-8 animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-emerald-700 text-center">
          Share Your Experience
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-white/90"
          />
          <Textarea
            placeholder="Your Review (what did you love about groupXam?)"
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            required
            className="bg-white/90"
            rows={3}
          />
          <Input
            placeholder="Details (e.g. WAEC 2024, 7 A's, etc)"
            value={form.details}
            onChange={(e) => setForm({ ...form, details: e.target.value })}
            required
            className="bg-white/90"
          />
          {/* 5-star rating */}
          <div className="flex items-center gap-2 justify-center mb-2">
            <span className="text-gray-600 font-medium mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setForm((f) => ({ ...f, rating: Number(star) }))}
                className="focus:outline-none"
                aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    Number(form.rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  fill={Number(form.rating) >= star ? "#facc15" : "none"}
                />
              </button>
            ))}
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg mt-2"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
          {success && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-center animate-fade-in">
              Thank you for your review!
            </div>
          )}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center animate-fade-in">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
