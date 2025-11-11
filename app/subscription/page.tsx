"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Headphones,
  MessageSquare,
  Target,
  Clock,
  Users,
  Award,
  CheckCircle,
  Star,
  Brain,
  FileText,
  Calculator,
  Sparkles,
  Globe,
  ArrowLeft,
  Shield,
  XCircle,
  Code2,
  PenSquare,
  BookOpenCheck,
  GraduationCap,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Hook to detect if user prefers reduced motion or is on mobile
const useReducedMotion = () => {
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isMobile = window.innerWidth < 768;
    setShouldReduceMotion(mediaQuery.matches || isMobile);

    const handleResize = () => {
      setShouldReduceMotion(window.innerWidth < 768 || mediaQuery.matches);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return shouldReduceMotion;
};

// Country pricing with regional adjustments (Africa from $3.99, global from $6.99)
const countryPricing = {
  US: {
    name: "🇺🇸 United States",
    currency: "USD",
    symbol: "$",
    monthly: 6.99,
    baseUsd: 6.99,
  },
  GB: {
    name: "🇬🇧 United Kingdom",
    currency: "GBP",
    symbol: "£",
    monthly: 5.49,
    baseUsd: 6.99,
  },
  CA: {
    name: "🇨🇦 Canada",
    currency: "CAD",
    symbol: "C$",
    monthly: 9.49,
    baseUsd: 6.99,
  },
  NG: {
    name: "🇳🇬 Nigeria",
    currency: "NGN",
    symbol: "₦",
    monthly: 6000,
    baseUsd: 3.99,
  },
  GH: {
    name: "🇬🇭 Ghana",
    currency: "GHS",
    symbol: "GH₵",
    monthly: 60,
    baseUsd: 3.99,
  },
  RW: {
    name: "🇷🇼 Rwanda",
    currency: "RWF",
    symbol: "FRw",
    monthly: 5200,
    baseUsd: 3.99,
  },
  SL: {
    name: "🇸🇱 Sierra Leone",
    currency: "SLE",
    symbol: "Le",
    monthly: 90,
    baseUsd: 3.99,
  },
  LR: {
    name: "🇱🇷 Liberia",
    currency: "LRD",
    symbol: "L$",
    monthly: 760,
    baseUsd: 3.99,
  },
  PK: {
    name: "🇵🇰 Pakistan",
    currency: "PKR",
    symbol: "₨",
    monthly: 1950,
    baseUsd: 6.99,
  },
  IN: {
    name: "🇮🇳 India",
    currency: "INR",
    symbol: "₹",
    monthly: 580,
    baseUsd: 6.99,
  },
  KE: {
    name: "🇰🇪 Kenya",
    currency: "KES",
    symbol: "KSh",
    monthly: 540,
    baseUsd: 3.99,
  },
  GM: {
    name: "🇬🇲 Gambia",
    currency: "GMD",
    symbol: "D",
    monthly: 340,
    baseUsd: 3.99,
  },
  ZA: {
    name: "🇿🇦 South Africa",
    currency: "ZAR",
    symbol: "R",
    monthly: 74,
    baseUsd: 3.99,
  },
};

const ANNUAL_MONTHS_CHARGED = 10;

const premiumFeatures = [
  "AI-generated quizzes with instant marking",
  "Adaptive AI flashcards that learn from every session",
  "Scholarly research assistant with citations & source summaries",
  "Coding assistant for Python, JavaScript, and algorithm walkthroughs",
  "Writing mentor for essays, statements, and academic reviews",
  "Reading development coach for comprehension and note-taking",
  "IELTS prep plus international exam resources",
  "Upgraded study groups & accountability tools (coming soon)",
];

const premiumHighlights = [
  {
    title: "Scholarly Research Assistance",
    description:
      "Plan literature reviews, collect credible citations, and summarise journal articles in minutes with AI that understands academic standards.",
    icon: <GraduationCap className="w-6 h-6 text-indigo-500" />,
    gradient: "from-indigo-50 to-indigo-100",
  },
  {
    title: "Coding Assistant",
    description:
      "Debug code, generate practice exercises, and learn new concepts with guided explanations tailored to your syllabus.",
    icon: <Code2 className="w-6 h-6 text-emerald-500" />,
    gradient: "from-emerald-50 to-emerald-100",
  },
  {
    title: "Writing Mentor",
    description:
      "Refine essays, scholarship applications, and research reports with AI that checks structure, tone, and clarity.",
    icon: <PenSquare className="w-6 h-6 text-rose-500" />,
    gradient: "from-rose-50 to-rose-100",
  },
  {
    title: "Reading Development Coach",
    description:
      "Turn dense textbooks into digestible insights and build active-reading habits with personalised comprehension drills.",
    icon: <BookOpenCheck className="w-6 h-6 text-amber-500" />,
    gradient: "from-amber-50 to-amber-100",
  },
];

const planComparison = [
  {
    feature: "Quizzes",
    free: {
      available: true,
      description: "Topic-by-topic quizzes and practice drills",
    },
    premium: {
      available: true,
      description: "AI-generated quizzes with instant marking",
    },
  },
  {
    feature: "Flashcards",
    free: {
      available: true,
      description: "Smart flashcards library for core subjects",
    },
    premium: {
      available: true,
      description: "AI flashcards that adapt to your progress",
    },
  },
  {
    feature: "AI assistance",
    free: {
      available: true,
      description: "Guided answers with 7-day chat history",
    },
    premium: {
      available: true,
      description: "Full research, coding, writing & reading assistants (30-day history)",
    },
  },
  {
    feature: "Expert AI mentors",
    free: {
      available: false,
      description: "Not available on the free plan",
    },
    premium: {
      available: true,
      description: "Dedicated scholarly, coding, writing, and reading coaches",
    },
  },
  {
    feature: "Exam resources",
    free: {
      available: true,
      description: "Free JAMB, WAEC & WASSCE exam packs",
    },
    premium: {
      available: true,
      description: "Includes IELTS prep plus international exam resources",
    },
  },
  {
    feature: "Study groups",
    free: {
      available: true,
      description: "Community study groups",
    },
    premium: {
      available: true,
      description: "Upgraded accountability pods (coming soon)",
    },
  },
  {
    feature: "Tools",
    free: {
      available: true,
      description: "Exam calculator,Whiteboard & working sheets",
    },
    premium: {
      available: true,
      description: "All free tools plus premium analytics & planners",
    },
  },
  {
    feature: "Upcoming releases",
    free: {
      available: false,
      description: "Stick with essentials",
    },
    premium: {
      available: true,
      description: "Upgraded study pods, accountability reports, more",
    },
  },
];

const renderPlanCell = (plan: { available: boolean; description: string }) => (
  <div className="flex items-start gap-2">
    {plan.available ? (
      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
    ) : (
      <XCircle className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
    )}
    <span className={plan.available ? "text-gray-700" : "text-gray-400"}>{plan.description}</span>
  </div>
);

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countryPricing>("US");
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  // Detect user's country
  useEffect(() => {
    // Try to get country from user profile
    if (user?.country && countryPricing[user.country as keyof typeof countryPricing]) {
      setSelectedCountry(user.country as keyof typeof countryPricing);
      setDetectedCountry(user.country);
    } else {
      // Default to US
      setSelectedCountry("US");
    }
  }, [user]);

  const pricing = countryPricing[selectedCountry];

  const features = [
    {
      name: "AI Practice Quizzes",
      icon: <Target className="w-5 h-5" />,
      description: "Exam-style questions generated instantly for any topic",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      name: "Adaptive AI Flashcards",
      icon: <Sparkles className="w-5 h-5" />,
      description: "Dynamic flashcards that track mastery and knowledge gaps",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      name: "IELTS & Global Exams",
      icon: <Globe className="w-5 h-5" />,
      description: "Prep resources for IELTS and other international exams",
      gradient: "from-purple-500 to-fuchsia-500",
    },
    {
      name: "Research & Writing Assistant",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Guided support for essays, projects, and deep research",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      name: "Enhanced Study Groups",
      icon: <Users className="w-5 h-5" />,
      description: "Organised accountability pods with upcoming upgrades",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const subscriptionPlans = [
    {
      name: "Monthly Access",
      period: "monthly",
      duration: "Billed monthly · cancel anytime",
      popular: false,
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "Annual Access",
      period: "annual",
      duration: "Best value · 2 months free",
      popular: true,
      color: "from-emerald-500 to-green-500",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <Header />

        <div className="container mx-auto py-12 px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Hero Section - Optimized */}
          <div className="text-center mb-12 relative">
            {/* Background - Simplified for mobile */}
            {!reduceMotion && (
              <>
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl scale-110 -z-10"></div>
                <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              </>
            )}

            <div className="relative">
              <Badge className={`mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-6 py-3 text-sm font-medium border border-emerald-200 shadow-lg ${!reduceMotion ? 'md:animate-float' : ''}`}>
                🎓 Premium Subscription
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Unlock Your Full Potential
                </span>
                <br />
                <span className="text-gray-800">
                  with groupXam Premium
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                Get access to all premium features and tools designed to accelerate your academic success
              </p>
            </div>

            {/* Country Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 px-4">
              <div className="flex items-center gap-2 mb-2 sm:mb-0">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-600">Select your country:</span>
              </div>
              <Select value={selectedCountry} onValueChange={(value) => setSelectedCountry(value as keyof typeof countryPricing)}>
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(countryPricing).map(([code, data]) => (
                    <SelectItem key={code} value={code}>
                      {data.name} ({data.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {detectedCountry && (
              <p className="text-sm text-gray-500">
                We detected you're in {detectedCountry}. Prices are shown in your local currency.
              </p>
            )}
          </div>

          {/* Premium Features Grid - Optimized */}
          <div className="mb-16 relative">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Premium Features Included
            </h2>

            <div className="relative">
              {/* Background - Desktop only */}
              {!reduceMotion && (
                <div className="hidden md:block absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl scale-110"></div>
                </div>
              )}

              <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 px-4">
                {/* AI Tutor Card */}
                <div className="relative group">
                  {/* Hover effect - Desktop only */}
                  {!reduceMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  )}

                  <div className={`relative bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 sm:p-6 text-center border border-emerald-200 shadow-md hover:shadow-lg transition-shadow duration-300 ${!reduceMotion ? 'md:group-hover:-translate-y-2 md:transition-transform' : ''}`}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm">AI Tutor</h3>
                  </div>
                </div>

                {/* Whiteboard Card */}
                <div className="relative group">
                  {!reduceMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  )}

                  <div className={`relative bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 sm:p-6 text-center border border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300 ${!reduceMotion ? 'md:group-hover:-translate-y-2 md:transition-transform' : ''}`}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Whiteboard</h3>
                  </div>
                </div>

                {/* Math Help Card */}
                <div className="relative group">
                  {!reduceMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  )}

                  <div className={`relative bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-4 sm:p-6 text-center border border-pink-200 shadow-md hover:shadow-lg transition-shadow duration-300 ${!reduceMotion ? 'md:group-hover:-translate-y-2 md:transition-transform' : ''}`}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Math Help</h3>
                  </div>
                </div>

                {/* Proofreading Card */}
                <div className="relative group">
                  {!reduceMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  )}

                  <div className={`relative bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-4 sm:p-6 text-center border border-violet-200 shadow-md hover:shadow-lg transition-shadow duration-300 ${!reduceMotion ? 'md:group-hover:-translate-y-2 md:transition-transform' : ''}`}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Proofreading</h3>
                  </div>
                </div>

                {/* Research Help Card */}
                <div className="relative group col-span-2 sm:col-span-1">
                  {!reduceMotion && (
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  )}

                  <div className={`relative bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-4 sm:p-6 text-center border border-yellow-200 shadow-md hover:shadow-lg transition-shadow duration-300 ${!reduceMotion ? 'md:group-hover:-translate-y-2 md:transition-transform' : ''}`}>
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm">Research Help</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Upgrade */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm shadow-sm">
                <Lightbulb className="w-4 h-4" />
                Why students go Premium
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mt-4">
                Unlock AI partners that accelerate every part of study life
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mt-3">
                Premium isn’t just more responses — it gives you specialist AI assistants for deep research, coding help,
                polished writing, and stronger reading comprehension.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {premiumHighlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className={`rounded-3xl border border-gray-100 shadow-lg p-6 bg-gradient-to-br ${highlight.gradient}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-white shadow-md">{highlight.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{highlight.title}</h3>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Plans - Optimized */}
          <div className="mb-16 relative">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-center text-gray-600">
              Select the subscription duration that works best for you
            </p>
            <p className="text-center text-sm text-gray-500 mt-2 mb-8">
              Regional pricing: Africa from $3.99/month, US/UK & others from $6.99/month — shown here in your selected currency.
            </p>

            <div className="relative">
              {/* Background - Desktop only */}
              {!reduceMotion && (
                <div className="hidden md:block absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-blue-400/5 to-purple-400/5 rounded-3xl blur-2xl scale-110"></div>
              )}

              <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 pt-6">
                {subscriptionPlans.map((plan) => {
                  if (!pricing) {
                    return null;
                  }

                  const monthlyPrice = pricing.monthly;
                  const annualTotalRaw = monthlyPrice * ANNUAL_MONTHS_CHARGED;
                  const annualMonthlyRaw = annualTotalRaw / 12;
                  const annualMonthly = Number(annualMonthlyRaw.toFixed(2));
                  const annualTotal = Number(annualTotalRaw.toFixed(2));
                  const annualDiscount = monthlyPrice
                    ? Math.max(0, Math.round((1 - annualMonthlyRaw / monthlyPrice) * 100))
                    : 0;

                  const planPricing =
                    plan.period === "annual"
                      ? {
                        monthly: annualMonthly,
                        total: annualTotal,
                        discount: annualDiscount,
                      }
                      : {
                        monthly: monthlyPrice,
                        total: monthlyPrice,
                        discount: 0,
                      };

                  const hasMonthlyDecimals = Math.abs(planPricing.monthly - Math.round(planPricing.monthly)) > 0.001;
                  const monthlyFormatted = planPricing.monthly.toLocaleString(undefined, {
                    minimumFractionDigits: hasMonthlyDecimals ? 2 : 0,
                    maximumFractionDigits: hasMonthlyDecimals ? 2 : 0,
                  });
                  const hasTotalDecimals = Math.abs(planPricing.total - Math.round(planPricing.total)) > 0.001;
                  const totalFormatted = planPricing.total.toLocaleString(undefined, {
                    minimumFractionDigits: hasTotalDecimals ? 2 : 0,
                    maximumFractionDigits: hasTotalDecimals ? 2 : 0,
                  });

                  const discountBadge =
                    plan.period === "annual" && planPricing.discount
                      ? `Save ${planPricing.discount}%`
                      : undefined;

                  const baseUsdNote = pricing.baseUsd
                    ? `≈ $${pricing.baseUsd.toFixed(2)} USD / month`
                    : null;

                  return (
                    <div key={plan.period} className="relative group">
                      {!reduceMotion && (
                        <div
                          className="hidden md:block absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105"
                          aria-hidden="true"
                        />
                      )}

                      <Card
                        className={`relative overflow-hidden rounded-2xl bg-white transition-all duration-300 border ${plan.popular ? "shadow-2xl border-emerald-200" : "shadow-lg border-gray-200"
                          } ${!reduceMotion ? "md:group-hover:-translate-y-3 md:group-hover:shadow-2xl" : ""}`}
                      >
                        {plan.popular && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                            Most Popular
                          </div>
                        )}
                        {discountBadge && (
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                            {discountBadge}
                          </div>
                        )}

                        <CardContent className="p-8 space-y-6 flex flex-col h-full">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-2xl font-bold text-gray-800">{plan.name}</h3>
                                <p className="text-sm text-gray-500">{plan.duration}</p>
                              </div>
                              <div
                                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}
                              >
                                <Clock className="w-6 h-6 text-white" />
                              </div>
                            </div>

                            <div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-extrabold text-gray-900">
                                  {pricing.symbol}
                                  {monthlyFormatted}
                                </span>
                                <span className="text-gray-500">/month</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {plan.period === "annual"
                                  ? "Billed annually — 2 months free"
                                  : "Billed monthly — cancel anytime"}
                              </p>
                              <p className="text-xs text-emerald-600 font-semibold mt-1">
                                {pricing.symbol}
                                {totalFormatted} {plan.period === "annual" ? "per year" : "per month"}
                                {baseUsdNote ? ` · ${baseUsdNote}` : ""}
                              </p>
                            </div>
                          </div>

                          <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 space-y-3">
                            <h4 className="text-sm font-semibold text-emerald-700">Everything in Premium:</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                              {premiumFeatures.map((feature) => (
                                <li key={feature} className="flex items-start gap-2">
                                  <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                              {plan.period === "annual" && (
                                <li className="flex items-start gap-2">
                                  <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                  <span>Priority email support & quarterly premium workshops</span>
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="pt-2">
                            <Link href={`/contact?package=subscription-${plan.period}&currency=${pricing.currency}`}>
                              <Button
                                className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-300 ${!reduceMotion ? "md:hover:shadow-xl md:hover:scale-[1.02]" : ""
                                  }`}
                              >
                                Get {plan.name}
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">What’s Included</h2>
            <p className="text-center text-gray-600 mb-10">
              Compare the essentials in the free plan with the advanced support unlocked in Premium.
            </p>

            <div className="max-w-5xl mx-auto">
              <div className="overflow-hidden rounded-3xl border border-gray-200 shadow-xl bg-white/95">
                <div className="grid grid-cols-2 divide-x divide-gray-100 bg-gradient-to-r from-gray-50 via-white to-emerald-50">
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gray-100 text-gray-700 border border-gray-200">Free plan</Badge>
                      <div>
                        <p className="text-lg font-semibold text-gray-800">Everything to get started</p>
                        <p className="text-xs text-gray-500">Perfect for quick revision and group study.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">Premium</Badge>
                        <div>
                          <p className="text-lg font-semibold text-gray-800">Unlock the full AI suite</p>
                          <p className="text-xs text-emerald-700/80">
                            Ideal for exam season, IELTS prep, research projects, and daily AI support.
                          </p>
                        </div>
                      </div>
                      {pricing && (
                        <div className="text-right text-sm text-emerald-700 font-semibold">
                          From{" "}
                          {pricing.symbol}
                          {pricing.monthly.toLocaleString(undefined, {
                            minimumFractionDigits:
                              Math.abs(pricing.monthly - Math.round(pricing.monthly)) > 0.001 ? 2 : 0,
                            maximumFractionDigits:
                              Math.abs(pricing.monthly - Math.round(pricing.monthly)) > 0.001 ? 2 : 0,
                          })}
                          /month
                          {pricing.baseUsd ? (
                            <span className="block text-[11px] text-emerald-600/80">
                              (≈ ${pricing.baseUsd.toFixed(2)} USD monthly)
                            </span>
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {planComparison.map((row, index) => (
                        <tr
                          key={row.feature}
                          className={index % 2 === 0 ? "bg-white" : "bg-gray-50/70"}
                        >
                          <th className="text-left align-top font-semibold text-gray-600 px-6 py-4 w-48">
                            {row.feature}
                          </th>
                          <td className="px-6 py-4 align-top border-l border-gray-100">
                            {renderPlanCell(row.free)}
                          </td>
                          <td className="px-6 py-4 align-top border-l border-gray-100 bg-emerald-50/60">
                            {renderPlanCell(row.premium)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Can I cancel anytime?</h3>
                  <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Do you offer refunds?</h3>
                  <p className="text-gray-600">We offer a 14-day money-back guarantee if you're not satisfied with our service.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Can I upgrade my plan?</h3>
                  <p className="text-gray-600">Yes, you can upgrade to a longer duration plan at any time and receive prorated pricing.</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">Is payment secure?</h3>
                  <p className="text-gray-600">Yes, all payments are processed securely through our encrypted payment gateway.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have transformed their academic journey with groupXam Premium
            </p>
            <Link href="/contact?package=subscription">
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-4 rounded-full shadow-xl text-lg font-semibold">
                Choose Your Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

