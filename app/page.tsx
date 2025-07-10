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
} from "lucide-react";
import Header from "@/components/ui/header";
import Image from "next/image";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef, useState } from "react";
import { MdGroups } from "react-icons/md";

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

  // Subject tiles
  const subjects = [
    { name: "Mathematics", icon: <Target className="w-6 h-6" /> },
    { name: "Biology", icon: <Brain className="w-6 h-6" /> },
    { name: "Chemistry", icon: <BookOpen className="w-6 h-6" /> },
    { name: "Physics", icon: <Clock className="w-6 h-6" /> },
    { name: "English", icon: <MessageSquare className="w-6 h-6" /> },
    { name: "Economics", icon: <Star className="w-6 h-6" /> },
    { name: "Geography", icon: <ArrowRight className="w-6 h-6" /> },
    { name: "Civic", icon: <Play className="w-6 h-6" /> },
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

  // Testimonials data
  const testimonials = [
    {
      name: "Adaora O.",
      initial: "A",
      color: "bg-emerald-500",
      quote:
        '"groupXam helped me improve my grades significantly. The practice questions are exactly like the real WAEC exams!"',
      details: "WAEC 2023 - 8 A's",
    },
    {
      name: "Kemi S.",
      initial: "K",
      color: "bg-blue-500",
      quote:
        '"The flashcards feature is amazing! I could study anywhere and the progress tracking kept me motivated."',
      details: "WAEC 2023 - 7 A's",
    },
    {
      name: "Chidi M.",
      initial: "C",
      color: "bg-purple-500",
      quote:
        '"The discussion forum helped me understand difficult concepts. The community is very supportive!"',
      details: "WAEC 2023 - 6 A's",
    },
  ];
  // Duplicate testimonials for seamless marquee
  const marqueeTestimonials = [...testimonials, ...testimonials];

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
            The most comprehensive study platform for WAEC/WASSCE/ACT/SAT
            preparation. Practice with thousands of questions, master concepts
            with flashcards, and track your progress.
          </p>

          {/* Quick Start Widget */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:gap-4 justify-center mb-8 sm:mb-12 px-4 max-w-md sm:max-w-none mx-auto">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams?type=sat">SAT</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams?type=act">ACT</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams?type=waec">WAEC</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-lg"
            >
              <Link href="/exams?type=wassce">WASSCE</Link>
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
                href="/quiz"
                className="group block rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 shadow-md hover:shadow-xl p-6 text-center transition-all duration-300 border border-transparent hover:border-emerald-400"
              >
                <div className="flex justify-center mb-3">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-2xl group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </span>
                </div>
                <div className="font-semibold text-lg text-gray-800 group-hover:text-emerald-700">
                  {subject.name}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Start Practicing
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Features - Interactive Cards */}
      <section id="features" className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              Everything You Need to{" "}
              <span className="text-emerald-600">Excel</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive tools designed to help you master every aspect of
              your WAEC/WASSCE preparation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-12">
            {/* Quiz Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100 h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Practice Quizzes
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    Test your knowledge with interactive quizzes and get instant
                    feedback
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md text-sm sm:text-base mt-auto"
                >
                  <Link href="/quiz">Start Quiz</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Exam Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100 h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Timed Exams
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    Simulate real exam conditions with our timed practice tests
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-md text-sm sm:text-base mt-auto"
                >
                  <Link href="/exams">Take Exam</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Flashcards Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100 h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Smart Flashcards
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    Memorize key concepts with our intelligent flashcard system
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 shadow-md text-sm sm:text-base mt-auto"
                >
                  <Link href="/flashcards">Study Cards</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Discussions Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-blue-50 h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Study Groups
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    Connect with peers and get help from the community
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-md text-sm sm:text-base mt-auto"
                >
                  <Link href="/discussions">Join Discussion</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Institutional Testing Service Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100 h-full">
              <CardContent className="p-6 sm:p-8 text-center flex flex-col h-full justify-between">
                <div className="flex-1 flex flex-col justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                    Institutional Testing Service
                  </h3>
                  <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                    Comprehensive online exam and assessment solutions for
                    schools, colleges, and universities. Empower your
                    institution with secure, scalable, and customizable testing.
                  </p>
                </div>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md text-sm sm:text-base mt-auto"
                >
                  <Link href="/services">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
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
              What Students Say
            </h2>
            <p className="text-base sm:text-xl text-gray-600 px-4">
              Join thousands of successful students
            </p>
          </div>
          {/* Marquee Train Animation */}
          <div className="overflow-hidden relative">
            <div
              className="flex gap-8 animate-marquee"
              style={{ minWidth: "200%", willChange: "transform" }}
            >
              {marqueeTestimonials.map((t, idx) => (
                <div
                  className="flex flex-col h-full min-w-[320px] max-w-xs mx-auto"
                  key={idx}
                >
                  <div className="border-0 shadow-lg rounded-xl bg-white flex flex-col h-full p-6 sm:p-8">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">
                      {t.quote}
                    </p>
                    <div className="flex items-center mt-auto">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${t.color} rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base`}
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
                    Practice Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/exams"
                    className="hover:text-white transition-colors"
                  >
                    Timed Exams
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
                    Discussions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-white transition-colors"
                  >
                    Institutional Testing Service
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
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
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
                <li>
                  <Link
                    href="/tutorials"
                    className="hover:text-white transition-colors"
                  >
                    Tutorials
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
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
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
