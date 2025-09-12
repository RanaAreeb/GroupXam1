"use client";
import { useEffect, useState } from "react";
import AppHeader from "@/components/ui/app-header";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/use-auth";
import { trackQuizCompletion, getQuizSubject, getQuizType } from "@/lib/activityTracker";
import { ieltsExams, mockExam, allMockExams } from "./exams-data";
import { readingPractices, readingCategories, getReadingPracticesByCategory, getReadingPracticesByDifficulty } from "./reading/reading-data";
import { listeningPractices, listeningCategories, getListeningPracticesByCategory, getListeningPracticesByDifficulty } from "./listening/listening-data";
import { grammarPractices, grammarCategories, getGrammarPracticesByCategory, getGrammarPracticesByDifficulty } from "./grammar/grammar-data";
import { BookOpen, Headphones, MessageSquare, Target, FileText, ArrowLeft, Clock, Users, Award, CheckCircle, Star, TrendingUp, Brain } from "lucide-react";
import Whiteboard from "@/components/Whiteboard";
import CanvasReveal from "@/components/CanvasReveal";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const subjectMeta: Record<string, { icon: JSX.Element; gradient: string; badge: string }> = {
  Reading: {
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-emerald-500 to-green-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Listening: {
    icon: <Headphones className="w-7 h-7" />,
    gradient: "from-blue-500 to-indigo-500",
    badge: "bg-blue-100 text-blue-700",
  },
  "Grammar & Vocabulary": {
    icon: <MessageSquare className="w-7 h-7" />,
    gradient: "from-purple-500 to-fuchsia-500",
    badge: "bg-purple-100 text-purple-700",
  },
};

const syllabusSubjects = [
  { name: "Reading", slug: "reading", icon: <BookOpen className="w-6 h-6" />, gradient: "from-indigo-500 to-blue-500" },
  { name: "Listening", slug: "listening", icon: <Headphones className="w-6 h-6" />, gradient: "from-blue-500 to-indigo-600" },
  { name: "Writing", slug: "writing", icon: <MessageSquare className="w-6 h-6" />, gradient: "from-purple-500 to-indigo-500" },
  { name: "Speaking", slug: "speaking", icon: <MessageSquare className="w-6 h-6" />, gradient: "from-fuchsia-500 to-indigo-500" },
];


// Function to generate questions for a reading practice
const generateQuestionsForPractice = (practice: any) => {
  console.log("generateQuestionsForPractice called with:", practice);
  
  // Check if practice has questions array (not just a number)
  const hasQuestionsArray = practice.questions && Array.isArray(practice.questions) && practice.questions.length > 0;
  console.log("Has questions array:", hasQuestionsArray);
  
  if (hasQuestionsArray) {
    console.log("Using existing questions array:", practice.questions);
    return practice.questions.map((q: any, index: number) => {
      // Handle different question types
      if (q.answer === "TRUE" || q.answer === "FALSE" || q.answer === "NOT GIVEN") {
        return {
          q: `Q${index + 1}. ${q.question || q.q || 'Sample question'}`,
          options: ["TRUE", "FALSE", "NOT GIVEN"],
          answer: q.answer === "TRUE" ? 0 : q.answer === "FALSE" ? 1 : 2,
          explanation: q.explanation || "No explanation provided"
        };
      } else if (q.answer === "YES" || q.answer === "NO" || q.answer === "NOT GIVEN") {
        return {
          q: `Q${index + 1}. ${q.question || q.q || 'Sample question'}`,
          options: ["YES", "NO", "NOT GIVEN"],
          answer: q.answer === "YES" ? 0 : q.answer === "NO" ? 1 : 2,
          explanation: q.explanation || "No explanation provided"
        };
      } else if (q.options && Array.isArray(q.options)) {
        return {
          q: `Q${index + 1}. ${q.question || q.q || 'Sample question'}`,
          options: q.options,
          answer: typeof q.answer === 'number' ? q.answer : 0,
          explanation: q.explanation || "No explanation provided"
        };
      } else {
        // Fallback for other question types
        return {
          q: `Q${index + 1}. ${q.question || q.q || 'Sample question'}`,
          options: [
            q.answer === "TRUE" ? "TRUE" : "Option A",
            q.answer === "FALSE" ? "FALSE" : "Option B", 
            q.answer === "NOT GIVEN" ? "NOT GIVEN" : "Option C",
            "Option D"
          ],
          answer: q.options ? 0 : (q.answer === "TRUE" ? 0 : q.answer === "FALSE" ? 1 : 2),
          explanation: q.explanation || "No explanation provided"
        };
      }
    });
  }
  
  // Fallback: generate sample questions based on the practice type
  console.log("Generating fallback questions");
  const baseQuestions = [
    {
      q: `According to the passage about ${practice.title.toLowerCase()}, what is the main purpose?`,
      options: [
        "To provide general information",
        "To explain a specific process",
        "To compare different approaches",
        "To present research findings"
      ],
      answer: 1
    },
    {
      q: "The passage suggests that the most important factor is:",
      options: [
        "Cost effectiveness",
        "Time management", 
        "Quality assurance",
        "Public awareness"
      ],
      answer: 2
    },
    {
      q: "Which statement best describes the author's opinion?",
      options: [
        "The approach is completely effective",
        "More research is needed",
        "The results are inconclusive", 
        "The method shows promise"
      ],
      answer: 3
    }
  ];
  
  // Generate questions based on the practice's question count
  const questions = [];
  const questionCount = typeof practice.questions === 'number' ? practice.questions : 3;
  console.log("Question count:", questionCount);
  
  for (let i = 0; i < Math.min(questionCount, 10); i++) {
    const baseQ = baseQuestions[i % baseQuestions.length];
    questions.push({
      ...baseQ,
      q: `Q${i + 1}. ${baseQ.q}`
    });
  }
  
  console.log("Generated questions:", questions);
  return questions;
};

export default function IELTSExamsPage() {
  const { user } = useAuth();
  const [openExam, setOpenExam] = useState<number | null>(null);
  
  
  const [answers, setAnswers] = useState<{ [examId: number]: number[] }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [activeTab, setActiveTab] = useState("practice");
  const [selectedReadingPractice, setSelectedReadingPractice] = useState<number | null>(null);
  const [selectedListeningPractice, setSelectedListeningPractice] = useState<number | null>(null);
  const [selectedGrammarPractice, setSelectedGrammarPractice] = useState<number | null>(null);
  const [readingFilter, setReadingFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [listeningFilter, setListeningFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [grammarFilter, setGrammarFilter] = useState<"all" | "beginner" | "intermediate" | "advanced">("all");
  const [readingCategoryFilter, setReadingCategoryFilter] = useState<string>("all");
  const [listeningCategoryFilter, setListeningCategoryFilter] = useState<string>("all");
  const [grammarCategoryFilter, setGrammarCategoryFilter] = useState<string>("all");
  const [showReadingPractice, setShowReadingPractice] = useState(false);
  const [showListeningPractice, setShowListeningPractice] = useState(false);
  const [showGrammarPractice, setShowGrammarPractice] = useState(false);
  const [practiceExams, setPracticeExams] = useState<{ [id: number]: any }>({});
  const [showModal, setShowModal] = useState(false);
  const [feedbackEmoji, setFeedbackEmoji] = useState("🎉");
  const [whiteboardOpen, setWhiteboardOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleStart = (examId: number) => {
    setOpenExam(examId);
    
    // Reset feedback states when starting a new exam
    setShowFeedback(false);
    setShowModal(false);
    
    if (!answers[examId]) {
      // Find exam in all possible sources
      let exam = ieltsExams.find((e) => e.id === examId);
      if (!exam) {
        exam = allMockExams.find((e) => e.id === examId);
      }
      if (!exam) {
        exam = practiceExams[examId];
      }
      
      const questionCount = exam?.questions.length || 0;
      setAnswers((prev) => ({ ...prev, [examId]: Array(questionCount).fill(-1) }));
    }
  };

  // Support opening via URL (?open=ID&tab=mock|practice&showReading=true)
  useEffect(() => {
    if (!searchParams) return;
    
    const openParam = searchParams.get("open");
    const tabParam = (searchParams.get("tab") as "mock" | "practice" | null) || null;
    const showReadingParam = searchParams.get("showReading");
    
    // Set tab first
    if (tabParam) {
      setActiveTab(tabParam);
    }
    
    if (showReadingParam === "true") {
      setShowReadingPractice(true);
    }
    
    // Then handle opening the exam
    if (openParam) {
      const id = parseInt(openParam, 10);
      if (!Number.isNaN(id)) {
        // Use setTimeout to ensure state updates are processed
        setTimeout(() => {
          handleStart(id);
        }, 0);
      }
    }
  }, [searchParams, allMockExams, practiceExams]);

  const handleAnswer = (examId: number, qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [examId]: prev[examId].map((a, i) => (i === qIdx ? optIdx : a)),
    }));
  };

  const handleSubmit = async (exam: any) => {
    const userAnswers = answers[exam.id] || [];
    let correct = 0;
    exam.questions.forEach((q: any, i: number) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setFeedbackEmoji(
      correct === exam.questions.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setShowModal(true);

    if (user && exam.questions && exam.questions.length > 0) {
      const subject = getQuizSubject(exam, "IELTS");
      const quizType = getQuizType("practice");
      await trackQuizCompletion({
        userId: user.email,
        userName: user.name,
        subject,
        score: correct,
        totalQuestions: exam.questions.length,
        quizType,
      });
    }
  };

  // Use the comprehensive mock exam
  const mockPaper = mockExam;

  return (
    <ProtectedRoute>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <AppHeader active="Exams" />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                IELTS Preparation
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Master IELTS with our comprehensive preparation platform. Learn about the test, choose your package, and start practicing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/exams/ielts/info">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg">
                  Learn About IELTS & Packages
                </Button>
              </Link>
              
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Academic</h3>
                <p className="text-gray-600 text-sm">For university admission and professional registration</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">General Training</h3>
                <p className="text-gray-600 text-sm">For work experience and immigration purposes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-100 border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">2 Hours 45 Min</h3>
                <p className="text-gray-600 text-sm">Total test duration</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            <Button
              onClick={() => {
                setActiveTab("syllabus");
                setOpenExam(null);
                setShowFeedback(false);
                setSelectedReadingPractice(null);
                setShowReadingPractice(false);
                setWhiteboardOpen(false);
                // Clear URL parameters by navigating to clean URL
                router.push('/exams/ielts');
              }}
              variant={activeTab === "syllabus" ? "default" : "outline"}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === "syllabus"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 hover:border-indigo-700"
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Syllabus
              {activeTab === "syllabus" && <span className="ml-2">✓</span>}
            </Button>
            <Button
              onClick={() => {
                setActiveTab("practice");
                setOpenExam(null);
                setShowFeedback(false);
                setSelectedReadingPractice(null);
                setShowReadingPractice(false);
                setWhiteboardOpen(false);
                // Clear URL parameters by navigating to clean URL
                router.push('/exams/ielts');
              }}
              variant={activeTab === "practice" ? "default" : "outline"}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === "practice"
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 hover:border-emerald-700"
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              Practice
              {activeTab === "practice" && <span className="ml-2">✓</span>}
            </Button>
            <Button
              onClick={() => {
                setActiveTab("mock");
                setOpenExam(null);
                setShowFeedback(false);
                setSelectedReadingPractice(null);
                setShowReadingPractice(false);
                setWhiteboardOpen(false);
                // Clear URL parameters by navigating to clean URL
                router.push('/exams/ielts');
              }}
              variant={activeTab === "mock" ? "default" : "outline"}
              className={`px-6 py-3 rounded-full transition-all duration-300 ${
                activeTab === "mock"
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg scale-105"
                  : "bg-white hover:bg-gray-50 text-indigo-600 border-2 border-indigo-600 hover:border-indigo-700"
              }`}
            >
              <Award className="w-5 h-5 mr-2" />
              Mock Exams
              {activeTab === "mock" && <span className="ml-2">✓</span>}
            </Button>
          </div>


          {activeTab === "syllabus" && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <FileText className="w-4 h-4" /> Syllabus View Active
                </div>
                <h2 className="text-3xl font-bold text-gray-800">IELTS Syllabus</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {syllabusSubjects.map((subject) => (
                  <Card key={subject.slug} className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
                    <Link href={`/exams/ielts/syllabus/${subject.slug}`}>
                      <CardContent className="p-6 flex flex-col items-center text-center h-full">
                        <div className="mb-4">
                          <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${subject.gradient} text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                            {subject.icon}
                          </span>
                        </div>
                        <div className="font-bold text-lg text-gray-800 mb-2">{subject.name}</div>
                        <div className="text-xs text-gray-500 mb-4">Syllabus Overview</div>
                        <Button size="sm" className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all">
                          <FileText className="w-4 h-4 mr-2" /> View Syllabus
                        </Button>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* IELTS Information Link */}
          {activeTab === "syllabus" && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">IELTS Information & Packages</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
                  Learn everything about IELTS and choose the perfect preparation package for your needs.
                </p>
                <Link href="/exams/ielts/info">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-full shadow-lg">
                    View IELTS Information & Packages
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {activeTab === "practice" && !showReadingPractice && !showListeningPractice && !showGrammarPractice && openExam === null && (
            <div>
              <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${
                  activeTab === "practice" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                }`}>
                  {activeTab === "practice" ? <Target className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {activeTab === "practice" ? "Practice Questions" : "Mock Exams"} View Active
                </div>
                
              </div>

              {activeTab === "practice" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                  {ieltsExams.map((exam) => {
                    const meta = subjectMeta[exam.subject] || subjectMeta["Reading"];
                    return (
                      <Card key={exam.id} className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/70 backdrop-blur-md transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
                        <CardContent className="p-8 flex flex-col h-full">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform`}>
                              {meta.icon}
                            </div>
                            <div>
                              <div className="text-xl font-bold text-gray-800 mb-1">{exam.title}</div>
                              <Badge className={`${meta.badge} px-3 py-1 shadow`}>{exam.subject}</Badge>
                            </div>
                          </div>
                          <Button 
                            onClick={() => {
                              if (exam.subject === "Reading") {
                                setShowReadingPractice(true);
                                setShowListeningPractice(false);
                                setShowGrammarPractice(false);
                                setOpenExam(null);
                                setShowFeedback(false);
                                setSelectedReadingPractice(null);
                                setSelectedListeningPractice(null);
                                setSelectedGrammarPractice(null);
                              } else if (exam.subject === "Listening") {
                                setShowListeningPractice(true);
                                setShowReadingPractice(false);
                                setShowGrammarPractice(false);
                                setOpenExam(null);
                                setShowFeedback(false);
                                setSelectedReadingPractice(null);
                                setSelectedListeningPractice(null);
                                setSelectedGrammarPractice(null);
                              } else if (exam.subject === "Grammar & Vocabulary") {
                                setShowGrammarPractice(true);
                                setShowReadingPractice(false);
                                setShowListeningPractice(false);
                                setOpenExam(null);
                                setShowFeedback(false);
                                setSelectedReadingPractice(null);
                                setSelectedListeningPractice(null);
                                setSelectedGrammarPractice(null);
                              } else {
                                setOpenExam(exam.id);
                                setShowReadingPractice(false);
                                setShowListeningPractice(false);
                                setShowGrammarPractice(false);
                              }
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white mt-auto w-full rounded-full shadow-lg"
                          >
                            {exam.subject === "Reading" ? "Go to Reading Practice" : 
                             exam.subject === "Listening" ? "Go to Listening Practice" :
                             exam.subject === "Grammar & Vocabulary" ? "Go to Grammar Practice" : "Go Practice"}
                          </Button>
                          <span className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${meta.gradient}`}></span>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "practice" && showReadingPractice && openExam === null && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <BookOpen className="w-4 h-4" /> Reading Practice Active
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">IELTS Reading Practice</h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                  Master all IELTS Reading question types with our comprehensive practice sets. 
                  Each exercise is designed to mirror real exam conditions with detailed explanations and tips.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowReadingPractice(false)}
                  className="mb-6 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Practice
                </Button>
                
                {/* Filter Buttons */}
                <div className="space-y-4 mb-8">
                  {/* Difficulty Filter */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Difficulty:</span>
                    {["all", "beginner", "intermediate", "advanced"].map((level) => (
                      <Button
                        key={level}
                        onClick={() => setReadingFilter(level as any)}
                        variant={readingFilter === level ? "default" : "outline"}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          readingFilter === level
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            : "bg-white hover:bg-blue-50 text-blue-600 border border-blue-300 hover:border-blue-400"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                 
                </div>
              </div>

              {/* Reading Practice Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {readingPractices
                  .filter(practice => {
                    const difficultyMatch = readingFilter === "all" || practice.difficulty.toLowerCase() === readingFilter;
                    const categoryMatch = readingCategoryFilter === "all" || practice.category === readingCategoryFilter;
                    return difficultyMatch && categoryMatch;
                  })
                  .map((practice) => (
                    <div 
                      key={practice.id} 
                      className="group relative overflow-hidden rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {practice.title}
                          </h3>
                          <Badge className={`mb-3 ${
                            practice.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                            practice.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {practice.difficulty}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {practice.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {practice.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {Array.isArray(practice.questions) ? practice.questions.length : practice.questions} questions
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {practice.category}
                        </Badge>
                        <div className="flex gap-2 relative z-10">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedReadingPractice(practice.id);
                            }}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-blue-600 relative z-10"
                          >
                            Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              console.log("Start Practice button clicked for:", practice.title);
                              
                              // Create and start the practice directly
                              const questions = generateQuestionsForPractice(practice);
                              
                              const practiceExam = {
                                id: 1000 + practice.id,
                                title: practice.title,
                                subject: "Reading",
                                questions: questions
                              };
                              
                              console.log("Creating practice exam:", practiceExam);
                              console.log("Generated questions:", questions);
                              
                              // Store the practice exam
                              setPracticeExams(prev => {
                                const updated = {
                                  ...prev,
                                  [practiceExam.id]: practiceExam
                                };
                                console.log("Updated practiceExams:", updated);
                                return updated;
                              });
                              
                              // Set up the exam and switch to exam mode
                              setOpenExam(practiceExam.id);
                              setShowReadingPractice(false);
                              setSelectedReadingPractice(null);
                              setActiveTab("practice");
                              setShowFeedback(false);
                              
                              // Initialize answers
                              setAnswers(prev => ({
                                ...prev,
                                [practiceExam.id]: Array(practiceExam.questions.length).fill(-1)
                              }));
                              
                              console.log("Set openExam to:", practiceExam.id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1 text-xs relative z-10"
                          >
                            Start Practice
                          </Button>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
              </div>

              {/* Selected Reading Practice Detail */}
              {selectedReadingPractice && (
                <div className="mt-12">
                  {(() => {
                    const practice = readingPractices.find(p => p.id === selectedReadingPractice);
                    if (!practice) return null;
                    
                    return (
                      <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 backdrop-blur-md rounded-3xl">
                        <CardContent className="p-8">
                          <div className="flex items-center gap-4 mb-6">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setSelectedReadingPractice(null)}
                              className="rounded-full"
                            >
                              <ArrowLeft className="w-4 h-4 mr-2" />
                              Back to Practice List
                            </Button>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                              <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-1">{practice.title}</h3>
                              <div className="flex items-center gap-3">
                                <Badge className={`${
                                  practice.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                                  practice.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                                  "bg-red-100 text-red-700"
                                }`}>
                                  {practice.difficulty}
                                </Badge>
                                <Badge variant="outline">{practice.category}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                              <Clock className="w-6 h-6 text-blue-600" />
                              <div>
                                <div className="font-semibold text-gray-800">Duration</div>
                                <div className="text-sm text-gray-600">{practice.duration}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl">
                              <Target className="w-6 h-6 text-indigo-600" />
                              <div>
                                <div className="font-semibold text-gray-800">Questions</div>
                                <div className="text-sm text-gray-600">{Array.isArray(practice.questions) ? practice.questions.length : practice.questions} questions</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
                              <Award className="w-6 h-6 text-purple-600" />
                              <div>
                                <div className="font-semibold text-gray-800">Type</div>
                                <div className="text-sm text-gray-600">{practice.category}</div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-8">
                            <h4 className="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                            <p className="text-gray-600 leading-relaxed">{practice.description}</p>
                          </div>
                          
                          <div className="flex gap-4">
                            <Button 
                              onClick={() => {
                                // Start the actual practice
                                const practiceExam = {
                                  id: 1000 + practice.id,
                                  title: practice.title,
                                  subject: "Reading",
                                  questions: generateQuestionsForPractice(practice)
                                };
                                
                                // Store the practice exam
                                setPracticeExams(prev => ({
                                  ...prev,
                                  [practiceExam.id]: practiceExam
                                }));
                                
                                // Set up the exam and switch to exam mode
                                setOpenExam(practiceExam.id);
                                setShowReadingPractice(false);
                                setSelectedReadingPractice(null);
                                setActiveTab("practice"); // Ensure we're in practice mode
                                setShowFeedback(false); // Reset feedback
                                
                                // Initialize answers
                                setAnswers(prev => ({
                                  ...prev,
                                  [practiceExam.id]: Array(practiceExam.questions.length).fill(-1)
                                }));
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full shadow-lg"
                            >
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Start Practice
                            </Button>
                            <Button variant="outline" className="px-8 py-3 rounded-full">
                              <Users className="w-5 h-5 mr-2" />
                              View Tips
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === "practice" && showListeningPractice && openExam === null && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <Headphones className="w-4 h-4" /> Listening Practice Active
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">IELTS Listening Practice</h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                  Master all IELTS Listening question types with our comprehensive practice sets. 
                  Each exercise is designed to mirror real exam conditions with audio content and detailed explanations.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowListeningPractice(false)}
                  className="mb-6 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Practice
                </Button>
                
                {/* Filter Buttons */}
                <div className="space-y-4 mb-8">
                  {/* Difficulty Filter */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Difficulty:</span>
                    {["all", "beginner", "intermediate", "advanced"].map((level) => (
                      <Button
                        key={level}
                        onClick={() => setListeningFilter(level as any)}
                        variant={listeningFilter === level ? "default" : "outline"}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          listeningFilter === level
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            : "bg-white hover:bg-blue-50 text-blue-600 border border-blue-300 hover:border-blue-400"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                 
                </div>
              </div>

              {/* Listening Practice Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listeningPractices
                  .filter(practice => {
                    const difficultyMatch = listeningFilter === "all" || practice.difficulty.toLowerCase() === listeningFilter;
                    const categoryMatch = listeningCategoryFilter === "all" || practice.category === listeningCategoryFilter;
                    return difficultyMatch && categoryMatch;
                  })
                  .map((practice) => (
                    <div 
                      key={practice.id} 
                      className="group relative overflow-hidden rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                            {practice.title}
                          </h3>
                          <Badge className={`mb-3 ${
                            practice.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                            practice.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {practice.difficulty}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <Headphones className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {practice.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {practice.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {Array.isArray(practice.questions) ? practice.questions.length : practice.questions} questions
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {practice.category}
                        </Badge>
                        <div className="flex gap-2 relative z-10">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedListeningPractice(practice.id);
                            }}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-blue-600 relative z-10"
                          >
                            Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              console.log("Start Practice button clicked for:", practice.title);
                              
                              // Create and start the practice directly
                              const questions = generateQuestionsForPractice(practice);
                              
                              const practiceExam = {
                                id: 2000 + practice.id,
                                title: practice.title,
                                subject: "Listening",
                                questions: questions
                              };
                              
                              console.log("Creating practice exam:", practiceExam);
                              console.log("Generated questions:", questions);
                              
                              // Store the practice exam
                              setPracticeExams(prev => {
                                const updated = {
                                  ...prev,
                                  [practiceExam.id]: practiceExam
                                };
                                console.log("Updated practiceExams:", updated);
                                return updated;
                              });
                              
                              // Set up the exam and switch to exam mode
                              setOpenExam(practiceExam.id);
                              setShowListeningPractice(false);
                              setSelectedListeningPractice(null);
                              setActiveTab("practice");
                              setShowFeedback(false);
                              
                              // Initialize answers
                              setAnswers(prev => ({
                                ...prev,
                                [practiceExam.id]: Array(practiceExam.questions.length).fill(-1)
                              }));
                              
                              console.log("Set openExam to:", practiceExam.id);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 py-1 text-xs relative z-10"
                          >
                            Start Practice
                          </Button>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "practice" && showGrammarPractice && openExam === null && (
            <div className="mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <MessageSquare className="w-4 h-4" /> Grammar & Vocabulary Practice Active
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">IELTS Grammar & Vocabulary Practice</h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                  Master essential grammar rules and vocabulary for IELTS success. 
                  Practice with comprehensive exercises covering all major grammar points and vocabulary categories.
                </p>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowGrammarPractice(false)}
                  className="mb-6 rounded-full"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Practice
                </Button>
                
                {/* Filter Buttons */}
                <div className="space-y-4 mb-8">
                  {/* Difficulty Filter */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Difficulty:</span>
                    {["all", "beginner", "intermediate", "advanced"].map((level) => (
                      <Button
                        key={level}
                        onClick={() => setGrammarFilter(level as any)}
                        variant={grammarFilter === level ? "default" : "outline"}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          grammarFilter === level
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                            : "bg-white hover:bg-purple-50 text-purple-600 border border-purple-300 hover:border-purple-400"
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                  
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm font-medium text-gray-600 mr-2">Category:</span>
                    {["all", ...grammarCategories].map((category) => (
                      <Button
                        key={category}
                        onClick={() => setGrammarCategoryFilter(category)}
                        variant={grammarCategoryFilter === category ? "default" : "outline"}
                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                          grammarCategoryFilter === category
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
                            : "bg-white hover:bg-emerald-50 text-emerald-600 border border-emerald-300 hover:border-emerald-400"
                        }`}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grammar Practice Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {grammarPractices
                  .filter(practice => {
                    const difficultyMatch = grammarFilter === "all" || practice.difficulty.toLowerCase() === grammarFilter;
                    const categoryMatch = grammarCategoryFilter === "all" || practice.category === grammarCategoryFilter;
                    return difficultyMatch && categoryMatch;
                  })
                  .map((practice) => (
                    <div 
                      key={practice.id} 
                      className="group relative overflow-hidden rounded-2xl shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                            {practice.title}
                          </h3>
                          <Badge className={`mb-3 ${
                            practice.difficulty === "Beginner" ? "bg-green-100 text-green-700" :
                            practice.difficulty === "Intermediate" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {practice.difficulty}
                          </Badge>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {practice.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {practice.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {Array.isArray(practice.questions) ? practice.questions.length : practice.questions} questions
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="outline" className="text-xs">
                          {practice.category}
                        </Badge>
                        <div className="flex gap-2 relative z-10">
                          <Button 
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedGrammarPractice(practice.id);
                            }}
                            className="text-xs px-2 py-1 text-gray-600 hover:text-purple-600 relative z-10"
                          >
                            Details
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => {
                              console.log("Start Practice button clicked for:", practice.title);
                              
                              // Create and start the practice directly
                              const questions = generateQuestionsForPractice(practice);
                              
                              const practiceExam = {
                                id: 3000 + practice.id,
                                title: practice.title,
                                subject: "Grammar & Vocabulary",
                                questions: questions
                              };
                              
                              console.log("Creating practice exam:", practiceExam);
                              console.log("Generated questions:", questions);
                              
                              // Store the practice exam
                              setPracticeExams(prev => {
                                const updated = {
                                  ...prev,
                                  [practiceExam.id]: practiceExam
                                };
                                console.log("Updated practiceExams:", updated);
                                return updated;
                              });
                              
                              // Set up the exam and switch to exam mode
                              setOpenExam(practiceExam.id);
                              setShowGrammarPractice(false);
                              setSelectedGrammarPractice(null);
                              setActiveTab("practice");
                              setShowFeedback(false);
                              
                              // Initialize answers
                              setAnswers(prev => ({
                                ...prev,
                                [practiceExam.id]: Array(practiceExam.questions.length).fill(-1)
                              }));
                              
                              console.log("Set openExam to:", practiceExam.id);
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-1 text-xs relative z-10"
                          >
                            Start Practice
                          </Button>
                        </div>
                      </div>
                      
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "mock" && openExam === null && (
            <div>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 bg-indigo-100 text-indigo-800">
                  <Award className="w-4 h-4" />
                  Mock Exams View Active
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Available Mock Exams ({allMockExams.length} exams, {allMockExams.reduce((total, exam) => total + (exam.questions?.length || 0), 0)} questions)
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                  Take our comprehensive IELTS mock exam to test your skills across all four sections: Reading, Listening, Writing, and Speaking.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {allMockExams.map((exam) => (
                  <Card key={exam.id} className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur-md hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg border-4 border-white">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">{exam.title}</h3>
                          <Badge className="bg-indigo-100 text-indigo-700 px-2 py-1 text-xs shadow mb-2">{exam.subject}</Badge>
                          <div className="flex items-center gap-3 text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {exam.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {exam.questions.length} questions
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Exam Sections</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {exam.sections.map((section, index) => (
                            <div key={index} className="p-2 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-200">
                              <div className="font-semibold text-gray-800 text-xs mb-1">{section.name}</div>
                              <div className="text-xs text-gray-600">{section.duration}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-lg flex-1 text-sm">
                          <Link href={`/exams/ielts?open=${exam.id}&tab=mock`}>
                            <Award className="w-4 h-4 mr-1" />
                            Start Exam
                          </Link>
                        </Button>
                        <Button variant="outline" className="px-3 py-2 rounded-full text-xs">
                          <FileText className="w-3 h-3 mr-1" />
                          Sample
                        </Button>
                      </div>
                      <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl bg-gradient-to-br from-indigo-500 to-blue-500"></span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab !== "syllabus" && openExam !== null && (() => {
            let exam;
            if (openExam === mockPaper.id) {
              exam = mockPaper;
            } else if (allMockExams.find(mock => mock.id === openExam)) {
              exam = allMockExams.find(mock => mock.id === openExam);
            } else if (openExam && practiceExams[openExam]) {
              exam = practiceExams[openExam];
            } else {
              exam = ieltsExams.find((e) => e.id === openExam);
            }
            if (!exam) {
              return null;
            }
            const meta = subjectMeta[exam.subject] || subjectMeta["Reading"];

            return (
                <div className={`mx-auto px-4 ${whiteboardOpen ? "max-w-7xl" : "max-w-4xl"}`}>
                  <div className={`flex gap-6 ${whiteboardOpen ? "flex-col lg:flex-row" : "flex-col"}`}>
                    {/* Exam Section - Left Side / Top on Mobile */}
                    <div className={`transition-all duration-700 ease-in-out ${whiteboardOpen ? "w-full lg:w-1/2" : "w-full"} min-w-0`}>
                      <Card className="relative overflow-hidden rounded-3xl shadow-xl border-0 bg-white/80 backdrop-blur-md">
                        <CardContent className="p-4 sm:p-6 lg:p-8 flex flex-col min-h-screen">
                          {/* Whiteboard Toggle Button */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                              {exam.title}
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
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg border-4 border-white`}>
                          {meta.icon}
                        </div>
                        <div>
                          <div className="text-xl font-bold text-gray-800 mb-1">{exam.title}</div>
                          <Badge className={`${meta.badge} px-3 py-1 shadow`}>{exam.subject}</Badge>
                        </div>
                      </div>

                      <Button
                        variant="secondary"
                        className="mb-6 w-fit self-start"
                        onClick={() => {
                          setOpenExam(null);
                          setShowFeedback(false);
                          setWhiteboardOpen(false);
                          // Clear URL parameters by navigating to clean URL
                          router.push('/exams/ielts');
                          // Return to appropriate view
                          if (openExam && practiceExams[openExam]) {
                            setShowReadingPractice(true);
                          }
                        }}
                      >
                        ← Back
                      </Button>

                      <div className="mt-4 space-y-6">
                        {exam.questions.map((q: any, qIdx: number) => (
                          <div key={qIdx} className="mb-4">
                            <div className="font-semibold mb-2">
                              Q{qIdx + 1}. {q.q}
                            </div>
                            {q.options && q.options.length > 0 ? (
                              <div className="flex flex-col gap-2">
                                {q.options.map((opt: string, optIdx: number) => {
                                  const isSelected = answers[exam.id]?.[qIdx] === optIdx;
                                  const isCorrect = q.answer === optIdx;
                                  const showExamFeedback = showFeedback;

                                  let optionClass = "flex items-center gap-2 p-2 rounded cursor-pointer transition-all";

                                  if (showExamFeedback) {
                                    if (isCorrect) {
                                      optionClass += " bg-green-100 border-green-400";
                                    } else if (isSelected && !isCorrect) {
                                      optionClass += " bg-red-100 border-red-400";
                                    } else {
                                      optionClass += " bg-gray-50 border-gray-200";
                                    }
                                  } else {
                                    if (isSelected) {
                                      optionClass += " bg-emerald-100 border-emerald-400";
                                    } else {
                                      optionClass += " bg-white border border-gray-200 hover:border-emerald-300";
                                    }
                                  }

                                  return (
                                    <label key={optIdx} className={optionClass}>
                                      <input
                                        type="radio"
                                        name={`q${exam.id}_${qIdx}`}
                                        checked={isSelected}
                                        onChange={() => handleAnswer(exam.id, qIdx, optIdx)}
                                        className="accent-emerald-600"
                                        disabled={showExamFeedback}
                                      />
                                      <span className="flex-1">{opt}</span>
                                      {showExamFeedback && isCorrect && (
                                        <span className="text-green-600 font-bold">✓</span>
                                      )}
                                      {showExamFeedback && isSelected && !isCorrect && (
                                        <span className="text-red-600 font-bold">✗</span>
                                      )}
                                    </label>
                                  );
                                })}
                              </div>
                            ) : null}
                          </div>
                        ))}

                        {!showFeedback ? (
                          <Button
                            className={`${
                              openExam === mockPaper.id 
                                ? "bg-indigo-600 hover:bg-indigo-700" 
                                : "bg-emerald-600 hover:bg-emerald-700"
                            } text-white mt-2 w-full rounded-full shadow-lg`}
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
                                const currentExamId = openExam;
                                setShowFeedback(false);
                                setOpenExam(null);
                                // Clear URL parameters by navigating to clean URL
                                router.push('/exams/ielts');
                                // Return to appropriate view
                                if (currentExamId && practiceExams[currentExamId]) {
                                  setShowReadingPractice(true);
                                }
                              }}
                            >
                              Back to Practices
                            </Button>
                          </div>
                        )}
                      </div>
                      <span className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${meta.gradient}`}></span>
                    </CardContent>
                  </Card>

                  {showFeedback && (
                    <div className="mt-6 bg-white/80 rounded-2xl shadow-lg p-6">
                      <div className="text-lg font-semibold text-emerald-700 text-center mb-2">
                        You scored {score} out of {exam.questions.length}
                      </div>
                      <Progress value={(score / (exam.questions.length || 1)) * 100} className="h-3 bg-gray-200" />
                    </div>
                  )}
                    </div>

                    {/* Whiteboard Section - Right Side / Bottom on Mobile */}
                    {whiteboardOpen && (
                      <div className="w-full lg:w-1/2 min-w-0">
                        <div className="sticky top-4">
                          <Whiteboard
                            width={800}
                            height={600}
                            title="IELTS Practice Whiteboard"
                            template="blank"
                            className="rounded-2xl shadow-xl border-0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

          {/* Feedback Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-md text-center bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-3xl flex items-center justify-center gap-2">
                  {feedbackEmoji}{" "}
                  {(() => {
                    const currentExam = openExam === mockPaper.id 
                      ? mockPaper 
                      : practiceExams[openExam || 0] || ieltsExams.find((e) => e.id === openExam);
                    const totalQuestions = currentExam?.questions?.length || 0;
                    return score === totalQuestions
                      ? "Perfect!"
                      : score > Math.floor(totalQuestions / 2)
                      ? "Great Job!"
                      : "Keep Practicing!";
                  })()}
                </DialogTitle>
              </DialogHeader>
              <div className="my-4 text-lg font-semibold text-emerald-700">
                You scored {score} out of{" "}
                {(() => {
                  const currentExam = openExam === mockPaper.id 
                    ? mockPaper 
                    : practiceExams[openExam || 0] || ieltsExams.find((e) => e.id === openExam);
                  return currentExam?.questions?.length || 0;
                })()}
              </div>
              <Progress
                value={(() => {
                  const currentExam = openExam === mockPaper.id 
                    ? mockPaper 
                    : practiceExams[openExam || 0] || ieltsExams.find((e) => e.id === openExam);
                  const totalQuestions = currentExam?.questions?.length || 1;
                  return (score / totalQuestions) * 100;
                })()}
                className="mb-4 h-3 bg-gray-200"
              />
              <div className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                  onClick={() => {
                    setShowModal(false);
                    setShowFeedback(true);
                  }}
                >
                  Show Correct Answers
                </Button>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full"
                  onClick={() => {
                    const currentExamId = openExam;
                    setShowModal(false);
                    setShowFeedback(false);
                    setOpenExam(null);
                    // Clear URL parameters by navigating to clean URL
                    router.push('/exams/ielts');
                    // Return to appropriate view
                    if (currentExamId && practiceExams[currentExamId]) {
                      setShowReadingPractice(true);
                    }
                  }}
                >
                  Back to Practices
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={() => {
                    setShowModal(false);
                    setShowFeedback(false);
                    
                    // Reset answers for the current exam
                    const currentExam = openExam === mockPaper.id 
                      ? mockPaper 
                      : practiceExams[openExam || 0] || ieltsExams.find((e) => e.id === openExam);
                    
                    if (currentExam) {
                      setAnswers(prev => ({
                        ...prev,
                        [currentExam.id]: Array(currentExam.questions.length).fill(-1)
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
    </PageTransition>
    </ProtectedRoute>
  );
}

function ieltsExamsLength(): number {
  try {
    return ieltsExams.length;
  } catch {
    return 0;
  }
}

function getTotalIELTSQuestions(): number {
  try {
    // Count basic practice exam questions
    const basicExamQuestions = ieltsExams.reduce((total, exam) => total + (exam.questions?.length || 0), 0);
    
    // Count reading practice questions
    const readingQuestions = readingPractices.reduce((total, practice) => {
      if (Array.isArray(practice.questions)) {
        return total + practice.questions.length;
      } else if (typeof practice.questions === 'number') {
        return total + practice.questions;
      }
      return total + 3; // default fallback
    }, 0);
    
    // Count listening practice questions
    const listeningQuestions = listeningPractices.reduce((total, practice) => {
      if (Array.isArray(practice.questions)) {
        return total + practice.questions.length;
      } else if (typeof practice.questions === 'number') {
        return total + practice.questions;
      }
      return total + 3; // default fallback
    }, 0);
    
    // Count grammar practice questions
    const grammarQuestions = grammarPractices.reduce((total, practice) => {
      if (Array.isArray(practice.questions)) {
        return total + practice.questions.length;
      } else if (typeof practice.questions === 'number') {
        return total + practice.questions;
      }
      return total + 3; // default fallback
    }, 0);
    
    // Count mock exam questions
    const mockQuestions = mockExam.questions?.length || 0;
    
    return basicExamQuestions + readingQuestions + listeningQuestions + grammarQuestions + mockQuestions;
  } catch (error) {
    console.error('Error calculating total IELTS questions:', error);
    return 0;
  }
}


