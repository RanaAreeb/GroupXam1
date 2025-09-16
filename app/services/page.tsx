"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  BookOpen,
  ArrowRight,
  Target,
  Brain,
  MessageSquare,
  Star,
  ShieldCheck,
  Fingerprint,
  Zap,
  Sparkles,
  Award,
  Search,
  Clock,
  Play,
  CheckCircle,
  Timer,
  FileText,
  UserCheck,
  GraduationCap,
} from "lucide-react";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import { usePaymentProtection } from "@/hooks/use-payment-protection";

// Services page - simplified without exam functionality

export default function ServicesPage() {
  const { isLoggedIn, user } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<"students" | "k12" | "universities" | null>(null);

  // Navigation links for header
  const navLinks = (
    <>
      <Link href="/" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
        Home
      </Link>
      <Link href="/services" className="text-emerald-600 font-medium">
        Services
      </Link>
      
      <Link href="/contact" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
        Contact
      </Link>
    </>
  );

  // Function to handle exam access with payment check
  const handleExamAccess = (packageType: "students" | "k12" | "universities") => {
    if (!isLoggedIn) {
      // Redirect to login if not logged in
      window.location.href = "/login";
      return;
    }
    
    // Check if user has access to the required package
    if (user?.access) {
      // Check specific access based on package type
      let hasAccess = false;
      
      if (packageType === "students") {
        hasAccess = !!(user.access.ielts || user.access.proctor);
      } else if (packageType === "k12") {
        hasAccess = !!user.access.proctor;
      } else if (packageType === "universities") {
        hasAccess = !!(user.access.university || user.access.proctor);
      }
      
      if (hasAccess) {
        // User has access, redirect to services exam page
        window.location.href = "/services/exam";
        return;
      }
    }
    
    // User doesn't have access, show payment modal
    setSelectedPackage(packageType);
    setShowPaymentModal(true);
  };

  // Simplified services page - exam functionality moved to /services/exam

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
      <Header navLinks={navLinks} />

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
                  <Link href="/signup">
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

      {/* Exam Portal Section - Replace the old upcoming exams */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full animate-bounce" style={{animationDuration: "3s"}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
           
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Discover
              </span>
              <br />
              <span className="text-slate-900">Amazing Exams</span>
            </h2>
            
            <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Explore curated exams from top institutions worldwide. From K-12 assessments to advanced certifications - 
              <span className="text-emerald-600 font-semibold"> find your perfect challenge</span>
            </p>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { 
                  icon: Target, 
                  title: "Smart Matching", 
                  desc: "AI-powered exam recommendations",
                  color: "emerald"
                },
                { 
                  icon: Zap, 
                  title: "Instant Registration", 
                  desc: "One-click signup process",
                  color: "blue"
                },
                { 
                  icon: Award, 
                  title: "Verified Results", 
                  desc: "Digital certificates & transcripts",
                  color: "purple"
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40 hover:bg-white/90 transition-all duration-300 group">
                  <feature.icon className={`w-8 h-8 text-${feature.color}-600 mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                  <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleExamAccess("students")}
                size="lg" 
                className="group bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <BookOpen className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                Browse All Exams
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button 
                onClick={() => handleExamAccess("students")}
                variant="outline" 
                size="lg" 
                className="group border-2 border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/50 hover:bg-white/80 transition-all duration-300"
              >
                <Search className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                Search Exams
              </Button>
            </div>

            {/* Quick stats */}
           
          </div>
        </div>
      </section>



      {/* ProctorIT Packages Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-emerald-50/30 to-blue-50/20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-6 border border-emerald-200">
              <ShieldCheck className="w-4 h-4 mr-2" />
              ProctorIT Packages
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-800 mb-6">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Secure Testing
              </span>
              <br />
              <span className="text-gray-800">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Advanced proctoring technology for institutions and students. Choose the perfect plan for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Students Package */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-emerald-200/50 hover:border-emerald-300 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <UserCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Students</h3>
                  <p className="text-gray-600">Perfect for individual assessments</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-5xl font-black text-emerald-600 mb-2">$2</div>
                  <div className="text-gray-600 text-sm">One-time charge per exam</div>
                  <div className="h-12"></div> {/* Spacer to match other cards */}
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span>Secure browser lockdown</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span>Identity verification</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-500 mr-3 flex-shrink-0" />
                    <span>Instant results</span>
                  </div>
                  <div className="h-6"></div> {/* Spacer to match other cards */}
                </div>

                <Button 
                  onClick={() => handleExamAccess("students")}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-2xl mt-auto"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* K-12 Package */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-blue-200/50 hover:border-blue-300 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center mb-8 mt-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">K-12 Schools</h3>
                  <p className="text-gray-600">Comprehensive school solutions</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-5xl font-black text-blue-600 mb-2">$10</div>
                  <div className="text-gray-600 text-sm mb-4">per month</div>
                  <div className="space-y-1 text-sm text-gray-500 h-8">
                    <div>$50 for 6 months</div>
                    <div className="text-emerald-600 font-semibold">$100 annually (save $20)</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Everything in Students</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Bulk student management</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                    <span>Priority support</span>
                  </div>
                  
                </div>

                <Button 
                  onClick={() => handleExamAccess("k12")}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-2xl mt-auto"
                >
                  Choose Plan
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>

            {/* Universities Package */}
            <div className="group relative h-full">
              <div className="absolute inset-0 bg-gradiimage.png from-purple-500/10 to-emerald-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-8 border border-purple-200/50 hover:border-purple-300 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:transform group-hover:-translate-y-2 h-full flex flex-col">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Universities</h3>
                  <p className="text-gray-600">Enterprise-grade solutions</p>
                </div>
                
                <div className="text-center mb-8">
                  <div className="text-5xl font-black text-purple-600 mb-2">$20</div>
                  <div className="text-gray-600 text-sm mb-4">per month</div>
                  <div className="space-y-1 text-sm text-gray-500 h-8">
                    <div>$120 for 6 months</div>
                    <div className="text-emerald-600 font-semibold">$240 annually (save $40)</div>
                  </div>
                </div>

                <div className="space-y-4 mb-8 flex-grow">
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Everything in K-12</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Unlimited users</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span>Dedicated support</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-3 flex-shrink-0" />
                    <span>White-label solution</span>
                  </div>
                </div>

                <Button 
                  onClick={() => handleExamAccess("universities")}
                  className="w-full bg-gradient-to-r from-purple-500 to-emerald-600 hover:from-purple-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-2xl mt-auto"
                >
                  Enterprise Solution
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-20 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-gray-800 font-semibold mb-2">Bank-Level Security</h4>
                <p className="text-gray-600 text-sm">256-bit encryption and multi-factor authentication</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="text-gray-800 font-semibold mb-2">Real-Time Monitoring</h4>
                <p className="text-gray-600 text-sm">Live proctoring with AI-powered detection</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="text-gray-800 font-semibold mb-2">Compliance Ready</h4>
                <p className="text-gray-600 text-sm">FERPA, GDPR, and industry standard compliance</p>
              </div>
            </div>
          </div>
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
                <Link href="/signup">
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

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes mesh-1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        
        @keyframes mesh-2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          50% { transform: translate(-40px, -20px) rotate(180deg); }
        }
        
        @keyframes mesh-3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(25px, -15px) rotate(90deg); }
          75% { transform: translate(-15px, 25px) rotate(270deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes width-expand {
          0% { width: 0; }
          100% { width: 6rem; }
        }
        
        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(50px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.1; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        
        @keyframes pulse-ring-delay {
          0% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.05; }
          100% { transform: scale(1); opacity: 0.2; }
        }
        
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes pulse-core {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes particle {
          0%, 100% { opacity: 0; transform: translateY(0) scale(0); }
          50% { opacity: 1; transform: translateY(-20px) scale(1); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 5px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
        }
        
        .animate-mesh-1 { animation: mesh-1 20s ease-in-out infinite; }
        .animate-mesh-2 { animation: mesh-2 15s ease-in-out infinite; }
        .animate-mesh-3 { animation: mesh-3 18s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        .animate-gradient-shift { animation: gradient-shift 3s ease infinite; }
        .animate-width-expand { animation: width-expand 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out; }
        .animate-pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }
        .animate-pulse-ring-delay { animation: pulse-ring-delay 3s ease-in-out infinite 1s; }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
        .animate-pulse-core { animation: pulse-core 2s ease-in-out infinite; }
        .animate-orbit { animation: orbit 30s linear infinite; }
        .animate-particle { animation: particle var(--duration, 4s) ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .bg-300% { background-size: 300% 300%; }
        .bg-left { background-position: left; }
        .bg-right { background-position: right; }
      `}</style>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-gray-800">
              Payment Required
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-6">
            <Award className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <p className="text-gray-600 mb-6">
              To access exam features and proctoring tools, you need to purchase a package.
              Choose the package that best fits your needs.
            </p>
            <div className="space-y-4">
              <Button 
                onClick={() => {
                  setShowPaymentModal(false);
                  window.location.href = `/contact?package=${selectedPackage}`;
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue to Payment
              </Button>
              <Button 
                onClick={() => setShowPaymentModal(false)}
                variant="outline" 
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simplified registration - no complex forms needed */}
    </div>
  );
}
