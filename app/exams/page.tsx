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
} from "lucide-react";
import { Input } from "@/components/ui/input";

const examCategories = [
  {
    id: "waec",
    title: "WAEC Practice Exams",
    description: "Full-length practice exams based on WAEC format",
    icon: Trophy,
    color: "emerald",
    count: 25,
    difficulty: "Mixed",
  },
  {
    id: "wassce",
    title: "WASSCE Mock Exams",
    description: "Comprehensive mock exams for WASSCE preparation",
    icon: Target,
    color: "blue",
    count: 18,
    difficulty: "Advanced",
  },
  {
    id: "subject-specific",
    title: "Subject-Specific Tests",
    description: "Focused exams for individual subjects",
    icon: BookOpen,
    color: "purple",
    count: 42,
    difficulty: "Beginner to Advanced",
  },
];

const recentExams = [
  {
    id: 1,
    title: "WAEC Mathematics 2023",
    subject: "Mathematics",
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
    title: "Physics Comprehensive Test",
    subject: "Physics",
    duration: "2.5 hours",
    questions: 40,
    difficulty: "Intermediate",
    participants: 890,
    rating: 4.6,
    lastTaken: "1 week ago",
    bestScore: 78,
    color: "blue",
  },
  {
    id: 3,
    title: "Chemistry Mock Exam",
    subject: "Chemistry",
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
    title: "Biology Practice Test",
    subject: "Biology",
    duration: "2 hours",
    questions: 45,
    difficulty: "Intermediate",
    participants: 1100,
    rating: 4.9,
    lastTaken: "5 days ago",
    bestScore: 88,
    color: "emerald",
  },
];

const subjects = [
  "All Subjects",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
  "English",
];
const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ExamsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All Levels");
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
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
            >
              groupXam
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/quiz"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Quizzes
            </Link>
            <Link href="/exams" className="text-emerald-600 font-medium">
              Exams
            </Link>
            <Link
              href="/flashcards"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Flashcards
            </Link>
            <Link
              href="/discussions"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Discussions
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Practice Exams
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take comprehensive practice exams to prepare for your WAEC/WASSCE.
            Simulate real exam conditions and track your progress.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">85</div>
              <div className="text-sm text-gray-600">Exams Available</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">12K+</div>
              <div className="text-sm text-gray-600">Students Practicing</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
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

        {/* Exam Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Choose Your Exam Type
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {examCategories.map((category) => {
              const Icon = category.icon;
              const colors = getColorClasses(category.color);

              return (
                <Card
                  key={category.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex justify-between items-center mb-6 text-sm">
                      <Badge variant="secondary">{category.count} Exams</Badge>
                      <Badge className={colors.text}>
                        {category.difficulty}
                      </Badge>
                    </div>
                    <Button className={`w-full ${colors.button} shadow-md`}>
                      Browse Exams
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search exams..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Recent/Popular Exams */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Popular Practice Exams
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {recentExams.map((exam) => {
              const colors = getColorClasses(exam.color);

              return (
                <Card
                  key={exam.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`${colors.light} ${colors.text} border-0`}
                          >
                            {exam.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {exam.difficulty}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {exam.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{exam.rating}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{exam.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span>{exam.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{exam.participants.toLocaleString()} taken</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        <span>Best: {exam.bestScore}%</span>
                      </div>
                    </div>

                    {exam.bestScore && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Your Best Score</span>
                          <span className="font-medium">{exam.bestScore}%</span>
                        </div>
                        <Progress value={exam.bestScore} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button className={`flex-1 ${colors.button}`}>
                        <Play className="w-4 h-4 mr-2" />
                        Start Exam
                      </Button>
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    </div>
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
                <h3 className="text-xl font-bold mb-2">Exam Tips</h3>
                <ul className="space-y-2 text-emerald-100">
                  <li>• Read all questions carefully before starting</li>
                  <li>
                    • Manage your time effectively - don't spend too long on one
                    question
                  </li>
                  <li>• Review your answers before submitting</li>
                  <li>• Take practice exams regularly to build confidence</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
