"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  GraduationCap,
  Building,
  Timer,
  UserCheck,
  Star,
  TrendingUp,
  Zap,
  Award,
  Target,
  ArrowLeft,
  MapPin,
  Globe,
  Sparkles,
  Brain,
  Layers,
  ChevronRight,
  Heart,
  Bookmark,
  Share2,
  Download,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";

interface Assessment {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  universityName?: string;
  date: string;
  time: string;
  duration?: number;
  description?: string;
  maxStudents?: number;
  registrationDeadline?: string;
  registrationTime?: string;
  category?: "K-12" | "University";
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  price?: number;
  rating?: number;
  enrolledCount?: number;
}

export default function ExamServicesPage() {
  const { isLoggedIn, user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [submittedExams, setSubmittedExams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);
  const [bookmarkedExams, setBookmarkedExams] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    totalInstitutions: 0,
    successRate: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchRegistrations = useCallback(async () => {
    if (isLoggedIn && user?.role === "student") {
      try {
        const regRes = await fetch("/api/exams/submissions");
        const regData = await regRes.json();
        const regExamIds = Array.isArray(regData)
          ? regData
              .filter((r) => r.studentEmail === user.email)
              .map((r) => r.examId)
          : [];
        setRegistrations(regExamIds);
        const submittedIds = Array.isArray(regData)
          ? regData
              .filter(
                (r) => r.studentEmail === user.email && r.status === "submitted"
              )
              .map((r) => r.examId)
          : [];
        setSubmittedExams(submittedIds);
      } catch (error) {
        setRegistrations([]);
        setSubmittedExams([]);
      }
    }
  }, [isLoggedIn, user?.role, user?.email]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        // Fetch exams and stats in parallel
        const [examsRes, statsRes] = await Promise.all([
          fetch("/api/exams"),
          fetch("/api/stats")
        ]);
        
        if (!examsRes.ok) {
          throw new Error(`HTTP error! status: ${examsRes.status}`);
        }
        
        const examsData = await examsRes.json();
        const exams = Array.isArray(examsData) ? examsData : [];
        
        // Fetch real stats
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          if (isMounted) {
            setStats({
              totalExams: statsData.totalExams || 0,
              totalStudents: statsData.totalStudents || 0,
              totalInstitutions: statsData.totalInstitutions || 0,
              successRate: statsData.successRate || 0
            });
          }
        }
        
        if (isMounted) {
          // Enhance exam data with mock additional fields for better UI
          const enhancedExams = exams.map(exam => ({
            ...exam,
            category: exam.category || (Math.random() > 0.5 ? "University" : "K-12"),
            difficulty: ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)],
            price: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 20 : 0,
            rating: 3.5 + Math.random() * 1.5,
            enrolledCount: Math.floor(Math.random() * 500) + 50
          }));
          setAssessments(enhancedExams);
          await fetchRegistrations();
        }
      } catch (error) {
        if (isMounted) {
          setAssessments([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, user, fetchRegistrations]);

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Auto-dismiss messages
  useEffect(() => {
    if (registerSuccess) {
      const timer = setTimeout(() => setRegisterSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [registerSuccess]);

  useEffect(() => {
    if (registerError) {
      const timer = setTimeout(() => setRegisterError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [registerError]);

  const handleRegister = async (assessment: Assessment) => {
    // Only allow logged-in users to register
    if (!isLoggedIn || (user?.role !== "student" && user?.role !== "university")) {
      return;
    }
    
    const examId = assessment._id || assessment.id || "";
    setRegistering(examId);
    setRegisterError("");
    setRegisterSuccess("");
    
    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: assessment._id || assessment.id,
          name: user?.name || "",
          email: user?.email || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Instantly update the registration state without refetching
        setRegistrations(prev => [...prev, examId]);
        setRegisterSuccess("🎉 Successfully registered for the exam!");
      } else {
        setRegisterError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      setRegisterError("Network error. Please check your connection and try again.");
    } finally {
      setRegistering(null);
    }
  };

  const toggleBookmark = (examId: string) => {
    setBookmarkedExams(prev => 
      prev.includes(examId) 
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  // Filter and sort logic
  const filteredAndSortedAssessments = assessments
    .filter((a) => {
      let match = true;
      if (searchTerm) {
        match =
          a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (a.universityName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.subject.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (selectedSubject !== "all") {
        match = match && a.subject === selectedSubject;
      }
      if (selectedCategory !== "all") {
        match = match && a.category === selectedCategory;
      }
      if (selectedDifficulty !== "all") {
        match = match && a.difficulty === selectedDifficulty;
      }
      return match;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "popularity":
          return (b.enrolledCount || 0) - (a.enrolledCount || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        default:
          return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "University" ? <GraduationCap className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <Header />

      {/* Hero Section - Unique exam-focused design */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full animate-bounce" style={{animationDuration: "3s"}}></div>
          <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-400/25 to-emerald-400/25 rounded-full animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center mb-8">
              <Link href="/services" className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Link>
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              <span className="text-emerald-600 font-medium">Exam Portal</span>
            </div>

            {/* Main title with unique styling */}
            <div className="mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/60 mb-6">
                <Sparkles className="w-5 h-5 text-emerald-500 mr-3" />
                <span className="text-emerald-800 font-semibold">Smart Assessment Solutions</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Discover
                </span>
                <br />
                <span className="text-slate-900">Your Next Challenge</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
                Explore curated exams from top institutions. From K-12 assessments to advanced certifications - 
                <span className="text-emerald-600 font-semibold"> find your perfect match</span>
              </p>
            </div>

            {/* Stats with real data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-xl mx-auto">
              {[
                { 
                  icon: Target, 
                  label: "Live Exams", 
                  value: loading ? "..." : stats.totalExams.toString(), 
                  color: "emerald" 
                },
                { 
                  icon: Users, 
                  label: "Students", 
                  value: loading ? "..." : stats.totalStudents > 1000 ? `${Math.floor(stats.totalStudents/1000)}K+` : stats.totalStudents.toString(), 
                  color: "blue" 
                },
                { 
                  icon: Award, 
                  label: "Institutions", 
                  value: loading ? "..." : stats.totalInstitutions.toString(), 
                  color: "purple" 
                }
              ].map((stat, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 hover:bg-white/90 transition-all duration-300 group">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                  <div className={`text-2xl font-bold text-${stat.color}-700`}>{stat.value}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section className="py-8 bg-white/50 backdrop-blur-sm border-b border-white/60">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Search and primary filters */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
              <div className="lg:col-span-5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search exams, subjects, or institutions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 text-lg bg-white/80 backdrop-blur-sm border-white/60 shadow-lg"
                  />
                </div>
              </div>
              
              <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 gap-3">
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-white/60">
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {[...new Set(assessments.map((a) => a.subject))].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-white/60">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="K-12">K-12</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-white/60">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 bg-white/80 backdrop-blur-sm border-white/60">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* View mode toggle and results count */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-emerald-600">{filteredAndSortedAssessments.length}</span> of <span className="font-semibold text-emerald-600">{stats.totalExams}</span> exams
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8"
                >
                  <Layers className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Grid/List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-20">
              <div className="relative mx-auto w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Amazing Exams</h3>
              <p className="text-gray-500">Discovering the perfect challenges for you...</p>
            </div>
          ) : filteredAndSortedAssessments.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Exams Found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedSubject("all");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }} className="bg-emerald-600 hover:bg-emerald-700">
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1 max-w-4xl mx-auto"}`}>
              {filteredAndSortedAssessments.map((a) => {
                const isRegistered = registrations.includes(a._id || a.id || "");
                const isSubmitted = submittedExams.includes(a._id || a.id || "");
                const start = new Date(`${a.date}T${a.time}`);
                const canStart = isRegistered && !isSubmitted && currentTime >= start;
                const regDeadlineDateTime = a.registrationDeadline
                  ? new Date(`${a.registrationDeadline}T${a.registrationTime || "23:59"}`)
                  : null;
                const isPastDeadline = regDeadlineDateTime && regDeadlineDateTime < currentTime;
                const isBookmarked = bookmarkedExams.includes(a._id || a.id || "");

                return (
                  <Card
                    key={a._id || a.id}
                    className={`group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden ${
                      viewMode === "list" ? "flex" : ""
                    } ${isRegistered ? "ring-2 ring-emerald-200 bg-emerald-50/30" : "bg-white/80 backdrop-blur-sm"}`}
                  >
                    {/* Exam Image/Visual Header */}
                    <div className={`relative ${viewMode === "list" ? "w-48 flex-shrink-0" : "h-48"} bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20"></div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className={`${getDifficultyColor(a.difficulty || "Beginner")} border-0`}>
                          {a.difficulty}
                        </Badge>
                        <Badge className="bg-white/90 text-gray-800 border-0">
                          {getCategoryIcon(a.category || "University")}
                          <span className="ml-1">{a.category}</span>
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(a._id || a.id || "")}
                          className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                        >
                          <Heart className={`w-4 h-4 ${isBookmarked ? "fill-red-500 text-red-500" : "text-white"}`} />
                        </Button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-white">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{a.rating?.toFixed(1) || "4.5"}</span>
                          </div>
                          <div className="text-sm">
                            {a.enrolledCount || 0} enrolled
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
                            {a.title}
                          </CardTitle>
                          {a.price ? (
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">${a.price}</div>
                              <div className="text-xs text-gray-500">per exam</div>
                            </div>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-0">FREE</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="w-4 h-4 mr-2" />
                            {a.universityName}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Brain className="w-4 h-4 mr-2" />
                            {a.subject}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{a.description}</p>

                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{new Date(a.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{a.time}</span>
                          </div>
                          <div className="flex items-center">
                            <Timer className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{a.duration || 120} min</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{a.maxStudents || 500} seats</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {/* Debug info - remove after fixing */}
                          {process.env.NODE_ENV === 'development' && (
                            <div className="text-xs text-gray-500 mb-2">
                              Debug: isLoggedIn={String(isLoggedIn)}, role={user?.role}<br/>
                              isRegistered={String(isRegistered)}, canStart={String(canStart)}<br/>
                              currentTime={currentTime.toLocaleString()}<br/>
                              examStart={start.toLocaleString()}<br/>
                              timeCheck={currentTime >= start ? "✅ Time reached" : "⏳ Not yet time"}
                            </div>
                          )}
                          {isLoggedIn && (user?.role === "student" || user?.role === "university") ? (
                            canStart ? (
                              <Button
                                asChild
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                              >
                                <Link href={`/assessments/${a._id || a.id}/attempt`}>
                                  <Play className="w-4 h-4 mr-2" />
                                  Start Exam
                                </Link>
                              </Button>
                            ) : isSubmitted ? (
                              <div className="flex-1 flex items-center justify-center py-2 px-4 bg-blue-50 text-blue-700 rounded-lg">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Completed
                              </div>
                            ) : isRegistered ? (
                              <div className="flex-1 flex items-center justify-center py-2 px-4 bg-green-50 text-green-700 rounded-lg">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Registered - {currentTime < start ? "Exam opens at " + start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "Ready to start"}
                              </div>
                            ) : (
                              <Button
                                onClick={() => handleRegister(a)}
                                disabled={registering === (a._id || a.id) || !!isPastDeadline}
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                              >
                                {registering === (a._id || a.id) ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Registering...
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Register
                                  </>
                                )}
                              </Button>
                            )
                          ) : (
                            <Button
                              asChild
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
                            >
                              <Link href="/login">
                                <UserCheck className="w-4 h-4 mr-2" />
                                Login to Register
                              </Link>
                            </Button>
                          )}

                          <Dialog
                            open={showDetailsFor === (a._id || a.id)}
                            onOpenChange={(open) =>
                              setShowDetailsFor(open ? (a._id || a.id) ?? null : null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="px-3">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center">
                                  <BookOpen className="w-5 h-5 mr-2 text-emerald-600" />
                                  Exam Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-xl font-bold text-gray-800 mb-2">{a.title}</h3>
                                  <p className="text-gray-600">{a.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div><strong>Institution:</strong> {a.universityName}</div>
                                    <div><strong>Subject:</strong> {a.subject}</div>
                                    <div><strong>Level:</strong> {a.category}</div>
                                    <div><strong>Difficulty:</strong> {a.difficulty}</div>
                                  </div>
                                  <div className="space-y-2">
                                    <div><strong>Date:</strong> {new Date(a.date).toLocaleDateString()}</div>
                                    <div><strong>Time:</strong> {a.time}</div>
                                    <div><strong>Duration:</strong> {a.duration || 120} minutes</div>
                                    <div><strong>Price:</strong> {a.price ? `$${a.price}` : "Free"}</div>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t">
                                  <div className="flex items-center">
                                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-2" />
                                    <span className="font-medium">{a.rating?.toFixed(1) || "4.5"} Rating</span>
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {a.enrolledCount || 0} students enrolled
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        {/* Success/Error Messages */}
                        {registerSuccess && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                                <CheckCircle className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-emerald-700 font-medium text-sm">{registerSuccess}</p>
                            </div>
                          </div>
                        )}
                        {registerError && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl">
                            <div className="flex items-center">
                              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                <XCircle className="w-4 h-4 text-white" />
                              </div>
                              <p className="text-red-700 font-medium text-sm">{registerError}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto text-white">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Challenge Yourself?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of students taking their skills to the next level with our premium exam platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Link href="#exams">
                  <Zap className="w-5 h-5 mr-2" />
                  Browse All Exams
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-emerald-600 hover:bg-gray-100">
                <Link href="/services">
                  <Globe className="w-5 h-5 mr-2" />
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

