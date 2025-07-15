"use client";
import { useState } from "react";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { wassceExams } from "./exams-data";
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
} from "lucide-react";
import Link from "next/link";

const subjectMeta: Record<
  string,
  { icon: JSX.Element; gradient: string; badge: string }
> = {
  Mathematics: {
    icon: <Target className="w-7 h-7" />,
    gradient: "from-pink-500 to-yellow-500",
    badge: "bg-pink-100 text-pink-700",
  },
  English: {
    icon: <MessageSquare className="w-7 h-7" />,
    gradient: "from-orange-400 to-pink-500",
    badge: "bg-orange-100 text-orange-700",
  },
  Physics: {
    icon: <Atom className="w-7 h-7" />,
    gradient: "from-blue-500 to-cyan-500",
    badge: "bg-blue-100 text-blue-700",
  },
  Chemistry: {
    icon: <FlaskConical className="w-7 h-7" />,
    gradient: "from-green-500 to-emerald-500",
    badge: "bg-green-100 text-green-700",
  },
  Biology: {
    icon: <Leaf className="w-7 h-7" />,
    gradient: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-100 text-emerald-700",
  },
  Literature: {
    icon: <BookOpen className="w-7 h-7" />,
    gradient: "from-purple-500 to-violet-500",
    badge: "bg-purple-100 text-purple-700",
  },
};

// Syllabus subjects with their PDF links
const syllabusSubjects = [
  {
    name: "Economics",
    slug: "economics",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "English Language",
    slug: "english-language",
    icon: <MessageSquare className="w-6 h-6" />,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Geography",
    slug: "geography",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-amber-500 to-orange-500",
  },
  {
    name: "General Mathematics",
    slug: "general-mathematics",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-pink-500 to-purple-500",
  },
  {
    name: "Further Mathematics",
    slug: "further-mathematics",
    icon: <Target className="w-6 h-6" />,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    name: "History",
    slug: "history",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-red-500 to-pink-500",
  },
  {
    name: "Computer Studies",
    slug: "computer-studies",
    icon: <Atom className="w-6 h-6" />,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    name: "Physics",
    slug: "physics",
    icon: <Atom className="w-6 h-6" />,
    gradient: "from-blue-500 to-indigo-500",
  },
  {
    name: "Literature in English",
    slug: "literature-in-english",
    icon: <BookOpen className="w-6 h-6" />,
    gradient: "from-violet-500 to-purple-500",
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
];

export default function WassceExamsPage() {
  const [openExam, setOpenExam] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [examId: number]: number[] }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackEmoji, setFeedbackEmoji] = useState("🎉");
  const [showSyllabus, setShowSyllabus] = useState(false);

  const handleStart = (examId: number) => {
    setOpenExam(examId);
    if (!answers[examId]) {
      setAnswers((prev) => ({ ...prev, [examId]: Array(2).fill(-1) }));
    }
  };

  const handleAnswer = (examId: number, qIdx: number, optIdx: number) => {
    setAnswers((prev) => ({
      ...prev,
      [examId]: prev[examId].map((a, i) => (i === qIdx ? optIdx : a)),
    }));
  };

  const handleSubmit = (exam: WassceExam) => {
    const userAnswers = answers[exam.id] || [];
    let correct = 0;
    exam.questions.forEach((q, i) => {
      if (userAnswers[i] === q.answer) correct++;
    });
    setScore(correct);
    setFeedbackEmoji(
      correct === exam.questions.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setShowFeedback(true);
  };

  type WassceExam = (typeof wassceExams)[number];
  const exams: WassceExam[] = wassceExams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              WASSCE Practice Exams
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice real WASSCE questions for various subjects. Get instant
            feedback and track your progress!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            onClick={() => setShowSyllabus(true)}
            variant={showSyllabus ? "default" : "outline"}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              showSyllabus
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 hover:border-blue-700"
            }`}
          >
            <FileText className="w-5 h-5 mr-2" />
            View Syllabus
            {showSyllabus && <span className="ml-2">✓</span>}
          </Button>
          <Button
            onClick={() => setShowSyllabus(false)}
            variant={!showSyllabus ? "default" : "outline"}
            className={`px-8 py-3 rounded-full transition-all duration-300 ${
              !showSyllabus
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg scale-105"
                : "bg-white hover:bg-gray-50 text-emerald-600 border-2 border-emerald-600 hover:border-emerald-700"
            }`}
          >
            <Target className="w-5 h-5 mr-2" />
            Practice Exams
            {!showSyllabus && <span className="ml-2">✓</span>}
          </Button>
        </div>

        {/* Syllabus Section */}
        {showSyllabus && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                Syllabus View Active
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                WASSCE Syllabus 2025
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {syllabusSubjects.map((subject) => (
                <Card
                  key={subject.slug}
                  className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
                >
                  <Link href={`/exams/wassce/syllabus/${subject.slug}`}>
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

        {/* Only show exam list if no exam is open and not showing syllabus */}
        {!showSyllabus && openExam === null ? (
          <div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                Practice View Active
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Available Practice Exams
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {exams.map((exam: WassceExam) => {
                const meta =
                  subjectMeta[exam.subject] || subjectMeta["Mathematics"];
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
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
                          <b>Class:</b> {exam.className}
                        </span>
                        <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
                          <b>Department:</b> {exam.department}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        {exam.date} at {exam.time}
                      </div>
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white mt-auto w-full rounded-full shadow-lg"
                        onClick={() => handleStart(exam.id)}
                      >
                        Go Practice
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
          !showSyllabus &&
          // Only show the selected exam in full-page view
          (() => {
            const exam = exams.find((e: WassceExam) => e.id === openExam);
            if (!exam) return null;
            const meta =
              subjectMeta[exam.subject] || subjectMeta["Mathematics"];
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
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
                        <b>Class:</b> {exam.className}
                      </span>
                      <span className="inline-block bg-gray-100 rounded px-2 py-1 text-xs text-gray-700">
                        <b>Department:</b> {exam.department}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mb-4">
                      {exam.date} at {exam.time}
                    </div>
                    <Button
                      variant="secondary"
                      className="mb-6 w-fit self-start"
                      onClick={() => setOpenExam(null)}
                    >
                      ← Back
                    </Button>
                    <div className="mt-4 space-y-6">
                      {exam.questions.map(
                        (
                          q: { q: string; options: string[]; answer: number },
                          qIdx: number
                        ) => (
                          <div key={qIdx} className="mb-4">
                            <div className="font-semibold mb-2">
                              Q{qIdx + 1}. {q.q}
                            </div>
                            <div className="flex flex-col gap-2">
                              {q.options.map((opt: string, optIdx: number) => (
                                <label
                                  key={optIdx}
                                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
                                    answers[exam.id]?.[qIdx] === optIdx
                                      ? "bg-emerald-100 border-emerald-400"
                                      : "bg-white border border-gray-200 hover:border-emerald-300"
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`q${exam.id}_${qIdx}`}
                                    checked={
                                      answers[exam.id]?.[qIdx] === optIdx
                                    }
                                    onChange={() =>
                                      handleAnswer(exam.id, qIdx, optIdx)
                                    }
                                    className="accent-emerald-600"
                                  />
                                  <span>{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )
                      )}
                      <Button
                        className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2 w-full rounded-full shadow-lg"
                        onClick={() => handleSubmit(exam)}
                      >
                        Submit
                      </Button>
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
              {exams.find((e) => e.id === openExam)?.questions.length || 0}
            </div>
            <Progress
              value={
                (score /
                  (exams.find((e) => e.id === openExam)?.questions.length ||
                    1)) *
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
      </div>
    </div>
  );
}
