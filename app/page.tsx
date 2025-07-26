"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Clock,
  Brain,
  MessageSquare,
  Play,
  Star,
  ArrowRight,
  BookOpen,
  AlertCircle,
  Users,
  FileText,
  Code,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Header from "@/components/ui/header";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef, useState } from "react";
import { MdGroups } from "react-icons/md";
import { FaFacebook, FaInstagram } from "react-icons/fa";

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
  const [questionsCount, setQuestionsCount] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [supportHours, setSupportHours] = useState(0);

  // Live activity feed
  const activities = [
    "Adaora just aced a Chemistry quiz!",
    "Kemi joined the Math study group.",
    "Chidi completed 20 flashcards.",
    "Ayo scored 95% in Physics practice test!",
    "Fatima unlocked a new badge!",
    "Emeka started a Timed Exam.",
    "Zainab posted a question in Discussions.",
    "Tunde finished a Biology flashcard set.",
  ];
  const [activityIndex, setActivityIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityIndex((i) => (i + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters effect
  useEffect(() => {
    let q = 0,
      s = 0,
      h = 0;
    const interval = setInterval(() => {
      if (q < 50000) setQuestionsCount((prev) => Math.min(prev + 1000, 50000));
      if (s < 95) setSuccessRate((prev) => Math.min(prev + 5, 95));
      if (h < 24) setSupportHours((prev) => Math.min(prev + 1, 24));
      q += 1000;
      s += 5;
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
  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setReviews(Array.isArray(data) ? data : []));
  }, []);

  // Scroll functionality for feature carousel
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-white">
      <Header
        navLinks={
          <>
            {loading ? (
              <span className="text-gray-400 font-medium">...</span>
            ) : isLoggedIn ? (
              <>
                {user?.role === "university" && (
                  <Link
                    href="/university/dashboard"
                    className="text-gray-600 hover:text-emerald-600 transition-colors font-medium mr-2"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition-colors font-semibold shadow"
                >
                  Sign Up
                </Link>
              </>
            )}
          </>
        }
      />

      {/* Animated Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden">
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
            🎓 Trusted by 10,000+ Students
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
            The most comprehensive study platform for WAEC/WASSCE/JAMB
            preparation. Practice with thousands of questions, master concepts
            with flashcards, and track your progress.
          </p>

          {/* Quick Start Widget */}
          <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center mb-8 sm:mb-12 px-4 max-w-md sm:max-w-none mx-auto">
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams/waec">WAEC</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams/wassce">WASSCE</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams/jamb">JAMB</Link>
            </Button>
          </div>

          {/* Animated Counters */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 mb-6">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2 animate-bounce">
                {questionsCount.toLocaleString()}+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2 animate-bounce">
                {successRate}%
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
          <div className="flex justify-center mb-4">
            <div className="bg-white/80 rounded-full px-6 py-2 shadow-md flex items-center gap-2 text-sm font-medium text-gray-700 animate-fade-in">
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              {activities[activityIndex]}
            </div>
          </div>

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

      {/* Interactive Subject Tiles */}
      <section className="py-10 sm:py-16 px-4 bg-white">
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
                href={`/quiz?category=${subject.category}`}
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
      <section id="features" className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              Everything You Need to{" "}
              <span className="text-emerald-600">Excel</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to help you master every aspect of
              your WAEC/WASSCE preparation
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
                href="/quiz"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Test your knowledge with interactive quizzes
                  </p>
                </div>
              </Link>

              {/* Exam Prep Card */}
              <Link
                href="/exams"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Simulate real exam conditions with timed tests
                  </p>
                </div>
              </Link>

              {/* Whiteboard Card */}
              <Link
                href="/whiteboard"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Draw and solve problems with digital tools
                  </p>
                </div>
              </Link>

              {/* Flashcards Card */}
              <Link
                href="/flashcards"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Memorize key concepts with smart flashcards
                  </p>
                </div>
              </Link>

              {/* Study Groups Card */}
              <Link
                href="/discussions"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
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
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Connect with peers and get community help
                  </p>
                </div>
              </Link>

              {/* proctorIT Card */}
              <Link
                href="/services"
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="bg-gradient-to-r from-emerald-400 to-lime-500 px-4 sm:px-6 py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    proctorIT
                  </h3>
                </div>
                <div className="p-4 sm:p-6 bg-white h-40 sm:h-48 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">
                    Enterprise exam solutions for institutions
                  </p>
                </div>
              </Link>
            </div>

            {/* Mobile navigation dots - Only visible on mobile */}
            <div className="flex justify-center mt-6 sm:hidden">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-12 sm:py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              How <span className="text-emerald-600">groupXam</span> Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple steps to transform your WAEC preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  1
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Sign Up & Choose Subjects
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Create your account and select the subjects you want to focus on
                for your WAEC preparation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Practice & Learn
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Take quizzes, study with flashcards, and participate in timed
                exams to build your knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Track Progress & Excel
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Monitor your improvement, identify weak areas, and achieve your
                target grades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              What are students saying.
            </h2>
            <p className="text-base sm:text-xl text-gray-600 px-4">
              Join thousands of successful students
            </p>
          </div>
          <div className="flex justify-center mt-2 mb-10">
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold text-lg px-8 py-3 rounded-full shadow-xl animate-fade-in"
            >
              <Link href="/testimonials">Share Testimonials</Link>
            </Button>
          </div>
          {/* Marquee Train Animation */}
          <div className="overflow-hidden relative">
            <div
              className="flex gap-8 animate-marquee"
              style={{ minWidth: "200%", willChange: "transform" }}
            >
              {reviews.concat(reviews).map((t, idx) => (
                <div
                  className="flex flex-col h-full min-w-[320px] max-w-xs mx-auto"
                  key={t._id || idx}
                >
                  <div className="border-0 shadow-lg rounded-xl bg-white flex flex-col h-full p-6 sm:p-8">
                    <div className="flex mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < t.rating ? "text-yellow-400" : "text-gray-300"
                          } fill-current`}
                        />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">
                      {t.quote}
                    </p>
                    <div className="flex items-center mt-auto">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base`}
                      >
                        {t.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base">
                          {t.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {t.details}
                        </div>
                        {t.createdAt && (
                          <div className="text-xs text-gray-400 mt-1">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Marquee Animation CSS */}
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
            }
          `}</style>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            Ready to Ace Your Exams?
          </h2>
          <p className="text-base sm:text-xl text-emerald-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join over 10,000 students who have transformed their grades with
            groupXam. Start your journey to academic excellence today.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
            <div>
              <div className="flex items-center mb-4 sm:mb-6 justify-center sm:justify-start">
                <Image
                  src="/logo-white.png"
                  alt="groupXam logo"
                  width={150}
                  height={150}
                  className="transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Empowering students to achieve academic excellence through
                innovative learning tools and comprehensive exam preparation.
              </p>
              {/* Social Media Links - Moved to far left */}
              <div className="flex gap-4 mt-4 sm:mt-6 justify-center sm:justify-start">
                <a
                  href="https://www.facebook.com/share/16vS1ui8oA/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xl sm:text-2xl transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/group_xam?igsh=MW45dHZqbnNrMTk1MQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-700 text-xl sm:text-2xl transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                Learning Tools & Products
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                <li>
                  <Link
                    href="/quiz"
                    className="hover:text-white transition-colors"
                  >
                    Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/exams"
                    className="hover:text-white transition-colors"
                  >
                    Exam prep
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flashcards"
                    className="hover:text-white transition-colors"
                  >
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discussions"
                    className="hover:text-white transition-colors"
                  >
                    Study Groups
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    proctorIT
                  </Link>
                </li>
                <li>
                  <Link
                    href="/whiteboard"
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
  );
}
