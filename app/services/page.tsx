"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  GraduationCap,
  Building,
  MapPin,
  CalendarDays,
  Timer,
  UserCheck,
  Award,
  Download,
  FileText,
  Mail,
  Phone,
  User,
  ArrowRight,
  Target,
  Brain,
  MessageSquare,
  Star,
  ShieldCheck,
  Fingerprint,
  Zap,
  Sparkles,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
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
}

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  regNo: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
}

interface RollNumberSlip {
  examId: string;
  examTitle: string;
  studentName: string;
  rollNumber: string;
  examDate: string;
  examTime: string;
  examCenter: string;
  instructions: string;
}

export default function ServicesPage() {
  const { isLoggedIn, user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [submittedExams, setSubmittedExams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Registration form state
  const [showRegistrationForm, setShowRegistrationForm] = useState<
    string | null
  >(null);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    phone: "",
    regNo: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    parentName: "",
    parentPhone: "",
  });
  const [rollNumberSlip, setRollNumberSlip] = useState<RollNumberSlip | null>(
    null
  );

  // Animated counters
  const [totalExams, setTotalExams] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalUniversities, setTotalUniversities] = useState(0);

  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
        setTotalStudents(regExamIds.length);
        // Track submitted exams
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
        setTotalStudents(0);
      }
    }
  }, [isLoggedIn, user?.role, user?.email]);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/exams");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const exams = Array.isArray(data) ? data : [];
        
        if (isMounted) {
        setAssessments(exams);
        setTotalExams(exams.length);
        setTotalUniversities(new Set(exams.map((a) => a.universityName)).size);
        await fetchRegistrations(); // Ensure this is awaited before setting loading to false
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

  useEffect(() => {
    let isMounted = true;
    
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && isMounted) {
        fetchRegistrations();
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibility);
    
    // Add interval to auto-refresh registrations/submissions every 30 seconds
    const interval = setInterval(() => {
      if (isMounted) {
      fetchRegistrations();
      }
    }, 30000);
    
    return () => {
      isMounted = false;
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [isLoggedIn, user, fetchRegistrations]);

  // Cleanup effect for component unmounting
  useEffect(() => {
    return () => {
      // Clear any pending state updates
      setLoading(false);
      setRegistering(null);
      setRegisterError("");
      setRegisterSuccess("");
    };
  }, []);

  const handleRegister = async (assessment: Assessment) => {
    if (!isLoggedIn) {
      setShowRegistrationForm(assessment._id || assessment.id || "");
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
          regNo: "",
          name: user?.name || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess("Registered successfully!");
        await fetchRegistrations();
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch (error) {
      setRegisterError("Registration failed");
    } finally {
      setRegistering(null);
    }
  };

  const handleGuestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRegistrationForm) return;

    const examId = showRegistrationForm;
    setRegistering(examId);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: showRegistrationForm,
          ...registrationForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess("Registered successfully!");
        setRegistrations((prev) => [...prev, showRegistrationForm]);
        const assessment = assessments.find(
          (a) => (a._id || a.id) === showRegistrationForm
        );
        if (assessment) {
          generateRollNumberSlip(assessment, registrationForm.name);
        }
        setShowRegistrationForm(null);
        setRegistrationForm({
          name: "",
          email: "",
          phone: "",
          regNo: "",
          address: "",
          dateOfBirth: "",
          gender: "",
          parentName: "",
          parentPhone: "",
        });
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch {
      setRegisterError("Network error. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  const generateRollNumberSlip = (
    assessment: Assessment,
    studentName: string
  ) => {
    const rollNumber = `RN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const slip: RollNumberSlip = {
      examId: assessment._id || assessment.id || "",
      examTitle: assessment.title,
      studentName,
      rollNumber,
      examDate: assessment.date,
      examTime: assessment.time,
      examCenter: `${assessment.universityName} Main Campus`,
      instructions:
        "Please arrive 30 minutes before the exam time. Bring your roll number slip and valid ID.",
    };
    setRollNumberSlip(slip);
  };

  const downloadRollNumberSlip = () => {
    if (!rollNumberSlip) return;

    const slipContent = `
ROLL NUMBER SLIP
================

Exam Title: ${rollNumberSlip.examTitle}
Student Name: ${rollNumberSlip.studentName}
Roll Number: ${rollNumberSlip.rollNumber}
Exam Date: ${rollNumberSlip.examDate}
Exam Time: ${rollNumberSlip.examTime}
Exam Center: ${rollNumberSlip.examCenter}

Instructions: ${rollNumberSlip.instructions}

This slip must be presented on exam day for verification.
    `;

    const blob = new Blob([slipContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roll_number_slip_${rollNumberSlip.rollNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAssessments = assessments.filter((a) => {
    let match = true;
    if (searchTerm) {
      match =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.universityName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedSubject !== "all") {
      match = match && a.subject === selectedSubject;
    }
    return match;
  });

  const subjects = [
    { name: "Mathematics", icon: <Target className="w-6 h-6" /> },
    { name: "Biology", icon: <Brain className="w-6 h-6" /> },
    { name: "Chemistry", icon: <BookOpen className="w-6 h-6" /> },
    { name: "Physics", icon: <Clock className="w-6 h-6" /> },
    { name: "English", icon: <MessageSquare className="w-6 h-6" /> },
    { name: "Economics", icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Ultra-sophisticated with mind-blowing animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/30 to-transparent rounded-full mix-blend-multiply blur-3xl animate-mesh-1"></div>
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-400/20 to-transparent rounded-full mix-blend-multiply blur-3xl animate-mesh-2"></div>
          <div className="absolute bottom-0 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-purple-400/25 to-transparent rounded-full mix-blend-multiply blur-3xl animate-mesh-3"></div>
        </div>

        {/* Floating geometric elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-3 h-3 bg-emerald-500/30 rounded-full animate-float-slow"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-blue-500/40 rounded-full animate-float-medium"></div>
          <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-purple-500/20 rounded-full animate-float-fast"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-emerald-600/50 rounded-full animate-float-slow"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Content - Enhanced typography and animations */}
            <div className="space-y-8 animate-slide-up">
              {/* Trust badge with subtle glow */}
              <div className="inline-flex items-center px-5 py-3 bg-white/80 backdrop-blur-md text-emerald-800 rounded-full text-sm font-medium shadow-lg border border-emerald-100/50 hover:shadow-xl transition-all duration-500 group">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></div>
                <span className="group-hover:scale-105 transition-transform duration-300">Trusted by learners worldwide</span>
              </div>

              {/* Main headline with sophisticated typography */}
              <div className="space-y-2">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[0.85] text-balance">
                  <span className="inline-block bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient-shift bg-300% bg-left hover:bg-right transition-all duration-700">
                    Transform
                  </span>
                  <br />
                  <span className="text-slate-900 inline-block transform hover:scale-105 transition-transform duration-300">
                    Your Future
                  </span>
          </h1>
                <div className="h-1 w-24 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-width-expand"></div>
              </div>

              {/* Refined description */}
              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-xl font-light">
                The ultimate platform where institutions create and manage exams while students register and take assessments with 
                <span className="text-emerald-600 font-medium"> zero-friction workflows</span> 
                and enterprise-grade security.
              </p>

              {/* Enhanced CTAs with micro-interactions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg" 
                  className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Link href="#upcoming-exams">
                    <Calendar className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="group border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-all duration-300"
                >
                  <Link href="#how-it-works">
                    <Play className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                    See It in Action
                  </Link>
                </Button>
              </div>

              {/* Refined capability badges with hover effects */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: ShieldCheck, text: "Bank-grade security", color: "emerald" },
                  { icon: Zap, text: "Lightning workflows", color: "blue" },
                  { icon: Sparkles, text: "Smart exam creation", color: "purple" },
                  { icon: Fingerprint, text: "Secure identity verification", color: "indigo" }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="group inline-flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-white/40 hover:bg-white/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                  >
                    <item.icon className={`w-4 h-4 text-${item.color}-600 group-hover:scale-110 transition-transform duration-300`} />
                    <span className="text-sm font-medium text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Revolutionary 3D-style visualization */}
            <div className="relative h-[500px] lg:h-[600px] flex items-center justify-center">
              {/* Main orb with sophisticated layering */}
              <div className="relative">
                {/* Outer glow rings */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 scale-150 animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/15 to-purple-500/15 scale-125 animate-pulse-ring-delay"></div>
                
                {/* Core orb with depth */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 animate-rotate-slow shadow-2xl"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tl from-emerald-300/50 via-blue-400/50 to-purple-500/50 backdrop-blur-sm"></div>
                  <div className="absolute inset-6 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-lg"></div>
                  
                  {/* Inner energy core */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/30 backdrop-blur-xl animate-pulse-core"></div>
                </div>
              </div>

              {/* Orbiting feature satellites */}
              <div className="absolute inset-0 animate-orbit">
                <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-white/60 transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Ultra Secure</div>
                        <div className="text-xs text-slate-600">256-bit encryption</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-white/60 transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Lightning Fast</div>
                        <div className="text-xs text-slate-600">Sub-second responses</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-2xl border border-white/60 transform hover:scale-105 transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800 text-sm">Smart Platform</div>
                        <div className="text-xs text-slate-600">Intuitive exam creation</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating data particles */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  { top: "20%", left: "10%", delay: "0s", duration: "4s" },
                  { top: "80%", left: "85%", delay: "0.5s", duration: "3.5s" },
                  { top: "60%", left: "20%", delay: "1s", duration: "4.5s" },
                  { top: "30%", left: "70%", delay: "1.5s", duration: "3s" },
                  { top: "90%", left: "40%", delay: "2s", duration: "4.2s" },
                  { top: "10%", left: "60%", delay: "2.5s", duration: "3.8s" },
                  { top: "70%", left: "90%", delay: "0.8s", duration: "4.8s" },
                  { top: "40%", left: "30%", delay: "1.2s", duration: "3.2s" },
                  { top: "85%", left: "15%", delay: "1.8s", duration: "4.1s" },
                  { top: "15%", left: "80%", delay: "0.3s", duration: "3.9s" },
                  { top: "50%", left: "50%", delay: "2.2s", duration: "4.3s" },
                  { top: "95%", left: "75%", delay: "0.7s", duration: "3.6s" }
                ].map((particle, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-emerald-400/60 rounded-full animate-particle"
                    style={{
                      top: particle.top,
                      left: particle.left,
                      animationDelay: particle.delay,
                      animationDuration: particle.duration
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> Succeed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with user-friendly design to deliver the ultimate exam registration experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Streamlined Registration</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Complete your exam registration in under 3 minutes with our intelligent form system. 
                    Auto-save functionality ensures you never lose your progress.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Timer className="w-7 h-7 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Real-time Notifications</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Stay informed with instant updates on exam schedules, venue changes, and important announcements. 
                    Never miss a critical deadline again.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Enterprise Security</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Bank-level encryption and multi-factor authentication protect your data. 
                    Our infrastructure maintains 99.9% uptime with automatic failover systems.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Digital Documentation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Generate and download roll number slips, certificates, and results instantly. 
                    All documents are digitally signed and verifiable.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-7 h-7 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">24/7 Expert Support</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our dedicated support team is available round the clock via chat, email, and phone. 
                    Average response time: under 2 minutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Comprehensive Coverage</h3>
                  <p className="text-gray-600 leading-relaxed">
                    From K-12 assessments to professional certifications, we support all exam types. 
                    Custom solutions available for institutions and organizations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - Futuristic timeline without big numbers */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">Process</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Simple Steps to
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> Success</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A guided, intelligent flow that feels like magic — with real‑time validation, secure identity and zero friction.
            </p>
          </div>

          {/* Futuristic line with glowing nodes and gradient connectors */}
          <div className="relative max-w-5xl mx-auto">
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 rounded-full opacity-70"></div>

            <div className="space-y-14">
              <div className="relative lg:flex lg:items-center">
                <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Discover & Explore</h3>
                  <p className="text-gray-600">Search by subject, institution or date. Powerful filters help you land on the perfect exam effortlessly.</p>
                </div>
                <div className="hidden lg:block w-6 h-6 bg-white rounded-full ring-4 ring-emerald-500/40 shadow-lg mx-6 animate-pulse-glow"></div>
                <div className="lg:w-1/2 lg:pl-12 mt-6 lg:mt-0">
                  <div className="px-5 py-4 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 text-emerald-700">Guided search with instant results</div>
                </div>
              </div>

              <div className="relative lg:flex lg:items-center">
                <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Quick Registration</h3>
                  <p className="text-gray-600">Auto‑save, live validation and document upload that just works. Finish in minutes, not hours.</p>
                </div>
                <div className="hidden lg:block w-6 h-6 bg-white rounded-full ring-4 ring-blue-500/40 shadow-lg mx-6 animate-pulse-glow"></div>
                <div className="lg:w-1/2 lg:pl-12 mt-6 lg:mt-0">
                  <div className="px-5 py-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 text-blue-700">Smart forms with auto‑fill</div>
                </div>
              </div>

              <div className="relative lg:flex lg:items-center">
                <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Instant Confirmation</h3>
                  <p className="text-gray-600">Get your digital roll number slip instantly. Securely stored in your dashboard, always accessible.</p>
                </div>
                <div className="hidden lg:block w-6 h-6 bg-white rounded-full ring-4 ring-purple-500/40 shadow-lg mx-6 animate-pulse-glow"></div>
                <div className="lg:w-1/2 lg:pl-12 mt-6 lg:mt-0">
                  <div className="px-5 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-emerald-50 border border-purple-100 text-purple-700">Digital slips with verification</div>
                </div>
              </div>

              <div className="relative lg:flex lg:items-center">
                <div className="lg:w-1/2 lg:pr-12 lg:text-right">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Excel & Achieve</h3>
                  <p className="text-gray-600">Attend on‑site or online. Get results digitally and track your milestones.</p>
                </div>
                <div className="hidden lg:block w-6 h-6 bg-white rounded-full ring-4 ring-emerald-500/40 shadow-lg mx-6 animate-pulse-glow"></div>
                <div className="lg:w-1/2 lg:pl-12 mt-6 lg:mt-0">
                  <div className="px-5 py-4 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-100 text-emerald-700">Results, downloads, and next steps</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-4">
              Categories
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Comprehensive
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> Coverage</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From academic excellence to professional advancement, we support every step of your educational journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subjects.map((subject, index) => (
              <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {subject.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{subject.name}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Comprehensive {subject.name.toLowerCase()} assessments designed for all academic levels and professional requirements.
                  </p>
                  <div className="flex items-center text-emerald-600 font-medium">
                    <span>Explore {subject.name}</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section id="upcoming-exams" className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
              Upcoming Exams
            </h2>
            <p className="text-xl text-gray-600">
              Find and register for exams that match your academic goals
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search exams, universities, or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {[...new Set(assessments.map((a) => a.subject))].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading assessments...</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No exams found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAssessments.map((a) => {
                const isRegistered = registrations.includes(
                  a._id || a.id || ""
                );
                const isSubmitted = submittedExams.includes(
                  a._id || a.id || ""
                );
                const now = new Date();
                const start = new Date(`${a.date}T${a.time}`);
                const canStart = isRegistered && !isSubmitted && now >= start;
                const regDeadlineDateTime = a.registrationDeadline
                  ? new Date(
                      `${a.registrationDeadline}T${
                        a.registrationTime || "23:59"
                      }`
                    )
                  : null;
                const isPastDeadline =
                  regDeadlineDateTime && regDeadlineDateTime < now;

                return (
                  <Card
                    key={a._id || a.id}
                    className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-gray-800">
                          {a.title}
                        </CardTitle>
                        <Badge
                          className={`${
                            isRegistered
                              ? "bg-green-100 text-green-800"
                              : isPastDeadline
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isRegistered
                            ? "Registered"
                            : isPastDeadline
                            ? "Closed"
                            : "Open"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        {a.universityName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {a.subject}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{a.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{a.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Timer className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{a.duration || 120} minutes</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Max: {a.maxStudents || 500}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        {isLoggedIn && user?.role === "student" ? (
                          canStart ? (
                            <Button
                              asChild
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Link
                                href={`/assessments/${a._id || a.id}/attempt`}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start Assessment
                              </Link>
                            </Button>
                          ) : isSubmitted ? (
                            <span className="text-blue-700 font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Submitted
                            </span>
                          ) : isRegistered ? (
                            <span className="text-green-700 font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Registered
                            </span>
                          ) : (
                            <Dialog
                              open={showRegistrationForm === (a._id || a.id)}
                              onOpenChange={(open) =>
                                setShowRegistrationForm(
                                  open ? (a._id || a.id) ?? null : null
                                )
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  // onClick={handleRegister(a)}
                                  disabled={
                                    registering === (a._id || a.id) ||
                                    !!isPastDeadline
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {registering === (a._id || a.id)
                                    ? "Registering..."
                                    : "Register"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Register for Exam</DialogTitle>
                                </DialogHeader>
                                <form
                                  onSubmit={handleGuestRegistration}
                                  className="space-y-6"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="name">Full Name *</Label>
                                      <Input
                                        id="name"
                                        value={registrationForm.name}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            name: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="email">
                                        Email Address *
                                      </Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={registrationForm.email}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            email: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="phone">
                                        Phone Number *
                                      </Label>
                                      <Input
                                        id="phone"
                                        value={registrationForm.phone}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            phone: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="regNo">
                                        Registration Number
                                      </Label>
                                      <Input
                                        id="regNo"
                                        value={registrationForm.regNo}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            regNo: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="dateOfBirth">
                                        Date of Birth *
                                      </Label>
                                      <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={registrationForm.dateOfBirth}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            dateOfBirth: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="gender">Gender *</Label>
                                      <Select
                                        value={registrationForm.gender}
                                        onValueChange={(value) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            gender: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="male">
                                            Male
                                          </SelectItem>
                                          <SelectItem value="female">
                                            Female
                                          </SelectItem>
                                          <SelectItem value="other">
                                            Other
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                      id="address"
                                      value={registrationForm.address}
                                      onChange={(e) =>
                                        setRegistrationForm({
                                          ...registrationForm,
                                          address: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="parentName">
                                        Parent/Guardian Name *
                                      </Label>
                                      <Input
                                        id="parentName"
                                        value={registrationForm.parentName}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            parentName: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="parentPhone">
                                        Parent/Guardian Phone *
                                      </Label>
                                      <Input
                                        id="parentPhone"
                                        value={registrationForm.parentPhone}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            parentPhone: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-end space-x-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        setShowRegistrationForm(null)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      disabled={
                                        registering === showRegistrationForm
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      {registering === showRegistrationForm
                                        ? "Registering..."
                                        : "Register"}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )
                        ) : (
                          <Button
                            asChild
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Link href="/login">Sign in to Register</Link>
                          </Button>
                        )}

                        <Dialog
                          open={showDetailsFor === (a._id || a.id)}
                          onOpenChange={(open) =>
                            setShowDetailsFor(
                              open ? (a._id || a.id) ?? null : null
                            )
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Exam Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div className="font-bold text-lg">{a.title}</div>
                              <div className="text-gray-700">
                                {a.description}
                              </div>
                              <div className="flex flex-col gap-1 text-sm mt-2">
                                <div>
                                  <b>University:</b> {a.universityName}
                                </div>
                                <div>
                                  <b>Subject:</b> {a.subject}
                                </div>
                                <div>
                                  <b>Date:</b> {a.date}
                                </div>
                                <div>
                                  <b>Time:</b> {a.time}
                                </div>
                                <div>
                                  <b>Duration:</b> {a.duration || 120} minutes
                                </div>
                                <div>
                                  <b>Max Students:</b> {a.maxStudents || 500}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {registerSuccess && registering === (a._id || a.id) && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            {registerSuccess}
                          </p>
                        </div>
                      )}
                      {registerError && registering === (a._id || a.id) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm">
                            {registerError}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>



      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-medium mb-4">
              Support
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
              Got
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> Questions?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about our platform and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
                        <div className="space-y-4">
              {[
                {
                  question: "How do I register for an exam?",
                  answer: "Simply browse available exams, click \"Register,\" fill out the required information, and complete the process. You'll receive instant confirmation and a digital roll number slip.",
                  color: "emerald"
                },
                {
                  question: "Can I register for multiple exams?",
                  answer: "Yes, you can register for multiple exams using the same account. Each exam will have its own registration process and roll number.",
                  color: "blue"
                },
                {
                  question: "What if I lose my roll number slip?",
                  answer: "You can always download your roll number slip from your account dashboard. The digital copy is permanently stored and accessible anytime.",
                  color: "purple"
                },
                {
                  question: "How secure is my personal information?",
                  answer: "We use bank-level encryption and security measures to protect your data. Your information is never shared with unauthorized parties.",
                  color: "orange"
                },
                {
                  question: "What payment methods are accepted?",
                  answer: "We accept major credit cards, debit cards, bank transfers, and mobile money payments. All transactions are processed securely.",
                  color: "green"
                },
                {
                  question: "How will I receive exam results?",
                  answer: "Results are published digitally on your account dashboard. You'll also receive email notifications when results are available.",
                  color: "indigo"
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className={`bg-gray-50 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                    expandedFaq === index 
                      ? 'border-emerald-200 bg-emerald-50/50 shadow-lg' 
                      : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <div className={`w-8 h-8 bg-${faq.color}-100 rounded-lg flex items-center justify-center mr-4 transition-transform duration-300 ${
                          expandedFaq === index ? 'rotate-180' : ''
                        }`}>
                          <span className={`text-${faq.color}-600 font-bold`}>Q</span>
                        </div>
                        {faq.question}
                      </h3>
                      <div className={`w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center transition-all duration-300 ${
                        expandedFaq === index 
                          ? 'border-emerald-500 bg-emerald-500 text-white rotate-45' 
                          : 'group-hover:border-gray-600'
                      }`}>
                        <span className="text-xs font-bold">+</span>
                      </div>
                    </div>
                    
                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${
                      expandedFaq === index ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                    }`}>
                      <div className="ml-12 pb-2">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8">
              Ready to
              <span className="block">Transform Your Future?</span>
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join over 50,000 students who trust our platform for their academic and professional success. 
              Start your journey today with the most advanced exam registration system.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Button 
                asChild 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Link href="#upcoming-exams">
                  <Calendar className="w-6 h-6 mr-3" />
                  Start Registration
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="bg-white text-emerald-600 hover:bg-gray-100 px-10 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                <Link href="/contact">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Get Support
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-white/90">Platform Uptime</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">24/7</div>
                <div className="text-white/90">Expert Support</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-white/90">Secure & Reliable</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (reused from homepage) */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4">
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

      {/* Registration Form Dialog */}
      <Dialog
        open={!!showRegistrationForm}
        onOpenChange={() => setShowRegistrationForm(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for Exam</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuestRegistration} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={registrationForm.name}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={registrationForm.phone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="regNo">Registration Number</Label>
                <Input
                  id="regNo"
                  value={registrationForm.regNo}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      regNo: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={registrationForm.dateOfBirth}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={registrationForm.gender}
                  onValueChange={(value) =>
                    setRegistrationForm({ ...registrationForm, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={registrationForm.address}
                onChange={(e) =>
                  setRegistrationForm({
                    ...registrationForm,
                    address: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  value={registrationForm.parentName}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      parentName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
                <Input
                  id="parentPhone"
                  value={registrationForm.parentPhone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      parentPhone: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationForm(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={registering === showRegistrationForm}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {registering === showRegistrationForm
                  ? "Registering..."
                  : "Register"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Roll Number Slip Dialog */}
      <Dialog
        open={!!rollNumberSlip}
        onOpenChange={() => setRollNumberSlip(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Roll Number Slip
            </DialogTitle>
          </DialogHeader>

          {rollNumberSlip && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Exam:</span>
                    <span>{rollNumberSlip.examTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{rollNumberSlip.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Roll Number:</span>
                    <span className="font-bold text-blue-600">
                      {rollNumberSlip.rollNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{rollNumberSlip.examDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{rollNumberSlip.examTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Center:</span>
                    <span>{rollNumberSlip.examCenter}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Instructions:</p>
                <p>{rollNumberSlip.instructions}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={downloadRollNumberSlip}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Slip
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRollNumberSlip(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
