"use client";

import Link from "next/link";
import Head from "next/head";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTestimonialName } from "@/lib/utils";
import {
  Target,
  Clock,
  Brain,
  MessageSquare,
  Star,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Users,
  FileText,
  Code,
  TrendingUp,
  GraduationCap,
  Award,
  Users2,
  Sparkles,
  Calculator,
} from "lucide-react";
import Header from "@/components/ui/header";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useDiscussionNotification } from "@/hooks/use-discussion-notification";
import { useEffect, useRef, useState, useCallback } from "react";
import { MdGroups } from "react-icons/md";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Play, Pause, Globe } from "lucide-react";
import DiscussionNotification from "@/components/DiscussionNotification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Add type for Exam
interface Exam {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  universityName?: string;
  date: string;
  time: string;
}

// Remove hardcoded testimonials and use fetched reviews
interface Review {
  _id?: string;
  name: string;
  initial: string;
  quote: string;
  details: string;
  rating: number;
  createdAt?: string;
}

// Country currency data with competitive pricing
const countryPricing = {
  US: {
    name: "🇺🇸 United States",
    currency: "USD",
    symbol: "$",
    rates: {
      "3month": { monthly: 2, total: 6 },
      "6month": { monthly: 2, total: 12 },
      "12month": { monthly: 2, total: 15.36, discount: 36 },
    },
  },
  NG: {
    name: "🇳🇬 Nigeria",
    currency: "NGN",
    symbol: "₦",
    rates: {
      "3month": { monthly: 3000, total: 9000 },
      "6month": { monthly: 3000, total: 18000 },
      "12month": { monthly: 3000, total: 23000, discount: 36 },
    },
  },
  GB: {
    name: "🇬🇧 United Kingdom",
    currency: "GBP",
    symbol: "£",
    rates: {
      "3month": { monthly: 1.5, total: 4.5 },
      "6month": { monthly: 1.5, total: 9 },
      "12month": { monthly: 1.5, total: 11.52, discount: 36 },
    },
  },
  CA: {
    name: "🇨🇦 Canada",
    currency: "CAD",
    symbol: "C$",
    rates: {
      "3month": { monthly: 2.5, total: 7.5 },
      "6month": { monthly: 2.5, total: 15 },
      "12month": { monthly: 2.5, total: 19.2, discount: 36 },
    },
  },
  GH: {
    name: "🇬🇭 Ghana",
    currency: "GHS",
    symbol: "GH₵",
    rates: {
      "3month": { monthly: 25, total: 75 },
      "6month": { monthly: 25, total: 150 },
      "12month": { monthly: 25, total: 192, discount: 36 },
    },
  },
  SL: {
    name: "🇸🇱 Sierra Leone",
    currency: "SLL",
    symbol: "Le",
    rates: {
      "3month": { monthly: 40000, total: 120000 },
      "6month": { monthly: 40000, total: 240000 },
      "12month": { monthly: 40000, total: 307200, discount: 36 },
    },
  },
  PK: {
    name: "🇵🇰 Pakistan",
    currency: "PKR",
    symbol: "₨",
    rates: {
      "3month": { monthly: 500, total: 1500 },
      "6month": { monthly: 500, total: 3000 },
      "12month": { monthly: 500, total: 3840, discount: 36 },
    },
  },
  IN: {
    name: "🇮🇳 India",
    currency: "INR",
    symbol: "₹",
    rates: {
      "3month": { monthly: 150, total: 450 },
      "6month": { monthly: 150, total: 900 },
      "12month": { monthly: 150, total: 1152, discount: 36 },
    },
  },
  LR: {
    name: "🇱🇷 Liberia",
    currency: "LRD",
    symbol: "L$",
    rates: {
      "3month": { monthly: 350, total: 1050 },
      "6month": { monthly: 350, total: 2100 },
      "12month": { monthly: 350, total: 2688, discount: 36 },
    },
  },
};

export default function HomePage() {
  const { isLoggedIn, loading, logout, user } = useAuth();
  const { showNotification, latestDiscussion, handleCloseNotification } = useDiscussionNotification();

  // Animated counters
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [totalQuizzesCompleted, setTotalQuizzesCompleted] = useState<number | null>(null);
  const [studentRetention, setStudentRetention] = useState<number | null>(95);
  const [totalUsers, setTotalUsers] = useState(0);

  // Live activity feed
  const [activities, setActivities] = useState<string[]>([]);
  const [activityIndex, setActivityIndex] = useState(0);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Intersection Observer for smooth animations
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());


  // Add smooth scrolling behavior
  useEffect(() => {
    // Enable smooth scrolling for the entire page
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Intersection Observer for smooth section animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
            // Add revealed class for CSS animations
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all sections with reveal-on-scroll class
    const sections = document.querySelectorAll('.reveal-on-scroll');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Fetch real activities from API
  const fetchActivities = useCallback(async () => {
    try {
      const response = await fetch('/api/activity');
      const data = await response.json();

      if (data.activities && data.activities.length > 0) {
        // Use only real activities from database
        const realActivities = data.activities.map((activity: any) => activity.message);
        setActivities(realActivities);
        console.log('Loaded real activities:', realActivities);
      } else {
        // If no real activities, the feed will be empty
        setActivities([]);
        console.log('No real activities found, feed will be empty.');
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      setActivities([]); // Clear activities on API failure
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();

    // Poll for new activities every 30 seconds
    const interval = setInterval(fetchActivities, 30000);

    // Cleanup function to clear interval
    return () => {
      clearInterval(interval);
    };
  }, [fetchActivities]);

  useEffect(() => {
    if (activities.length === 0) {
      setActivityIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setActivityIndex((i) => (i + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [activities.length]);

  // Fetch real-time user count
  const fetchUserCount = useCallback(async () => {
    try {
      const response = await fetch('/api/stats/users');
      const data = await response.json();

      if (data.success) {
        setTotalUsers(data.totalUsers);
        console.log('Updated user count:', data.totalUsers);
      }
    } catch (error) {
      console.error('Failed to fetch user count:', error);
    }
  }, []);

  // Fetch real-time question count
  const fetchQuestionCount = useCallback(async () => {
    try {
      const response = await fetch(`/api/stats/questions?t=${Date.now()}`);
      const data = await response.json();

      if (data.success) {
        setQuestionsCount(data.totalQuestions);
        console.log('Updated question count:', data.totalQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch question count:', error);
    }
  }, []);

  // Fetch total quizzes and tests completed
  const fetchTotalQuizzesCompleted = useCallback(async () => {
    try {
      const response = await fetch('/api/stats/quizzes-completed');
      const data = await response.json();

      if (data.success) {
        setTotalQuizzesCompleted(data.totalQuizzesCompleted);
        console.log('Updated total quizzes completed:', data.totalQuizzesCompleted);
      }
    } catch (error) {
      console.error('Failed to fetch total quizzes completed:', error);
    }
  }, []);

  // Student retention is now fixed at 95%
  // const fetchStudentRetention = useCallback(async () => {
  //   try {
  //     const response = await fetch('/api/stats/student-retention');
  //     const data = await response.json();
  //     
  //     if (data.success) {
  //       setStudentRetention(data.studentRetention);
  //       console.log('Updated student retention:', data.studentRetention);
  //     }
  //   } catch (error) {
  //     console.error('Failed to fetch student retention:', error);
  //   }
  // }, []);

  // Fetch all stats on mount and every 2 minutes
  useEffect(() => {
    fetchUserCount();
    fetchQuestionCount();
    fetchTotalQuizzesCompleted();
    // fetchStudentRetention(); // Student retention is now fixed at 95%

    const interval = setInterval(() => {
      fetchUserCount();
      fetchQuestionCount();
      fetchTotalQuizzesCompleted();
      // fetchStudentRetention(); // Student retention is now fixed at 95%
    }, 120000); // 2 minutes instead of 30 seconds

    return () => clearInterval(interval);
  }, [fetchUserCount, fetchQuestionCount, fetchTotalQuizzesCompleted]);


  // Subject tiles with category mapping
  const subjects = [
    {
      name: "Coding",
      icon: <Code className="w-6 h-6" />,
      gradient: "from-indigo-500 to-blue-500",
      category: "coding",
      hasSvg: true,
      svgPath: "/Subjects/coding.svg",
    },
    {
      name: "Biology",
      icon: <Brain className="w-6 h-6" />,
      gradient: "from-green-400 to-emerald-600",
      category: "sciences",
      hasSvg: true,
      svgPath: "/Subjects/Biology.svg",
    },
    {
      name: "Chemistry",
      icon: <BookOpen className="w-6 h-6" />,
      gradient: "from-blue-400 to-cyan-500",
      category: "sciences",
      hasImage: true,
      imagePath: "/Subjects/chemistry.jpg",
    },
    {
      name: "Physics",
      icon: <Clock className="w-6 h-6" />,
      gradient: "from-purple-500 to-indigo-500",
      category: "sciences",
      hasImage: true,
      imagePath: "/Subjects/Physics.jpg",
    },
    {
      name: "English",
      icon: <MessageSquare className="w-6 h-6" />,
      gradient: "from-orange-400 to-pink-500",
      category: "arts-humanities",
      hasImage: true,
      imagePath: "/Subjects/English.jpg",
    },
    {
      name: "Economics",
      icon: <Star className="w-6 h-6" />,
      gradient: "from-yellow-400 to-amber-500",
      category: "economics",
      hasSvg: true,
      svgPath: "/Subjects/economics.svg",
    },
    {
      name: "Geography",
      icon: <ArrowRight className="w-6 h-6" />,
      gradient: "from-teal-400 to-blue-500",
      category: "arts-humanities",
      hasImage: true,
      imagePath: "/Subjects/geography.jpg",
    },
    {
      name: "Civic",
      icon: <Play className="w-6 h-6" />,
      gradient: "from-red-400 to-pink-600",
      category: "arts-humanities",
      hasImage: true,
      imagePath: "/Subjects/civic.jpg",
    },
  ];

  // Exam alert state
  const [upcomingExam, setUpcomingExam] = useState<Exam | null>(null);
  const [regNo, setRegNo] = useState("");
  const [studentName, setStudentName] = useState(user?.name || "");
  const [registerStatus, setRegisterStatus] = useState("");
  const [registerError, setRegisterError] = useState("");

  useEffect(() => {
    // Fetch upcoming exams
    fetch("/api/exams")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((exams: Exam[]) => {
        if (Array.isArray(exams) && exams.length > 0) {
          // Find the soonest exam in the future
          const now = new Date();
          const nextExam = exams
            .filter((e) => {
              const examDate = new Date(`${e.date}T${e.time}`);
              return examDate > now;
            })
            .sort((a, b) => {
              const aDate = new Date(`${a.date}T${a.time}`).getTime();
              const bDate = new Date(`${b.date}T${b.time}`).getTime();
              return aDate - bDate;
            })[0];
          setUpcomingExam(nextExam || null);
        }
      })
      .catch((error) => {
        console.error("Error fetching exams:", error);
        // Don't show error to user, just don't show the alert
      });
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterStatus("");
    setRegisterError("");
    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: upcomingExam?._id || upcomingExam?.id,
          regNo,
          name: studentName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterStatus("Registered successfully!");
        setRegNo("");
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch {
      setRegisterError("Network error. Please try again.");
    }
  };

  // Reviews state for carousel
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // Subscription country selection
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countryPricing>("US");
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async (retryCount = 0) => {
      try {
        const response = await fetch("/api/reviews", {
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (response.ok) {
          const data = await response.json();
          setReviews(Array.isArray(data) ? data : []);
          setIsLoadingReviews(false);
        } else if (retryCount < 3) {
          // Retry on failure
          setTimeout(() => fetchReviews(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          setReviews([]);
          setIsLoadingReviews(false);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
        if (retryCount < 3) {
          // Retry on error
          setTimeout(() => fetchReviews(retryCount + 1), 1000 * (retryCount + 1));
        } else {
          setReviews([]);
          setIsLoadingReviews(false);
        }
      }
    };

    fetchReviews();
  }, []);

  // Detect user's country for pricing
  useEffect(() => {
    if (user?.country && countryPricing[user.country as keyof typeof countryPricing]) {
      setSelectedCountry(user.country as keyof typeof countryPricing);
      setDetectedCountry(user.country);
    } else {
      // Default to US if no country or unsupported country
      setSelectedCountry("US");
    }
  }, [user]);

  // Scroll functionality for feature carousel
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const subjectScrollRef = useRef<HTMLDivElement>(null);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // Subject carousel scroll functions
  const scrollToCard = (direction: 'prev' | 'next' | number) => {
    if (!subjectScrollRef.current) return;

    const container = subjectScrollRef.current;
    const cardWidth = 320; // w-80 = 320px
    const gap = 24; // gap-6 = 24px
    const totalCardWidth = cardWidth + gap;

    if (direction === 'prev') {
      const newIndex = Math.max(0, currentSubjectIndex - 1);
      setCurrentSubjectIndex(newIndex);
      container.scrollTo({
        left: newIndex * totalCardWidth,
        behavior: 'smooth'
      });
    } else if (direction === 'next') {
      const maxIndex = subjects.length - 1;
      const newIndex = Math.min(maxIndex, currentSubjectIndex + 1);
      setCurrentSubjectIndex(newIndex);
      container.scrollTo({
        left: newIndex * totalCardWidth,
        behavior: 'smooth'
      });
    } else if (typeof direction === 'number') {
      setCurrentSubjectIndex(direction);
      container.scrollTo({
        left: direction * totalCardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Track scroll position for mobile dots
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = 320; // Width of each card including gap
        const newIndex = Math.round(scrollLeft / cardWidth);
        setCurrentCardIndex(Math.max(0, Math.min(newIndex, 5))); // 6 cards total (0-5)
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Track scroll position for subject carousel
  useEffect(() => {
    const handleSubjectScroll = () => {
      if (subjectScrollRef.current) {
        const scrollLeft = subjectScrollRef.current.scrollLeft;
        const cardWidth = 320;
        const gap = 24;
        const totalCardWidth = cardWidth + gap;
        const newIndex = Math.round(scrollLeft / totalCardWidth);
        setCurrentSubjectIndex(Math.max(0, Math.min(newIndex, subjects.length - 1)));
      }
    };

    const subjectContainer = subjectScrollRef.current;
    if (subjectContainer) {
      subjectContainer.addEventListener("scroll", handleSubjectScroll);
      return () => subjectContainer.removeEventListener("scroll", handleSubjectScroll);
    }
  }, [subjects.length]);

  // Gallery Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Testimonials Carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialAutoPlaying, setIsTestimonialAutoPlaying] = useState(true);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const testimonialContainerRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const galleryImages = [
    {
      src: "/gallery/image1.webp",
      alt: "GroupXam Educational Platform - Student Success Stories"
    },
    {
      src: "/gallery/image2.webp",
      alt: "GroupXam Learning Environment - Interactive Study Sessions"
    },
    {
      src: "/gallery/image3.webp",
      alt: "GroupXam Academic Excellence - Exam Preparation Tools"
    },

    {
      src: "/gallery/image5.webp",
      alt: "GroupXam Student Community - Collaborative Learning Experience"
    },
    {
      src: "/gallery/image6.webp",
      alt: "GroupXam Achievement Gallery - Academic Success Showcase"
    },
    {
      src: "/gallery/image7.webp",
      alt: "GroupXam Innovation Hub - Advanced Learning Solutions"
    },
    {
      src: "/gallery/image8.webp",
      alt: "GroupXam Global Impact - Worldwide Educational Reach"
    },
    {
      src: "/gallery/image9.webp",
      alt: "GroupXam Future Ready - Next-Generation Learning Platform"
    }
  ];

  // Auto-play gallery slideshow
  useEffect(() => {
    if (isAutoPlaying) {
      slideshowIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
      }, 5000);
    } else {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    }

    return () => {
      if (slideshowIntervalRef.current) {
        clearInterval(slideshowIntervalRef.current);
      }
    };
  }, [isAutoPlaying, galleryImages.length]);

  // Auto-play testimonials carousel
  useEffect(() => {
    if (isTestimonialAutoPlaying && reviews.length > 0) {
      testimonialIntervalRef.current = setInterval(() => {
        setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
      }, 6000);
    } else {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    }

    return () => {
      if (testimonialIntervalRef.current) {
        clearInterval(testimonialIntervalRef.current);
      }
    };
  }, [isTestimonialAutoPlaying, reviews.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Testimonials carousel functions
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % reviews.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  // Enhanced touch handling for testimonials carousel
  const minSwipeDistance = 50;
  const maxDragOffset = 100;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
    setIsUserInteracting(true);
    setDragOffset(0);

    // Pause auto-play when user starts interacting
    if (isTestimonialAutoPlaying) {
      setIsTestimonialAutoPlaying(false);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;

    setTouchEnd(e.targetTouches[0].clientX);
    const currentTouch = e.targetTouches[0].clientX;
    const diff = touchStart - currentTouch;

    // Limit drag offset for visual feedback
    const limitedDiff = Math.max(-maxDragOffset, Math.min(maxDragOffset, diff));
    setDragOffset(limitedDiff);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && reviews.length > 0) {
      nextTestimonial();
    } else if (isRightSwipe && reviews.length > 0) {
      prevTestimonial();
    }

    // Reset states
    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);

    // Resume auto-play after a delay
    setTimeout(() => {
      setIsUserInteracting(false);
      if (reviews.length > 0) {
        setIsTestimonialAutoPlaying(true);
      }
    }, 3000);
  };

  // Mouse drag support for desktop
  const onMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    setIsDragging(true);
    setIsUserInteracting(true);
    setDragOffset(0);

    if (isTestimonialAutoPlaying) {
      setIsTestimonialAutoPlaying(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!touchStart || !isDragging) return;

    const diff = touchStart - e.clientX;
    const limitedDiff = Math.max(-maxDragOffset, Math.min(maxDragOffset, diff));
    setDragOffset(limitedDiff);
  };

  const onMouseUp = () => {
    if (!touchStart || !isDragging) return;

    const distance = touchStart - (touchEnd || 0);
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && reviews.length > 0) {
      nextTestimonial();
    } else if (isRightSwipe && reviews.length > 0) {
      prevTestimonial();
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);

    setTimeout(() => {
      setIsUserInteracting(false);
      if (reviews.length > 0) {
        setIsTestimonialAutoPlaying(true);
      }
    }, 3000);
  };

  const onMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
    }
  };

  // Reveal-on-scroll animations
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const elements = document.querySelectorAll('.reveal-on-scroll');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      elements.forEach((el) => el.classList.add('reveal-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -10% 0px' }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <PageTransition>
      {/* Additional SEO Structured Data for Homepage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "GroupXam - Ace Your Exams with Confidence",
            description: "Master WAEC, WASSCE, and JAMB exams with GroupXam's comprehensive study platform. Access 10,000+ practice questions, interactive flashcards, mock exams, advanced calculator tools, and real-time progress tracking.",
            url: "https://groupxam.com",
            mainEntity: {
              "@type": "EducationalApplication",
              name: "GroupXam",
              description: "Comprehensive exam preparation platform for WAEC, WASSCE, and JAMB exams with advanced calculator tools",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              featureList: [
                "WAEC Exam Preparation",
                "WASSCE Exam Preparation",
                "JAMB Exam Preparation",
                "IELTS Exam Preparation",
                "Advanced Scientific Calculator",
                "Programmer Calculator",
                "Graphing Calculator",
                "Unit Converter",
                "Interactive Practice Tests",
                "Real-time Progress Tracking",
                "Study Groups and Discussions",
                "AI-powered Tutoring",
                "Mobile-friendly Platform"
              ],
              audience: {
                "@type": "Audience",
                audienceType: "Students preparing for WAEC, WASSCE, and JAMB exams worldwide"
              }
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://groupxam.com"
                }
              ]
            },
            potentialAction: {
              "@type": "SearchAction",
              target: "https://groupxam.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />

      {/* Calculator Tool Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "GroupXam Advanced Calculator",
            description: "Multi-mode calculator with scientific functions, programming tools, graphing capabilities, and unit conversion. Perfect for students, engineers, and researchers.",
            url: "https://groupxam.com/calculator",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web Browser",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
            featureList: [
              "Scientific Calculator",
              "Basic Arithmetic Operations",
              "Trigonometric Functions",
              "Logarithmic Functions",
              "Statistical Analysis",
              "Programming Calculator",
              "Base Conversions",
              "Bitwise Operations",
              "Graphing Calculator",
              "Function Plotting",
              "Unit Converter",
              "Length, Weight, Temperature Conversions",
              "Memory Functions",
              "Variable Storage",
              "Calculation History",
              "Keyboard Shortcuts",
              "Export/Import Data",
              "High Precision Calculations"
            ],
            audience: {
              "@type": "Audience",
              audienceType: "Students, Engineers, Researchers, Programmers"
            },
            author: {
              "@type": "Organization",
              name: "GroupXam"
            }
          })
        }}
      />
      <div className="min-h-screen bg-white">
        <Header
          navLinks={
            <>
              {loading ? (
                <span className="text-gray-400 font-medium">...</span>
              ) : isLoggedIn ? (
                <>
                  {/* Admin Dashboard Link - Only visible to specified admin emails */}
                  {(user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com") && (
                    <Link
                      href="/admin/dashboard"
                      className="text-gray-600 hover:text-emerald-600 transition-colors font-medium mr-2"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === "university" && (
                    <Link
                      href="/university/dashboard"
                      className="text-gray-600 hover:text-emerald-600 transition-colors font-medium mr-2"
                    >
                      Dashboard
                    </Link>
                  )}
                </>
              ) : null}
            </>
          }
          onLogout={logout}
        />

        {/* Global smooth scroll + reveal styles */}
        <style>{`
          html { scroll-behavior: smooth; }
          .reveal-on-scroll { opacity: 0; transform: translateY(24px); transition: opacity 600ms ease, transform 600ms ease; will-change: opacity, transform; }
          .reveal-on-scroll.reveal-visible { opacity: 1; transform: none; }
          @media (prefers-reduced-motion: reduce) {
            html { scroll-behavior: auto; }
            .reveal-on-scroll { opacity: 1 !important; transform: none !important; transition: none !important; }
          }
          
          /* Slideshow animations */
          @keyframes slideInFromRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes slideInFromLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          
          @keyframes fadeInUp {
            0% { transform: translateY(30px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          
          .slide-in-right { animation: slideInFromRight 0.7s ease-out; }
          .slide-in-left { animation: slideInFromLeft 0.7s ease-out; }
          .fade-in-up { animation: fadeInUp 0.6s ease-out; }
          
          /* iPhone-specific text optimizations */
          @media (max-width: 428px) {
            h1 span:first-child {
              font-size: 1.875rem !important; /* text-3xl for "Ace Your Exams" - single line */
              line-height: 2.25rem !important;
              white-space: nowrap !important;
            }
            h1 span:last-child {
              font-size: 1.5rem !important; /* text-2xl for "with Confidence" */
              line-height: 2rem !important;
            }
          }
          
          @media (min-width: 429px) and (max-width: 430px) {
            h1 span:first-child {
              font-size: 2.25rem !important; /* text-4xl for "Ace Your Exams" - single line */
              line-height: 2.5rem !important;
              white-space: nowrap !important;
            }
            h1 span:last-child {
              font-size: 1.875rem !important; /* text-3xl for "with Confidence" */
              line-height: 2.25rem !important;
            }
          }
          
          /* Custom gradient animation */
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          /* Beautiful typing cursor animations */
          @keyframes blink {
            0%, 45% { opacity: 1; }
            50%, 95% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes glow {
            0%, 100% { 
              text-shadow: 0 0 5px #10b981, 0 0 10px #10b981, 0 0 15px #10b981;
              filter: brightness(1.2);
            }
            50% { 
              text-shadow: 0 0 10px #10b981, 0 0 20px #10b981, 0 0 30px #10b981;
              filter: brightness(1.5);
            }
          }
          
          @keyframes pulse-glow {
            0%, 100% { 
              transform: scale(1);
              opacity: 1;
            }
            50% { 
              transform: scale(1.1);
              opacity: 0.8;
            }
          }
          
          .typing-cursor {
            animation: blink 1.2s ease-in-out infinite, glow 3s ease-in-out infinite, pulse-glow 2s ease-in-out infinite;
            background: linear-gradient(45deg, #10b981, #059669, #047857);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 900;
            position: relative;
            transition: all 0.2s ease-in-out;
          }
          
          .typing-cursor::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, #10b981, #059669, #047857);
            border-radius: 2px;
            z-index: -1;
            opacity: 0.3;
            animation: pulse-glow 1.5s ease-in-out infinite;
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          
          
          /* Hover effects for slideshow */
          .slideshow-slide {
            transition: transform 0.3s ease, filter 0.3s ease;
          }
          
          /* Hide scrollbar while keeping scroll functionality */
          .scrollbar-hide {
            -ms-overflow-style: none;  /* Internet Explorer 10+ */
            scrollbar-width: none;  /* Firefox */
          }
          .scrollbar-hide::-webkit-scrollbar { 
            display: none;  /* Safari and Chrome */
          }
          
          .slideshow-slide:hover {
            transform: scale(1.02);
            filter: brightness(1.1);
          }
          
          /* Pulse animation for indicators */
          @keyframes pulse-indicator {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
          
          .pulse-indicator {
            animation: pulse-indicator 2s ease-in-out infinite;
          }
          
          /* High quality image rendering */
          .slideshow-slide img {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            image-rendering: high-quality;
            -webkit-backface-visibility: hidden;
            backface-visibility: hidden;
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          /* Ensure sharp rendering on high DPI displays */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .slideshow-slide img {
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          }
          
        `}</style>

        {/* Animated Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden reveal-on-scroll">
          {/* SVG Blobs */}
          <svg
            className="absolute -top-32 -left-32 w-[40vw] h-[40vw] opacity-30 blur-2xl"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#6ee7b7"
              d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
              transform="translate(100 100)"
            />
          </svg>
          <svg
            className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] opacity-20 blur-2xl"
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#a5b4fc"
              d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
              transform="translate(100 100)"
            />
          </svg>

          <div className="container mx-auto text-center relative z-10">
            <Badge className="mb-4 sm:mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium animate-pulse">
              <GraduationCap className="w-4 h-4 mr-1 inline" />
              Trusted by {totalUsers > 0 ? (
                totalUsers.toLocaleString() + '+ Students'
              ) : (
                <span className="flex items-center gap-2">
                  <span></span>
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </span>
              )}
            </Badge>
            <div className="mb-4">
              <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium text-sm">
                Now offering Institutional Testing Services for schools and
                universities!
              </span>
            </div>
            <h1 className="text-3xl iphone-12:text-3xl iphone-14:text-4xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <div className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                <span className="block text-3xl iphone-12:text-3xl iphone-14:text-4xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold whitespace-nowrap">
                  Ace Your Exams
                </span>
                <span className="block text-2xl iphone-12:text-2xl iphone-14:text-3xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold">
                  with Confidence
                </span>
              </div>
            </h1>
            {/* Progress Bar Design */}
            <div className="mb-8 sm:mb-10 max-w-3xl mx-auto px-4">
              <div className="relative flex items-center justify-center space-x-2 sm:space-x-4 text-base sm:text-xl md:text-2xl font-bold text-gray-800">
                <span className="text-blue-600">Smarter</span>
                <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-green-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                <span className="text-blue-600">Prep</span>
                <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-green-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                <span className="text-blue-600">Stronger</span>
                <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-green-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                <span className="text-blue-600">Results</span>
              </div>
            </div>

            {/* Quick Start Widget */}
            <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 max-w-sm sm:max-w-4xl lg:max-w-none mx-auto">
              {/* Exam Buttons Row */}
              <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white text-xs sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold border-0"
                >
                  <Link href={isLoggedIn ? "/exams/ielts" : "/login"}>IELTS</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white text-xs sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold border-0"
                >
                  <Link href={isLoggedIn ? "/exams/waec" : "/login"}>WAEC</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold border-0"
                >
                  <Link href={isLoggedIn ? "/exams/wassce" : "/login"}>WASSCE</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold border-0"
                >
                  <Link href={isLoggedIn ? "/exams/jamb" : "/login"}>JAMB</Link>
                </Button>
              </div>

              {/* Calculator Button - Centered */}
              <div className="flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-sm sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold border-0 flex items-center gap-2"
                  aria-label="Advanced Calculator - Scientific, Programming, Graphing, and Unit Conversion Tools"
                  title="Access our comprehensive calculator with scientific functions, programming tools, graphing capabilities, and unit conversions"
                >
                  <Link href="/calculator" aria-describedby="calculator-description">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    <span>Calculator</span>
                  </Link>
                </Button>
              </div>

              {/* Hidden description for screen readers */}
              <div id="calculator-description" className="sr-only">
                Advanced multi-mode calculator featuring scientific functions, programming tools, graphing capabilities, unit conversions, and high-precision calculations. Perfect for students, engineers, and researchers.
              </div>
            </div>

            {/* Animated Counters */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 mb-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2 animate-bounce">
                  {questionsCount !== null ? (
                    questionsCount.toLocaleString() + '+'
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Practice Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2 animate-bounce">
                  {totalQuizzesCompleted !== null ? (
                    totalQuizzesCompleted.toLocaleString() + '+'
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Quizzes and Tests Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2 animate-bounce">
                  {studentRetention !== null ? (
                    studentRetention + '%'
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Total Student Retention
                </div>
              </div>
            </div>

            {/* Live Activity Feed */}
            {activities.length > 0 && (
              <div className="flex justify-center mb-6">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg flex items-center gap-3 text-sm font-medium text-gray-700 animate-fade-in border border-gray-100">
                  <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">
                    Live
                  </span>
                  {isLoadingActivities ? (
                    <span className="text-gray-500">Loading activities...</span>
                  ) : (
                    <span className="animate-fade-in">
                      {activities[activityIndex]}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Exam Alert */}
            {upcomingExam && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center gap-4 mb-6">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-800">
                    Upcoming Exam: {upcomingExam.title} ({upcomingExam.subject})
                  </div>
                  <div className="text-yellow-700 text-sm">
                    {upcomingExam.universityName && (
                      <span>By {upcomingExam.universityName} &middot; </span>
                    )}
                    {upcomingExam.date} at {upcomingExam.time}
                  </div>
                  {isLoggedIn && user?.role === "student" && (
                    <div className="mt-4 flex justify-center">
                      <Link href="/services">
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Register
                        </Button>
                      </Link>
                    </div>
                  )}
                  {!isLoggedIn && (
                    <div className="mt-2 text-yellow-700 text-xs">
                      <Link href="/login" className="underline text-yellow-800">
                        Sign in
                      </Link>{" "}
                      to register for this exam.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Modern Gallery Slideshow */}
        <section className="py-8 sm:py-12 px-4 bg-gradient-to-br from-gray-50 to-blue-50 reveal-on-scroll">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
                <BookOpen className="w-4 h-4 mr-1 inline" />
                Real Field Work & School Partnerships
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">
                GroupXam in <span className="text-emerald-600">Action</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover how we're working directly with schools and students to transform education through innovative learning solutions
              </p>
            </div>

            {/* Slideshow Container */}
            <div className="relative max-w-4xl mx-auto px-2 sm:px-4">
              {/* Main Slideshow */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl bg-white">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {galleryImages.map((image, index) => (
                    <div key={`gallery-slide-${index}-${image}`} className="w-full flex-shrink-0 relative slideshow-slide">
                      <div className={`relative h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[500px] ${index === 3 ? 'bg-transparent' : 'bg-gray-100'}`}>
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className={`${index === 3 ? 'object-contain' : 'object-cover'}`}
                          priority={index === 0}
                          quality={100}
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, (max-width: 1280px) 100vw, 100vw"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2 sm:left-4 top-[55%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2 sm:right-4 top-[55%] -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" />
                </button>

                {/* Play/Pause Button */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                  aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isAutoPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  )}
                </button>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-4 sm:mt-6 space-x-2 sm:space-x-3">
                {galleryImages.map((image, index) => (
                  <button
                    key={`gallery-dot-${index}-${image}`}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                      ? "bg-emerald-500 scale-125 shadow-lg pulse-indicator"
                      : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Thumbnail Navigation - Show only 3 with fade effect */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-5 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide">
                {galleryImages.map((image, index) => {
                  // Calculate which 3 thumbnails to show (current slide and 1 on each side)
                  const startIndex = Math.max(0, Math.min(currentSlide - 1, galleryImages.length - 3));
                  const endIndex = Math.min(startIndex + 3, galleryImages.length);
                  const isVisible = index >= startIndex && index < endIndex;
                  const isActive = index === currentSlide;

                  return (
                    <button
                      key={`gallery-thumb-${index}-${image}`}
                      onClick={() => goToSlide(index)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 transform-gpu ${isVisible
                        ? isActive
                          ? "ring-2 sm:ring-4 ring-emerald-500 scale-105 shadow-lg opacity-100"
                          : "hover:scale-105 shadow-md opacity-100"
                        : "opacity-30 scale-95"
                        }`}
                      style={{ transformOrigin: 'center center' }}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className={`${index === 3 ? 'object-contain' : 'object-cover'}`}
                        quality={95}
                        sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                      />
                      <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? "bg-emerald-500/20" : isVisible ? "bg-black/0 hover:bg-black/10" : "bg-black/20"
                        }`}></div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Subject Tiles */}
        <section className="py-10 sm:py-16 px-4 sm:px-6 bg-white reveal-on-scroll">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2">
                Explore Subjects
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Jump into practice questions and resources for your favorite
                subjects
              </p>
            </div>
            {/* Mobile: Carousel Layout */}
            <div className="md:hidden">
              <div
                ref={subjectScrollRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-2 sm:px-4"
                style={{
                  scrollbarWidth: "none",
                  scrollSnapType: "x mandatory",
                  scrollPaddingLeft: "0.5rem",
                  scrollPaddingRight: "0.5rem"
                }}
              >
                {subjects.map((subject) => (
                  <Link
                    key={`mobile-${subject.name}`}
                    href={isLoggedIn ? `/quiz?category=${subject.category}` : "/login"}
                    className="group flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden border border-gray-100 hover:border-emerald-200 hover:-translate-y-2 snap-start"
                  >
                    {subject.hasSvg ? (
                      <>
                        {/* SVG Image Container - Featured at Top */}
                        <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
                          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent z-10"></div>
                          <img
                            src={subject.svgPath}
                            alt={subject.name}
                            className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-700"
                            style={{
                              imageRendering: 'crisp-edges',
                              backfaceVisibility: 'hidden',
                              transform: 'translateZ(0)'
                            }}
                            width="320"
                            height="160"
                          />
                          {/* Floating Badge */}
                          <div className="absolute top-2 right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                            New
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                              {subject.name}
                            </h3>
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                              <svg className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>

                          <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                            Practice questions and improve your skills
                          </p>

                          {/* Stats/Features */}
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                              <span>Quick Practice</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                              <span>Progress Track</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : subject.hasImage ? (
                      <>
                        {/* Image Container - Featured at Top */}
                        <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-500/10 to-transparent z-10"></div>
                          <img
                            src={subject.imagePath}
                            alt={subject.name}
                            className={`w-full h-full ${subject.name === 'Civic' ? 'object-contain' : 'object-cover'} object-center transform group-hover:scale-110 transition-transform duration-700`}
                            style={{
                              imageRendering: 'auto',
                              backfaceVisibility: 'hidden',
                              transform: 'translateZ(0)',
                              willChange: 'transform'
                            }}
                            width="320"
                            height="160"
                          />
                          {/* Floating Badge */}
                          <div className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                            Practice
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                              {subject.name}
                            </h3>
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>

                          <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                            Start practicing with interactive questions and track your progress
                          </p>

                          {/* Stats/Features */}
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              <span>Quick Practice</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              <span>Progress Track</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Gradient Visual - Featured at Top */}
                        <div className={`relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-br ${subject.gradient}`}>
                          {/* Animated Background Pattern */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                            <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                          </div>

                          {/* Icon Illustration */}
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50">
                              <div className="text-2xl">
                                {subject.icon}
                              </div>
                            </div>
                          </div>

                          {/* Floating Badge */}
                          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                            Practice
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm sm:text-base font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                              {subject.name}
                            </h3>
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                              <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>

                          <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                            Start practicing with interactive questions and track your progress
                          </p>

                          {/* Stats/Features */}
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              <span>Quick Practice</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                              <span>Progress Track</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </Link>
                ))}
              </div>


              {/* Mobile Dot Indicators */}
              <div className="flex justify-center gap-2 mt-4 md:hidden">
                {subjects.map((subject, index) => (
                  <button
                    key={`subject-dot-${subject.name}-${index}`}
                    onClick={() => scrollToCard(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSubjectIndex === index
                      ? 'bg-emerald-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    aria-label={`Go to subject ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={isLoggedIn ? `/quiz?category=${subject.category}` : "/login"}
                  className="group flex-shrink-0 w-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden border border-gray-100 hover:border-emerald-200 hover:-translate-y-2"
                >
                  {subject.hasSvg ? (
                    <>
                      {/* SVG Image Container - Featured at Top */}
                      <div className="relative h-32 sm:h-36 md:h-40 w-full overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-50">
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent z-10"></div>
                        <img
                          src={subject.svgPath}
                          alt={subject.name}
                          className="w-full h-full object-contain object-center transform group-hover:scale-105 transition-transform duration-700"
                          style={{
                            imageRendering: 'crisp-edges',
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)'
                          }}
                          width="320"
                          height="160"
                        />
                        {/* Floating Badge */}
                        <div className="absolute top-2 right-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                          New
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            {subject.name}
                          </h3>
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                            <svg className="w-4 h-4 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                          Practice questions and improve your skills
                        </p>

                        {/* Stats/Features */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                            <span>Quick Practice</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                            <span>Progress Track</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : subject.hasImage ? (
                    <>
                      {/* Image Container - Featured at Top */}
                      <div className="relative h-32 sm:h-36 md:h-40 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-500/10 to-transparent z-10"></div>
                        <img
                          src={subject.imagePath}
                          alt={subject.name}
                          className={`w-full h-full ${subject.name === 'Civic' ? 'object-contain' : 'object-cover'} object-center transform group-hover:scale-110 transition-transform duration-700`}
                          style={{
                            imageRendering: 'auto',
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(0)',
                            willChange: 'transform'
                          }}
                          width="320"
                          height="160"
                        />
                        {/* Floating Badge */}
                        <div className="absolute top-2 right-2 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                          Practice
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                            {subject.name}
                          </h3>
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                          Start practicing with interactive questions and track your progress
                        </p>

                        {/* Stats/Features */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>Quick Practice</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>Progress Track</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Gradient Visual - Featured at Top */}
                      <div className={`relative h-28 sm:h-32 md:h-36 w-full overflow-hidden bg-gradient-to-br ${subject.gradient}`}>
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-20">
                          <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-full blur-2xl"></div>
                          <div className="absolute bottom-4 right-4 w-20 h-20 bg-white rounded-full blur-2xl"></div>
                        </div>

                        {/* Icon Illustration */}
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl flex items-center justify-center border-4 border-white/50">
                            <div className="text-2xl">
                              {subject.icon}
                            </div>
                          </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-gray-600 px-3 py-1 rounded-full text-xs font-semibold shadow-lg z-20">
                          Practice
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                            {subject.name}
                          </h3>
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                            <svg className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>

                        <p className="text-gray-600 text-xs leading-relaxed mb-2 sm:mb-3">
                          Start practicing with interactive questions and track your progress
                        </p>

                        {/* Stats/Features */}
                        <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>Quick Practice</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                            <span>Progress Track</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Main Features - Quizlet Style */}
        <section id="features" className="py-12 sm:py-20 px-4 bg-white reveal-on-scroll">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
                Everything You Need to{" "}
                <span className="text-emerald-600">Excel with GroupXam</span>
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                GroupXam's comprehensive tools designed to help you master every aspect of
                your WAEC/WASSCE/JAMB/IELTS preparation. Join thousands of students who trust GroupXam for exam success.
              </p>
            </div>

            <div className="relative">
              {/* Cards container - Enhanced padding for proper visibility */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-2 sm:px-4"
                style={{
                  scrollbarWidth: "none",
                  scrollSnapType: "x mandatory",
                  scrollPaddingLeft: "0.5rem",
                  scrollPaddingRight: "0.5rem"
                }}
              >
                {/* Quizzes Card - WITH IMAGE */}
                <Link
                  href={isLoggedIn ? "/quiz" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-emerald-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-green-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/quiz.webp"
                      alt="Interactive Quizzes"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      width="384"
                      height="256"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      Popular
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">
                        Quizzes
                      </h3>
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                        <svg className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Test your knowledge with interactive quizzes across all subjects. Track your progress and master every topic.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>1000+ Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Instant Results</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Exam Prep Card */}
                <Link
                  href={isLoggedIn ? "/exams" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-blue-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/exam.webp"
                      alt="Exam Preparation"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      Timed
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        Exam Prep
                      </h3>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <svg className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Practice with timed mock exams that simulate real test conditions. Get exam-ready with confidence.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Real Exam Format</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Detailed Reports</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Calculator Card - THIRD POSITION */}
                <Link
                  href={isLoggedIn ? "/calculator" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-cyan-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-cyan-50 to-blue-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/cal1.webp"
                      alt="Advanced Calculator"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      width="384"
                      height="256"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      New
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                        Calculator
                      </h3>
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                        <svg className="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Advanced scientific calculator with graphing capabilities. Solve complex equations and visualize mathematical concepts.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Scientific Functions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Graphing Tools</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Whiteboard Card */}
                <Link
                  href={isLoggedIn ? "/whiteboard" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-orange-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/whiteboard.webp"
                      alt="Interactive Whiteboard"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        willChange: 'transform',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      width="384"
                      height="256"
                    />
                    {/* Floating Badge - Optimized for sharpness */}
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20"
                      style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)'
                      }}>
                      Interactive
                    </div>
                  </div>

                  {/* Content Section - Optimized for sharpness */}
                  <div className="p-6" style={{
                    textRendering: 'optimizeLegibility',
                    WebkitFontSmoothing: 'antialiased',
                    MozOsxFontSmoothing: 'grayscale'
                  }}>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors"
                        style={{
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>
                        Whiteboard
                      </h3>
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors">
                        <svg className="w-5 h-5 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4"
                      style={{
                        textRendering: 'optimizeLegibility',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}>
                      Draw and solve problems digitally with our intuitive whiteboard. Perfect for visual learners.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span style={{
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>Free Drawing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span style={{
                          textRendering: 'optimizeLegibility',
                          WebkitFontSmoothing: 'antialiased',
                          MozOsxFontSmoothing: 'grayscale'
                        }}>Save & Share</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Flashcards Card */}
                <Link
                  href={isLoggedIn ? "/flashcards" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-purple-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-purple-50 to-fuchsia-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/flashcard.webp"
                      alt="Smart Flashcards"
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      style={{
                        imageRendering: 'crisp-edges',
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(0)',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      width="384"
                      height="256"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      Smart Learning
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        Flashcards
                      </h3>
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                        <svg className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Memorize concepts with smart flashcards. Master any subject using spaced repetition techniques.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Flip & Learn</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Track Progress</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Study Groups Card */}
                <Link
                  href={isLoggedIn ? "/discussions" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-cyan-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-cyan-50 to-teal-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/study.webp"
                      alt="Study Groups"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      width="384"
                      height="219"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-cyan-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      Collaborative
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">
                        Study Groups
                      </h3>
                      <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center group-hover:bg-cyan-500 transition-colors">
                        <svg className="w-5 h-5 text-cyan-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Connect with peers for collaborative learning. Share knowledge and get help when you need it.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Ask Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        <span>Share Tips</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* ProctorIT Card */}
                <Link
                  href={isLoggedIn ? "/services" : "/login"}
                  className="group flex-shrink-0 w-72 sm:w-80 md:w-96 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer relative overflow-hidden snap-start border border-gray-100 hover:border-red-200 hover:-translate-y-2"
                >
                  {/* Image Container - Featured at Top */}
                  <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-red-50 to-pink-50">
                    <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent z-10"></div>
                    <img
                      src="/features/image.png
                      "
                      alt="Professional Proctoring"
                      className="w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-700"
                      width="384"
                      height="256"
                    />
                    {/* Floating Badge */}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg z-20">
                      Professional
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
                        ProctorIT
                      </h3>
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-500 transition-colors">
                        <svg className="w-5 h-5 text-red-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      Professional exam proctoring services for secure and reliable test administration.
                    </p>

                    {/* Stats/Features */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>Secure Testing</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span>24/7 Support</span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Spacer to ensure last card is fully visible */}
                <div className="flex-shrink-0 w-4 sm:w-8"></div>
              </div>

              {/* Navigation arrows - Below cards for desktop */}
              <div className="hidden sm:flex justify-center gap-4 mt-6">
                <button
                  onClick={scrollLeft}
                  className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg hover:shadow-xl items-center justify-center transition-all duration-300 flex group"
                >
                  <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={scrollRight}
                  className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg hover:shadow-xl items-center justify-center transition-all duration-300 flex group"
                >
                  <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                </button>
              </div>

              {/* Mobile navigation dots - Only visible on mobile */}
              <div className="flex justify-center mt-6 sm:hidden">
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={`card-indicator-${index}`}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${currentCardIndex === index
                        ? "bg-emerald-500"
                        : "bg-gray-300"
                        }`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how-it-works"
          className="py-12 sm:py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50 reveal-on-scroll"
        >
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
              <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4">
                How <span className="text-emerald-600">groupXam</span> Works
              </h2>
              <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mx-auto">
                Simple steps to transform your WAEC preparation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-xl">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    1
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
                  Sign Up & Choose Subjects
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-2">
                  Create your account and select the subjects you want to focus
                  on for your WAEC preparation
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-xl">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    2
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
                  Practice & Learn
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-2">
                  Take quizzes, study with flashcards, and participate in timed
                  exams to build your knowledge
                </p>
              </div>

              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 md:mb-6 shadow-xl">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                    3
                  </span>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 px-2">
                  Track Progress & Excel
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-2">
                  Monitor your improvement, identify weak areas, and achieve
                  your target grades
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Carousel */}
        <section className="py-12 sm:py-16 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 reveal-on-scroll">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-10 sm:mb-12">
              <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
                <Award className="w-4 h-4 mr-1 inline" />
                Student Success Stories
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                <span className="text-emerald-600">Testimonials</span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto">
                Real feedback from students who've achieved their academic goals with groupXam
              </p>
            </div>

            {/* Testimonials Carousel */}
            {isLoadingReviews ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading testimonials...</h3>
                <p className="text-gray-600 mb-4">We're fetching the latest student success stories!</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="relative max-w-3xl mx-auto">
                {/* Main Carousel */}
                <div
                  ref={testimonialContainerRef}
                  className={`relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl sm:shadow-2xl cursor-grab select-none ${isDragging ? 'cursor-grabbing' : ''}`}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                  onMouseMove={onMouseMove}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseLeave}
                >
                  <div
                    className={`flex transition-transform duration-700 ease-in-out ${isDragging ? 'transition-none' : ''}`}
                    style={{
                      transform: `translateX(calc(-${currentTestimonial * 100}% + ${dragOffset}px))`,
                      filter: isDragging ? 'brightness(0.95)' : 'brightness(1)'
                    }}
                  >
                    {reviews.map((review, index) => (
                      <div key={review._id || `review-${index}-${review.name || 'anonymous'}`} className="w-full flex-shrink-0">
                        <div className="p-6 sm:p-8 md:p-10 text-center">
                          {/* Quote Icon */}
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 2C5.477 2 2 5.477 2 10c0 1.5.375 2.9 1.031 4.125L2 18l3.875-1.031C7.1 17.625 8.5 18 10 18c4.523 0 8-3.477 8-8s-3.477-8-8-8zm0 14c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z" clipRule="evenodd" />
                              <path d="M7 9a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h2a1 1 0 110 2H8a1 1 0 01-1-1z" />
                            </svg>
                          </div>

                          {/* Rating Stars */}
                          <div className="flex justify-center mb-6">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 sm:w-6 sm:h-6 mx-0.5 sm:mx-1 ${i < review.rating ? "text-yellow-400" : "text-gray-200"
                                  } fill-current transition-colors duration-300`}
                              />
                            ))}
                          </div>

                          {/* Quote */}
                          <blockquote className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 leading-relaxed italic max-w-2xl mx-auto">
                            "{review.quote}"
                          </blockquote>

                          {/* Author */}
                          <div className="flex items-center justify-center">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl mr-3 sm:mr-4 shadow-lg">
                              {review.initial}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-800 text-base sm:text-lg">
                                {formatTestimonialName(review.name)}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-500">
                                {review.details}
                              </div>
                              {review.createdAt && (
                                <div className="text-xs text-gray-400 mt-1">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={prevTestimonial}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 group-hover:text-emerald-600 transition-colors" />
                  </button>

                  {/* Swipe Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1 sm:hidden">
                    <div className="flex items-center gap-1 text-white text-xs">
                      <ChevronLeft className="w-3 h-3" />
                      <span>Swipe</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {reviews.map((review, index) => (
                    <button
                      key={review._id || `review-dot-${index}-${review.name || 'anonymous'}`}
                      onClick={() => {
                        goToTestimonial(index);
                        setIsUserInteracting(true);
                        setTimeout(() => setIsUserInteracting(false), 3000);
                      }}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentTestimonial
                        ? "bg-emerald-500 scale-125 shadow-lg pulse-indicator"
                        : "bg-gray-300 hover:bg-emerald-400 hover:scale-110"
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>

              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No testimonials yet</h3>
                <p className="text-gray-600 mb-4">Be the first to share your success story!</p>
              </div>
            )}

            {/* Call to Action */}
            <div className="text-center mt-8 sm:mt-10">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/testimonials">
                  Share Testimonials
                </Link>
              </Button>
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 relative overflow-hidden reveal-on-scroll">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto text-center relative">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              Ready to Ace Your Exams with GroupXam?
            </h2>
            <p className="text-base sm:text-xl text-emerald-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Join our community of learners who have transformed their grades with
              GroupXam. Start your journey to academic excellence with GroupXam's proven exam preparation platform today.
            </p>

            {/* Professional Animated Elements */}
            <div className="flex justify-center space-x-8 mb-8">
              <div className="w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                <BookOpen className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                <Target className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="w-16 h-16 bg-white/10 rounded-xl backdrop-blur-sm flex items-center justify-center group hover:bg-white/20 transition-all duration-300">
                <TrendingUp className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>

            {/* Subtle Background Elements */}
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4 reveal-on-scroll">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
              <div>
                {/* groupXam Social Section */}
                <div className="mb-6">
                  <h3
                    className="text-xl font-bold text-white mb-4 tracking-wide"
                    style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                  >
                    groupXam Social
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="https://www.facebook.com/share/16vS1ui8oA/?mibextid=wwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <FaFacebook className="w-4 h-4 text-gray-800" />
                      </div>
                      <span
                        className="font-semibold underline"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                      >
                        Facebook
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/group_xam?igsh=MW45dHZqbnNrMTk1MQ%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <FaInstagram className="w-4 h-4 text-gray-800" />
                      </div>
                      <span
                        className="font-semibold underline"
                        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}
                      >
                        Instagram
                      </span>
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                  Learning Tools & Products
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                  <li>
                    <Link
                      href={isLoggedIn ? "/quiz" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      Quizzes
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={isLoggedIn ? "/exams" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      Exam prep
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={isLoggedIn ? "/flashcards" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      Flashcards
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={isLoggedIn ? "/discussions" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      Study Groups
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={isLoggedIn ? "/services" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      proctorIT
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={isLoggedIn ? "/whiteboard" : "/login"}
                      className="hover:text-white transition-colors"
                    >
                      Whiteboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculator"
                      className="hover:text-white transition-colors"
                    >
                      Calculator
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="https://efggames.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      EFG Games
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                  Support
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                  <li>
                    <Link
                      href="/contact"
                      className="hover:text-white transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="hover:text-white transition-colors"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                  Company
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                  <li>
                    <Link
                      href="/about"
                      className="hover:text-white transition-colors"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy-policy"
                      className="hover:text-white transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms-of-use"
                      className="hover:text-white transition-colors"
                    >
                      Terms of Use
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
              <p>
                &copy; 2025 groupXam. All rights reserved. Made with ❤️ for
                students.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Discussion Notification Popup */}
      {showNotification && (
        <DiscussionNotification
          onClose={handleCloseNotification}
          discussionTitle={latestDiscussion?.title}
          authorName={latestDiscussion?.author}
        />
      )}
    </PageTransition>
  );
}
