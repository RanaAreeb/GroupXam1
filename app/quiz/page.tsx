"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Sparkles } from "lucide-react";
import AppHeader from "@/components/ui/app-header";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import {
  Target,
  MessageSquare,
  BookOpen,
  Clock,
  Star,
  ArrowRight,
  Brain,
  Play,
  Code,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Calculator,
  MapPin,
  Lightbulb,
  Users,
  Palette,
  Music,
  Languages,
  BookMarked,
  Globe,
  Vote,
  Heart,
  Building2,
  Scale,
  Stethoscope,
  Leaf,
  Settings,
  Home,
  FileText,
} from "lucide-react";

// Subject categories
const subjectCategories = [
  {
    id: "sciences",
    title: "Sciences",
    description: "Physics, Chemistry, Biology and more",
    icon: Target,
    subjects: [
      {
        name: "Physics",
        icon: Clock,
        quizzes: ["physics-quiz-1", "physics-quiz-2"],
      },
      {
        name: "Chemistry",
        icon: BookOpen,
        quizzes: ["chemistry-quiz-1", "chemistry-quiz-2"],
      },
      {
        name: "Biology",
        icon: Brain,
        quizzes: ["biology-quiz-1"],
      },
      {
        name: "Anatomy",
        icon: Star,
        quizzes: ["anatomy-quiz-1"],
      },
      {
        name: "Physiology",
        icon: Brain,
        quizzes: ["physiology-quiz-1"],
      },
      {
        name: "Microbiology",
        icon: Star,
        quizzes: ["microbiology-quiz-1"],
      },
      {
        name: "Biochemistry",
        icon: Brain,
        quizzes: ["biochemistry-quiz-1"],
      },
      {
        name: "Pharmacology",
        icon: Star,
        quizzes: ["pharmacology-quiz-1"],
      },
      {
        name: "Ecology",
        icon: Brain,
        quizzes: ["ecology-quiz-1"],
      },
      {
        name: "Psychology",
        icon: Star,
        quizzes: ["psychology-quiz-1"],
      },
      {
        name: "Agricultural Science",
        icon: Leaf,
        quizzes: ["agricultural-science-quiz-1"],
      },
      {
        name: "Health Science",
        icon: Stethoscope,
        quizzes: ["health-science-quiz-1"],
      },
      {
        name: "Engineering Science",
        icon: Settings,
        quizzes: ["engineering-science-quiz-1"],
      },
    ],
  },
  {
    id: "coding",
    title: "Coding & Programming",
    description:
      "Programming languages, web development, and software engineering",
    icon: Code,
    subjects: [
      {
        name: "JavaScript",
        icon: Code,
        quizzes: ["javascript-quiz-1"],
      },
      {
        name: "Python",
        icon: Code,
        quizzes: ["python-quiz-1"],
      },
      {
        name: "HTML/CSS",
        icon: Code,
        quizzes: ["html-css-quiz-1"],
      },
      {
        name: "React",
        icon: Code,
        quizzes: ["react-quiz-1"],
      },
      {
        name: "Node.js",
        icon: Code,
        quizzes: ["nodejs-quiz-1"],
      },
      {
        name: "Database",
        icon: Code,
        quizzes: ["database-quiz-1"],
      },
    ],
  },
  {
    id: "economics",
    title: "Economics & Business",
    description: "Economics, Accounting, Finance and more",
    icon: DollarSign,
    subjects: [
      {
        name: "Economics",
        icon: DollarSign,
        quizzes: ["economics-quiz-1"],
      },
      {
        name: "Micro Economics",
        icon: TrendingDown,
        quizzes: ["micro-economics-quiz-1"],
      },
      {
        name: "Macro Economics",
        icon: TrendingUp,
        quizzes: ["macro-economics-quiz-1"],
      },
      {
        name: "Accounting",
        icon: Calculator,
        quizzes: ["accounting-quiz-1"],
      },
      {
        name: "Finance",
        icon: Calculator,
        quizzes: ["finance-quiz-1"],
      },
      {
        name: "Political Science",
        icon: Vote,
        quizzes: ["political-science-quiz-1"],
      },
      {
        name: "Commerce",
        icon: DollarSign,
        quizzes: ["commerce-quiz-1"],
      },
      {
        name: "Principles of Cost Accounting",
        icon: Calculator,
        quizzes: ["principles-cost-accounting-quiz-1"],
      },
      {
        name: "Financial Accounting",
        icon: Calculator,
        quizzes: ["financial-accounting-quiz-1"],
      },
    ],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    description: "Algebra, Calculus, Statistics and more",
    icon: Calculator,
    subjects: [
      {
        name: "Statistics",
        icon: Calculator,
        quizzes: ["statistics-quiz-1"],
      },
      {
        name: "Calculus",
        icon: Calculator,
        quizzes: ["calculus-quiz-1"],
      },
      {
        name: "Algebra",
        icon: Calculator,
        quizzes: ["algebra-quiz-1"],
      },
      {
        name: "Arithmetic",
        icon: Calculator,
        quizzes: ["arithmetic-quiz-1"],
      },
      {
        name: "Geometry",
        icon: Calculator,
        quizzes: ["geometry-quiz-1"],
      },
      {
        name: "Trigonometry",
        icon: Calculator,
        quizzes: ["trigonometry-quiz-1"],
      },
      {
        name: "Pythagorean Theorem",
        icon: Calculator,
        quizzes: ["pythagorean-theorem-quiz-1"],
      },
      {
        name: "Further Mathematics (Elective)",
        icon: Calculator,
        quizzes: ["further-mathematics-quiz-1"],
      },
    ],
  },
  {
    id: "arts-humanities",
    title: "Arts & Humanities",
    description: "English, Literature, History and more",
    icon: MessageSquare,
    subjects: [
      {
        name: "English",
        icon: MessageSquare,
        quizzes: ["english-quiz-1"],
      },
      {
        name: "Literature",
        icon: BookOpen,
        quizzes: ["literature-quiz-1"],
      },
      {
        name: "History",
        icon: Play,
        quizzes: ["history-quiz-1"],
      },
      {
        name: "Geography",
        icon: MapPin,
        quizzes: ["geography-quiz-1"],
      },
      {
        name: "Philosophy",
        icon: Lightbulb,
        quizzes: ["philosophy-quiz-1"],
      },
      {
        name: "Sociology",
        icon: Users,
        quizzes: ["sociology-quiz-1"],
      },
      {
        name: "Art History",
        icon: Palette,
        quizzes: ["art-history-quiz-1"],
      },
      {
        name: "Music Theory",
        icon: Music,
        quizzes: ["music-theory-quiz-1"],
      },
      {
        name: "Creative Writing",
        icon: BookOpen,
        quizzes: ["creative-writing-quiz-1"],
      },
      {
        name: "Foreign Languages",
        icon: Languages,
        quizzes: ["foreign-languages-quiz-1"],
      },
      {
        name: "Religious Studies",
        icon: BookMarked,
        quizzes: ["religious-studies-quiz-1"],
      },
      {
        name: "Cultural Studies",
        icon: Globe,
        quizzes: ["cultural-studies-quiz-1"],
      },
      {
        name: "Government",
        icon: Vote,
        quizzes: ["government-quiz-1"],
      },
      {
        name: "Arabic",
        icon: Languages,
        quizzes: ["arabic-quiz-1"],
      },
      {
        name: "Islamic Studies",
        icon: BookMarked,
        quizzes: ["islamic-studies-quiz-1"],
      },
      {
        name: "Christian Religious Knowledge",
        icon: BookMarked,
        quizzes: ["christian-religious-knowledge-quiz-1"],
      },
      {
        name: "Visual Art",
        icon: Palette,
        quizzes: ["visual-art-quiz-1"],
      },
      {
        name: "Physical Education",
        icon: Users,
        quizzes: ["physical-education-quiz-1"],
      },
    ],
  },
  {
    id: "medicine",
    title: "Medicine",
    description: "Medical sciences, healthcare, and clinical practice",
    icon: Stethoscope,
    subjects: [
      {
        name: "Anatomy",
        icon: Heart,
        quizzes: ["anatomy-quiz-1"],
      },
      {
        name: "Physiology",
        icon: Heart,
        quizzes: ["physiology-quiz-1"],
      },
      {
        name: "Pathology",
        icon: Heart,
        quizzes: ["pathology-quiz-1"],
      },
      {
        name: "Pharmacology",
        icon: Heart,
        quizzes: ["pharmacology-quiz-1"],
      },
      {
        name: "Microbiology",
        icon: Heart,
        quizzes: ["microbiology-quiz-1"],
      },
      {
        name: "Biochemistry",
        icon: Heart,
        quizzes: ["biochemistry-quiz-1"],
      },
      {
        name: "Immunology",
        icon: Heart,
        quizzes: ["immunology-quiz-1"],
      },
      {
        name: "Cardiology",
        icon: Heart,
        quizzes: ["cardiology-quiz-1"],
      },
      {
        name: "Neurology",
        icon: Heart,
        quizzes: ["neurology-quiz-1"],
      },
      {
        name: "Pediatrics",
        icon: Heart,
        quizzes: ["pediatrics-quiz-1"],
      },
    ],
  },
  {
    id: "business",
    title: "Business",
    description: "Business management, entrepreneurship, and corporate studies",
    icon: Building2,
    subjects: [
      {
        name: "Business Management",
        icon: Building2,
        quizzes: ["business-management-quiz-1"],
      },
      {
        name: "Marketing",
        icon: Building2,
        quizzes: ["marketing-quiz-1"],
      },
      {
        name: "Human Resources",
        icon: Building2,
        quizzes: ["human-resources-quiz-1"],
      },
      {
        name: "Operations Management",
        icon: Building2,
        quizzes: ["operations-management-quiz-1"],
      },
      {
        name: "Strategic Management",
        icon: Building2,
        quizzes: ["strategic-management-quiz-1"],
      },
      {
        name: "Entrepreneurship",
        icon: Building2,
        quizzes: ["entrepreneurship-quiz-1"],
      },
      {
        name: "International Business",
        icon: Building2,
        quizzes: ["international-business-quiz-1"],
      },
      {
        name: "Supply Chain Management",
        icon: Building2,
        quizzes: ["supply-chain-management-quiz-1"],
      },
      {
        name: "Project Management",
        icon: Building2,
        quizzes: ["project-management-quiz-1"],
      },
      {
        name: "Business Ethics",
        icon: Building2,
        quizzes: ["business-ethics-quiz-1"],
      },
      {
        name: "Auto Mechanics",
        icon: Settings,
        quizzes: ["auto-mechanics-quiz-1"],
      },
      {
        name: "Home Management",
        icon: Home,
        quizzes: ["home-management-quiz-1"],
      },
      {
        name: "Clothing and Textiles",
        icon: Palette,
        quizzes: ["clothing-textiles-quiz-1"],
      },
      {
        name: "Metalwork",
        icon: Settings,
        quizzes: ["metalwork-quiz-1"],
      },
      {
        name: "Technical Drawing",
        icon: Palette,
        quizzes: ["technical-drawing-quiz-1"],
      },
      {
        name: "Typewriting",
        icon: FileText,
        quizzes: ["typewriting-quiz-1"],
      },
      {
        name: "Foods and Nutrition",
        icon: Heart,
        quizzes: ["foods-nutrition-quiz-1"],
      },
    ],
  },
  {
    id: "law",
    title: "Law",
    description: "Legal studies, jurisprudence, and legal practice",
    icon: Scale,
    subjects: [
      {
        name: "Constitutional Law",
        icon: Scale,
        quizzes: ["constitutional-law-quiz-1"],
      },
      {
        name: "Criminal Law",
        icon: Scale,
        quizzes: ["criminal-law-quiz-1"],
      },
      {
        name: "Civil Law",
        icon: Scale,
        quizzes: ["civil-law-quiz-1"],
      },
      {
        name: "Contract Law",
        icon: Scale,
        quizzes: ["contract-law-quiz-1"],
      },
      {
        name: "Tort Law",
        icon: Scale,
        quizzes: ["tort-law-quiz-1"],
      },
      {
        name: "Property Law",
        icon: Scale,
        quizzes: ["property-law-quiz-1"],
      },
      {
        name: "Corporate Law",
        icon: Scale,
        quizzes: ["corporate-law-quiz-1"],
      },
      {
        name: "International Law",
        icon: Scale,
        quizzes: ["international-law-quiz-1"],
      },
      {
        name: "Environmental Law",
        icon: Scale,
        quizzes: ["environmental-law-quiz-1"],
      },
      {
        name: "Human Rights Law",
        icon: Scale,
        quizzes: ["human-rights-law-quiz-1"],
      },
    ],
  },
];

const aiSubjectOptions = Array.from(
  new Set(
    subjectCategories.flatMap((category) =>
      category.subjects.map((subject) => subject.name)
    )
  )
).sort();

type AIDifficulty = "Beginner" | "Intermediate" | "Advanced";

type AIQuizQuestion = {
  id: string;
  prompt: string;
  options: { id: string; text: string }[];
  answerId: string;
  explanation: string;
};

type AIQuiz = {
  id: string;
  subject: string;
  topic: string;
  difficulty: AIDifficulty;
  questions: AIQuizQuestion[];
  timeLimit: number;
  createdAt: number;
};

const evaluateAIQuiz = (
  quiz: AIQuiz,
  answers: Record<string, string>
) => {
  const details = quiz.questions.map((question) => {
    const userAnswerId = answers[question.id];
    const isCorrect = userAnswerId === question.answerId;
    const correctOption =
      question.options.find((option) => option.id === question.answerId)
        ?.text || "N/A";
    const userOption =
      question.options.find((option) => option.id === userAnswerId)?.text ||
      "Not answered";

    return {
      questionId: question.id,
      prompt: question.prompt,
      isCorrect,
      correctOption,
      userOption,
      explanation: question.explanation,
    };
  });

  const totalCorrect = details.filter((detail) => detail.isCorrect).length;

  return {
    totalCorrect,
    totalQuestions: quiz.questions.length,
    accuracy: Math.round((totalCorrect / quiz.questions.length) * 100),
    details,
  };
};

// Quiz data - this would normally come from an API or dynamic import
const quizData: Record<
  string,
  {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    questions: number;
    timeLimit: number;
  }
> = {
  "physics-quiz-1": {
    id: "physics-quiz-1",
    title: "Physics Quiz 1",
    subject: "Physics",
    difficulty: "Beginner",
    questions: 6,
    timeLimit: 300,
  },
  "physics-quiz-2": {
    id: "physics-quiz-2",
    title: "Physics Quiz 2",
    subject: "Physics",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 600,
  },
  "chemistry-quiz-1": {
    id: "chemistry-quiz-1",
    title: "Chemistry Quiz 1",
    subject: "Chemistry",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "chemistry-quiz-2": {
    id: "chemistry-quiz-2",
    title: "Chemistry Quiz 2",
    subject: "Chemistry",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "biology-quiz-1": {
    id: "biology-quiz-1",
    title: "Biology Quiz 1",
    subject: "Biology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "anatomy-quiz-1": {
    id: "anatomy-quiz-1",
    title: "Anatomy Quiz 1",
    subject: "Anatomy",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "physiology-quiz-1": {
    id: "physiology-quiz-1",
    title: "Physiology Quiz 1",
    subject: "Physiology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "microbiology-quiz-1": {
    id: "microbiology-quiz-1",
    title: "Microbiology Quiz 1",
    subject: "Microbiology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "biochemistry-quiz-1": {
    id: "biochemistry-quiz-1",
    title: "Biochemistry Quiz 1",
    subject: "Biochemistry",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "pharmacology-quiz-1": {
    id: "pharmacology-quiz-1",
    title: "Pharmacology Quiz 1",
    subject: "Pharmacology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "ecology-quiz-1": {
    id: "ecology-quiz-1",
    title: "Ecology Quiz 1",
    subject: "Ecology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "psychology-quiz-1": {
    id: "psychology-quiz-1",
    title: "Psychology Quiz 1",
    subject: "Psychology",
    difficulty: "Intermediate",
    questions: 15,
    timeLimit: 900,
  },
  "javascript-quiz-1": {
    id: "javascript-quiz-1",
    title: "JavaScript Quiz 1",
    subject: "JavaScript",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "python-quiz-1": {
    id: "python-quiz-1",
    title: "Python Quiz 1",
    subject: "Python",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "html-css-quiz-1": {
    id: "html-css-quiz-1",
    title: "HTML/CSS Quiz 1",
    subject: "HTML/CSS",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "react-quiz-1": {
    id: "react-quiz-1",
    title: "React Quiz 1",
    subject: "React",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "nodejs-quiz-1": {
    id: "nodejs-quiz-1",
    title: "Node.js Quiz 1",
    subject: "Node.js",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "database-quiz-1": {
    id: "database-quiz-1",
    title: "Database Quiz 1",
    subject: "Database",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "economics-quiz-1": {
    id: "economics-quiz-1",
    title: "Economics Quiz 1",
    subject: "Economics",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "micro-economics-quiz-1": {
    id: "micro-economics-quiz-1",
    title: "Micro Economics Quiz 1",
    subject: "Micro Economics",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "macro-economics-quiz-1": {
    id: "macro-economics-quiz-1",
    title: "Macro Economics Quiz 1",
    subject: "Macro Economics",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "accounting-quiz-1": {
    id: "accounting-quiz-1",
    title: "Accounting Quiz 1",
    subject: "Accounting",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "finance-quiz-1": {
    id: "finance-quiz-1",
    title: "Finance Quiz 1",
    subject: "Finance",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "political-science-quiz-1": {
    id: "political-science-quiz-1",
    title: "Political Science Quiz 1",
    subject: "Political Science",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "statistics-quiz-1": {
    id: "statistics-quiz-1",
    title: "Statistics Quiz 1",
    subject: "Statistics",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "calculus-quiz-1": {
    id: "calculus-quiz-1",
    title: "Calculus Quiz 1",
    subject: "Calculus",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "algebra-quiz-1": {
    id: "algebra-quiz-1",
    title: "Algebra Quiz 1",
    subject: "Algebra",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "arithmetic-quiz-1": {
    id: "arithmetic-quiz-1",
    title: "Arithmetic Quiz 1",
    subject: "Arithmetic",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "geometry-quiz-1": {
    id: "geometry-quiz-1",
    title: "Geometry Quiz 1",
    subject: "Geometry",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "trigonometry-quiz-1": {
    id: "trigonometry-quiz-1",
    title: "Trigonometry Quiz 1",
    subject: "Trigonometry",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "pythagorean-theorem-quiz-1": {
    id: "pythagorean-theorem-quiz-1",
    title: "Pythagorean Theorem Quiz 1",
    subject: "Pythagorean Theorem",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "english-quiz-1": {
    id: "english-quiz-1",
    title: "English Quiz 1",
    subject: "English",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "literature-quiz-1": {
    id: "literature-quiz-1",
    title: "Literature Quiz 1",
    subject: "Literature",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "history-quiz-1": {
    id: "history-quiz-1",
    title: "History Quiz 1",
    subject: "History",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "geography-quiz-1": {
    id: "geography-quiz-1",
    title: "Geography Quiz 1",
    subject: "Geography",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "philosophy-quiz-1": {
    id: "philosophy-quiz-1",
    title: "Philosophy Quiz 1",
    subject: "Philosophy",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "sociology-quiz-1": {
    id: "sociology-quiz-1",
    title: "Sociology Quiz 1",
    subject: "Sociology",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "art-history-quiz-1": {
    id: "art-history-quiz-1",
    title: "Art History Quiz 1",
    subject: "Art History",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "music-theory-quiz-1": {
    id: "music-theory-quiz-1",
    title: "Music Theory Quiz 1",
    subject: "Music Theory",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "creative-writing-quiz-1": {
    id: "creative-writing-quiz-1",
    title: "Creative Writing Quiz 1",
    subject: "Creative Writing",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "foreign-languages-quiz-1": {
    id: "foreign-languages-quiz-1",
    title: "Foreign Languages Quiz 1",
    subject: "Foreign Languages",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "religious-studies-quiz-1": {
    id: "religious-studies-quiz-1",
    title: "Religious Studies Quiz 1",
    subject: "Religious Studies",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
  "cultural-studies-quiz-1": {
    id: "cultural-studies-quiz-1",
    title: "Cultural Studies Quiz 1",
    subject: "Cultural Studies",
    difficulty: "Beginner",
    questions: 10,
    timeLimit: 300,
  },
};

// Get quizzes for a subject
const getQuizzesForSubject = async (subjectName: string) => {
  const subject = subjectCategories
    .flatMap((cat) => cat.subjects)
    .find((sub) => sub.name === subjectName);

  if (!subject) return [];

  // For science subjects, load from the new folder structure
  if (
    subjectName.toLowerCase() === "physics" ||
    subjectName.toLowerCase() === "chemistry" ||
    subjectName.toLowerCase() === "biology" ||
    subjectName.toLowerCase() === "anatomy" ||
    subjectName.toLowerCase() === "physiology" ||
    subjectName.toLowerCase() === "microbiology" ||
    subjectName.toLowerCase() === "biochemistry" ||
    subjectName.toLowerCase() === "pharmacology" ||
    subjectName.toLowerCase() === "ecology" ||
    subjectName.toLowerCase() === "psychology" ||
    subjectName.toLowerCase() === "agricultural science" ||
    subjectName.toLowerCase() === "health science" ||
    subjectName.toLowerCase() === "engineering science"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "agricultural science") {
        folderName = "agricultural-science";
      } else if (subjectName.toLowerCase() === "health science") {
        folderName = "health-science";
      } else if (subjectName.toLowerCase() === "engineering science") {
        folderName = "engineering-science";
      }

      const response = await fetch(
        `/api/quiz-data/science/${folderName}`
      );
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For coding subjects, load from the coding folder structure
  if (
    subjectName.toLowerCase() === "javascript" ||
    subjectName.toLowerCase() === "python" ||
    subjectName.toLowerCase() === "html/css" ||
    subjectName.toLowerCase() === "react" ||
    subjectName.toLowerCase() === "node.js" ||
    subjectName.toLowerCase() === "database"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "html/css") {
        folderName = "html-css";
      } else if (subjectName.toLowerCase() === "node.js") {
        folderName = "nodejs";
      }

      const response = await fetch(`/api/quiz-data/coding/${folderName}`);
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For economics subjects, load from the economics folder structure
  if (
    subjectName.toLowerCase() === "economics" ||
    subjectName.toLowerCase() === "micro economics" ||
    subjectName.toLowerCase() === "macro economics" ||
    subjectName.toLowerCase() === "accounting" ||
    subjectName.toLowerCase() === "finance" ||
    subjectName.toLowerCase() === "political science" ||
    subjectName.toLowerCase() === "commerce" ||
    subjectName.toLowerCase() === "principles of cost accounting" ||
    subjectName.toLowerCase() === "financial accounting"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "micro economics") {
        folderName = "micro-economics";
      } else if (subjectName.toLowerCase() === "macro economics") {
        folderName = "macro-economics";
      } else if (subjectName.toLowerCase() === "political science") {
        folderName = "political-science";
      } else if (subjectName.toLowerCase() === "principles of cost accounting") {
        folderName = "principles-of-cost-accounting";
      } else if (subjectName.toLowerCase() === "financial accounting") {
        folderName = "financial-accounting";
      }

      const response = await fetch(`/api/quiz-data/economics/${folderName}`);
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For mathematics subjects, load from the mathematics folder structure
  if (
    subjectName.toLowerCase() === "statistics" ||
    subjectName.toLowerCase() === "calculus" ||
    subjectName.toLowerCase() === "algebra" ||
    subjectName.toLowerCase() === "arithmetic" ||
    subjectName.toLowerCase() === "geometry" ||
    subjectName.toLowerCase() === "trigonometry" ||
    subjectName.toLowerCase() === "pythagorean theorem" ||
    subjectName.toLowerCase() === "further mathematics (elective)"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "pythagorean theorem") {
        folderName = "pythagorean-theorem";
      } else if (subjectName.toLowerCase() === "further mathematics (elective)") {
        folderName = "further-mathematics";
      }

      const response = await fetch(`/api/quiz-data/mathematics/${folderName}`);
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For arts & humanities subjects, load from the arts-humanities folder structure
  if (
    subjectName.toLowerCase() === "english" ||
    subjectName.toLowerCase() === "literature" ||
    subjectName.toLowerCase() === "history" ||
    subjectName.toLowerCase() === "geography" ||
    subjectName.toLowerCase() === "philosophy" ||
    subjectName.toLowerCase() === "sociology" ||
    subjectName.toLowerCase() === "art history" ||
    subjectName.toLowerCase() === "music theory" ||
    subjectName.toLowerCase() === "creative writing" ||
    subjectName.toLowerCase() === "foreign languages" ||
    subjectName.toLowerCase() === "religious studies" ||
    subjectName.toLowerCase() === "cultural studies" ||
    subjectName.toLowerCase() === "government" ||
    subjectName.toLowerCase() === "arabic" ||
    subjectName.toLowerCase() === "islamic studies" ||
    subjectName.toLowerCase() === "christian religious knowledge" ||
    subjectName.toLowerCase() === "visual art" ||
    subjectName.toLowerCase() === "literature-in-english"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "art history") {
        folderName = "art-history";
      } else if (subjectName.toLowerCase() === "music theory") {
        folderName = "music-theory";
      } else if (subjectName.toLowerCase() === "creative writing") {
        folderName = "creative-writing";
      } else if (subjectName.toLowerCase() === "foreign languages") {
        folderName = "foreign-languages";
      } else if (subjectName.toLowerCase() === "religious studies") {
        folderName = "religious-studies";
      } else if (subjectName.toLowerCase() === "cultural studies") {
        folderName = "cultural-studies";
      } else if (subjectName.toLowerCase() === "christian religious knowledge") {
        folderName = "christian-religious-knowledge";
      } else if (subjectName.toLowerCase() === "visual art") {
        folderName = "visual-art";
      } else if (subjectName.toLowerCase() === "literature-in-english") {
        folderName = "literature-in-english";
      }

      const response = await fetch(
        `/api/quiz-data/arts-humanities/${folderName}`
      );
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For medicine subjects, load from the medicine folder structure
  if (
    subjectName.toLowerCase() === "anatomy" ||
    subjectName.toLowerCase() === "physiology" ||
    subjectName.toLowerCase() === "pathology" ||
    subjectName.toLowerCase() === "pharmacology" ||
    subjectName.toLowerCase() === "microbiology" ||
    subjectName.toLowerCase() === "biochemistry" ||
    subjectName.toLowerCase() === "immunology" ||
    subjectName.toLowerCase() === "cardiology" ||
    subjectName.toLowerCase() === "neurology" ||
    subjectName.toLowerCase() === "pediatrics"
  ) {
    try {
      const response = await fetch(
        `/api/quiz-data/medicine/${subjectName.toLowerCase()}`
      );
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For business subjects, load from the business folder structure
  if (
    subjectName.toLowerCase() === "business management" ||
    subjectName.toLowerCase() === "marketing" ||
    subjectName.toLowerCase() === "human resources" ||
    subjectName.toLowerCase() === "operations management" ||
    subjectName.toLowerCase() === "strategic management" ||
    subjectName.toLowerCase() === "entrepreneurship" ||
    subjectName.toLowerCase() === "international business" ||
    subjectName.toLowerCase() === "supply chain management" ||
    subjectName.toLowerCase() === "project management" ||
    subjectName.toLowerCase() === "business ethics" ||
    subjectName.toLowerCase() === "auto mechanics" ||
    subjectName.toLowerCase() === "home management" ||
    subjectName.toLowerCase() === "clothing and textiles" ||
    subjectName.toLowerCase() === "metalwork" ||
    subjectName.toLowerCase() === "technical drawing" ||
    subjectName.toLowerCase() === "typewriting" ||
    subjectName.toLowerCase() === "foods and nutrition" ||
    subjectName.toLowerCase() === "physical education"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "business management") {
        folderName = "business-management";
      } else if (subjectName.toLowerCase() === "human resources") {
        folderName = "human-resources";
      } else if (subjectName.toLowerCase() === "operations management") {
        folderName = "operations-management";
      } else if (subjectName.toLowerCase() === "strategic management") {
        folderName = "strategic-management";
      } else if (subjectName.toLowerCase() === "international business") {
        folderName = "international-business";
      } else if (subjectName.toLowerCase() === "supply chain management") {
        folderName = "supply-chain-management";
      } else if (subjectName.toLowerCase() === "project management") {
        folderName = "project-management";
      } else if (subjectName.toLowerCase() === "business ethics") {
        folderName = "business-ethics";
      } else if (subjectName.toLowerCase() === "auto mechanics") {
        folderName = "auto-mechanics";
      } else if (subjectName.toLowerCase() === "home management") {
        folderName = "home-management";
      } else if (subjectName.toLowerCase() === "clothing and textiles") {
        folderName = "clothing-and-textiles";
      } else if (subjectName.toLowerCase() === "technical drawing") {
        folderName = "technical-drawing";
      } else if (subjectName.toLowerCase() === "foods and nutrition") {
        folderName = "foods-and-nutrition";
      } else if (subjectName.toLowerCase() === "physical education") {
        folderName = "physical-education";
      }

      const response = await fetch(`/api/quiz-data/business/${folderName}`);
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // For law subjects, load from the law folder structure
  if (
    subjectName.toLowerCase() === "constitutional law" ||
    subjectName.toLowerCase() === "criminal law" ||
    subjectName.toLowerCase() === "civil law" ||
    subjectName.toLowerCase() === "contract law" ||
    subjectName.toLowerCase() === "tort law" ||
    subjectName.toLowerCase() === "property law" ||
    subjectName.toLowerCase() === "corporate law" ||
    subjectName.toLowerCase() === "international law" ||
    subjectName.toLowerCase() === "environmental law" ||
    subjectName.toLowerCase() === "human rights law"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "constitutional law") {
        folderName = "constitutional-law";
      } else if (subjectName.toLowerCase() === "criminal law") {
        folderName = "criminal-law";
      } else if (subjectName.toLowerCase() === "civil law") {
        folderName = "civil-law";
      } else if (subjectName.toLowerCase() === "contract law") {
        folderName = "contract-law";
      } else if (subjectName.toLowerCase() === "tort law") {
        folderName = "tort-law";
      } else if (subjectName.toLowerCase() === "property law") {
        folderName = "property-law";
      } else if (subjectName.toLowerCase() === "corporate law") {
        folderName = "corporate-law";
      } else if (subjectName.toLowerCase() === "international law") {
        folderName = "international-law";
      } else if (subjectName.toLowerCase() === "environmental law") {
        folderName = "environmental-law";
      } else if (subjectName.toLowerCase() === "human rights law") {
        folderName = "human-rights-law";
      }

      const response = await fetch(`/api/quiz-data/law/${folderName}`);
      if (response.ok) {
        const quizFiles = await response.json();
        return quizFiles;
      }
    } catch (error) {
      console.error("Error loading quiz data:", error);
    }
  }

  // Fallback to static data for other subjects
  return subject.quizzes.map((quizId) => quizData[quizId]).filter(Boolean);
};

export default function QuizPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState<"library" | "ai">("library");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectQuizCounts, setSubjectQuizCounts] = useState<{
    [key: string]: number;
  }>({});
  const [isPremium, setIsPremium] = useState<boolean | null>(null);
  const [isCheckingPremium, setIsCheckingPremium] = useState(true);
  const [aiForm, setAiForm] = useState({
    subject: aiSubjectOptions[0] || "General Studies",
    topic: "",
    difficulty: "Intermediate" as AIDifficulty,
    numQuestions: 5,
    timePerQuestion: 2,
  });
  const [isGeneratingAiQuiz, setIsGeneratingAiQuiz] = useState(false);
  const [aiQuiz, setAiQuiz] = useState<AIQuiz | null>(null);
  const [aiQuizAnswers, setAiQuizAnswers] = useState<Record<string, string>>({});
  const [aiQuizResult, setAiQuizResult] = useState<ReturnType<
    typeof evaluateAIQuiz
  > | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      setIsCheckingPremium(true);
      try {
        const response = await fetch("/api/user/payment-status", {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Check if user has premium subscription (subscription-3month, subscription-6month, subscription-12month)
          const hasPremiumPackage =
            data.packageType === "subscription-3month" ||
            data.packageType === "subscription-6month" ||
            data.packageType === "subscription-12month";

          const isSubscriptionValid =
            data.hasAccess &&
            data.expiryDate &&
            new Date(data.expiryDate) > new Date();

          // Also check user.access directly as fallback (in case API doesn't return correct packageType)
          const userAccessPackageType = (user?.access as any)?.packageType;
          const hasDirectPremiumPackage =
            userAccessPackageType === "subscription-3month" ||
            userAccessPackageType === "subscription-6month" ||
            userAccessPackageType === "subscription-12month";

          const userAccessExpiry = (user?.access as any)?.accessExpiresAt;
          const isDirectAccessValid = hasDirectPremiumPackage &&
            (user?.access as any)?.hasPaidAccess === true &&
            userAccessExpiry &&
            new Date(userAccessExpiry) > new Date();

          // Also check user.access?.premium as fallback
          const hasPremiumAccess = (user?.access as any)?.premium === true;

          setIsPremium((hasPremiumPackage && isSubscriptionValid) || isDirectAccessValid || hasPremiumAccess);
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
      } finally {
        setIsCheckingPremium(false);
      }
    };

    checkPremiumStatus();
  }, [user]);

  // Handle URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    const subjectParam = urlParams.get("subject");
    const modeParam = urlParams.get("mode");

    if (
      categoryParam &&
      subjectCategories.find((cat) => cat.id === categoryParam)
    ) {
      setSelectedCategory(categoryParam);
    }

    if (subjectParam) {
      setSelectedSubject(subjectParam);
    }

    // Check if user is trying to access AI mode via URL
    if (modeParam === "ai") {
      if (isPremium && !isCheckingPremium) {
        setActiveMode("ai");
      } else if (!isPremium && !isCheckingPremium) {
        setActiveMode("library");
        const upgrade = window.confirm(
          "AI Quiz Studio is a premium feature. Upgrade to Premium to access AI-generated quizzes. Would you like to visit the subscription page?"
        );
        if (upgrade) {
          router.push("/subscription");
        }
      }
    }
  }, [isPremium, isCheckingPremium, router]);

  // Load quiz data when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadQuizData(selectedSubject);
    }
  }, [selectedSubject]);

  // Initialize with static quiz counts to avoid loading all data on page load
  useEffect(() => {
    // Set default counts - these can be updated when user actually clicks on subjects
    const defaultCounts: { [key: string]: number } = {
      // Sciences
      physics: 2,
      chemistry: 2,
      biology: 1,
      anatomy: 1,
      physiology: 1,
      microbiology: 1,
      biochemistry: 1,
      pharmacology: 1,
      ecology: 1,
      psychology: 1,

      // Coding
      javascript: 2,
      python: 2,
      "html/css": 2,
      react: 2,
      "node.js": 2,
      database: 2,

      // Economics
      economics: 1,
      "micro economics": 1,
      "macro economics": 1,
      accounting: 1,
      finance: 1,
      "political science": 1,

      // Mathematics
      statistics: 1,
      calculus: 2,
      algebra: 3,
      arithmetic: 1,
      geometry: 2,
      trigonometry: 2,
      "pythagorean theorem": 1,

      // Arts & Humanities
      english: 1,
      literature: 1,
      history: 1,
      geography: 1,
      philosophy: 1,
      sociology: 1,
      "art history": 1,
      "music theory": 1,
      "creative writing": 1,
      "foreign languages": 1,
      "religious studies": 1,
      "cultural studies": 1,

      // Medicine
      pathology: 1,
      immunology: 1,
      cardiology: 1,
      neurology: 1,
      pediatrics: 1,

      // Business
      "business management": 1,
      marketing: 1,
      "human resources": 1,
      "operations management": 1,
      "strategic management": 1,
      entrepreneurship: 1,
      "international business": 1,
      "supply chain management": 1,
      "project management": 1,
      "business ethics": 1,

      // Law
      "constitutional law": 1,
      "criminal law": 1,
      "civil law": 1,
      "contract law": 1,
      "tort law": 1,
      "property law": 1,
      "corporate law": 1,
      "international law": 1,
      "environmental law": 1,
      "human rights law": 1,

      // Additional Subjects
      "agricultural science": 1,
      "government": 1,
      "arabic": 1,
      "health science": 1,
      "auto mechanics": 1,
      "home management": 1,
      "islamic studies": 1,
      "clothing and textiles": 1,
      "metalwork": 1,
      "commerce": 1,
      "physical education": 1,
      "principles of cost accounting": 1,
      "engineering science": 1,
      "technical drawing": 1,
      "financial accounting": 1,
      "typewriting": 1,
      "foods and nutrition": 1,
      "visual art": 1,
      "further mathematics (elective)": 1,
      "christian religious knowledge": 1,
    };

    setSubjectQuizCounts(defaultCounts);
  }, []);

  const loadQuizData = async (subjectName: string) => {
    setLoading(true);
    try {
      const quizzes = await getQuizzesForSubject(subjectName);
      setQuizData(quizzes);
    } catch (error) {
      console.error("Error loading quiz data:", error);
      setQuizData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubject(null);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("category", categoryId);
    url.searchParams.delete("subject");
    window.history.pushState({}, "", url.toString());
  };

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set("subject", subjectName);
    window.history.pushState({}, "", url.toString());
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubject(null);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete("category");
    url.searchParams.delete("subject");
    window.history.pushState({}, "", url.toString());
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.delete("subject");
    window.history.pushState({}, "", url.toString());
  };

  const handleModeChange = (mode: "library" | "ai") => {
    if (mode === "ai") {
      // Check if user has premium access
      if (!isPremium) {
        // Show upgrade prompt or redirect to subscription page
        const upgrade = window.confirm(
          "AI Quiz Studio is a premium feature. Upgrade to Premium to access AI-generated quizzes. Would you like to visit the subscription page?"
        );
        if (upgrade) {
          router.push("/subscription");
        }
        return;
      }
      setSelectedCategory(null);
      setSelectedSubject(null);
    }
    setActiveMode(mode);
    setAiError(null);
  };

  const handleGenerateAiQuiz = async () => {
    if (!aiForm.subject) return;

    // Double-check premium status before generating
    if (!isPremium) {
      setAiError("AI Quiz Studio is a premium feature. Please upgrade to Premium to access this feature.");
      const upgrade = window.confirm(
        "AI Quiz Studio is a premium feature. Upgrade to Premium to access AI-generated quizzes. Would you like to visit the subscription page?"
      );
      if (upgrade) {
        router.push("/subscription");
      }
      return;
    }

    setAiError(null);
    setIsGeneratingAiQuiz(true);
    try {
      const response = await fetch("/api/ai-quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject: aiForm.subject,
          topic: aiForm.topic,
          difficulty: aiForm.difficulty,
          numQuestions: aiForm.numQuestions,
          timePerQuestion: aiForm.timePerQuestion,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate quiz. Please try again.");
      }

      const data = await response.json();
      if (!data.quiz) {
        throw new Error("AI response was missing quiz content. Please try again.");
      }

      setAiQuiz(data.quiz);
      setAiQuizAnswers({});
      setAiQuizResult(null);
    } catch (error: any) {
      console.error("AI quiz generation failed:", error);
      setAiError(error?.message || "Failed to generate quiz. Please try again.");
      setAiQuiz(null);
    } finally {
      setIsGeneratingAiQuiz(false);
    }
  };

  const handleAiAnswerChange = (questionId: string, optionId: string) => {
    setAiQuizAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmitAiQuiz = () => {
    if (!aiQuiz) return;
    const result = evaluateAIQuiz(aiQuiz, aiQuizAnswers);
    setAiQuizResult(result);
  };

  const handleResetAiQuiz = () => {
    setAiQuiz(null);
    setAiQuizAnswers({});
    setAiQuizResult(null);
    setAiError(null);
  };

  const handleStartQuiz = (quiz: any) => {
    // Navigate to quiz page with quiz info
    const quizUrl = `/quiz/${encodeURIComponent(quiz.subject.toLowerCase())}/${quiz.id
      }`;
    window.location.href = quizUrl;
  };

  const selectedCategoryData = selectedCategory
    ? subjectCategories.find((cat) => cat.id === selectedCategory)
    : null;

  const selectedSubjectData = selectedSubject
    ? selectedCategoryData?.subjects.find((sub) => sub.name === selectedSubject)
    : null;

  return (
    <ProtectedRoute>
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
              {activeMode === "library" && selectedCategoryData && (
                <>
                  {" "}
                  &gt; <span>{selectedCategoryData.title}</span>
                </>
              )}
              {activeMode === "library" && selectedSubjectData && (
                <>
                  {" "}
                  &gt; <span>{selectedSubjectData.name}</span>
                </>
              )}
              {activeMode === "ai" && (
                <>
                  {" "}
                  &gt; <span>AI Quiz Studio</span>
                  {aiQuiz && (
                    <>
                      {" "}
                      &gt; <span>Custom Quiz</span>
                    </>
                  )}
                </>
              )}
            </nav>

            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {subjectCategories.slice(0, 4).map((cat) => {
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
              {activeMode === "ai"
                ? "AI Quiz Studio"
                : selectedSubjectData
                  ? `${selectedSubjectData.name} Quizzes`
                  : selectedCategoryData
                    ? selectedCategoryData.title
                    : "Exam Preparation Quizzes"}
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100/90 max-w-3xl mx-auto mb-6">
              {activeMode === "ai"
                ? "Generate tailored quizzes on any subject with AI-crafted questions, review instant explanations, and keep practice lightweight without new API costs."
                : selectedSubjectData
                  ? `Choose a quiz to test your ${selectedSubjectData.name.toLowerCase()} knowledge`
                  : selectedCategoryData
                    ? `Practice and master ${selectedCategoryData.title.toLowerCase()} subjects. Choose a subject to get started!`
                    : "Practice quizzes for every subject and exam type. Select a category to get started!"}
            </p>

            <div className="inline-flex bg-white/20 rounded-full p-1 mb-4">
              <button
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${activeMode === "library"
                  ? "bg-white text-emerald-600 shadow"
                  : "text-white/90 hover:text-white"
                  }`}
                onClick={() => handleModeChange("library")}
              >
                Browse Quiz Library
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-semibold transition relative ${activeMode === "ai"
                  ? "bg-white text-emerald-600 shadow"
                  : "text-white/90 hover:text-white"
                  } ${!isPremium ? "opacity-75" : ""}`}
                onClick={() => handleModeChange("ai")}
                disabled={isCheckingPremium}
              >
                <span className="flex items-center gap-2">
                  AI Quiz Studio
                  {!isPremium && (
                    <Lock className="w-3 h-3" />
                  )}
                  {isPremium && (
                    <Sparkles className="w-3 h-3" />
                  )}
                </span>
              </button>
            </div>
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
          {activeMode === "library" ? (
            <>
              {/* Back Buttons */}
              {selectedSubjectData && (
                <div className="mb-8">
                  <Button
                    variant="outline"
                    onClick={handleBackToSubjects}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Subjects
                  </Button>
                </div>
              )}

              {selectedCategoryData && !selectedSubjectData && (
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
              ) : !selectedSubjectData ? (
                /* Subjects Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {selectedCategoryData.subjects.map((subject) => {
                    const SubjIcon = subject.icon;
                    // Use dynamic quiz count for science subjects, fallback to static count
                    const isScienceSubject = [
                      "physics",
                      "chemistry",
                      "biology",
                      "anatomy",
                      "physiology",
                      "microbiology",
                      "biochemistry",
                      "pharmacology",
                      "ecology",
                      "psychology",
                    ].includes(subject.name.toLowerCase());

                    const isCodingSubject = [
                      "javascript",
                      "python",
                      "html/css",
                      "react",
                      "node.js",
                      "database",
                    ].includes(subject.name.toLowerCase());

                    const isEconomicsSubject = [
                      "economics",
                      "micro economics",
                      "macro economics",
                      "accounting",
                      "finance",
                      "political science",
                    ].includes(subject.name.toLowerCase());

                    const isMathematicsSubject = [
                      "statistics",
                      "calculus",
                      "algebra",
                      "arithmetic",
                      "geometry",
                      "trigonometry",
                      "pythagorean theorem",
                    ].includes(subject.name.toLowerCase());

                    const isArtsHumanitiesSubject = [
                      "english",
                      "literature",
                      "history",
                      "geography",
                      "philosophy",
                      "sociology",
                      "art history",
                      "music theory",
                      "creative writing",
                      "foreign languages",
                      "religious studies",
                      "cultural studies",
                    ].includes(subject.name.toLowerCase());

                    const isMedicineSubject = [
                      "anatomy",
                      "physiology",
                      "pathology",
                      "pharmacology",
                      "microbiology",
                      "biochemistry",
                      "immunology",
                      "cardiology",
                      "neurology",
                      "pediatrics",
                    ].includes(subject.name.toLowerCase());

                    const isBusinessSubject = [
                      "business management",
                      "marketing",
                      "human resources",
                      "operations management",
                      "strategic management",
                      "entrepreneurship",
                      "international business",
                      "supply chain management",
                      "project management",
                      "business ethics",
                    ].includes(subject.name.toLowerCase());

                    const isLawSubject = [
                      "constitutional law",
                      "criminal law",
                      "civil law",
                      "contract law",
                      "tort law",
                      "property law",
                      "corporate law",
                      "international law",
                      "environmental law",
                      "human rights law",
                    ].includes(subject.name.toLowerCase());

                    const quizCount =
                      isScienceSubject ||
                        isCodingSubject ||
                        isEconomicsSubject ||
                        isMathematicsSubject ||
                        isArtsHumanitiesSubject ||
                        isMedicineSubject ||
                        isBusinessSubject ||
                        isLawSubject
                        ? subjectQuizCounts[subject.name.toLowerCase()] ||
                        subject.quizzes?.length ||
                        0
                        : subject.quizzes?.length || 0;

                    // Debug logging
                    if (subject.name.toLowerCase() === 'algebra') {
                      console.log(`Subject: ${subject.name}, Quiz count: ${quizCount}, SubjectQuizCounts:`, subjectQuizCounts);
                    }

                    return (
                      <Card
                        key={subject.name}
                        className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                        onClick={() => handleSubjectClick(subject.name)}
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
                          <div className="text-sm text-gray-500 mb-4">
                            {quizCount || 0} {quizCount === 1 ? 'quiz' : 'quizzes'} available
                          </div>

                          <Button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all">
                            View Quizzes
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <>
                  {/* Quizzes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                      <p>Loading quizzes...</p>
                    ) : quizData.length === 0 ? (
                      <p>No quizzes available for this subject.</p>
                    ) : (
                      quizData.map((quiz) => (
                        <Card
                          key={quiz.id}
                          className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
                        >
                          <CardContent className="p-6 flex flex-col items-center text-center h-full">
                            <div className="mb-4">
                              <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-2xl shadow-lg group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7" />
                              </span>
                            </div>
                            <div className="font-bold text-lg text-gray-800 mb-2">
                              {quiz.title}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {Array.isArray(quiz.questions)
                                ? quiz.questions.length
                                : 0}{" "}
                              questions •{" "}
                              {quiz.timeLimit ? Math.floor(quiz.timeLimit / 60) : 0} min
                            </div>
                            <Badge
                              className={`mb-4 ${quiz.difficulty === "Beginner"
                                ? "bg-green-100 text-green-700"
                                : quiz.difficulty === "Intermediate"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                                }`}
                            >
                              {quiz.difficulty}
                            </Badge>
                            <Button
                              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all"
                              onClick={() => handleStartQuiz(quiz)}
                            >
                              Start Quiz
                            </Button>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {!isPremium ? (
                <Card className="shadow-xl border-0 rounded-2xl bg-white">
                  <CardContent className="p-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-600 flex items-center justify-center">
                      <Lock className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      AI Quiz Studio is a Premium Feature
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                      Unlock AI-powered quiz generation with instant explanations and personalized practice.
                      Upgrade to Premium to access this powerful feature and accelerate your learning.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <Button
                        className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all"
                        onClick={() => router.push("/subscription")}
                      >
                        Upgrade to Premium
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleModeChange("library")}
                        className="px-8 py-3"
                      >
                        Browse Quiz Library
                      </Button>
                    </div>
                    <div className="mt-8 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-100">
                      <h4 className="font-semibold text-gray-900 mb-3">Premium Features Include:</h4>
                      <ul className="text-sm text-gray-600 space-y-2 text-left max-w-md mx-auto">
                        <li className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          AI-generated quizzes on any subject
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Instant explanations and feedback
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Customizable difficulty and topics
                        </li>
                        <li className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          Unlimited quiz generation
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  <Card className="lg:col-span-1 shadow-xl border-0 rounded-2xl bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold text-emerald-600">
                          Create AI Quiz
                        </p>
                        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs">
                          Premium
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Customize your practice
                      </h2>
                      <p className="text-sm text-gray-500 mb-6">
                        Select a subject, describe the topic you want to focus on,
                        and let our lightweight AI generate instant practice without
                        additional API costs.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Subject
                          </label>
                          <select
                            value={aiForm.subject}
                            onChange={(event) =>
                              setAiForm((prev) => ({
                                ...prev,
                                subject: event.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                          >
                            {aiSubjectOptions.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Topic / Focus Area
                          </label>
                          <input
                            type="text"
                            value={aiForm.topic}
                            onChange={(event) =>
                              setAiForm((prev) => ({
                                ...prev,
                                topic: event.target.value,
                              }))
                            }
                            placeholder="e.g., Photosynthesis basics"
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                          />
                          <p className="text-xs text-gray-400 mt-1">
                            Leave blank to let AI pick a core concept.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Difficulty
                            </label>
                            <select
                              value={aiForm.difficulty}
                              onChange={(event) =>
                                setAiForm((prev) => ({
                                  ...prev,
                                  difficulty: event.target.value as AIDifficulty,
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Questions
                            </label>
                            <input
                              type="number"
                              min={3}
                              max={15}
                              value={aiForm.numQuestions}
                              onChange={(event) =>
                                setAiForm((prev) => ({
                                  ...prev,
                                  numQuestions: Math.max(
                                    3,
                                    Math.min(15, Number(event.target.value))
                                  ),
                                }))
                              }
                              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700 block mb-2">
                            Time per question (minutes)
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            value={aiForm.timePerQuestion}
                            onChange={(event) =>
                              setAiForm((prev) => ({
                                ...prev,
                                timePerQuestion: Math.max(
                                  1,
                                  Math.min(5, Number(event.target.value))
                                ),
                              }))
                            }
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                        <Button
                          className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          onClick={handleGenerateAiQuiz}
                          disabled={isGeneratingAiQuiz}
                        >
                          {isGeneratingAiQuiz ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Crafting Quiz...
                            </span>
                          ) : (
                            "Generate Quiz"
                          )}
                        </Button>
                        {aiError && (
                          <p className="text-sm text-red-600 text-center">
                            {aiError}
                          </p>
                        )}
                        {aiQuiz && (
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleResetAiQuiz}
                          >
                            Start New Quiz
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <div className="lg:col-span-2 space-y-6">
                    {isGeneratingAiQuiz ? (
                      <Card className="shadow-xl border-0 rounded-2xl bg-white">
                        <CardContent className="p-10 text-center">
                          <div className="relative w-24 h-24 mx-auto mb-6">
                            {/* Animated gradient background */}
                            <div 
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 via-blue-500 to-emerald-400"
                              style={{
                                backgroundSize: '200% 100%',
                                animation: 'gradient-x 3s ease infinite',
                              }}
                            ></div>
                            {/* Pulsing ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-pulse"></div>
                            {/* Brain icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Brain className="w-12 h-12 text-white animate-pulse" />
                            </div>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 animate-pulse">
                            Crafting Your Quiz...
                          </h3>
                          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                            Our AI is generating {aiForm.numQuestions} carefully crafted questions for you
                          </p>
                          
                          {/* Animated progress dots */}
                          <div className="flex items-center justify-center gap-2 mb-6">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>

                          {/* Progress steps */}
                          <div className="space-y-2 text-xs text-gray-500">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                              <span>Analyzing your requirements...</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                              <span>Generating questions and options...</span>
                            </div>
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '400ms' }}></div>
                              <span>Finalizing your quiz...</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : !aiQuiz ? (
                      <Card className="shadow-xl border-0 rounded-2xl bg-white">
                        <CardContent className="p-10 text-center text-gray-500">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                            <Brain className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-2">
                            Ready to practice anything
                          </h3>
                          <p className="text-sm max-w-2xl mx-auto">
                            Describe the topic you want to master and we will build a
                            fresh quiz with AI-written options, explanations, and
                            automatic scoring—all generated on-device to stay
                            lightweight.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <Card className="shadow-xl border-0 rounded-2xl bg-white">
                          <CardContent className="p-6">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                              <Badge variant="outline" className="text-emerald-600">
                                {aiQuiz.subject}
                              </Badge>
                              <Badge variant="outline">{aiQuiz.difficulty}</Badge>
                              <Badge variant="outline">
                                {aiQuiz.questions.length} questions ·{" "}
                                {Math.round(aiQuiz.timeLimit / aiQuiz.questions.length)}{" "}
                                min/question
                              </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {aiQuiz.topic} Quiz
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                              Generated{" "}
                              {new Date(aiQuiz.createdAt).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              . Answer each question and submit to receive AI feedback.
                            </p>
                            <div className="space-y-6">
                              {aiQuiz.questions.map((question, index) => (
                                <div
                                  key={question.id}
                                  className="border border-gray-100 rounded-2xl p-5 bg-gray-50"
                                >
                                  <div className="flex items-start gap-3">
                                    <span className="w-8 h-8 min-w-[2rem] flex-shrink-0 rounded-full bg-white text-emerald-600 font-semibold flex items-center justify-center shadow text-sm">
                                      {index + 1}
                                    </span>
                                    <div>
                                      <p className="font-semibold text-gray-800 mb-3">
                                        {question.prompt}
                                      </p>
                                      <div className="space-y-2">
                                        {question.options.map((option) => (
                                          <label
                                            key={option.id}
                                            className={`flex items-center gap-3 border rounded-xl px-4 py-3 text-sm cursor-pointer transition ${aiQuizAnswers[question.id] === option.id
                                              ? "border-emerald-500 bg-white"
                                              : "border-transparent bg-white/70 hover:bg-white"
                                              }`}
                                          >
                                            <input
                                              type="radio"
                                              name={question.id}
                                              value={option.id}
                                              checked={aiQuizAnswers[question.id] === option.id}
                                              onChange={() =>
                                                handleAiAnswerChange(
                                                  question.id,
                                                  option.id
                                                )
                                              }
                                              className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className="text-gray-700">
                                              {option.text}
                                            </span>
                                          </label>
                                        ))}
                                      </div>
                                      {aiQuizResult && (
                                        <div
                                          className={`mt-3 rounded-xl px-4 py-3 text-sm ${aiQuizResult.details.find(
                                            (detail) =>
                                              detail.questionId === question.id
                                          )?.isCorrect
                                            ? "bg-emerald-50 text-emerald-800"
                                            : "bg-red-50 text-red-700"
                                            }`}
                                        >
                                          <p className="font-medium">
                                            {aiQuizResult.details.find(
                                              (detail) =>
                                                detail.questionId === question.id
                                            )?.isCorrect
                                              ? "Great work! That’s correct."
                                              : "Review the explanation below and try again."}
                                          </p>
                                          <p>
                                            Explanation:{" "}
                                            {
                                              aiQuizResult.details.find(
                                                (detail) =>
                                                  detail.questionId === question.id
                                              )?.explanation
                                            }
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                              <Button
                                className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow transition-all"
                                onClick={handleSubmitAiQuiz}
                                disabled={
                                  !aiQuiz ||
                                  Object.keys(aiQuizAnswers).length !==
                                  aiQuiz.questions.length
                                }
                              >
                                Get Feedback
                              </Button>
                              <Button variant="outline" onClick={handleResetAiQuiz}>
                                Clear Quiz
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        {aiQuizResult && (
                          <Card className="shadow-xl border-0 rounded-2xl bg-white">
                            <CardContent className="p-6 space-y-6">
                              <h3 className="text-xl font-bold text-gray-900">
                                Feedback Summary
                              </h3>
                              <div className="flex flex-wrap gap-6">
                                <div>
                                  <p className="text-sm text-gray-500">Score</p>
                                  <p className="text-3xl font-bold text-emerald-600">
                                    {aiQuizResult.totalCorrect}/
                                    {aiQuizResult.totalQuestions}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Accuracy</p>
                                  <p className="text-3xl font-bold text-blue-600">
                                    {aiQuizResult.accuracy}%
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Next step</p>
                                  <p className="text-base font-semibold text-gray-800">
                                    {aiQuizResult.accuracy > 80
                                      ? "Level up to harder drills"
                                      : aiQuizResult.accuracy > 50
                                        ? "Review explanations, retry soon"
                                        : "Revisit fundamentals first"}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-4">
                                {aiQuizResult.details.map((detail, index) => (
                                  <div
                                    key={detail.questionId}
                                    className="border border-gray-100 rounded-2xl p-4"
                                  >
                                    <p className="text-sm font-semibold text-gray-800 mb-1">
                                      Question {index + 1}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-2">
                                      {detail.prompt}
                                    </p>
                                    <div className="flex flex-wrap gap-3 text-xs">
                                      <Badge
                                        variant="outline"
                                        className={
                                          detail.isCorrect
                                            ? "border-emerald-200 text-emerald-700"
                                            : "border-red-200 text-red-700"
                                        }
                                      >
                                        {detail.isCorrect ? "Correct" : "Incorrect"}
                                      </Badge>
                                      {!detail.isCorrect && (
                                        <Badge variant="outline">
                                          You chose: {detail.userOption}
                                        </Badge>
                                      )}
                                      <Badge variant="outline" className="text-gray-600">
                                        Correct: {detail.correctOption}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                      {detail.explanation}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
