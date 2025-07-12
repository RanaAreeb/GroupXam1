"use client";
import { useState } from "react";
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
import { Target, MessageSquare } from "lucide-react";

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
};

export default function WaecExamsPage() {
  const [openExam, setOpenExam] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ [examId: number]: number[] }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [feedbackEmoji, setFeedbackEmoji] = useState("🎉");

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

  const handleSubmit = (exam: WaecExam) => {
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

  type WaecExam = (typeof waecExams)[number];
  const exams: WaecExam[] = waecExams;

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
            Practice real WAEC questions for Mathematics and English. Get
            instant feedback and track your progress!
          </p>
        </div>
        {/* Only show exam list if no exam is open */}
        {openExam === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
            {exams.map((exam: WaecExam) => {
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
        ) : (
          // Only show the selected exam in full-page view
          (() => {
            const exam = exams.find((e: WaecExam) => e.id === openExam);
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
              You scored {score} out of 2
            </div>
            <Progress
              value={(score / 2) * 100}
              className="mb-4 h-3 bg-gray-200"
            />
            {score === 2 && <div className="text-4xl animate-bounce">🎊</div>}
            {score === 2 && (
              <div className="text-emerald-600 font-bold mt-2">
                Perfect Score!
              </div>
            )}
            {score < 2 && (
              <div className="text-gray-600 mt-2">
                Review your answers and try again!
              </div>
            )}
            <Button
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white w-full rounded-full shadow-lg"
              onClick={() => setShowFeedback(false)}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
        {/* Tips Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white mt-16 rounded-3xl">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Exam Preparation Tips
                </h3>
                <ul className="space-y-2 text-emerald-100">
                  <li>• Read all questions carefully before starting</li>
                  <li>
                    • Manage your time effectively - don’t spend too long on one
                    question
                  </li>
                  <li>• Review your answers before submitting</li>
                  <li>• Take practice exams regularly to build confidence</li>
                  <li>
                    • Focus on your weak areas and practice specific subjects
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
