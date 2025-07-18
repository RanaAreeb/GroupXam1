"use client";
import { useState, useEffect } from "react";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Target,
  MessageSquare,
  BookOpen,
  Atom,
  FlaskConical,
  Leaf,
  FileText,
  Download,
  DollarSign,
  MapPin,
  History,
  Monitor,
  Calculator,
  Brain,
  Heart,
  Microscope,
  Pill,
  TreePine,
  Vote,
  Globe,
  TestTube,
  Dna,
  Leaf as EcologyIcon,
} from "lucide-react";
import Link from "next/link";

const subjectMeta: Record<
  string,
  { icon: JSX.Element; gradient: string; badge: string }
> = {
  "Use of English": {
    icon: <MessageSquare className="w-7 h-7" />,
    gradient: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700",
  },
  Mathematics: {
    icon: <Calculator className="w-7 h-7" />,
    gradient: "from-pink-500 to-purple-500",
    badge: "bg-pink-100 text-pink-700",
  },
  Physics: {
    icon: <Atom className="w-7 h-7" />,
    gradient: "from-blue-500 to-indigo-500",
    badge: "bg-blue-100 text-blue-700",
  },
  Chemistry: {
    icon: <FlaskConical className="w-7 h-7" />,
    gradient: "from-green-500 to-teal-500",
    badge: "bg-green-100 text-green-700",
  },
  Biology: {
    icon: <Leaf className="w-7 h-7" />,
    gradient: "from-emerald-500 to-green-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Economics: {
    icon: <DollarSign className="w-7 h-7" />,
    gradient: "from-green-500 to-emerald-500",
    badge: "bg-green-100 text-green-700",
  },

  "Literature in English": {
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-violet-500 to-purple-500",
    badge: "bg-violet-100 text-violet-700",
  },
  Government: {
    icon: <Vote className="w-7 h-7" />,
    gradient: "from-indigo-500 to-purple-500",
    badge: "bg-indigo-100 text-indigo-700",
  },
};

// Practice Questions data (only subjects with past papers)
const practiceQuestions = [
  {
    id: 1,
    title: "JAMB Use of English Practice Questions",
    subject: "Use of English",
    className: "UTME",
    department: "General",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "Choose the word that best completes the sentence: 'The students _____ their assignments on time.'",
        options: ["submitted", "submits", "submitting", "submit"],
        answer: 0,
      },
      {
        q: "Identify the part of speech of 'quickly' in 'She quickly finished her homework.'",
        options: ["Noun", "Verb", "Adjective", "Adverb"],
        answer: 3,
      },
    ],
  },
  {
    id: 2,
    title: "JAMB Mathematics Practice Questions",
    subject: "Mathematics",
    className: "UTME",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is the value of x in the equation 2x + 5 = 13?",
        options: ["3", "4", "5", "6"],
        answer: 1,
      },
      {
        q: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        answer: 2,
      },
    ],
  },
  {
    id: 3,
    title: "JAMB Physics Practice Questions",
    subject: "Physics",
    className: "UTME",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is the SI unit of force?",
        options: ["Joule", "Watt", "Newton", "Pascal"],
        answer: 2,
      },
      {
        q: "What is the formula for kinetic energy?",
        options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = Fd"],
        answer: 1,
      },
    ],
  },
  {
    id: 4,
    title: "JAMB Chemistry Practice Questions",
    subject: "Chemistry",
    className: "UTME",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is the chemical symbol for gold?",
        options: ["Ag", "Au", "Fe", "Cu"],
        answer: 1,
      },
      {
        q: "What is the pH of a neutral solution?",
        options: ["0", "7", "14", "10"],
        answer: 1,
      },
    ],
  },
  {
    id: 5,
    title: "JAMB Biology Practice Questions",
    subject: "Biology",
    className: "UTME",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
        answer: 1,
      },
      {
        q: "What is the process by which plants make their own food?",
        options: ["Respiration", "Photosynthesis", "Digestion", "Excretion"],
        answer: 1,
      },
    ],
  },
  {
    id: 6,
    title: "JAMB Economics Practice Questions",
    subject: "Economics",
    className: "UTME",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is the basic economic problem?",
        options: ["Scarcity", "Unemployment", "Inflation", "Deflation"],
        answer: 0,
      },
      {
        q: "Which of the following is a factor of production?",
        options: ["Money", "Land", "Interest", "Profit"],
        answer: 1,
      },
    ],
  },
  {
    id: 7,
    title: "JAMB Literature in English Practice Questions",
    subject: "Literature in English",
    className: "UTME",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is a sonnet?",
        options: [
          "A 14-line poem",
          "A type of novel",
          "A dramatic monologue",
          "A free verse poem",
        ],
        answer: 0,
      },
      {
        q: "Who wrote 'Romeo and Juliet'?",
        options: [
          "Charles Dickens",
          "William Shakespeare",
          "Jane Austen",
          "Mark Twain",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: 8,
    title: "JAMB Government Practice Questions",
    subject: "Government",
    className: "UTME",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    questions: [
      {
        q: "What is democracy?",
        options: [
          "Rule by one person",
          "Rule by the people",
          "Rule by the military",
          "Rule by the wealthy",
        ],
        answer: 1,
      },
      {
        q: "What is the main function of the legislature?",
        options: [
          "To execute laws",
          "To make laws",
          "To interpret laws",
          "To enforce laws",
        ],
        answer: 1,
      },
    ],
  },
];

// Past Papers data (2010-2018) - Subject categories
const pastPaperSubjects = [
  {
    id: 101,
    title: "Use of English",
    subject: "Use of English",
    className: "UTME",
    department: "General",
    years: "2010-2018",
    icon: <MessageSquare className="w-7 h-7" />,
    gradient: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 102,
    title: "Mathematics",
    subject: "Mathematics",
    className: "UTME",
    department: "Science",
    years: "2010-2018",
    icon: <Calculator className="w-7 h-7" />,
    gradient: "from-pink-500 to-purple-500",
    badge: "bg-pink-100 text-pink-700",
  },
  {
    id: 103,
    title: "Physics",
    subject: "Physics",
    className: "UTME",
    department: "Science",
    years: "2010-2018",
    icon: <Atom className="w-7 h-7" />,
    gradient: "from-blue-500 to-indigo-500",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    id: 104,
    title: "Chemistry",
    subject: "Chemistry",
    className: "UTME",
    department: "Science",
    years: "2010-2018",
    icon: <FlaskConical className="w-7 h-7" />,
    gradient: "from-green-500 to-teal-500",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: 105,
    title: "Biology",
    subject: "Biology",
    className: "UTME",
    department: "Science",
    years: "2010-2018",
    icon: <Leaf className="w-7 h-7" />,
    gradient: "from-emerald-500 to-green-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    id: 106,
    title: "Economics",
    subject: "Economics",
    className: "UTME",
    department: "Arts",
    years: "2010-2018",
    icon: <DollarSign className="w-7 h-7" />,
    gradient: "from-green-500 to-emerald-500",
    badge: "bg-green-100 text-green-700",
  },
  {
    id: 107,
    title: "Literature in English",
    subject: "Literature in English",
    className: "UTME",
    department: "Arts",
    years: "2010-2018",
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-violet-500 to-purple-500",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    id: 108,
    title: "Government",
    subject: "Government",
    className: "UTME",
    department: "Arts",
    years: "2010-2018",
    icon: <Vote className="w-7 h-7" />,
    gradient: "from-indigo-500 to-purple-500",
    badge: "bg-indigo-100 text-indigo-700",
  },
];

// Year-specific past papers (2010-2018)
const yearSpecificPapers = {
  "Use of English": [
    { year: 2010, questions: 60, duration: "2 hours" },
    { year: 2011, questions: 60, duration: "2 hours" },
    { year: 2012, questions: 60, duration: "2 hours" },
    { year: 2013, questions: 60, duration: "2 hours" },
    { year: 2014, questions: 60, duration: "2 hours" },
    { year: 2015, questions: 60, duration: "2 hours" },
    { year: 2016, questions: 60, duration: "2 hours" },
    { year: 2017, questions: 60, duration: "2 hours" },
    { year: 2018, questions: 60, duration: "2 hours" },
  ],
  Mathematics: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  Physics: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  Chemistry: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  Biology: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  Economics: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  "Literature in English": [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
  Government: [
    { year: 2010, questions: 50, duration: "2 hours" },
    { year: 2011, questions: 50, duration: "2 hours" },
    { year: 2012, questions: 50, duration: "2 hours" },
    { year: 2013, questions: 50, duration: "2 hours" },
    { year: 2014, questions: 50, duration: "2 hours" },
    { year: 2015, questions: 50, duration: "2 hours" },
    { year: 2016, questions: 50, duration: "2 hours" },
    { year: 2017, questions: 50, duration: "2 hours" },
    { year: 2018, questions: 50, duration: "2 hours" },
  ],
};

// Syllabus subjects with their PDF links (only subjects with past papers)
const syllabusSubjects = [
  {
    name: "Use of English",
    slug: "use-of-english",
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Mathematics",
    slug: "mathematics",
    icon: <Calculator className="w-6 h-6" />,
    gradient: "from-pink-500 to-purple-500",
  },
  {
    name: "Physics",
    slug: "physics",
    icon: <Atom className="w-6 h-6" />,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    icon: <FlaskConical className="w-6 h-6" />,
    gradient: "from-green-500 to-teal-500",
  },
  {
    name: "Biology",
    slug: "biology",
    icon: <Leaf className="w-6 h-6" />,
    gradient: "from-emerald-500 to-green-500",
  },
  {
    name: "Economics",
    slug: "economics",
    icon: <DollarSign className="w-6 h-6" />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "Literature in English",
    slug: "literature-in-english",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Government",
    slug: "government",
    icon: <Vote className="w-6 h-6" />,
    gradient: "from-indigo-500 to-purple-500",
  },
];

export default function JambExamsPage() {
  const [openExam, setOpenExam] = useState<number | null>(null);
  const [examData, setExamData] = useState<any>(null);
  const [answers, setAnswers] = useState<{ [examId: string]: number[] }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackEmoji, setFeedbackEmoji] = useState("🎉");
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [activeTab, setActiveTab] = useState<"syllabus" | "practice" | "mock">(
    "practice"
  );
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoadingExam, setIsLoadingExam] = useState(false);

  // Debug: Watch for openExam changes
  useEffect(() => {
    console.log("openExam changed to:", openExam);
  }, [openExam]);

  const handleStart = async (examId: number) => {
    if (activeTab === "mock") {
      // For past papers, show year selection
      const subject = pastPaperSubjects.find((e) => e.id === examId);
      if (subject) {
        setSelectedSubject(subject.subject);
        return;
      }
    } else if (activeTab === "practice") {
      setOpenExam(examId);
      if (!answers[examId]) {
        const exam = practiceQuestions.find((e) => e.id === examId);
        const questionCount = exam?.questions.length || 2;
        setAnswers((prev) => ({
          ...prev,
          [examId]: Array(questionCount).fill(-1),
        }));
      }
    }
  };

  const handleYearSelect = async (year: number) => {
    setSelectedYear(year);
    setIsLoadingExam(true);

    try {
      console.log("Loading exam for:", selectedSubject, year);

      // Load MCQ questions for the specific year and subject
      const response = await fetch(
        `/api/exams/jamb/mock-data/${encodeURIComponent(
          selectedSubject!
        )}/${year}`
      );
      if (response.ok) {
        const loadedExamData = await response.json();
        console.log("Exam data loaded:", loadedExamData);

        // Store the exam data in state
        setExamData(loadedExamData);

        // Store in localStorage as backup
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "currentJambExam",
            JSON.stringify(loadedExamData)
          );
        }

        // Initialize answers array using the exam ID
        if (!answers[loadedExamData.id]) {
          setAnswers((prev) => ({
            ...prev,
            [loadedExamData.id]: Array(loadedExamData.questions.length).fill(
              -1
            ),
          }));
        }

        // Set the exam as open using a number ID for consistency
        console.log("Setting openExam to:", 999); // Use 999 as JAMB exam ID
        setOpenExam(999);
        setIsLoadingExam(false);
      } else {
        console.error("Failed to load exam data");
        setIsLoadingExam(false);
      }
    } catch (error) {
      console.error("Error loading exam data:", error);
      setIsLoadingExam(false);
    }
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedYear(null);
  };

  const handleAnswer = (examId: any, qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [examId]: prev[examId].map((a, i) => (i === qIdx ? optIdx : a)),
    }));
  };

  const handleSubmit = (exam: any) => {
    const examId = exam.id || examData?.id;
    const userAnswers = answers[examId] || [];
    let correct = 0;
    const questions = exam.questions || examData?.questions || [];
    questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.correctAnswer) correct++;
    });
    setScore(correct);
    setFeedbackEmoji(
      correct === questions.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setShowModal(true);
  };

  const getCurrentExams = () => {
    switch (activeTab) {
      case "practice":
        return practiceQuestions;
      case "mock":
        return pastPaperSubjects;
      default:
        return [];
    }
  };

  const currentExams = getCurrentExams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              JAMB Practice Exams
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice real JAMB questions for various subjects. Get instant
            feedback and track your progress!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => setActiveTab("syllabus")}
            variant={activeTab === "syllabus" ? "default" : "outline"}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              activeTab === "syllabus"
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 hover:border-blue-700"
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            View Syllabus
            {activeTab === "syllabus" && <span className="ml-2">✓</span>}
          </Button>
          <Button
            onClick={() => setActiveTab("practice")}
            variant={activeTab === "practice" ? "default" : "outline"}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              activeTab === "practice"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 hover:border-emerald-700"
            }`}
          >
            <Target className="w-5 h-5 mr-2" />
            Practice Questions
            {activeTab === "practice" && <span className="ml-2">✓</span>}
          </Button>
          <Button
            onClick={() => setActiveTab("mock")}
            variant={activeTab === "mock" ? "default" : "outline"}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              activeTab === "mock"
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-purple-600 border-2 border-purple-600 hover:border-purple-700"
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Mock Exams
            {activeTab === "mock" && <span className="ml-2">✓</span>}
          </Button>
        </div>

        {/* Syllabus Section */}
        {activeTab === "syllabus" && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                Syllabus View Active
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                JAMB Syllabus 2025
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {syllabusSubjects.map((subject) => (
                <Card
                  key={subject.slug}
                  className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                >
                  <Link href={`/exams/jamb/syllabus/${subject.slug}`}>
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${subject.gradient} text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          {subject.icon}
                        </span>
                      </div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {subject.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        Syllabus PDF
                      </div>
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Syllabus
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Practice Questions and Mock Exams Section */}
        {activeTab !== "syllabus" &&
        openExam === null &&
        !selectedSubject &&
        !examData ? (
          <div>
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                  activeTab === "practice"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-purple-100 text-purple-800"
                }`}
              >
                {activeTab === "practice" ? (
                  <Target className="w-4 h-4" />
                ) : (
                  <BookOpen className="w-4 h-4" />
                )}
                {activeTab === "practice" ? "Practice Questions" : "Mock Exams"}{" "}
                View Active
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Available{" "}
                {activeTab === "practice" ? "Practice Questions" : "Mock Exams"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {currentExams.map((exam: any) => {
                const meta =
                  activeTab === "practice"
                    ? subjectMeta[exam.subject] || subjectMeta["Use of English"]
                    : exam;
                return (
                  <Card
                    key={exam.id}
                    className={`relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl group`}
                  >
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform`}
                        >
                          {meta.icon}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800 mb-1">
                            {exam.title}
                          </div>
                          <Badge className={`${meta.badge} px-3 py-1 shadow`}>
                            {exam.subject}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-4">
                        {activeTab === "practice"
                          ? `${exam.questions?.length || 0} Questions • ${
                              exam.duration || "2 hours"
                            }`
                          : `${exam.years} • Past Papers`}
                      </div>

                      <Button
                        className={`${
                          activeTab === "practice"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-purple-600 hover:bg-purple-700"
                        } text-white mt-auto w-full rounded-full shadow-lg`}
                        onClick={() => handleStart(exam.id)}
                      >
                        {activeTab === "practice"
                          ? "Go Practice"
                          : "Select Year"}
                      </Button>
                      {/* Decorative gradient blob */}
                      <span
                        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${meta.gradient}`}
                      ></span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : selectedSubject && !openExam && !examData ? (
          // Year Selection View
          <div>
            <div className="text-center mb-8">
              <Button
                variant="ghost"
                className="mb-4"
                onClick={handleBackToSubjects}
              >
                ← Back to Subjects
              </Button>
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                Year Selection View Active
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {selectedSubject} Past Papers (2010-2018)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {yearSpecificPapers[
                selectedSubject as keyof typeof yearSpecificPapers
              ]?.map((yearPaper) => (
                <Card
                  key={yearPaper.year}
                  className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer"
                  onClick={() => handleYearSelect(yearPaper.year)}
                >
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                        <span className="text-white font-bold text-lg">
                          {yearPaper.year}
                        </span>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800 mb-1">
                          {selectedSubject} {yearPaper.year}
                        </div>
                        <Badge className="bg-purple-100 text-purple-700 px-3 py-1 shadow">
                          {yearPaper.questions} Questions
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Duration: {yearPaper.duration}
                    </div>
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white mt-auto w-full rounded-full shadow-lg"
                      onClick={() => handleYearSelect(yearPaper.year)}
                    >
                      Start MCQ Exam
                    </Button>
                    {/* Decorative gradient blob */}
                    <span className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br from-purple-500 to-indigo-500"></span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : openExam !== null || isLoadingExam || examData !== null ? (
          // Only show the selected exam in full-page view
          (() => {
            if (isLoadingExam) {
              return (
                <div className="max-w-2xl mx-auto mb-12">
                  <Card className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur-md">
                    <CardContent className="p-8 flex flex-col items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                      <p className="text-lg font-semibold text-gray-700">
                        Loading exam...
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            }

            // Use examData from state first, then fall back to practice questions or localStorage
            let exam: any = examData;
            let meta: any = null;
            let questions: any = null;

            if (exam) {
              // JAMB exam from state
              meta = {
                icon: <BookOpen className="w-7 h-7" />,
                gradient: "from-purple-500 to-indigo-500",
                badge: "bg-purple-100 text-purple-700",
              };
              questions = exam.questions;
              console.log("Using exam from state:", exam.id);
            } else {
              // Check practice questions
              exam = practiceQuestions.find((e) => e.id === openExam);
              if (exam) {
                meta =
                  subjectMeta[exam.subject] || subjectMeta["Use of English"];
                questions = exam.questions;
                console.log("Using practice exam:", exam.id);
              }
            }

            console.log("Exam display check:", {
              exam: exam?.id,
              meta: !!meta,
              questions: questions?.length,
            });

            if (!exam || !meta) {
              console.log("Exam not showing because:", {
                hasExam: !!exam,
                hasMeta: !!meta,
              });
              return null;
            }

            return (
              <div className="max-w-2xl mx-auto mb-12">
                <Card className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur-md">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg border-4 border-white`}
                      >
                        {meta.icon}
                      </div>
                      <div>
                        <div className="text-xl font-bold text-gray-800 mb-1">
                          {exam.title}
                        </div>
                        <Badge className={`${meta.badge} px-3 py-1 shadow`}>
                          {exam.subject}
                        </Badge>
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      className="mb-6 w-fit self-start"
                      onClick={() => {
                        setOpenExam(null);
                        setExamData(null);
                        setShowFeedback(false);
                        setShowModal(false);
                      }}
                    >
                      ← Back
                    </Button>

                    <div className="mt-4 space-y-6">
                      {questions.map(
                        (
                          q: {
                            id: number;
                            question: string;
                            options: string[];
                            correctAnswer: number;
                          },
                          qIdx: number
                        ) => (
                          <div key={qIdx} className="mb-4">
                            <div className="font-semibold mb-2">
                              Q{q.id || qIdx + 1}. {q.question}
                            </div>
                            {q.options && q.options.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {q.options.map(
                                  (opt: string, optIdx: number) => {
                                    const isSelected =
                                      answers[exam.id || examData?.id]?.[
                                        qIdx
                                      ] === optIdx;
                                    const isCorrect =
                                      q.correctAnswer === optIdx;
                                    const showExamFeedback = showFeedback;

                                    let optionClass =
                                      "flex items-center gap-2 p-2 rounded cursor-pointer transition-all";

                                    if (showExamFeedback) {
                                      if (isCorrect) {
                                        optionClass +=
                                          " bg-green-100 border-green-400";
                                      } else if (isSelected && !isCorrect) {
                                        optionClass +=
                                          " bg-red-100 border-red-400";
                                      } else {
                                        optionClass +=
                                          " bg-gray-50 border-gray-200";
                                      }
                                    } else {
                                      if (isSelected) {
                                        optionClass +=
                                          " bg-emerald-100 border-emerald-400";
                                      } else {
                                        optionClass +=
                                          " bg-white border border-gray-200 hover:border-emerald-300";
                                      }
                                    }

                                    return (
                                      <label
                                        key={optIdx}
                                        className={optionClass}
                                      >
                                        <input
                                          type="radio"
                                          name={`q${
                                            exam.id || examData?.id
                                          }_${qIdx}`}
                                          checked={isSelected}
                                          onChange={() =>
                                            handleAnswer(
                                              exam.id || examData?.id,
                                              qIdx,
                                              optIdx
                                            )
                                          }
                                          className="accent-emerald-600"
                                          disabled={showExamFeedback}
                                        />
                                        <span className="flex-1">{opt}</span>
                                        {showExamFeedback && isCorrect && (
                                          <span className="text-green-600 font-bold">
                                            ✓
                                          </span>
                                        )}
                                        {showExamFeedback &&
                                          isSelected &&
                                          !isCorrect && (
                                            <span className="text-red-600 font-bold">
                                              ✗
                                            </span>
                                          )}
                                      </label>
                                    );
                                  }
                                )}
                              </div>
                            ) : null}
                          </div>
                        )
                      )}
                      {!showFeedback ? (
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2 w-full rounded-full shadow-lg"
                          onClick={() => handleSubmit(exam)}
                        >
                          Submit
                        </Button>
                      ) : (
                        <div className="mt-2 space-y-2">
                          <Button
                            variant="outline"
                            className="w-full rounded-full"
                            onClick={() => setShowFeedback(false)}
                          >
                            Hide Answers
                          </Button>
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-full shadow-lg"
                            onClick={() => {
                              setShowFeedback(false);
                              setOpenExam(null);
                              setExamData(null);
                            }}
                          >
                            Back to Exams
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Decorative gradient blob */}
                    <span
                      className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${meta.gradient}`}
                    ></span>
                  </CardContent>
                </Card>
              </div>
            );
          })()
        ) : null}
        {/* Feedback Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl flex items-center justify-center gap-2">
                {feedbackEmoji}{" "}
                {score === 2
                  ? "Awesome!"
                  : score === 1
                  ? "Good Try!"
                  : "Keep Practicing!"}
              </DialogTitle>
            </DialogHeader>
            <div className="my-4 text-lg font-semibold text-emerald-700">
              You scored {score} out of{" "}
              {(() => {
                // First check examData (for JAMB exams)
                if (examData && examData.questions) {
                  return examData.questions.length;
                }

                // Then check practice questions
                const exam = practiceQuestions.find((e) => e.id === openExam);
                if (exam && exam.questions) {
                  return exam.questions.length;
                }

                // Fallback to localStorage
                if (typeof window !== "undefined") {
                  const storedExam = localStorage.getItem("currentJambExam");
                  if (storedExam) {
                    const jambExam = JSON.parse(storedExam);
                    return jambExam.questions?.length || 0;
                  }
                }

                return 0;
              })()}
            </div>
            <Progress
              value={
                (score /
                  (() => {
                    // First check examData (for JAMB exams)
                    if (examData && examData.questions) {
                      return examData.questions.length;
                    }

                    // Then check practice questions
                    const exam = practiceQuestions.find(
                      (e) => e.id === openExam
                    );
                    if (exam && exam.questions) {
                      return exam.questions.length;
                    }

                    // Fallback to localStorage
                    if (typeof window !== "undefined") {
                      const storedExam =
                        localStorage.getItem("currentJambExam");
                      if (storedExam) {
                        const jambExam = JSON.parse(storedExam);
                        return jambExam.questions?.length || 1;
                      }
                    }

                    return 1;
                  })()) *
                100
              }
              className="mb-4 h-3 bg-gray-200"
            />
            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                onClick={() => {
                  setShowModal(false);
                  setShowFeedback(true);
                  // Keep the exam open to show answers
                }}
              >
                Show Correct Answers
              </Button>
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                onClick={() => {
                  setShowModal(false);
                  setShowFeedback(false);
                  setOpenExam(null);
                  setExamData(null);
                }}
              >
                Back to Exams
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setShowModal(false);
                  setShowFeedback(false);

                  // Determine question count and exam ID
                  let questionCount = 50;
                  let examId = null;

                  if (examData && examData.questions) {
                    questionCount = examData.questions.length;
                    examId = examData.id;
                  } else {
                    const exam = practiceQuestions.find(
                      (e) => e.id === openExam
                    );
                    if (exam && exam.questions) {
                      questionCount = exam.questions.length;
                      examId = exam.id;
                    } else if (typeof window !== "undefined") {
                      const storedExam =
                        localStorage.getItem("currentJambExam");
                      if (storedExam) {
                        const jambExam = JSON.parse(storedExam);
                        questionCount = jambExam.questions?.length || 50;
                        examId = jambExam.id;
                      }
                    }
                  }

                  if (examId) {
                    setAnswers((prev) => ({
                      ...prev,
                      [examId]: Array(questionCount).fill(-1),
                    }));
                  }
                }}
              >
                Try Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
