"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
  Brain,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import PageTransition from "@/components/PageTransition";
import AppHeader from "@/components/ui/app-header";

export default function IELTSInfoPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Exams" />
        
        <div className="container mx-auto py-12 px-4">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/exams/ielts">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to IELTS Exams
              </Button>
            </Link>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-4 py-2 text-sm font-medium">
              🎓 IELTS Preparation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Master IELTS
              </span>
              <br />
              <span className="text-gray-800">with Confidence</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              The International English Language Testing System (IELTS) is the world's most popular English language test for higher education and global migration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/exams/ielts?tab=practice">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg">
                  Start Practicing Now
                </Button>
              </Link>
              <Link href="/exams/ielts?tab=mock">
                <Button size="lg" variant="outline" className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-full">
                  Take Mock Exam
                </Button>
              </Link>
            </div>
          </div>

          {/* IELTS Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Academic</h3>
                <p className="text-gray-600 text-sm">For university admission and professional registration</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">General Training</h3>
                <p className="text-gray-600 text-sm">For work experience and immigration purposes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">2 Hours 45 Min</h3>
                <p className="text-gray-600 text-sm">Total test duration</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-amber-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Band 0-9</h3>
                <p className="text-gray-600 text-sm">Scoring system</p>
              </CardContent>
            </Card>
          </div>

          {/* Test Format Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Test Format</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Headphones className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Listening</h4>
                <p className="text-sm text-gray-600 mb-2">30 minutes + 10 minutes transfer time</p>
                <p className="text-xs text-gray-500">4 sections, 40 questions</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Reading</h4>
                <p className="text-sm text-gray-600 mb-2">60 minutes</p>
                <p className="text-xs text-gray-500">3 sections, 40 questions</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Writing</h4>
                <p className="text-sm text-gray-600 mb-2">60 minutes</p>
                <p className="text-xs text-gray-500">2 tasks</p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">Speaking</h4>
                <p className="text-sm text-gray-600 mb-2">11-14 minutes</p>
                <p className="text-xs text-gray-500">3 parts</p>
              </div>
            </div>
          </div>

          {/* IELTS Eligibility Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">IELTS Eligibility 2025</h3>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h4 className="text-xl font-bold text-gray-800 mb-4">Who Can Take IELTS?</h4>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  IDP IELTS has no definite eligibility criteria for students. Anyone who wishes to study, live, and work in an English-speaking country can take the IELTS exam irrespective of their age, educational qualification, sex, and nationality.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">General Requirements:</h5>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>No minimum age limit (recommended 16+)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>No educational qualification required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Valid passport or national ID required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Available to all nationalities</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">Popular Study Destinations:</h5>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Canada, Australia, UK, USA</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>New Zealand, Ireland, Germany</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Netherlands, Sweden, Denmark</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>And many more countries</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* University Requirements Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">University IELTS Requirements</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">University Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Country</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">IELTS Requirement</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Alberta</td>
                    <td className="border border-gray-300 px-4 py-3">Canada</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">6.0</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of British Columbia</td>
                    <td className="border border-gray-300 px-4 py-3">Canada</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-blue-600">6.0</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Melbourne</td>
                    <td className="border border-gray-300 px-4 py-3">Australia</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">6.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Australian National University</td>
                    <td className="border border-gray-300 px-4 py-3">Australia</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">6.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Cambridge</td>
                    <td className="border border-gray-300 px-4 py-3">UK</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">6.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Oxford</td>
                    <td className="border border-gray-300 px-4 py-3">UK</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-purple-600">6.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Massachusetts Institute of Technology</td>
                    <td className="border border-gray-300 px-4 py-3">USA</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-red-600">7.0</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Graduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">Stanford University</td>
                    <td className="border border-gray-300 px-4 py-3">USA</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-red-600">7.0</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Graduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Otago</td>
                    <td className="border border-gray-300 px-4 py-3">New Zealand</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-green-600">6.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 font-medium">University of Montpellier</td>
                    <td className="border border-gray-300 px-4 py-3">France</td>
                    <td className="border border-gray-300 px-4 py-3 text-center font-semibold text-orange-600">5.5</td>
                    <td className="border border-gray-300 px-4 py-3 text-center text-sm">Undergraduate</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> Requirements may vary by program and level. Always check with your specific university for exact requirements.
              </p>
            </div>
          </div>

          {/* IELTS Band Score Guide */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">IELTS Band Score Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">9</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Expert User</h4>
                <p className="text-sm text-gray-600">Fully operational command of the language</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">7-8</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Good User</h4>
                <p className="text-sm text-gray-600">Operational command with occasional inaccuracies</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">5-6</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Modest User</h4>
                <p className="text-sm text-gray-600">Partial command, coping with overall meaning</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Limited User</h4>
                <p className="text-sm text-gray-600">Basic competence in familiar situations</p>
              </div>
            </div>
          </div>

          {/* Test Types Comparison */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">IELTS Test Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">Academic IELTS</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>For university admission and professional registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Academic reading and writing tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Same listening and speaking as General Training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Valid for 2 years</span>
                  </li>
                </ul>
              </div>
              <div className="border-2 border-green-200 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800">General Training IELTS</h4>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>For work experience and immigration purposes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Everyday reading and writing tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Same listening and speaking as Academic</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Valid for 2 years</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Pricing Packages */}
          <div id="packages" className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 mb-16">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-gray-800 mb-4">Choose Your IELTS Package</h3>
              <p className="text-xl text-gray-600">Unlock your potential with our comprehensive IELTS preparation packages</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Monthly Package */}
              <Card className="relative overflow-hidden rounded-2xl shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Monthly</h4>
                    <div className="text-4xl font-bold text-blue-600 mb-2">$1.99</div>
                    <p className="text-gray-600">per month</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Unlimited practice tests</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">All 4 skills practice</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Detailed explanations</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Progress tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Mobile app access</span>
                    </li>
                  </ul>

                  <Link href="/contact?package=ielts-monthly">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                      Get Monthly Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 6 Month Package - Most Popular */}
              <Card className="relative overflow-hidden rounded-2xl shadow-2xl border-2 border-emerald-500 bg-white hover:shadow-3xl transition-all duration-300 group scale-105 h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-600"></div>
                <div className="absolute -top-3 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-20">
                  Most Popular
                </div>
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">6 Months</h4>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">$14.99</div>
                    <p className="text-gray-600">6 months access</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Everything in Monthly</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Mock exams with feedback</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Speaking practice with AI</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Writing task evaluation</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Priority support</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Study materials download</span>
                    </li>
                  </ul>

                  <Link href="/contact?package=ielts-6months">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                      Get 6 Month Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Yearly Package */}
              <Card className="relative overflow-hidden rounded-2xl shadow-xl border-0 bg-white hover:shadow-2xl transition-all duration-300 group h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-600"></div>
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-800 mb-2">Yearly</h4>
                    <div className="text-4xl font-bold text-purple-600 mb-2">$29.99</div>
                    <p className="text-gray-600">12 months access</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Everything in 6 Months</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">1-on-1 tutoring sessions</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Personalized study plan</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Exam strategy coaching</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Guaranteed score improvement</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">Lifetime access to materials</span>
                    </li>
                  </ul>

                  <Link href="/contact?package=ielts-yearly">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white font-semibold py-3 rounded-xl shadow-lg group-hover:shadow-xl transition-all">
                      Get Yearly Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Additional Features */}
            <div className="mt-12 text-center">
              <h4 className="text-2xl font-bold text-gray-800 mb-8">All Packages Include</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Real Exam Format</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI-Powered Learning</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center mb-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Progress Analytics</span>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Community Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Registration Process */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">How to Register for IELTS</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Choose Test Type</h4>
                <p className="text-sm text-gray-600">Select Academic or General Training based on your purpose</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Find Test Center</h4>
                <p className="text-sm text-gray-600">Locate your nearest IELTS test center and available dates</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Register Online</h4>
                <p className="text-sm text-gray-600">Complete registration form and upload required documents</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">4</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Pay & Confirm</h4>
                <p className="text-sm text-gray-600">Make payment and receive confirmation with test details</p>
              </div>
            </div>
          </div>

          {/* Test Day Tips */}
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Test Day Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-500" />
                  Before the Test
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Arrive 30 minutes early with valid ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Bring only allowed items (pens, pencils, eraser)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Get a good night's sleep before the test</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Eat a healthy breakfast</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-emerald-500" />
                  During the Test
                </h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Read all instructions carefully</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Manage your time effectively</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Answer all questions (no penalty for wrong answers)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Stay calm and focused throughout</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results & Validity */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-3xl p-8 mb-16">
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">Results & Validity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Results Timeline</h4>
                <p className="text-sm text-gray-600 mb-2">Computer-delivered: 3-5 days</p>
                <p className="text-sm text-gray-600">Paper-based: 13 days</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Validity Period</h4>
                <p className="text-sm text-gray-600 mb-2">IELTS scores are valid for</p>
                <p className="text-sm text-gray-600 font-semibold">2 years from test date</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Score Range</h4>
                <p className="text-sm text-gray-600 mb-2">Each skill scored from</p>
                <p className="text-sm text-gray-600 font-semibold">0 to 9 bands</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-12">
            <h3 className="text-4xl font-bold text-gray-800 mb-4">Ready to Start Your IELTS Journey?</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of students who have achieved their target IELTS scores with our comprehensive preparation platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/exams/ielts?tab=practice">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-12 py-4 rounded-full shadow-xl text-lg font-semibold">
                  Start Practicing Now
                </Button>
              </Link>
              <Link href="/exams/ielts?tab=mock">
                <Button size="lg" variant="outline" className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-12 py-4 rounded-full text-lg font-semibold">
                  Take Mock Exam
                </Button>
              </Link>
            </div>
            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">Choose your practice area:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/exams/ielts?tab=practice&skill=reading">
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    Reading Practice
                  </Button>
                </Link>
                <Link href="/exams/ielts?tab=practice&skill=listening">
                  <Button variant="outline" className="border-green-200 text-green-600 hover:bg-green-50">
                    Listening Practice
                  </Button>
                </Link>
                <Link href="/exams/ielts?tab=practice&skill=grammar">
                  <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
                    Grammar Practice
                  </Button>
                </Link>
                <Link href="/exams/ielts?tab=mock">
                  <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    Mock Exams
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
