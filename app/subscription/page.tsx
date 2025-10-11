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
} from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AppHeader from "@/components/ui/app-header";
import { useAuth } from "@/hooks/use-auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Country currency data with competitive pricing
const countryPricing = {
  US: {
    name: "🇺🇸 United States",
    currency: "USD",
    symbol: "$",
    rates: {
      "3month": { monthly: 2, total: 6 },
      "6month": { monthly: 2, total: 12 },
      "12month": { monthly: 3, total: 36, discount: 5 },
    },
  },
  NG: {
    name: "🇳🇬 Nigeria",
    currency: "NGN",
    symbol: "₦",
    rates: {
      "3month": { monthly: 3000, total: 9000 },
      "6month": { monthly: 3000, total: 18000 },
      "12month": { monthly: 4500, total: 54000, discount: 5 },
    },
  },
  GB: {
    name: "🇬🇧 United Kingdom",
    currency: "GBP",
    symbol: "£",
    rates: {
      "3month": { monthly: 1.5, total: 4.5 },
      "6month": { monthly: 1.5, total: 9 },
      "12month": { monthly: 2.3, total: 27.6, discount: 5 },
    },
  },
  CA: {
    name: "🇨🇦 Canada",
    currency: "CAD",
    symbol: "C$",
    rates: {
      "3month": { monthly: 2.5, total: 7.5 },
      "6month": { monthly: 2.5, total: 15 },
      "12month": { monthly: 3.8, total: 45.6, discount: 5 },
    },
  },
  GH: {
    name: "🇬🇭 Ghana",
    currency: "GHS",
    symbol: "GH₵",
    rates: {
      "3month": { monthly: 25, total: 75 },
      "6month": { monthly: 25, total: 150 },
      "12month": { monthly: 38, total: 456, discount: 5 },
    },
  },
  SL: {
    name: "🇸🇱 Sierra Leone",
    currency: "SLL",
    symbol: "Le",
    rates: {
      "3month": { monthly: 40000, total: 120000 },
      "6month": { monthly: 40000, total: 240000 },
      "12month": { monthly: 60000, total: 720000, discount: 5 },
    },
  },
  PK: {
    name: "🇵🇰 Pakistan",
    currency: "PKR",
    symbol: "₨",
    rates: {
      "3month": { monthly: 500, total: 1500 },
      "6month": { monthly: 500, total: 3000 },
      "12month": { monthly: 750, total: 9000, discount: 5 },
    },
  },
  IN: {
    name: "🇮🇳 India",
    currency: "INR",
    symbol: "₹",
    rates: {
      "3month": { monthly: 150, total: 450 },
      "6month": { monthly: 150, total: 900 },
      "12month": { monthly: 225, total: 2700, discount: 5 },
    },
  },
  LR: {
    name: "🇱🇷 Liberia",
    currency: "LRD",
    symbol: "L$",
    rates: {
      "3month": { monthly: 350, total: 1050 },
      "6month": { monthly: 350, total: 2100 },
      "12month": { monthly: 525, total: 6300, discount: 5 },
    },
  },
};

export default function SubscriptionPage() {
  const { user } = useAuth();
  const [selectedCountry, setSelectedCountry] = useState<keyof typeof countryPricing>("US");
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

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
      name: "AI Tutor",
      icon: <Brain className="w-5 h-5" />,
      description: "24/7 AI-powered tutoring and homework assistance",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      name: "Whiteboard",
      icon: <FileText className="w-5 h-5" />,
      description: "Collaborative online whiteboard for brainstorming and problem-solving",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      name: "Math Help",
      icon: <Calculator className="w-5 h-5" />,
      description: "Step-by-step solutions and explanations for complex math problems",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Proofreading",
      icon: <FileText className="w-5 h-5" />,
      description: "Grammar, spelling, and style checks for essays and assignments",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      name: "Research Help",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Access to academic databases and research tools",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const subscriptionPlans = [
    {
      name: "3 Months",
      period: "3month",
      duration: "3 months",
      popular: false,
      color: "from-blue-500 to-indigo-500",
    },
    {
      name: "6 Months",
      period: "6month",
      duration: "6 months",
      popular: true,
      color: "from-emerald-500 to-green-500",
    },
    {
      name: "12 Months",
      period: "12month",
      duration: "12 months",
      popular: false,
      color: "from-purple-500 to-fuchsia-500",
      badge: "5% OFF",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Subscription" />
        
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

          {/* Hero Section - Futuristic Design */}
          <div className="text-center mb-12 relative">
            {/* Holographic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl scale-110 -z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
            
            <div className="relative">
              <Badge className="mb-6 bg-emerald-100/80 backdrop-blur-sm text-emerald-700 hover:bg-emerald-200/80 px-6 py-3 text-sm font-medium border border-emerald-200/50 shadow-lg animate-float">
                🎓 Premium Subscription
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight relative">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent relative">
                  Unlock Your Full Potential
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-lg blur-xl scale-110 -z-10"></div>
                </span>
                <br />
                <span className="text-gray-800 relative">
                  with groupXam Premium
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/10 to-gray-600/10 rounded-lg blur-lg scale-105 -z-10"></div>
                </span>
              </h1>
              <div className="relative">
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
                  Get access to all premium features and tools designed to accelerate your academic success
                </p>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse -z-10"></div>
              </div>
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

          {/* Premium Features Grid - Futuristic Design */}
          <div className="mb-16 relative">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 relative">
              Premium Features Included
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-lg blur-xl scale-110 -z-10"></div>
            </h2>
            
            <div className="relative">
              {/* Animated Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl scale-110"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              </div>
              
              <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 px-4">
                {/* AI Tutor Card */}
                <div className="relative group">
                  {/* Holographic Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-green-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative bg-gradient-to-br from-emerald-50 to-green-100 rounded-2xl p-4 sm:p-6 text-center border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-emerald-200/50 transition-all duration-500 transform group-hover:-translate-y-2">
                    {/* Floating Particles */}
                    <div className="absolute top-2 right-2 w-1 h-1 bg-emerald-400 rounded-full opacity-60 animate-bounce"></div>
                    <div className="absolute top-4 left-3 w-0.5 h-0.5 bg-green-400 rounded-full opacity-40 animate-ping"></div>
                    
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                      {/* Glow Effect */}
                      <div className="absolute inset-0 bg-emerald-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors duration-300">AI Tutor</h3>
                  </div>
                </div>
                
                {/* Whiteboard Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-amber-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  
                  <div className="relative bg-gradient-to-br from-orange-50 to-amber-100 rounded-2xl p-4 sm:p-6 text-center border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-500 transform group-hover:-translate-y-2">
                    <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full opacity-50 animate-pulse"></div>
                    
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-orange-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-orange-700 transition-colors duration-300">Whiteboard</h3>
                  </div>
                </div>
                
                {/* Math Help Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  
                  <div className="relative bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-4 sm:p-6 text-center border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-pink-200/50 transition-all duration-500 transform group-hover:-translate-y-2">
                    <div className="absolute bottom-2 left-2 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-60 animate-bounce"></div>
                    
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg">
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-pink-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-pink-700 transition-colors duration-300">Math Help</h3>
                  </div>
                </div>
                
                {/* Proofreading Card */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  
                  <div className="relative bg-gradient-to-br from-violet-50 to-purple-100 rounded-2xl p-4 sm:p-6 text-center border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-violet-200/50 transition-all duration-500 transform group-hover:-translate-y-2">
                    <div className="absolute top-3 right-2 w-0.5 h-0.5 bg-violet-400 rounded-full opacity-40 animate-ping"></div>
                    
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 shadow-lg">
                      <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-violet-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-violet-700 transition-colors duration-300">Proofreading</h3>
                  </div>
                </div>
                
                {/* Research Help Card */}
                <div className="relative group col-span-2 sm:col-span-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110"></div>
                  
                  <div className="relative bg-gradient-to-br from-yellow-50 to-orange-100 rounded-2xl p-4 sm:p-6 text-center border border-white/20 backdrop-blur-sm hover:shadow-2xl hover:shadow-yellow-200/50 transition-all duration-500 transform group-hover:-translate-y-2">
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 rounded-full opacity-70 animate-bounce"></div>
                    <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-orange-400 rounded-full opacity-50 animate-pulse"></div>
                    
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-yellow-400/30 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-xs sm:text-sm group-hover:text-yellow-700 transition-colors duration-300">Research Help</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Plans - Futuristic Design */}
          <div className="mb-16 relative">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4 relative">
              Choose Your Plan
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-blue-400/10 to-purple-400/10 rounded-lg blur-xl scale-110 -z-10"></div>
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Select the subscription duration that works best for you
            </p>

            <div className="relative">
              {/* Holographic Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 via-blue-400/5 to-purple-400/5 rounded-3xl blur-2xl scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
              
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 pt-6">
                {subscriptionPlans.map((plan) => {
                  const planPricing = pricing.rates[plan.period as keyof typeof pricing.rates];
                  return (
                    <div key={plan.period} className="relative group mt-6">
                      {/* Holographic Aura */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${plan.color.includes('emerald') ? 'from-emerald-400/20 to-green-400/20' : plan.color.includes('blue') ? 'from-blue-400/20 to-indigo-400/20' : 'from-purple-400/20 to-fuchsia-400/20'} rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-110`}></div>
                      
                      <Card 
                        className={`relative overflow-visible rounded-2xl bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-3 border border-white/20 min-h-[500px] ${
                          plan.popular ? 'shadow-2xl scale-105' : 'shadow-lg'
                        }`}
                      >
                        {plan.popular && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg z-30 animate-pulse-glow">
                            Most Popular
                          </div>
                        )}
                        {plan.badge && (
                          <div className="absolute -top-4 right-2 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl z-30 animate-float">
                            {plan.badge}
                          </div>
                        )}
                        
                        {/* Floating Particles */}
                        <div className={`absolute top-2 right-2 w-1 h-1 ${plan.color.includes('emerald') ? 'bg-emerald-400' : plan.color.includes('blue') ? 'bg-blue-400' : 'bg-purple-400'} rounded-full opacity-60 animate-bounce`}></div>
                        <div className={`absolute bottom-3 left-3 w-0.5 h-0.5 ${plan.color.includes('emerald') ? 'bg-green-400' : plan.color.includes('blue') ? 'bg-cyan-400' : 'bg-violet-400'} rounded-full opacity-40 animate-ping`}></div>
                        
                        <CardContent className="p-8 h-full flex flex-col justify-between">
                          <div>
                            <div className="text-center mb-6">
                              <div className={`relative w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                <Clock className="w-8 h-8 text-white drop-shadow-sm" />
                                {/* Icon Glow Effect */}
                                <div className={`absolute inset-0 ${plan.color.includes('emerald') ? 'bg-emerald-400' : plan.color.includes('blue') ? 'bg-blue-400' : 'bg-purple-400'}/30 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                              </div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-emerald-700 transition-colors duration-300">{plan.name}</h3>
                              <div className="relative text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                                {pricing.symbol}{planPricing.total.toLocaleString()}
                                <div className="absolute inset-0 bg-emerald-400/10 rounded-lg blur-sm -z-10"></div>
                              </div>
                              <p className="text-gray-600">
                                {pricing.symbol}{planPricing.monthly.toLocaleString()}/month
                              </p>
                              {'discount' in planPricing && planPricing.discount && (
                                <p className="text-sm text-green-600 font-semibold mt-1 animate-pulse">
                                  Save {planPricing.discount}%!
                                </p>
                              )}
                            </div>

                            <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">All 8 premium features</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">Unlimited practice tests</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">24/7 AI tutor support</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">Priority support</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">Mobile app access</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                              <span className="text-gray-700">Progress tracking</span>
                            </li>
                            <li className="flex items-center gap-3">
                              {plan.period === "12month" ? (
                                <>
                                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 animate-pulse" />
                                  <span className="text-gray-700 font-semibold">Exclusive 5% discount</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                  <span className="text-gray-700">Advanced analytics</span>
                                </>
                              )}
                            </li>
                          </ul>
                          </div>

                          <div>
                            <Link href={`/contact?package=subscription-${plan.period}&currency=${pricing.currency}`}>
                            <Button 
                              className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
                                plan.popular ? 'animate-pulse-glow' : ''
                              }`}
                            >
                              Get {plan.name} Plan
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

          {/* Comparison with Competitors */}
          <div className="mb-16">
            <Card className="border-0 shadow-xl bg-white">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Why Choose groupXam?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4">Feature</th>
                        <th className="text-center py-4 px-4">
                          <div className="font-bold text-emerald-600">groupXam</div>
                        </th>
                        <th className="text-center py-4 px-4">
                          <div className="font-semibold text-gray-600">uLearn</div>
                        </th>
                        <th className="text-center py-4 px-4">
                          <div className="font-semibold text-gray-600">Examity</div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4">Monthly Price (6 months)</td>
                        <td className="text-center py-4 px-4">
                          <Badge className="bg-emerald-100 text-emerald-700">{pricing.symbol}{pricing.rates["6month"].monthly}</Badge>
                        </td>
                        <td className="text-center py-4 px-4 text-gray-600">{pricing.symbol}{pricing.rates["6month"].monthly * 4}</td>
                        <td className="text-center py-4 px-4 text-gray-600">{pricing.symbol}{pricing.rates["6month"].monthly * 5}</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4">All Premium Features</td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4">AI Tutor 24/7</td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">Limited</span></td>
                        <td className="text-center py-4 px-4"><span className="text-red-500">✗</span></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4">Study Groups</td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center py-4 px-4"><span className="text-red-500">✗</span></td>
                        <td className="text-center py-4 px-4"><span className="text-red-500">✗</span></td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-4 px-4">Multi-Currency Support</td>
                        <td className="text-center py-4 px-4"><CheckCircle className="w-5 h-5 text-green-500 mx-auto" /></td>
                        <td className="text-center py-4 px-4"><span className="text-red-500">✗</span></td>
                        <td className="text-center py-4 px-4"><span className="text-gray-400">Limited</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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

