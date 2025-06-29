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
  AlertCircle,
  GraduationCap,
  School,
  BookMarked,
  TestTube,
  Atom,
  FlaskConical,
  Heart,
  Leaf,
  Microscope,
  Pill,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Vote,
  Dna,
  Leaf as EcologyIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/ui/app-header";

// Exam Types (copied from Exams page)
const examTypes = [
  {
    id: "waec",
    title: "WAEC",
    description: "West African Examinations Council",
    icon: GraduationCap,
    color: "emerald",
  },
  {
    id: "wassce",
    title: "WASSCE",
    description: "West African Senior School Certificate Examination",
    icon: School,
    color: "blue",
  },
  {
    id: "sat",
    title: "SAT",
    description: "Scholastic Assessment Test",
    icon: BookMarked,
    color: "purple",
  },
  {
    id: "act",
    title: "ACT",
    description: "American College Testing",
    icon: TestTube,
    color: "orange",
  },
];

// Subject Categories (copied from Exams page, shortened for brevity)
const subjectCategories = [
  {
    id: "sciences",
    title: "Sciences",
    icon: Atom,
    color: "emerald",
    subjects: [
      { name: "Physics", icon: Atom, color: "emerald" },
      { name: "Chemistry", icon: FlaskConical, color: "blue" },
      { name: "Biology", icon: Leaf, color: "green" },
      { name: "Anatomy", icon: Heart, color: "red" },
      { name: "Physiology", icon: Brain, color: "pink" },
      { name: "Microbiology", icon: Microscope, color: "orange" },
      { name: "Biochemistry", icon: Dna, color: "indigo" },
      { name: "Pharmacology", icon: Pill, color: "violet" },
      { name: "Ecology", icon: EcologyIcon, color: "teal" },
      { name: "Psychology", icon: Brain, color: "amber" },
    ],
  },
  {
    id: "economics",
    title: "Economics & Business",
    icon: DollarSign,
    color: "blue",
    subjects: [
      { name: "Economics", icon: DollarSign, color: "blue" },
      { name: "Micro Economics", icon: TrendingDown, color: "cyan" },
      { name: "Macro Economics", icon: TrendingUp, color: "sky" },
      { name: "Accounting", icon: Calculator, color: "emerald" },
      { name: "Finance", icon: Calculator, color: "purple" },
      { name: "Political Science", icon: Vote, color: "red" },
    ],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    icon: Calculator,
    color: "purple",
    subjects: [
      { name: "Statistics", icon: Calculator, color: "purple" },
      { name: "Calculus", icon: Calculator, color: "indigo" },
      { name: "Algebra", icon: Calculator, color: "blue" },
      { name: "Arithmetic", icon: Calculator, color: "emerald" },
      { name: "Geometry", icon: Calculator, color: "teal" },
      { name: "Trigonometry", icon: Calculator, color: "cyan" },
      { name: "Pythagorean Theorem", icon: Calculator, color: "orange" },
    ],
  },
];

// Mock quizzes per subject
const getMockQuizzes = (subject: string) =>
  Array.from({ length: 5 }).map((_, i) => ({
    id: `${subject}-quiz-${i + 1}`,
    title: `${subject} Quiz ${i + 1}`,
    questions: 10 + i * 2,
    difficulty: ["Beginner", "Intermediate", "Advanced"][i % 3],
  }));

export default function QuizPage() {
  const [selectedExam, setSelectedExam] = useState<string>(examTypes[0].id);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories/subjects by search
  const filteredCategories = subjectCategories
    .map((cat) => ({
      ...cat,
      subjects: cat.subjects.filter((subj) =>
        subj.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.subjects.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader userInitial="J" active="Quizzes" />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Exam Preparation Quizzes
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice quizzes for every subject and exam type. Select your exam,
            pick a subject, and start mastering your prep!
          </p>
        </div>
        {/* Exam Type Selector */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {examTypes.map((exam) => {
            const Icon = exam.icon;
            return (
              <Button
                key={exam.id}
                variant={selectedExam === exam.id ? "default" : "outline"}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-base shadow-md ${
                  selectedExam === exam.id
                    ? "bg-gradient-to-r from-emerald-500 to-blue-500 text-white"
                    : ""
                }`}
                onClick={() => setSelectedExam(exam.id)}
              >
                <Icon className="w-5 h-5" />
                {exam.title}
              </Button>
            );
          })}
        </div>
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {/* Categories Accordion */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isCatOpen = expandedCategory === category.id;
            return (
              <Card key={category.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <button
                    className="flex items-center w-full text-left focus:outline-none"
                    onClick={() =>
                      setExpandedCategory(isCatOpen ? null : category.id)
                    }
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {category.title}
                      </h2>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">
                      {category.subjects.length} subjects
                    </span>
                  </button>
                  {isCatOpen && (
                    <div className="mt-6 space-y-4">
                      {category.subjects.map((subject) => {
                        const SubjIcon = subject.icon;
                        const isSubjOpen = expandedSubject === subject.name;
                        return (
                          <div
                            key={subject.name}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <button
                              className="flex items-center w-full text-left focus:outline-none"
                              onClick={() =>
                                setExpandedSubject(
                                  isSubjOpen ? null : subject.name
                                )
                              }
                            >
                              <SubjIcon className="w-5 h-5 text-gray-600 mr-3" />
                              <span className="font-medium text-gray-800">
                                {subject.name}
                              </span>
                              <span className="ml-auto text-xs text-gray-500">
                                {isSubjOpen ? "▲" : "▼"}
                              </span>
                            </button>
                            {isSubjOpen && (
                              <div className="mt-3 ml-8">
                                <div className="text-sm text-gray-700 font-semibold mb-1">
                                  Available Quizzes:
                                </div>
                                <ul className="space-y-2">
                                  {getMockQuizzes(subject.name).map((quiz) => (
                                    <li
                                      key={quiz.id}
                                      className="flex items-center gap-3 bg-white rounded-md p-3 shadow-sm"
                                    >
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {quiz.difficulty}
                                      </Badge>
                                      <span className="font-medium text-gray-800">
                                        {quiz.title}
                                      </span>
                                      <span className="ml-auto text-xs text-gray-500">
                                        {quiz.questions} questions
                                      </span>
                                      <Button
                                        size="sm"
                                        className="ml-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                                      >
                                        Start
                                      </Button>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
