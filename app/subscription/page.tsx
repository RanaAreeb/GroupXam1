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
      name: "AI Tutor & Homework Help",
      icon: <Brain className="w-5 h-5" />,
      description: "24/7 AI-powered tutoring and homework assistance",
      gradient: "from-emerald-500 to-green-500",
    },
    {
      name: "Research Assistance",
      icon: <FileText className="w-5 h-5" />,
      description: "Advanced research tools and academic support",
      gradient: "from-orange-500 to-amber-500",
    },
    {
      name: "Whiteboard",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Interactive digital whiteboard for visual learning",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      name: "Math Help",
      icon: <Calculator className="w-5 h-5" />,
      description: "Step-by-step math problem solving and explanations",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      name: "Proofreading",
      icon: <Sparkles className="w-5 h-5" />,
      description: "AI-powered grammar checking and writing enhancement",
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

          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
              🎓 Premium Subscription
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Unlock Your Full Potential
              </span>
              <br />
              <span className="text-gray-800">with groupXam Premium</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Get access to all premium features and tools designed to accelerate your academic success
            </p>

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

          {/* Premium Features Grid */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Premium Features Included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-4 sm:p-6">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                      <span className="text-white">{feature.icon}</span>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2">{feature.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Select the subscription duration that works best for you
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {subscriptionPlans.map((plan) => {
                const planPricing = pricing.rates[plan.period as keyof typeof pricing.rates];
                return (
                  <Card 
                    key={plan.period}
                    className={`relative overflow-hidden rounded-2xl border-0 bg-white hover:shadow-2xl transition-all duration-300 ${
                      plan.popular ? 'shadow-2xl scale-105' : 'shadow-lg'
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
                    )}
                    {plan.badge && (
                      <div className="absolute -top-3 right-4 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-20">
                        {plan.badge}
                      </div>
                    )}
                    <CardContent className="p-8 h-full flex flex-col">
                      <div className="text-center mb-6">
                        <div className={`w-16 h-16 bg-gradient-to-br ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <Clock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                        <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">
                          {pricing.symbol}{planPricing.total.toLocaleString()}
                        </div>
                        <p className="text-gray-600">
                          {pricing.symbol}{planPricing.monthly.toLocaleString()}/month
                        </p>
                        {'discount' in planPricing && planPricing.discount && (
                          <p className="text-sm text-green-600 font-semibold mt-1">
                            Save {planPricing.discount}%!
                          </p>
                        )}
                      </div>

                      <ul className="space-y-3 mb-8 flex-grow">
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
                        {plan.period === "12month" && (
                          <li className="flex items-center gap-3">
                            <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                            <span className="text-gray-700 font-semibold">Exclusive 5% discount</span>
                          </li>
                        )}
                      </ul>

                      <Link href={`/contact?package=subscription-${plan.period}&currency=${pricing.currency}`}>
                        <Button 
                          className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all ${
                            plan.popular ? 'scale-105' : ''
                          }`}
                        >
                          Get {plan.name} Plan
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
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

