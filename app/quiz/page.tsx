"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
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
  BookText,
  Globe,
  Palette,
  Music,
  Languages,
  ScrollText,
  Lightbulb,
  Users,
  MapPin,
  ArrowLeft,
  Brain,
  BookOpen,
  BookMarked,
} from "lucide-react";
import AppHeader from "@/components/ui/app-header";

// Subject Categories
const subjectCategories = [
  {
    id: "sciences",
    title: "Sciences",
    description: "Physics, Chemistry, Biology and more",
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
    description: "Economics, Accounting, Finance and more",
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
    description: "Algebra, Calculus, Statistics and more",
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
  {
    id: "arts-humanities",
    title: "Arts & Humanities",
    description: "English, Literature, History and more",
    icon: BookText,
    color: "rose",
    subjects: [
      { name: "English", icon: BookText, color: "rose" },
      { name: "Literature", icon: ScrollText, color: "pink" },
      { name: "History", icon: Globe, color: "amber" },
      { name: "Geography", icon: MapPin, color: "emerald" },
      { name: "Philosophy", icon: Lightbulb, color: "yellow" },
      { name: "Sociology", icon: Users, color: "blue" },
      { name: "Art History", icon: Palette, color: "purple" },
      { name: "Music Theory", icon: Music, color: "indigo" },
      { name: "Creative Writing", icon: BookOpen, color: "teal" },
      { name: "Foreign Languages", icon: Languages, color: "cyan" },
      { name: "Religious Studies", icon: BookMarked, color: "orange" },
      { name: "Cultural Studies", icon: Globe, color: "violet" },
    ],
  },
];

// Mock quizzes per subject
const getMockQuizzes = (subject: string) => {
  if (subject === "Physics") {
    return [
      {
        id: "physics-quiz-1",
        title: "Physics Quiz 1",
        questions: 10,
        difficulty: "Beginner",
      },
    ];
  }
  // For other subjects, return placeholder quizzes
  return [
    {
      id: `${subject.toLowerCase()}-quiz-1`,
      title: `${subject} Quiz 1`,
      questions: 10,
      difficulty: "Beginner",
    },
  ];
};

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Handle URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");

    if (
      categoryParam &&
      subjectCategories.find((cat) => cat.id === categoryParam)
    ) {
      setSelectedCategory(categoryParam);
    }
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("category", categoryId);
    window.history.pushState({}, "", url.toString());
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    window.history.pushState({}, "", url.toString());
  };

  const handleStartQuiz = (subject: string, quiz: any) => {
    // Navigate to quiz page with subject and quiz info
    const quizUrl = `/quiz/${subject.toLowerCase()}/${quiz.id}`;
    window.location.href = quizUrl;
  };

  const selectedCategoryData = selectedCategory
    ? subjectCategories.find((cat) => cat.id === selectedCategory)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader userInitial="J" active="Quizzes" />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white shadow-lg rounded-b-3xl mb-12">
        <div className="container mx-auto text-center relative z-10">
          <nav className="mb-4 text-sm text-emerald-100/80">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            &gt; <span>Quizzes</span>
            {selectedCategoryData && (
              <>
                {" "}
                &gt; <span>{selectedCategoryData.title}</span>
              </>
            )}
          </nav>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {subjectCategories.slice(0, 4).map((cat, i) => {
              const Icon = cat.icon;
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white text-2xl shadow-lg"
                >
                  <Icon className="w-7 h-7" />
                </span>
              );
            })}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {selectedCategoryData
              ? selectedCategoryData.title
              : "Exam Preparation Quizzes"}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-2">
            {selectedCategoryData
              ? `Practice and master ${selectedCategoryData.title.toLowerCase()} subjects. Choose a subject to get started!`
              : "Practice quizzes for every subject and exam type. Select a category to get started!"}
          </p>
        </div>

        {/* Decorative SVG blobs */}
        <svg
          className="absolute -top-24 -left-24 w-96 h-96 opacity-20 blur-2xl"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#a5b4fc"
            d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-24 -right-24 w-96 h-96 opacity-10 blur-2xl"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#6ee7b7"
            d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </section>

      <div className="container mx-auto pb-16 px-4">
        {/* Back Button for Subject View */}
        {selectedCategoryData && (
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBackToCategories}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
          </div>
        )}

        {/* Content */}
        {!selectedCategoryData ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
            {subjectCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card
                  key={category.id}
                  className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center h-full">
                    <div className="mb-5">
                      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-3xl shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-8 h-8" />
                      </span>
                    </div>
                    <div className="font-bold text-xl text-gray-800 mb-2">
                      {category.title}
                    </div>
                    <div className="text-sm text-gray-500 mb-6">
                      {category.description}
                    </div>
                    <div className="text-xs text-gray-400 mb-4">
                      {category.subjects.length} subjects available
                    </div>
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all">
                      Explore Subjects
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Subjects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedCategoryData.subjects.map((subject) => {
              const SubjIcon = subject.icon;
              const quizzes = getMockQuizzes(subject.name);
              return (
                <Card
                  key={subject.name}
                  className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                >
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                        <SubjIcon className="w-7 h-7" />
                      </span>
                    </div>
                    <div className="font-bold text-lg text-gray-800 mb-2">
                      {subject.name}
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""}{" "}
                      available
                    </div>
                    <div className="space-y-2 w-full">
                      {quizzes.map((quiz) => (
                        <Button
                          key={quiz.id}
                          size="sm"
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all"
                          onClick={() => handleStartQuiz(subject.name, quiz)}
                        >
                          Start {quiz.title}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
