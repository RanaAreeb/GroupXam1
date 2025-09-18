"use client";

import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import Header from "@/components/ui/header";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef, useState, useCallback } from "react";
import { MdGroups } from "react-icons/md";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

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

export default function HomePage() {
  const { isLoggedIn, loading, logout, user } = useAuth();

  // Animated counters
  const [questionsCount, setQuestionsCount] = useState<number | null>(null);
  const [successRate, setSuccessRate] = useState<number | null>(null);
  const [supportHours, setSupportHours] = useState(0);
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

  // Fetch real-time success rate
  const fetchSuccessRate = useCallback(async () => {
    try {
      const response = await fetch('/api/stats/success-rate');
      const data = await response.json();
      
      if (data.success) {
        setSuccessRate(data.successRate);
        console.log('Updated success rate:', data.successRate);
      }
    } catch (error) {
      console.error('Failed to fetch success rate:', error);
    }
  }, []);

  // Fetch all stats on mount and every 2 minutes
  useEffect(() => {
    fetchUserCount();
    fetchQuestionCount();
    fetchSuccessRate();
    
    const interval = setInterval(() => {
      fetchUserCount();
      fetchQuestionCount();
      fetchSuccessRate();
    }, 120000); // 2 minutes instead of 30 seconds
    
    return () => clearInterval(interval);
  }, [fetchUserCount, fetchQuestionCount, fetchSuccessRate]);

  // Animated counters effect (only for support hours now)
  useEffect(() => {
    let h = 0;
    const interval = setInterval(() => {
      if (h < 24) setSupportHours((prev) => Math.min(prev + 1, 24));
      h += 1;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Subject tiles with category mapping
  const subjects = [
    {
      name: "Coding",
      icon: <Code className="w-6 h-6" />,
      gradient: "from-indigo-500 to-blue-500",
      category: "coding",
    },
    {
      name: "Biology",
      icon: <Brain className="w-6 h-6" />,
      gradient: "from-green-400 to-emerald-600",
      category: "sciences",
    },
    {
      name: "Chemistry",
      icon: <BookOpen className="w-6 h-6" />,
      gradient: "from-blue-400 to-cyan-500",
      category: "sciences",
    },
    {
      name: "Physics",
      icon: <Clock className="w-6 h-6" />,
      gradient: "from-purple-500 to-indigo-500",
      category: "sciences",
    },
    {
      name: "English",
      icon: <MessageSquare className="w-6 h-6" />,
      gradient: "from-orange-400 to-pink-500",
      category: "arts-humanities",
    },
    {
      name: "Economics",
      icon: <Star className="w-6 h-6" />,
      gradient: "from-yellow-400 to-amber-500",
      category: "economics",
    },
    {
      name: "Geography",
      icon: <ArrowRight className="w-6 h-6" />,
      gradient: "from-teal-400 to-blue-500",
      category: "arts-humanities",
    },
    {
      name: "Civic",
      icon: <Play className="w-6 h-6" />,
      gradient: "from-red-400 to-pink-600",
      category: "arts-humanities",
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
  
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error('Failed to fetch reviews:', error);
        setReviews([]);
      })
      .finally(() => {
        setIsLoadingReviews(false);
      });
  }, []);

  // Scroll functionality for feature carousel
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

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

  // Gallery Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slideshowIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Testimonials Carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isTestimonialAutoPlaying, setIsTestimonialAutoPlaying] = useState(true);
  const testimonialIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const galleryImages = [
    {
      src: "/gallery/image1.png",
      alt: "groupXam School Partnership"
    },
    {
      src: "/gallery/image2.png", 
      alt: "groupXam Field Work"
    },
    {
      src: "/gallery/image3.png",
      alt: "groupXam Educational Impact"
    }
    ,
    {
      src: "/gallery/image4.png",
      alt: "groupXam Educational Impact"
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
          
          /* Custom gradient animation */
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          
          /* Hover effects for slideshow */
          .slideshow-slide {
            transition: transform 0.3s ease, filter 0.3s ease;
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
                    <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-1 bg-emerald-600 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
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
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Ace Your Exams
              </span>
              <br />
              <span className="text-gray-800">with Confidence</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            Smarter Prep. Stronger Results. With 24/7 access to educational tools
            </p>

            {/* Quick Start Widget */}
            <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center mb-8 sm:mb-12 px-4 max-w-sm sm:max-w-none mx-auto">
              <Button
                asChild
                size="lg"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg"
              >
                <Link href={isLoggedIn ? "/exams/ielts" : "/login"}>IELTS</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg"
              >
                <Link href={isLoggedIn ? "/exams/waec" : "/login"}>WAEC</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg"
              >
                <Link href={isLoggedIn ? "/exams/wassce" : "/login"}>WASSCE</Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm sm:text-lg px-4 sm:px-8 py-3 sm:py-4 shadow-lg"
              >
                <Link href={isLoggedIn ? "/exams/jamb" : "/login"}>JAMB</Link>
              </Button>
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
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Practice Questions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2 animate-bounce">
                  {successRate !== null ? (
                    successRate + '%'
                  ) : (
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Success Rate
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2 animate-bounce">
                  {supportHours}/7
                </div>
                <div className="text-xs sm:text-sm text-gray-600">
                  Study Support
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
                groupXam in <span className="text-emerald-600">Action</span>
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
                    <div key={index} className="w-full flex-shrink-0 relative slideshow-slide">
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
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? "bg-emerald-500 scale-125 shadow-lg pulse-indicator"
                        : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-5 overflow-x-auto pb-6 pt-2 px-4">
                {galleryImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden transition-all duration-300 flex-shrink-0 transform-gpu ${
                      index === currentSlide
                        ? "ring-2 sm:ring-4 ring-emerald-500 scale-105 shadow-lg"
                        : "hover:scale-105 shadow-md"
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
                    <div className={`absolute inset-0 transition-opacity duration-300 ${
                      index === currentSlide ? "bg-emerald-500/20" : "bg-black/0 hover:bg-black/10"
                    }`}></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Subject Tiles */}
        <section className="py-10 sm:py-16 px-4 bg-white reveal-on-scroll">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {subjects.map((subject) => (
                <Link
                  key={subject.name}
                  href={isLoggedIn ? `/quiz?category=${subject.category}` : "/login"}
                  className="group block rounded-2xl bg-white hover:shadow-xl shadow-md p-6 text-center transition-all duration-300 border border-gray-100 hover:border-transparent relative overflow-hidden"
                  style={{ position: "relative" }}
                >
                  <div className={`flex justify-center mb-3`}>
                    <span
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${subject.gradient} text-white text-2xl shadow-lg group-hover:scale-110 transition-transform border-4 border-white`}
                    >
                      {subject.icon}
                    </span>
                  </div>
                  <div className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700">
                    {subject.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Start Practicing
                  </div>
                  {/* Decorative blob */}
                  <span
                    className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-2xl bg-gradient-to-br ${subject.gradient}`}
                  ></span>
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
                <span className="text-emerald-600">Excel</span>
              </h2>
              <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
                Comprehensive tools designed to help you master every aspect of
                your WAEC/WASSCE/JAMB/IELTS preparation
              </p>
            </div>

            <div className="relative">
              {/* Navigation arrows - Hidden on mobile, visible on larger screens */}
              <button
                onClick={scrollLeft}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center hover:shadow-lg transition-shadow"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={scrollRight}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-md items-center justify-center hover:shadow-lg transition-shadow"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Cards container - Responsive padding */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto pb-4 px-4 sm:px-16"
                style={{ scrollbarWidth: "none" }}
              >
                {/* Quizzes Card */}
                <Link
                  href={isLoggedIn ? "/quiz" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-green-400 to-emerald-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Quizzes
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <Target className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Test knowledge with interactive quizzes
                    </p>
                  </div>
                </Link>

                {/* Exam Prep Card */}
                <Link
                  href={isLoggedIn ? "/exams" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-blue-400 to-indigo-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Exam Prep
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Practice with timed mock exams
                    </p>
                  </div>
                </Link>

                {/* Whiteboard Card */}
                <Link
                  href={isLoggedIn ? "/whiteboard" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-orange-400 to-amber-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Whiteboard
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Draw and solve problems digitally
                    </p>
                  </div>
                </Link>

                {/* Flashcards Card */}
                <Link
                  href={isLoggedIn ? "/flashcards" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-purple-400 to-fuchsia-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Flashcards
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Memorize concepts with smart cards
                    </p>
                  </div>
                </Link>

                {/* Study Groups Card */}
                <Link
                  href={isLoggedIn ? "/discussions" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-cyan-400 to-teal-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      Study Groups
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Connect with peers for help
                    </p>
                  </div>
                </Link>

                {/* ProctorIT Card */}
                <Link
                  href={isLoggedIn ? "/services" : "/login"}
                  className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative"
                >
                  <div className="bg-gradient-to-r from-red-400 to-pink-500 px-4 sm:px-6 py-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      ProctorIT
                    </h3>
                  </div>
                  <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 text-center leading-relaxed">
                      Professional exam proctoring services
                    </p>
                  </div>
                </Link>

                
              </div>

              {/* Mobile navigation dots - Only visible on mobile */}
              <div className="flex justify-center mt-6 sm:hidden">
                <div className="flex space-x-2">
                  {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        currentCardIndex === index
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
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-xl sm:shadow-2xl">
                  <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
                  >
                    {reviews.map((review, index) => (
                      <div key={review._id || index} className="w-full flex-shrink-0">
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
                                className={`w-5 h-5 sm:w-6 sm:h-6 mx-0.5 sm:mx-1 ${
                                  i < review.rating ? "text-yellow-400" : "text-gray-200"
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
                                {review.name}
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
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 z-10"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
                  </button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {reviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToTestimonial(index)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-emerald-500 scale-125 shadow-lg pulse-indicator"
                          : "bg-gray-300 hover:bg-gray-400 hover:scale-110"
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
              Ready to Ace Your Exams?
            </h2>
            <p className="text-base sm:text-xl text-emerald-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
              Join our community of learners who have transformed their grades with
              groupXam. Start your journey to academic excellence today.
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
    </PageTransition>
  );
}
