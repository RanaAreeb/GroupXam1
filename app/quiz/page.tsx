"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
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
const getMockQuizzes = (
  subject: string,
  quizCounts: Record<string, number>
) => {
  if (subject === "Physics") {
    return [
      {
        id: "physics-quiz-1",
        title: "Physics Quiz 1",
        questions: quizCounts["physics-quiz-1"] || 0,
        difficulty: "Beginner",
      },
    ];
  }
  // For other subjects, return empty or placeholder quizzes
  return [];
};

// Preload quiz question counts
function useQuizCounts() {
  const [quizCounts, setQuizCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await import("./data/physics-quiz-1.json");
        setQuizCounts({ "physics-quiz-1": data.default.questions.length });
      } catch {
        setQuizCounts({});
      }
    }
    loadCounts();
  }, []);
  return quizCounts;
}

export default function QuizPage() {
  const [selectedExam, setSelectedExam] = useState<string>(examTypes[0].id);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedbackEmoji, setQuizFeedbackEmoji] = useState("🎉");
  const [quizTime, setQuizTime] = useState<number>(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const quizCounts = useQuizCounts();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Filter categories/subjects by search
  const filteredCategories = subjectCategories
    .map((cat) => ({
      ...cat,
      subjects: cat.subjects.filter((subj) =>
        subj.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.subjects.length > 0);

  const handleStartQuiz = async (quiz: any) => {
    // Try to load quiz content from JSON file
    try {
      const data = await import(`./data/${quiz.id}.json`);
      setActiveQuiz(data.default);
      setQuizQuestions(data.default.questions);
      setQuizAnswers(Array(data.default.questions.length).fill(-1));
      setQuizTime(data.default.timeLimit || 0);
      setQuizTimeLeft(data.default.timeLimit || 0);
      setQuizSubmitted(false);
      setQuizScore(0);
      setQuizFeedbackEmoji("🎉");
      setCurrentQuestion(0); // Reset current question for new quiz
    } catch (err) {
      alert("Quiz content not found.");
    }
  };

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || quizSubmitted || !quizTime) return;
    if (quizTimeLeft <= 0) {
      setQuizSubmitted(true);
      return;
    }
    timerRef.current = setTimeout(() => setQuizTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current!);
  }, [activeQuiz, quizTimeLeft, quizSubmitted, quizTime]);

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleQuizSubmit = () => {
    if (!activeQuiz) return;
    let correct = 0;
    for (let i = 0; i < quizAnswers.length; i++) {
      if (quizAnswers[i] === quizQuestions[i]?.answer) correct++;
    }
    setQuizScore(correct);
    setQuizFeedbackEmoji(
      correct === quizAnswers.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setQuizSubmitted(true);
  };

  const handleQuizBack = () => {
    setActiveQuiz(null);
    setQuizQuestions([]);
    setQuizAnswers([]);
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizFeedbackEmoji("🎉");
    setQuizTime(0);
    setQuizTimeLeft(0);
    setCurrentQuestion(0); // Reset current question on back
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Animated SVG Blobs */}
      <svg
        className="absolute -top-32 -left-32 w-[40vw] h-[40vw] opacity-30 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#6ee7b7"
          d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] opacity-20 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#a5b4fc"
          d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <AppHeader userInitial="J" active="Quizzes" />
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
              Exam Preparation Quizzes
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice quizzes for every subject and exam type. Select your exam,
            pick a subject, and start mastering your prep!
          </p>
        </div>
        {/* Quiz Full-Page Modal */}
        <AnimatePresence>
          {activeQuiz && (
            <motion.div
              key="quiz-modal"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-2xl w-full mx-auto bg-white/80 rounded-3xl shadow-2xl animate-slide-down p-0 sm:p-0"
                initial={{ scale: 0.95, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="max-h-screen overflow-y-auto p-4 sm:p-8 relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
                    onClick={handleQuizBack}
                    aria-label="Close Quiz"
                    style={{ zIndex: 10 }}
                  >
                    ×
                  </button>
                  {/* Motivational Tip */}
                  <div className="mb-4 text-center text-emerald-700 font-semibold text-base animate-fade-in">
                    "Every question is a step closer to mastery!"
                  </div>
                  {/* Progress Bar for Navigation */}
                  <div className="mb-6">
                    <Progress
                      value={
                        ((currentQuestion + 1) / quizQuestions.length) * 100
                      }
                      className="h-2 bg-gray-200"
                    />
                    <div className="flex justify-center gap-2 mt-2">
                      {quizQuestions.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-4 h-4 rounded-full border-2 ${
                            currentQuestion === idx
                              ? "bg-emerald-500 border-emerald-700"
                              : "bg-white border-gray-300"
                          }`}
                          onClick={() => setCurrentQuestion(idx)}
                          aria-label={`Go to question ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
                    {activeQuiz.title}
                  </h2>
                  <div className="text-sm text-gray-500 mb-6 text-center">
                    {quizQuestions.length} Questions
                    {activeQuiz.timeLimit && (
                      <span className="ml-4 font-semibold text-emerald-700">
                        ⏰ Time Left: {Math.floor(quizTimeLeft / 60)}:
                        {(quizTimeLeft % 60).toString().padStart(2, "0")}
                      </span>
                    )}
                  </div>
                  {!quizSubmitted ? (
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <div className="font-semibold mb-2 text-lg">
                          Q{currentQuestion + 1}.{" "}
                          {quizQuestions[currentQuestion]?.q}
                        </div>
                        <div className="flex flex-col gap-2">
                          {quizQuestions[currentQuestion]?.options.map(
                            (opt: string, optIdx: number) => (
                              <label
                                key={optIdx}
                                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all text-base shadow-sm border-2 ${
                                  quizAnswers[currentQuestion] === optIdx
                                    ? "bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-400"
                                    : "bg-white border border-gray-200 hover:border-emerald-300"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`q${currentQuestion}`}
                                  checked={
                                    quizAnswers[currentQuestion] === optIdx
                                  }
                                  onChange={() =>
                                    handleQuizAnswer(currentQuestion, optIdx)
                                  }
                                  className="accent-emerald-600"
                                />
                                <span>{opt}</span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          onClick={() =>
                            setCurrentQuestion((q) => Math.max(0, q - 1))
                          }
                          disabled={currentQuestion === 0}
                        >
                          Previous
                        </Button>
                        {currentQuestion < quizQuestions.length - 1 ? (
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                            onClick={() =>
                              setCurrentQuestion((q) =>
                                Math.min(quizQuestions.length - 1, q + 1)
                              )
                            }
                          >
                            Next
                          </Button>
                        ) : (
                          <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto"
                            onClick={handleQuizSubmit}
                          >
                            Submit
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="feedback"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="text-4xl mb-4 animate-bounce">
                        {quizFeedbackEmoji}
                      </div>
                      <div className="text-2xl font-bold mb-2 text-emerald-700">
                        You scored {quizScore} out of {quizAnswers.length}
                      </div>
                      <Progress
                        value={(quizScore / quizAnswers.length) * 100}
                        className="mb-4 h-3 bg-gray-200"
                      />
                      {quizScore === quizAnswers.length && (
                        <div className="text-emerald-600 font-bold mt-2">
                          Perfect Score!
                        </div>
                      )}
                      {quizScore < quizAnswers.length && (
                        <div className="text-gray-600 mt-2">
                          Review your answers and try again!
                        </div>
                      )}
                      <Button
                        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-full shadow-lg"
                        onClick={handleQuizBack}
                      >
                        Back to Quizzes
                      </Button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
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
                                  {getMockQuizzes(subject.name, quizCounts).map(
                                    (quiz) => (
                                      <li
                                        key={quiz.id}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 bg-white rounded-md p-3 shadow-sm"
                                      >
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {quiz.difficulty}
                                          </Badge>
                                          <span className="font-medium text-gray-800 block">
                                            {quiz.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 sm:ml-auto">
                                          <span className="text-xs text-gray-500">
                                            {quiz.questions} questions
                                          </span>
                                          <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                            onClick={() =>
                                              handleStartQuiz(quiz)
                                            }
                                          >
                                            Start
                                          </Button>
                                        </div>
                                      </li>
                                    )
                                  )}
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
