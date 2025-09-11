"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookOpen,
  Target,
  Users,
  Trophy,
  Play,
  AlertCircle,
  Star,
  Search,
  GraduationCap,
  School,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Heart,
  Leaf,
  Microscope,
  Pill,
  TreePine,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator as FinanceIcon,
  Vote,
  BookMarked,
  Globe,
  TestTube,
  Dna,
  Leaf as EcologyIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/ui/app-header";
import ProtectedRoute from "@/components/ProtectedRoute";

// Remove all dynamic fetching and use static data for exam types and exams
// Each exam type card links to a static page (e.g., /exams/waec)
// Use the website's header and color scheme for design consistency
const examTypes = [
  {
    id: "waec",
    title: "WAEC",
    description: "West African Examinations Council",
    icon: GraduationCap,
    color: "emerald",
    count: 33,
    difficulty: "Advanced",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    id: "wassce",
    title: "WASSCE",
    description: "West African Senior School Certificate Examination",
    icon: School,
    color: "blue",
    count: 22,
    difficulty: "Advanced",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    id: "ielts",
    title: "IELTS",
    description: "International English Language Testing System",
    icon: BookOpen,
    color: "indigo",
    count: 3,
    difficulty: "Intermediate",
    gradient: "from-indigo-400 to-indigo-600",
  },
  {
    id: "jamb",
    title: "JAMB",
    description: "Joint Admissions and Matriculation Board",
    icon: BookOpen,
    color: "purple",
    count: 15,
    difficulty: "Advanced",
    gradient: "from-purple-400 to-purple-600",
  },
];

// Remove the subject tiles section (Sciences, Economics & Business, Mathematics, etc.) from this page
// Only show the main exam types (WAEC, WASSCE, SAT, ACT)
const recentExams = [
  {
    id: 1,
    title: "WAEC Physics 2024",
    subject: "Physics",
    examType: "WAEC",
    duration: "3 hours",
    questions: 50,
    difficulty: "Advanced",
    participants: 1250,
    rating: 4.8,
    lastTaken: "2 days ago",
    bestScore: 85,
    color: "emerald",
  },
  {
    id: 2,
    title: "SAT Mathematics",
    subject: "Mathematics",
    examType: "SAT",
    duration: "2.5 hours",
    questions: 58,
    difficulty: "Advanced",
    participants: 890,
    rating: 4.6,
    lastTaken: "1 week ago",
    bestScore: 78,
    color: "blue",
  },
  {
    id: 3,
    title: "WASSCE Chemistry",
    subject: "Chemistry",
    examType: "WASSCE",
    duration: "2 hours",
    questions: 35,
    difficulty: "Advanced",
    participants: 675,
    rating: 4.7,
    lastTaken: "3 days ago",
    bestScore: 92,
    color: "purple",
  },
  {
    id: 4,
    title: "ACT Biology",
    subject: "Biology",
    examType: "ACT",
    duration: "2 hours",
    questions: 45,
    difficulty: "Advanced",
    participants: 1100,
    rating: 4.9,
    lastTaken: "5 days ago",
    bestScore: 88,
    color: "emerald",
  },
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ExamsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "from-emerald-500 to-emerald-600",
        light: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
      },
      blue: {
        bg: "from-blue-500 to-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      purple: {
        bg: "from-purple-500 to-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      orange: {
        bg: "from-orange-500 to-orange-600",
        light: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        button: "bg-orange-600 hover:bg-orange-700",
      },
      red: {
        bg: "from-red-500 to-red-600",
        light: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        button: "bg-red-600 hover:bg-red-700",
      },
      pink: {
        bg: "from-pink-500 to-pink-600",
        light: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        button: "bg-pink-600 hover:bg-pink-700",
      },
      green: {
        bg: "from-green-500 to-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        button: "bg-green-600 hover:bg-green-700",
      },
      indigo: {
        bg: "from-indigo-500 to-indigo-600",
        light: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        button: "bg-indigo-600 hover:bg-indigo-700",
      },
      violet: {
        bg: "from-violet-500 to-violet-600",
        light: "bg-violet-50",
        text: "text-violet-600",
        border: "border-violet-200",
        button: "bg-violet-600 hover:bg-violet-700",
      },
      teal: {
        bg: "from-teal-500 to-teal-600",
        light: "bg-teal-50",
        text: "text-teal-600",
        border: "border-teal-200",
        button: "bg-teal-600 hover:bg-teal-700",
      },
      amber: {
        bg: "from-amber-500 to-amber-600",
        light: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        button: "bg-amber-600 hover:bg-amber-700",
      },
      cyan: {
        bg: "from-cyan-500 to-cyan-600",
        light: "bg-cyan-50",
        text: "text-cyan-600",
        border: "border-cyan-200",
        button: "bg-cyan-600 hover:bg-cyan-700",
      },
      sky: {
        bg: "from-sky-500 to-sky-600",
        light: "bg-sky-50",
        text: "text-sky-600",
        border: "border-sky-200",
        button: "bg-sky-600 hover:bg-sky-700",
      },
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader userInitial="J" active="Exams" />

        <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Practice Exams
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All subjects are organized by category. Click to explore
            subcategories and start practicing!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 mt-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                66+
              </div>
              <div className="text-sm text-gray-600">Exams Available</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">Expert</div>
              <div className="text-sm text-gray-600">Curated Content</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">96%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                2.5h
              </div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Choose Your Exam Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {examTypes.map((type) => {
              const color = getColorClasses(type.color);
              return (
                <Card
                  key={type.id}
                  className={`
                    relative overflow-hidden rounded-3xl shadow-xl border-0
                    bg-white/70 backdrop-blur-md
                    transition-transform duration-300
                    hover:scale-105 hover:shadow-2xl
                    group
                  `}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mb-4 border-4 border-white group-hover:shadow-emerald-200">
                      <type.icon className={`w-8 h-8 ${color.text}`} />
                    </div>
                    <div className="font-bold text-2xl mb-1 text-gray-900 tracking-wide">
                      {type.title}
                    </div>
                    <div className="text-gray-700 text-sm mb-3">
                      {type.description}
                    </div>
                    <div className="flex items-center gap-2 mb-6">
                      <Badge className="bg-emerald-100 text-emerald-700 px-3 py-1 shadow">
                        {type.count} Exams
                      </Badge>
                      <Badge className="bg-black text-white px-3 py-1">
                        {type.difficulty}
                      </Badge>
                    </div>
                    <Button
                      asChild
                      className={`w-full rounded-full font-semibold shadow-lg ${color.button} text-base py-3`}
                    >
                      <Link
                        href={`/exams/${type.id}`}
                      >{`Browse ${type.title}`}</Link>
                    </Button>
                    {/* Decorative gradient blob */}
                    <span
                      className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${type.gradient}`}
                    ></span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Exam Preparation Tips
                </h3>
                <ul className="space-y-2 text-emerald-100">
                  <li>• Read all questions carefully before starting</li>
                  <li>
                    • Manage your time effectively - don't spend too long on one
                    question
                  </li>
                  <li>• Review your answers before submitting</li>
                  <li>• Take practice exams regularly to build confidence</li>
                  <li>
                    • Focus on your weak areas and practice specific subjects
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
