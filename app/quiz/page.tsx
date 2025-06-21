"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  BookOpen,
  Zap,
  Brain,
  Trophy,
  Play,
  CheckCircle,
  Star,
  Search,
  Shuffle,
  BarChart3,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const quizCategories = [
  {
    id: "quick",
    title: "Quick Practice",
    description: "5-10 minute quizzes for quick review sessions",
    icon: Zap,
    color: "emerald",
    count: 150,
    avgTime: "7 min",
    difficulty: "Mixed",
  },
  {
    id: "subject-focus",
    title: "Subject Focus",
    description: "Deep dive into specific subjects with targeted questions",
    icon: Target,
    color: "blue",
    count: 85,
    avgTime: "15 min",
    difficulty: "Intermediate",
  },
  {
    id: "brain-training",
    title: "Brain Training",
    description: "Challenge yourself with advanced problem-solving quizzes",
    icon: Brain,
    color: "purple",
    count: 45,
    avgTime: "20 min",
    difficulty: "Advanced",
  },
];

const featuredQuizzes = [
  {
    id: 1,
    title: "Mathematics Fundamentals",
    subject: "Mathematics",
    questions: 15,
    duration: "12 min",
    difficulty: "Beginner",
    participants: 2340,
    rating: 4.8,
    completed: true,
    bestScore: 92,
    color: "emerald",
    topics: ["Algebra", "Geometry", "Statistics"],
  },
  {
    id: 2,
    title: "Physics: Motion & Forces",
    subject: "Physics",
    questions: 20,
    duration: "18 min",
    difficulty: "Intermediate",
    participants: 1890,
    rating: 4.6,
    completed: false,
    bestScore: null,
    color: "blue",
    topics: ["Mechanics", "Forces", "Energy"],
  },
  {
    id: 3,
    title: "Chemistry Bonding",
    subject: "Chemistry",
    questions: 12,
    duration: "10 min",
    difficulty: "Intermediate",
    participants: 1560,
    rating: 4.9,
    completed: true,
    bestScore: 85,
    color: "purple",
    topics: ["Ionic Bonds", "Covalent Bonds", "Metallic Bonds"],
  },
  {
    id: 4,
    title: "Biology: Cell Structure",
    subject: "Biology",
    questions: 18,
    duration: "15 min",
    difficulty: "Beginner",
    participants: 2100,
    rating: 4.7,
    completed: false,
    bestScore: null,
    color: "emerald",
    topics: ["Cell Organelles", "Cell Membrane", "Nucleus"],
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

export default function QuizPage() {
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
            <Link href="/quiz" className="text-emerald-600 font-medium">
              Quizzes
            </Link>
            <Link
              href="/exams"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
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
              Practice Quizzes
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with interactive quizzes. Get instant feedback
            and track your progress across all subjects.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-lg"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Random Quiz
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-2 hover:border-emerald-600 hover:text-emerald-600"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            View Progress
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                280
              </div>
              <div className="text-sm text-gray-600">Quizzes Available</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">45</div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">87%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">12</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Choose Your Quiz Style
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {quizCategories.map((category) => {
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
                    <div className="grid grid-cols-2 gap-2 mb-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {category.count}
                        </div>
                        <div className="text-gray-500">Quizzes</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {category.avgTime}
                        </div>
                        <div className="text-gray-500">Avg Time</div>
                      </div>
                    </div>
                    <Button className={`w-full ${colors.button} shadow-md`}>
                      Start Quiz
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
                placeholder="Search quizzes..."
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

        {/* Featured Quizzes */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Featured Quizzes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featuredQuizzes.map((quiz) => {
              const colors = getColorClasses(quiz.color);

              return (
                <Card
                  key={quiz.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            className={`${colors.light} ${colors.text} border-0`}
                          >
                            {quiz.subject}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {quiz.difficulty}
                          </Badge>
                          {quiz.completed && (
                            <Badge className="bg-green-100 text-green-700 border-0">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                          {quiz.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{quiz.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {quiz.topics.map((topic, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {topic}
                        </Badge>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {quiz.questions}
                        </div>
                        <div>Questions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {quiz.duration}
                        </div>
                        <div>Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-800">
                          {quiz.participants.toLocaleString()}
                        </div>
                        <div>Taken</div>
                      </div>
                    </div>

                    {quiz.bestScore && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Your Best Score</span>
                          <span className="font-medium">{quiz.bestScore}%</span>
                        </div>
                        <Progress value={quiz.bestScore} className="h-2" />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button className={`flex-1 ${colors.button}`}>
                        <Play className="w-4 h-4 mr-2" />
                        {quiz.completed ? "Retake Quiz" : "Start Quiz"}
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

        {/* Study Tips */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Quiz Tips for Success
                </h3>
                <ul className="space-y-2 text-emerald-100">
                  <li>• Take quizzes regularly to reinforce learning</li>
                  <li>• Review explanations for wrong answers</li>
                  <li>• Focus on your weak subjects more</li>
                  <li>• Use quick quizzes for daily practice</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
