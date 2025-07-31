"use client";
import { useState, useEffect } from "react";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { waecExams } from "./exams-data";
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
} from "lucide-react";
import Link from "next/link";
import Whiteboard from "@/components/Whiteboard";

const subjectMeta: Record<
  string,
  { icon: JSX.Element; gradient: string; badge: string }
> = {
  Economics: {
    icon: <DollarSign className="w-7 h-7" />,
    gradient: "from-green-500 to-emerald-500",
    badge: "bg-green-100 text-green-700",
  },
  "English Language": {
    icon: <MessageSquare className="w-7 h-7" />,
    gradient: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700",
  },
  Geography: {
    icon: <MapPin className="w-7 h-7" />,
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-700",
  },
  "General Mathematics": {
    icon: <Target className="w-7 h-7" />,
    gradient: "from-pink-500 to-purple-500",
    badge: "bg-pink-100 text-pink-700",
  },
  "Further Mathematics": {
    icon: <Target className="w-7 h-7" />,
    gradient: "from-indigo-500 to-purple-500",
    badge: "bg-indigo-100 text-indigo-700",
  },
  History: {
    icon: <History className="w-7 h-7" />,
    gradient: "from-red-500 to-pink-500",
    badge: "bg-red-100 text-red-700",
  },
  "Computer Studies": {
    icon: <Monitor className="w-7 h-7" />,
    gradient: "from-cyan-500 to-blue-500",
    badge: "bg-cyan-100 text-cyan-700",
  },
  Physics: {
    icon: <Atom className="w-7 h-7" />,
    gradient: "from-blue-500 to-indigo-500",
    badge: "bg-blue-100 text-blue-700",
  },
  "Literature in English": {
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-violet-500 to-purple-500",
    badge: "bg-violet-100 text-violet-700",
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
};

// Use imported practice questions data
const practiceQuestions = waecExams;

// Mock Exams data (questions only - display format)
const mockExams = [
  {
    id: 101,
    title: "WAEC Economics Mock Exam",
    subject: "Economics",
    className: "SS3",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-economics-mock.json",
  },
  {
    id: 102,
    title: "WAEC English Language Mock Exam",
    subject: "English Language",
    className: "SS3",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-english-language-mock.json",
  },
  {
    id: 103,
    title: "WAEC Geography Mock Exam",
    subject: "Geography",
    className: "SS3",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-geography-mock.json",
  },
  {
    id: 104,
    title: "WAEC General Mathematics Mock Exam",
    subject: "General Mathematics",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-general-mathematics-mock.json",
  },
  {
    id: 105,
    title: "WAEC Further Mathematics Mock Exam",
    subject: "Further Mathematics",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-further-mathematics-mock.json",
  },
  {
    id: 106,
    title: "WAEC History Mock Exam",
    subject: "History",
    className: "SS3",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-history-mock.json",
  },
  {
    id: 107,
    title: "WAEC Computer Studies Mock Exam",
    subject: "Computer Studies",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-computer-studies-mock.json",
  },
  {
    id: 108,
    title: "WAEC Physics Mock Exam",
    subject: "Physics",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-physics-mock.json",
  },
  {
    id: 109,
    title: "WAEC Literature in English Mock Exam",
    subject: "Literature in English",
    className: "SS3",
    department: "Arts",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-literature-english-mock.json",
  },
  {
    id: 110,
    title: "WAEC Chemistry Mock Exam",
    subject: "Chemistry",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-chemistry-mock.json",
  },
  {
    id: 111,
    title: "WAEC Biology Mock Exam",
    subject: "Biology",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-biology-mock.json",
  },
  {
    id: 112,
    title: "WAEC Physics Mock Exam 2025",
    subject: "Physics",
    className: "SS3",
    department: "Science",
    date: "2025-03-15",
    time: "09:00 AM",
    dataFile: "waec-physics-mock.json",
  },
];

// Syllabus subjects with their PDF links
const syllabusSubjects = [
  {
    name: "Economics",
    slug: "economics",
    icon: <DollarSign className="w-6 h-6" />,
    gradient: "from-green-500 to-emerald-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/ECONOMICS (1).pdf",
  },
  {
    name: "English Language",
    slug: "english-language",
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/ENGLISH LANGUAGE (1).pdf",
  },
  {
    name: "Geography",
    slug: "geography",
    icon: <MapPin className="w-6 h-6" />,
    gradient: "from-amber-500 to-orange-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/GEOGRAPHY (1).pdf",
  },
  {
    name: "General Mathematics",
    slug: "general-mathematics",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-pink-500 to-purple-500",
    pdfUrl:
      "/pdf/waec-syllabus-pdf/GENERAL MATHEMATICS OR MATHEMATICS (CORE).pdf",
  },
  {
    name: "Further Mathematics",
    slug: "further-mathematics",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-indigo-500 to-purple-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/math.png",
    isImage: true,
  },
  {
    name: "History",
    slug: "history",
    icon: <History className="w-6 h-6" />,
    gradient: "from-red-500 to-pink-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/HISTORY (1).pdf",
  },
  {
    name: "Computer Studies",
    slug: "computer-studies",
    icon: <Monitor className="w-6 h-6" />,
    gradient: "from-cyan-500 to-blue-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/COMPUTER STUDIES (1).pdf",
  },
  {
    name: "Physics",
    slug: "physics",
    icon: <Atom className="w-6 h-6" />,
    gradient: "from-blue-500 to-indigo-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/PHYSICS (1).pdf",
  },
  {
    name: "Literature in English",
    slug: "literature-in-english",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-violet-500 to-purple-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/LITERATURE IN ENGLISH (1).pdf",
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    icon: <FlaskConical className="w-6 h-6" />,
    gradient: "from-green-500 to-teal-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/CHEMISTRY (1).pdf",
  },
  {
    name: "Biology",
    slug: "biology",
    icon: <Leaf className="w-6 h-6" />,
    gradient: "from-emerald-500 to-green-500",
    pdfUrl: "/pdf/waec-syllabus-pdf/BIOLOGY (1).pdf",
  },
];

export default function WAECExamsPage() {
  const [openExam, setOpenExam] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{
    [examId: string | number]: number[];
  }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackEmoji, setFeedbackEmoji] = useState("🎉");
  const [showSyllabus, setShowSyllabus] = useState(false);
  const [activeTab, setActiveTab] = useState<"syllabus" | "practice" | "mock">(
    "practice"
  );
  const [mockExamData, setMockExamData] = useState<{
    [examId: string | number]: any;
  }>({});
  const [loadingMockExam, setLoadingMockExam] = useState(false);
  // Mock exam answers state
  const [mockAnswers, setMockAnswers] = useState<{
    [examId: string | number]: number[];
  }>({});
  const [mockScore, setMockScore] = useState(0);
  const [mockFeedbackEmoji, setMockFeedbackEmoji] = useState("🎉");
  const [showMockFeedback, setShowMockFeedback] = useState(false);
  const [showMockExamFeedback, setShowMockExamFeedback] = useState(false);
  // Whiteboard state
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const [whiteboardBg, setWhiteboardBg] = useState<"white" | "black">("white");
  const [whiteboardTemplate, setWhiteboardTemplate] = useState("blank");

  const handleStart = async (examId: number) => {
    setOpenExam(examId);

    // If it's a mock exam and we haven't loaded the data yet
    if (activeTab === "mock" && !mockExamData[examId]) {
      setLoadingMockExam(true);
      const exam = mockExams.find((e) => e.id === examId);
      if (exam?.dataFile) {
        try {
          // Load data from the JSON file
          const response = await fetch(
            `/api/exams/waec/mock-data/${exam.dataFile.replace(".json", "")}`
          );
          console.log(
            "WAEC API Response:",
            response.status,
            response.statusText
          );
          if (response.ok) {
            const data = await response.json();
            console.log("WAEC API Data loaded:", data);
            setMockExamData((prev) => ({ ...prev, [examId]: data }));
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Failed to load mock exam data:", errorData);
          }
        } catch (error) {
          console.error("Error loading mock exam data:", error);
        } finally {
          setLoadingMockExam(false);
        }
      }
    } else if (activeTab === "practice" && !answers[examId]) {
      const exam = practiceQuestions.find((e) => e.id === examId);
      const questionCount = exam?.questions.length || 2;
      setAnswers((prev) => ({
        ...prev,
        [examId]: Array(questionCount).fill(-1),
      }));
    } else if (activeTab === "mock" && !mockAnswers[examId]) {
      // Initialize mock answers with a large array to handle any number of questions
      setMockAnswers((prev) => ({
        ...prev,
        [examId]: Array(100).fill(-1),
      }));
    }
  };

  const handleAnswer = (
    examId: string | number,
    qIdx: number,
    optIdx: number
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [examId]: prev[examId].map((a, i) => (i === qIdx ? optIdx : a)),
    }));
  };

  const handleMockAnswer = (
    examId: string | number,
    qIdx: number,
    optIdx: number
  ) => {
    setMockAnswers((prev) => ({
      ...prev,
      [examId]: prev[examId]
        ? prev[examId].map((a, i) => (i === qIdx ? optIdx : a))
        : Array(100)
            .fill(-1)
            .map((a, i) => (i === qIdx ? optIdx : a)),
    }));
  };

  const handleSubmit = (exam: any) => {
    const userAnswers = answers[exam.id] || [];
    let correct = 0;
    exam.questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setFeedbackEmoji(
      correct === exam.questions.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setShowFeedback(true);
  };

  const handleMockSubmit = (exam: any) => {
    const mockData = mockExamData[exam.id];
    if (!mockData) return;

    const questions = (() => {
      if (mockData.questions) {
        return mockData.questions;
      } else if (mockData.sections) {
        const allQuestions: any[] = [];
        Object.values(mockData.sections).forEach((section: any) => {
          if (section.questions) {
            allQuestions.push(...section.questions);
          }
        });
        return allQuestions;
      }
      return [];
    })();

    const userAnswers = mockAnswers[exam.id] || [];
    let correct = 0;
    questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.correctAnswer) correct++;
    });
    setMockScore(correct);
    setMockFeedbackEmoji(
      correct === questions.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setShowMockFeedback(true);
  };

  const getCurrentExams = () => {
    switch (activeTab) {
      case "practice":
        return practiceQuestions;
      case "mock":
        return mockExams;
      default:
        return [];
    }
  };

  const [currentExams, setCurrentExams] = useState(getCurrentExams());

  // Update currentExams when activeTab changes
  useEffect(() => {
    const newExams = getCurrentExams();
    setCurrentExams(newExams);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              WAEC Practice Exams
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice real WAEC questions for various subjects. Get instant
            feedback and track your progress!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => {
              setActiveTab("syllabus");
              setOpenExam(null);
              setShowFeedback(false);
              setShowMockFeedback(false);
              setShowMockExamFeedback(false);
            }}
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
            onClick={() => {
              setActiveTab("practice");
              setOpenExam(null);
              setShowFeedback(false);
              setShowMockFeedback(false);
              setShowMockExamFeedback(false);
              setMockExamData({});
              // Force immediate update of currentExams
              setCurrentExams(practiceQuestions);
            }}
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
            onClick={() => {
              setActiveTab("mock");
              setOpenExam(null);
              setShowFeedback(false);
              setShowMockFeedback(false);
              setShowMockExamFeedback(false);
              setMockExamData({});
              // Force immediate update of currentExams
              setCurrentExams(mockExams);
            }}
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
                WAEC Syllabus 2025
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {syllabusSubjects.map((subject) => (
                <Card
                  key={subject.slug}
                  className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                >
                  <Link href={`/exams/waec/syllabus/${subject.slug}`}>
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
        {activeTab !== "syllabus" && openExam === null ? (
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
                {activeTab === "practice" ? "Practice Questions" : "Mock Exams"}{" "}
                ({currentExams.length})
              </h2>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12"
              key={`${activeTab}-${currentExams.length}`}
            >
              {currentExams.map((exam: any, index: number) => {
                const meta =
                  subjectMeta[exam.subject] || subjectMeta["Economics"];
                return (
                  <Card
                    key={`${activeTab}-${exam.id}`}
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
                          : "View Full Paper"}
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
        ) : (
          activeTab !== "syllabus" &&
          // Only show the selected exam in full-page view
          (() => {
            const exam =
              activeTab === "practice"
                ? practiceQuestions.find((e) => e.id === openExam)
                : mockExams.find((e) => e.id === openExam);
            if (!exam) return null;

            const meta = subjectMeta[exam.subject] || subjectMeta["Economics"];
            const questions =
              activeTab === "practice"
                ? (exam as any).questions
                : (() => {
                    const mockData = mockExamData[exam.id];
                    if (!mockData) return [];

                    // Handle different data structures
                    if (mockData.questions) {
                      return mockData.questions;
                    } else if (mockData.sections) {
                      // Flatten questions from all sections
                      const allQuestions: any[] = [];
                      Object.values(mockData.sections).forEach(
                        (section: any) => {
                          if (section.questions) {
                            allQuestions.push(...section.questions);
                          }
                        }
                      );
                      return allQuestions;
                    }
                    return [];
                  })();

            return (
              <div
                className={`transition-all duration-700 ease-in-out ${
                  whiteboardOpen ? "max-w-7xl" : "max-w-2xl"
                } mx-auto mb-12 px-4`}
              >
                <div
                  className={`flex ${
                    whiteboardOpen ? "flex-col lg:flex-row" : "flex-col"
                  } gap-4 lg:gap-6 relative`}
                >
                  {/* Exam Section - Left Side / Top on Mobile */}
                  <div
                    className={`transition-all duration-700 ease-in-out ${
                      whiteboardOpen ? "w-full lg:w-1/2" : "w-full"
                    } min-w-0`}
                  >
                    <Card className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur-md">
                      <CardContent className="p-8 flex flex-col h-full">
                        {/* Whiteboard Toggle Button */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {exam?.title}
                          </h2>
                          <Button
                            variant={whiteboardOpen ? "default" : "outline"}
                            onClick={() => setWhiteboardOpen(!whiteboardOpen)}
                            className={`transition-all duration-300 w-full sm:w-auto ${
                              whiteboardOpen
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                            }`}
                          >
                            {whiteboardOpen ? "Hide" : "Show"} Whiteboard
                          </Button>
                        </div>
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
                          onClick={() => setOpenExam(null)}
                        >
                          ← Back
                        </Button>

                        {loadingMockExam ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                              Loading mock exam data...
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-6">
                            {/* Show instructions only once for mock exams */}
                            {activeTab === "mock" && (
                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                                <p className="text-blue-700 text-sm font-medium">
                                  📝 This is a full paper mock exam. Write your
                                  answers on paper or in your preferred format.
                                </p>
                                <div className="mt-2 text-xs text-blue-600">
                                  <p>• Read each question carefully</p>
                                  <p>• Plan your response before writing</p>
                                  <p>• Use appropriate examples and evidence</p>
                                  <p>
                                    • Check your work for accuracy and clarity
                                  </p>
                                  <p>• Manage your time effectively</p>
                                </div>
                              </div>
                            )}

                            {questions.map(
                              (
                                q: {
                                  q?: string;
                                  question?: string;
                                  options: string[];
                                  answer?: number;
                                  correctAnswer?: number;
                                },
                                qIdx: number
                              ) => (
                                <div key={qIdx} className="mb-4">
                                  <div className="font-semibold mb-2">
                                    Q{qIdx + 1}. {q.q || q.question}
                                  </div>
                                  {q.options && q.options.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                      {q.options.map(
                                        (opt: string, optIdx: number) => {
                                          const isSelected =
                                            activeTab === "practice"
                                              ? answers[exam.id]?.[qIdx] ===
                                                optIdx
                                              : mockAnswers[exam.id]?.[qIdx] ===
                                                optIdx;
                                          const isCorrect =
                                            q.correctAnswer === optIdx;

                                          let optionClass =
                                            "flex items-center gap-2 p-2 rounded cursor-pointer transition-all";

                                          if (
                                            activeTab === "mock" &&
                                            showMockExamFeedback
                                          ) {
                                            if (isCorrect) {
                                              optionClass +=
                                                " bg-green-100 border-green-400";
                                            } else if (
                                              isSelected &&
                                              !isCorrect
                                            ) {
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
                                                name={`q${exam.id}_${qIdx}`}
                                                checked={isSelected}
                                                onChange={() =>
                                                  activeTab === "practice"
                                                    ? handleAnswer(
                                                        exam.id,
                                                        qIdx,
                                                        optIdx
                                                      )
                                                    : handleMockAnswer(
                                                        exam.id,
                                                        qIdx,
                                                        optIdx
                                                      )
                                                }
                                                className="accent-emerald-600"
                                                disabled={
                                                  activeTab === "mock" &&
                                                  showMockExamFeedback
                                                }
                                              />
                                              <span className="flex-1">
                                                {opt}
                                              </span>
                                              {activeTab === "mock" &&
                                                showMockExamFeedback &&
                                                isCorrect && (
                                                  <span className="text-green-600 font-bold">
                                                    ✓
                                                  </span>
                                                )}
                                              {activeTab === "mock" &&
                                                showMockExamFeedback &&
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
                                  ) : (
                                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                      <p className="text-gray-600 text-sm">
                                        This is an essay question. Write your
                                        answer in the space provided.
                                      </p>
                                      <textarea
                                        className="w-full mt-2 p-3 border border-gray-300 rounded-lg resize-none"
                                        rows={4}
                                        placeholder="Write your answer here..."
                                      />
                                    </div>
                                  )}
                                </div>
                              )
                            )}
                            {(activeTab === "practice" ||
                              activeTab === "mock") && (
                              <>
                                {activeTab === "mock" &&
                                showMockExamFeedback ? (
                                  <div className="mt-2 space-y-2">
                                    <Button
                                      variant="outline"
                                      className="w-full rounded-full"
                                      onClick={() =>
                                        setShowMockExamFeedback(false)
                                      }
                                    >
                                      Hide Answers
                                    </Button>
                                    <Button
                                      className="bg-purple-600 hover:bg-purple-700 text-white w-full rounded-full shadow-lg"
                                      onClick={() => {
                                        setShowMockExamFeedback(false);
                                        setOpenExam(null);
                                      }}
                                    >
                                      Back to Exams
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    className={`${
                                      activeTab === "practice"
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-purple-600 hover:bg-purple-700"
                                    } text-white mt-2 w-full rounded-full shadow-lg`}
                                    onClick={() =>
                                      activeTab === "practice"
                                        ? handleSubmit(exam)
                                        : handleMockSubmit(exam)
                                    }
                                  >
                                    Submit
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                        {/* Decorative gradient blob */}
                        <span
                          className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${meta.gradient}`}
                        ></span>
                      </CardContent>
                    </Card>
                  </div>
                  {/* Whiteboard Section - Right Side / Bottom on Mobile */}
                  <div
                    className={`transition-all duration-700 ease-in-out ${
                      whiteboardOpen
                        ? "w-full lg:w-1/2 opacity-100 translate-x-0"
                        : "w-0 lg:w-0 opacity-0 translate-x-full lg:translate-x-full hidden lg:block"
                    } min-w-0 overflow-hidden`}
                  >
                    {whiteboardOpen && (
                      <div className="h-[50vh] sm:h-[60vh] lg:h-screen sticky top-0">
                        <Whiteboard
                          width={
                            typeof window !== "undefined"
                              ? Math.min(600, window.innerWidth - 32)
                              : 400
                          }
                          height={
                            typeof window !== "undefined"
                              ? Math.min(500, window.innerHeight * 0.5)
                              : 300
                          }
                          initialBackground={whiteboardBg}
                          className="h-full w-full border-t lg:border-t-0 lg:border-l border-gray-200"
                          title="Exam Whiteboard"
                          showHeader={true}
                          template={whiteboardTemplate}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })()
        )}
        {/* Feedback Modal */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
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
              {practiceQuestions.find((e) => e.id === openExam)?.questions
                .length || 0}
            </div>
            <Progress
              value={
                (score /
                  (practiceQuestions.find((e) => e.id === openExam)?.questions
                    .length || 1)) *
                100
              }
              className="mb-4 h-3 bg-gray-200"
            />
            <div className="space-y-3">
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                onClick={() => {
                  setShowFeedback(false);
                  setOpenExam(null);
                }}
              >
                Back to Exams
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setShowFeedback(false);
                  setAnswers((prev) => ({
                    ...prev,
                    [openExam!]: Array(2).fill(-1),
                  }));
                }}
              >
                Try Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Mock Feedback Modal */}
        <Dialog open={showMockFeedback} onOpenChange={setShowMockFeedback}>
          <DialogContent className="max-w-md text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-3xl flex items-center justify-center gap-2">
                {mockFeedbackEmoji}{" "}
                {(() => {
                  const mockData = mockExamData[openExam!];
                  if (!mockData) return "Keep Practicing!";
                  let totalQuestions = 0;
                  if (mockData.questions)
                    totalQuestions = mockData.questions.length;
                  if (mockData.sections) {
                    Object.values(mockData.sections).forEach((section: any) => {
                      if (section.questions)
                        totalQuestions += section.questions.length;
                    });
                  }
                  return mockScore === totalQuestions
                    ? "Perfect Score!"
                    : mockScore > totalQuestions * 0.7
                    ? "Excellent!"
                    : mockScore > totalQuestions * 0.5
                    ? "Good Job!"
                    : "Keep Practicing!";
                })()}
              </DialogTitle>
            </DialogHeader>
            <div className="my-4 text-lg font-semibold text-purple-700">
              You scored {mockScore} out of{" "}
              {(() => {
                const mockData = mockExamData[openExam!];
                if (!mockData) return 0;
                if (mockData.questions) return mockData.questions.length;
                if (mockData.sections) {
                  let totalQuestions = 0;
                  Object.values(mockData.sections).forEach((section: any) => {
                    if (section.questions)
                      totalQuestions += section.questions.length;
                  });
                  return totalQuestions;
                }
                return 0;
              })()}
            </div>
            <Progress
              value={
                (mockScore /
                  (() => {
                    const mockData = mockExamData[openExam!];
                    if (!mockData) return 1;
                    if (mockData.questions) return mockData.questions.length;
                    if (mockData.sections) {
                      let totalQuestions = 0;
                      Object.values(mockData.sections).forEach(
                        (section: any) => {
                          if (section.questions)
                            totalQuestions += section.questions.length;
                        }
                      );
                      return totalQuestions || 1;
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
                  setShowMockFeedback(false);
                  setShowMockExamFeedback(true);
                }}
              >
                Show Correct Answers
              </Button>
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-full"
                onClick={() => {
                  setShowMockFeedback(false);
                  setShowMockExamFeedback(false);
                  setOpenExam(null);
                }}
              >
                Back to Exams
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full"
                onClick={() => {
                  setShowMockFeedback(false);
                  setShowMockExamFeedback(false);
                  setMockAnswers((prev) => ({
                    ...prev,
                    [openExam!]: Array(100).fill(-1),
                  }));
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
