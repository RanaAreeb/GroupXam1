"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import AppHeader from "@/components/ui/app-header";
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
    ],
  },
];

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
    subjectName.toLowerCase() === "psychology"
  ) {
    try {
      const response = await fetch(
        `/api/quiz-data/science/${subjectName.toLowerCase()}`
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
    subjectName.toLowerCase() === "political science"
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
    subjectName.toLowerCase() === "pythagorean theorem"
  ) {
    try {
      // Map subject names to folder names
      let folderName = subjectName.toLowerCase();
      if (subjectName.toLowerCase() === "pythagorean theorem") {
        folderName = "pythagorean-theorem";
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
    subjectName.toLowerCase() === "cultural studies"
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

  // Fallback to static data for other subjects
  return subject.quizzes.map((quizId) => quizData[quizId]).filter(Boolean);
};

export default function QuizPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjectQuizCounts, setSubjectQuizCounts] = useState<{
    [key: string]: number;
  }>({});

  // Handle URL parameters for category selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get("category");
    const subjectParam = urlParams.get("subject");

    if (
      categoryParam &&
      subjectCategories.find((cat) => cat.id === categoryParam)
    ) {
      setSelectedCategory(categoryParam);
    }

    if (subjectParam) {
      setSelectedSubject(subjectParam);
    }
  }, []);

  // Load quiz data when subject changes
  useEffect(() => {
    if (selectedSubject) {
      loadQuizData(selectedSubject);
    }
  }, [selectedSubject]);

  // Load quiz counts for science subjects
  useEffect(() => {
    const loadQuizCounts = async () => {
      const scienceSubjects = [
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
      ];

      const codingSubjects = [
        "javascript",
        "python",
        "html/css",
        "react",
        "node.js",
        "database",
      ];

      const economicsSubjects = [
        "economics",
        "micro economics",
        "macro economics",
        "accounting",
        "finance",
        "political science",
      ];

      const mathematicsSubjects = [
        "statistics",
        "calculus",
        "algebra",
        "arithmetic",
        "geometry",
        "trigonometry",
        "pythagorean theorem",
      ];

      const artsHumanitiesSubjects = [
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
      ];

      const counts: { [key: string]: number } = {};

      // Load science subject counts
      for (const subject of scienceSubjects) {
        try {
          const response = await fetch(`/api/quiz-data/science/${subject}`);
          if (response.ok) {
            const quizFiles = await response.json();
            counts[subject] = Array.isArray(quizFiles) ? quizFiles.length : 0;
          }
        } catch (error) {
          console.error(`Error loading quiz count for ${subject}:`, error);
          counts[subject] = 0;
        }
      }

      // Load coding subject counts
      for (const subject of codingSubjects) {
        try {
          // Map subject names to folder names
          let folderName = subject;
          if (subject === "html/css") {
            folderName = "html-css";
          } else if (subject === "node.js") {
            folderName = "nodejs";
          }

          const response = await fetch(`/api/quiz-data/coding/${folderName}`);
          if (response.ok) {
            const quizFiles = await response.json();
            counts[subject] = Array.isArray(quizFiles) ? quizFiles.length : 0;
          }
        } catch (error) {
          console.error(`Error loading quiz count for ${subject}:`, error);
          counts[subject] = 0;
        }
      }

      // Load economics subject counts
      for (const subject of economicsSubjects) {
        try {
          // Map subject names to folder names
          let folderName = subject;
          if (subject === "micro economics") {
            folderName = "micro-economics";
          } else if (subject === "macro economics") {
            folderName = "macro-economics";
          } else if (subject === "political science") {
            folderName = "political-science";
          }

          const response = await fetch(
            `/api/quiz-data/economics/${folderName}`
          );
          if (response.ok) {
            const quizFiles = await response.json();
            counts[subject] = Array.isArray(quizFiles) ? quizFiles.length : 0;
          }
        } catch (error) {
          console.error(`Error loading quiz count for ${subject}:`, error);
          counts[subject] = 0;
        }
      }

      // Load mathematics subject counts
      for (const subject of mathematicsSubjects) {
        try {
          // Map subject names to folder names
          let folderName = subject;
          if (subject === "pythagorean theorem") {
            folderName = "pythagorean-theorem";
          }

          const response = await fetch(
            `/api/quiz-data/mathematics/${folderName}`
          );
          if (response.ok) {
            const quizFiles = await response.json();
            counts[subject] = Array.isArray(quizFiles) ? quizFiles.length : 0;
          }
        } catch (error) {
          console.error(`Error loading quiz count for ${subject}:`, error);
          counts[subject] = 0;
        }
      }

      // Load arts & humanities subject counts
      for (const subject of artsHumanitiesSubjects) {
        try {
          // Map subject names to folder names
          let folderName = subject;
          if (subject === "art history") {
            folderName = "art-history";
          } else if (subject === "music theory") {
            folderName = "music-theory";
          } else if (subject === "creative writing") {
            folderName = "creative-writing";
          } else if (subject === "foreign languages") {
            folderName = "foreign-languages";
          } else if (subject === "religious studies") {
            folderName = "religious-studies";
          } else if (subject === "cultural studies") {
            folderName = "cultural-studies";
          }

          const response = await fetch(
            `/api/quiz-data/arts-humanities/${folderName}`
          );
          if (response.ok) {
            const quizFiles = await response.json();
            counts[subject] = Array.isArray(quizFiles) ? quizFiles.length : 0;
          }
        } catch (error) {
          console.error(`Error loading quiz count for ${subject}:`, error);
          counts[subject] = 0;
        }
      }

      setSubjectQuizCounts(counts);
    };

    loadQuizCounts();
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

  const handleStartQuiz = (quiz: any) => {
    // Navigate to quiz page with quiz info
    const quizUrl = `/quiz/${encodeURIComponent(quiz.subject.toLowerCase())}/${
      quiz.id
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
            {selectedSubjectData && (
              <>
                {" "}
                &gt; <span>{selectedSubjectData.name}</span>
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
            {selectedSubjectData
              ? `${selectedSubjectData.name} Quizzes`
              : selectedCategoryData
              ? selectedCategoryData.title
              : "Exam Preparation Quizzes"}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-2">
            {selectedSubjectData
              ? `Choose a quiz to test your ${selectedSubjectData.name.toLowerCase()} knowledge`
              : selectedCategoryData
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

              const quizCount =
                isScienceSubject ||
                isCodingSubject ||
                isEconomicsSubject ||
                isMathematicsSubject ||
                isArtsHumanitiesSubject
                  ? subjectQuizCounts[subject.name.toLowerCase()] ||
                    subject.quizzes?.length ||
                    0
                  : subject.quizzes?.length || 1;

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
                    <div className="text-xs text-gray-500 mb-4">
                      {quizCount} quiz{quizCount !== 1 ? "es" : ""} available
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
          /* Quizzes Grid */
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
                      className={`mb-4 ${
                        quiz.difficulty === "Beginner"
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
        )}
      </div>
    </div>
  );
}
