"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  Play,
  Brain,
  MessageSquare,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const [user] = useState({
    name: "John Doe",
    email: "john@example.com",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "Economics"],
    totalQuestions: 1250,
    correctAnswers: 892,
    streak: 7,
    level: "Intermediate",
  });

  const recentActivity = [
    { subject: "Physics", type: "Quiz", score: 85, date: "2 hours ago" },
    { subject: "Chemistry", type: "Flashcards", score: 92, date: "1 day ago" },
    { subject: "Mathematics", type: "Exam", score: 78, date: "2 days ago" },
    { subject: "Biology", type: "Quiz", score: 88, date: "3 days ago" },
  ];

  const subjectProgress = [
    { name: "Physics", progress: 75, questions: 180, correct: 135 },
    { name: "Chemistry", progress: 82, questions: 160, correct: 131 },
    { name: "Mathematics", progress: 68, questions: 200, correct: 136 },
    { name: "Biology", progress: 71, questions: 150, correct: 107 },
    { name: "Economics", progress: 85, questions: 120, correct: 102 },
  ];

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
            <Link href="/dashboard" className="text-emerald-600 font-medium">
              Dashboard
            </Link>
            <Link
              href="/quiz"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Quizzes
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
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              {user.name.charAt(0)}
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to continue your learning journey? You're on a {user.streak}
            -day streak!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {user.totalQuestions}
                  </p>
                </div>
                <Target className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Accuracy</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      (user.correctAnswers / user.totalQuestions) * 100
                    )}
                    %
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Current Streak</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {user.streak} days
                  </p>
                </div>
                <Award className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {user.level}
                  </p>
                </div>
                <Brain className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg mb-8">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jump into your studies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <Button
                    asChild
                    className="h-20 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                  >
                    <Link
                      href="/quiz/random"
                      className="flex flex-col items-center space-y-2"
                    >
                      <Play className="w-6 h-6" />
                      <span>Quick Quiz</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 border-2 border-blue-200 hover:bg-blue-50"
                  >
                    <Link
                      href="/exam/practice"
                      className="flex flex-col items-center space-y-2"
                    >
                      <Clock className="w-6 h-6 text-blue-600" />
                      <span className="text-blue-600">Practice Exam</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 border-2 border-purple-200 hover:bg-purple-50"
                  >
                    <Link
                      href="/flashcards"
                      className="flex flex-col items-center space-y-2"
                    >
                      <Brain className="w-6 h-6 text-purple-600" />
                      <span className="text-purple-600">Flashcards</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-20 border-2 border-orange-200 hover:bg-orange-50"
                  >
                    <Link
                      href="/discussions"
                      className="flex flex-col items-center space-y-2"
                    >
                      <MessageSquare className="w-6 h-6 text-orange-600" />
                      <span className="text-orange-600">Discussions</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Subject Progress */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
                <CardDescription>
                  Your performance across different subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {subjectProgress.map((subject) => (
                    <div key={subject.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{subject.name}</span>
                        <Badge variant="secondary">
                          {subject.correct}/{subject.questions}
                        </Badge>
                      </div>
                      <Progress value={subject.progress} className="h-2" />
                      <p className="text-sm text-gray-600 mt-1">
                        {subject.progress}% complete
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {activity.subject}
                        </p>
                        <p className="text-xs text-gray-600">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <Badge
                        variant={activity.score >= 80 ? "default" : "secondary"}
                        className={activity.score >= 80 ? "bg-emerald-500" : ""}
                      >
                        {activity.score}%
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
