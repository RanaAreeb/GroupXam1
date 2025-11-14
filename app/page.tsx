"use client";

import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Paperclip,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";
import Header from "@/components/ui/header";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useDiscussionNotification } from "@/hooks/use-discussion-notification";
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { useMaintenance } from "@/hooks/use-maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

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
  const router = useRouter();
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
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiDocument, setAiDocument] = useState<string | null>(null);
  const [aiDocumentName, setAiDocumentName] = useState<string | null>(null);
  const [aiDocumentType, setAiDocumentType] = useState<string | null>(null);
  const [aiDocumentSize, setAiDocumentSize] = useState<number>(0);
  const [aiUploadError, setAiUploadError] = useState<string | null>(null);
  const [aiImages, setAiImages] = useState<string[]>([]);
  const aiDocumentInputRef = useRef<HTMLInputElement>(null);
  const aiImageInputRef = useRef<HTMLInputElement>(null);

  const { maintenance: aiMaintenance } = useMaintenance("ai_chat");
  const { maintenance: siteMaintenance } = useMaintenance("whole_site");
  const aiSectionConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "ai_chat");
  const siteSectionConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "whole_site");
  const isAiDisabled = Boolean(siteMaintenance?.isActive || aiMaintenance?.isActive);
  const aiDisabledMessage =
    (siteMaintenance?.isActive
      ? siteMaintenance?.message || siteSectionConfig?.defaultMessage
      : aiMaintenance?.message || aiSectionConfig?.defaultMessage) ||
    "sunu-I is currently undergoing maintenance. Please check back soon.";

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

  const handleAiDocumentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAiDisabled) {
      if (aiDocumentInputRef.current) {
        aiDocumentInputRef.current.value = "";
      }
      return;
    }

    const file = event.target.files?.[0];
    if (!file) return;

    const supportedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "application/json",
      "text/csv",
    ];

    if (!supportedTypes.includes(file.type)) {
      setAiUploadError("Only PDF, DOC, DOCX, TXT, MD, JSON, and CSV files are supported.");
      if (aiDocumentInputRef.current) {
        aiDocumentInputRef.current.value = "";
      }
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setAiUploadError("Please upload a document smaller than 8MB.");
      if (aiDocumentInputRef.current) {
        aiDocumentInputRef.current.value = "";
      }
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAiDocument(base64String);
      setAiDocumentName(file.name);
      setAiDocumentType(file.type);
      setAiDocumentSize(file.size);
      setAiUploadError(null);
    };

    reader.readAsDataURL(file);

    if (aiDocumentInputRef.current) {
      aiDocumentInputRef.current.value = "";
    }
  };

  const clearAiDocument = () => {
    setAiDocument(null);
    setAiDocumentName(null);
    setAiDocumentType(null);
    setAiDocumentSize(0);
    setAiUploadError(null);
    if (aiDocumentInputRef.current) {
      aiDocumentInputRef.current.value = "";
    }
  };

  const handleAiSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuestion = aiQuestion.trim();

    if (isAiDisabled) {
      return;
    }

    if (!trimmedQuestion && !aiDocument && aiImages.length === 0) {
      setAiUploadError("Type a question or attach a document or image to continue.");
      return;
    }

    if (typeof window !== "undefined") {
      const payload = {
        question: trimmedQuestion,
        document: aiDocument,
        documentName: aiDocumentName,
        documentType: aiDocumentType,
        documentSize: aiDocumentSize,
        images: aiImages,
        timestamp: Date.now(),
      };

      window.sessionStorage.setItem("groupxam_chat_prefill", JSON.stringify(payload));
    }

    setAiQuestion("");
    clearAiDocument();
    clearAiImages();
    setAiUploadError(null);

    router.push("/chatbot/chat");
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

  const formatDocumentSize = (bytes: number) => {
    if (!bytes || Number.isNaN(bytes) || !Number.isFinite(bytes)) {
      return "Unknown size";
    }
    if (bytes < 1024) {
      return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleAiImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isAiDisabled) {
      if (aiImageInputRef.current) {
        aiImageInputRef.current.value = "";
      }
      return;
    }

    const files = event.target.files;
    if (!files) return;

    const maxImages = 3;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        setAiUploadError("Only image files (JPG, PNG, WEBP, GIF) are supported.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setAiUploadError("Images must be 5MB or smaller.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAiImages((prev) => {
          if (prev.length >= maxImages) {
            setAiUploadError(`You can attach up to ${maxImages} images.`);
            return prev;
          }
          setAiUploadError(null);
          return [...prev, base64String];
        });
      };
      reader.readAsDataURL(file);
    });

    if (aiImageInputRef.current) {
      aiImageInputRef.current.value = "";
    }
  };

  const removeAiImage = (index: number) => {
    setAiImages((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAiImages = () => {
    setAiImages([]);
    setAiUploadError(null);
    if (aiImageInputRef.current) {
      aiImageInputRef.current.value = "";
    }
  };

  return (
    <>
      {/* Floating AI Chat Icon - Outside PageTransition for global positioning */}
      <Link
        href={isLoggedIn ? "/chatbot" : "/login"}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 group"
        aria-label="Open AI Chat Assistant"
      >
        <div className="relative">
          {/* sunu-I Icon without any background or shadow */}
          <Image
            src="/sunu_icon.png"
            alt="sunu-I AI Assistant"
            width={56}
            height={56}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain transition-all duration-300 transform hover:scale-110"
          />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs sm:text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
              Chat with sunu-I
              <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      </Link>

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
              url: "https://www.groupxam.com",
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
                    item: "https://www.groupxam.com"
                  }
                ]
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.groupxam.com/search?q={search_term_string}",
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
              url: "https://www.groupxam.com/calculator",
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
                    {(user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com" ||
                      user?.email === "jtdavis@konductcoachlearning.com"
                    ) && (
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
          
          /* Blob animation */
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }
          
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          
          .animation-delay-4000 {
            animation-delay: 4s;
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

          {/* Redesigned Hero Section */}
          <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-blue-50 overflow-hidden reveal-on-scroll">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container mx-auto text-center relative z-10">
              {/* Top Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium shadow-md">
                  <GraduationCap className="w-4 h-4 mr-2 inline" />
                  Trusted by {totalUsers > 0 ? (
                    totalUsers.toLocaleString() + '+ Students'
                  ) : (
                    <span className="flex items-center gap-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse"></div>
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </span>
                  )}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 text-sm font-medium shadow-md">
                  Institutional Testing Services Available
                </Badge>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
                <span className="block text-gray-900">Ace Your Exams</span>
                <span className="block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  with Confidence
                </span>
              </h1>

              {/* Tagline */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-6">
                  <span className="text-blue-600">Smarter</span>
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-emerald-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                  <span className="text-blue-600">Prep</span>
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-emerald-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                  <span className="text-blue-600">Stronger</span>
                  <div className="w-0 h-0 border-l-[4px] sm:border-l-[6px] border-l-emerald-500 border-t-[3px] sm:border-t-[4px] border-t-transparent border-b-[3px] sm:border-b-[4px] border-b-transparent"></div>
                  <span className="text-blue-600">Results</span>
                </div>


              </div>

              {/* Exam Buttons */}
              <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12 px-4 max-w-sm sm:max-w-4xl lg:max-w-none mx-auto">
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
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">
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
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
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
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
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
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 flex items-center gap-4 mb-6 max-w-2xl mx-auto rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div className="flex-1 text-left">
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
                      <div className="mt-4">
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

          {/* sunu-I Quick Ask Section */}
          <section className="py-16 sm:py-20 px-4 bg-gradient-to-b from-white via-blue-50/60 to-emerald-50 reveal-on-scroll">
            <div className="container mx-auto">
              <div className="relative overflow-hidden rounded-[32px] border border-emerald-100/60 bg-white shadow-[0_40px_80px_-60px_rgba(6,95,70,0.45)]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -top-32 -left-24 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl"></div>
                  <div className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-2xl"></div>
                </div>
                <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] items-stretch">
                  <div className="p-6 sm:p-10 lg:p-12 order-1">
                    <Badge className="mb-4 w-fit bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide">
                      <Sparkles className="mr-1 h-3 w-3" /> AI-Powered Study Help
                    </Badge>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                      Start a conversation with sunu-I
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl">
                      Drop your question, attach supporting documents, or include problem images. We'll hand everything off to sunu-I and launch the full chat with your context ready to go.
                    </p>

                    <form onSubmit={handleAiSubmit} className="mt-8 space-y-5">
                      <input
                        ref={aiDocumentInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
                        onChange={handleAiDocumentSelect}
                        className="hidden"
                      />
                      <input
                        ref={aiImageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleAiImageSelect}
                        className="hidden"
                      />

                      {isAiDisabled && (
                        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-amber-700">
                          <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold">sunu-I is currently offline</p>
                            <p className="text-sm leading-relaxed">{aiDisabledMessage}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col xl:flex-row gap-3 items-stretch">
                        <Input
                          value={aiQuestion}
                          onChange={(event) => {
                            setAiQuestion(event.target.value);
                            if (aiUploadError) {
                              setAiUploadError(null);
                            }
                          }}
                          placeholder="What would you like sunu-I to help you with today?"
                          className="flex-1 h-14 rounded-xl border border-gray-200 bg-white/95 text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-emerald-500"
                          disabled={isAiDisabled}
                        />
                        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => aiDocumentInputRef.current?.click()}
                            className="h-12 sm:h-14 w-full sm:w-auto px-5 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            disabled={isAiDisabled}
                          >
                            <Paperclip className="mr-2 h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-semibold">Add Document</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => aiImageInputRef.current?.click()}
                            className="h-12 sm:h-14 w-full sm:w-auto px-5 rounded-xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            disabled={isAiDisabled}
                          >
                            <ImageIcon className="mr-2 h-5 w-5 text-emerald-600" />
                            <span className="text-sm font-semibold">Add Images</span>
                          </Button>
                          <Button
                            type="submit"
                            disabled={
                              isAiDisabled || (!aiQuestion.trim() && !aiDocument && aiImages.length === 0)
                            }
                            className="h-12 sm:h-14 w-full sm:w-auto px-6 sm:px-8 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl transition-transform duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            Ask sunu-I
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {(aiDocument || aiImages.length > 0) && (
                        <div className="grid gap-4 rounded-2xl border border-emerald-200/70 bg-white/90 p-4 shadow-sm">
                          {aiDocument && (
                            <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                  <FileText className="h-4 w-4" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{aiDocumentName}</p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {(aiDocumentType?.split("/").pop() || "Document").toUpperCase()} · {formatDocumentSize(aiDocumentSize)}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={clearAiDocument}
                                className="rounded-full bg-white/80 p-1 text-gray-400 transition-colors hover:text-red-500"
                                aria-label="Remove document"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          )}

                          {aiImages.length > 0 && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Images</span>
                                <button
                                  type="button"
                                  onClick={clearAiImages}
                                  className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                                >
                                  Remove all
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {aiImages.map((imageSrc, index) => (
                                  <div key={`ai-image-${index}`} className="group relative">
                                    <img
                                      src={imageSrc}
                                      alt={`Selected image ${index + 1}`}
                                      className="h-20 w-20 rounded-xl border border-emerald-100 object-cover shadow-sm"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeAiImage(index)}
                                      className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                      aria-label="Remove image"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {aiUploadError && !isAiDisabled && (
                        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          <span>{aiUploadError}</span>
                        </div>
                      )}

                      <p className="text-xs leading-relaxed text-gray-500">
                        Upload PDFs, Word docs, spreadsheets, or up to 3 images (max 5MB each). Press Enter to jump into sunu-I with everything preloaded.
                      </p>
                    </form>
                  </div>

                  <div className="order-2 lg:order-2 flex flex-col justify-between rounded-b-[32px] lg:rounded-[32px] lg:rounded-l-none bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 p-8 sm:p-10 text-white">
                    <div>
                      <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide">
                        <Sparkles className="h-3.5 w-3.5" /> Instant prep boost
                      </div>
                      <h3 className="mt-6 text-2xl font-semibold leading-snug">
                        Drop your study files and jump straight into the conversation.
                      </h3>
                      <ul className="mt-5 space-y-2 text-sm text-emerald-50/90">
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80"></span>
                          <span>Get contextual responses from sunu-I using your uploads.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80"></span>
                          <span>Auto-redirect to the chat with your question and files ready.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80"></span>
                          <span>Perfect for summarising notes, solving problem sets, or planning revision.</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-8 flex items-center justify-end">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-white/25 blur-xl"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                <div className="flex justify-center mt-6 sm:mt-8 space-x-3 sm:space-x-5 overflow-x-auto pb-6 pt-2 px-4 scrollbar-hide max-w-full">
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
                  className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-2 sm:px-4 max-w-full"
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
                  className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 px-2 sm:px-4 max-w-full"
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
                        src="/features/image.png"
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

          {/* How It Works - Redesigned */}
          <section
            id="how-it-works"
            className="relative py-16 sm:py-24 px-4 bg-white overflow-hidden reveal-on-scroll"
          >
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"></div>

            {/* Floating Geometric Shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/25 to-indigo-200/25 rounded-full blur-xl"></div>

            <div className="container mx-auto relative z-10">
              {/* Header Section */}
              <div className="text-center mb-16 sm:mb-20 px-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  How It Works
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Transform Your Learning with{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    groupXam
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Experience a revolutionary approach to exam preparation with our intelligent, personalized learning platform
                </p>
              </div>

              {/* Steps Container */}
              <div className="relative max-w-6xl mx-auto">
                {/* Connecting Line */}
                <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 opacity-30"></div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  {/* Step 1 */}
                  <div className="relative group">
                    <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-emerald-200 group-hover:-translate-y-2">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors duration-300">
                        Quick Registration
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Create your personalized account and select your target subjects. Set up your profile and choose your exam preferences to get started.
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">Quick Setup</span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Personalized</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="relative group">
                    <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 group-hover:-translate-y-2">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                        Intelligent Learning
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Engage with adaptive quizzes, interactive flashcards, and timed practice tests to build your knowledge and skills.
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">Adaptive</span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Interactive</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="relative group">
                    <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-purple-200 group-hover:-translate-y-2">
                      {/* Step Number Badge */}
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>

                      {/* Icon */}
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                        Achieve Excellence
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        Track your progress with detailed analytics, identify improvement areas, and achieve your target grades with confidence and precision.
                      </p>

                      {/* Feature Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Analytics</span>
                        <span className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full">Success</span>
                      </div>
                    </div>
                  </div>
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


          {/* CTA Section - Redesigned */}
          <section className="relative py-20 sm:py-28 px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden reveal-on-scroll">
            {/* Advanced Background Elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.03),transparent_70%)]"></div>

            {/* Floating Geometric Shapes */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-blue-200/30 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200/25 to-indigo-200/25 rounded-full blur-xl"></div>

            <div className="container mx-auto relative z-10">
              {/* Main Content */}
              <div className="text-center mb-16">

                {/* Main Headline */}
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                  Ready to{" "}
                  <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Transform
                  </span>{" "}
                  Your Future?
                </h2>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
                  Join thousands of successful students who have achieved their academic goals with GroupXam's comprehensive exam preparation platform.
                </p>
              </div>

              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                {/* Study Card */}
                <div className="group relative">
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-emerald-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <BookOpen className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Study Smart</h3>
                    <p className="text-gray-600 leading-relaxed">Access comprehensive study materials and practice tests designed for your success.</p>
                  </div>
                </div>

                {/* Track Progress Card */}
                <div className="group relative">
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-blue-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Track Progress</h3>
                    <p className="text-gray-600 leading-relaxed">Monitor your improvement with detailed analytics and personalized insights.</p>
                  </div>
                </div>

                {/* Achieve Goals Card */}
                <div className="group relative">
                  <div className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-purple-200 hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Achieve Goals</h3>
                    <p className="text-gray-600 leading-relaxed">Reach your target grades with confidence and unlock your full potential.</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                >
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>

              </div>
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
                        href={isLoggedIn ? "/calculator" : "/login"}
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
    </>
  );
}
