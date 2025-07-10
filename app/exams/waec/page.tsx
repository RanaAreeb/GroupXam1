"use client";
import { useState } from "react";
import Header from "@/components/ui/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const exams = [
  {
    id: 1,
    title: "WAEC Mathematics 2025",
    subject: "Mathematics",
    className: "SS3",
    department: "Science",
    date: "2025-07-08",
    time: "09:00",
    questions: [
      {
        q: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        answer: 1,
      },
      {
        q: "The square root of 16 is?",
        options: ["2", "4", "8", "16"],
        answer: 1,
      },
    ],
  },
  {
    id: 2,
    title: "WAEC English 2025",
    subject: "English",
    className: "SS3",
    department: "Arts",
    date: "2025-07-10",
    time: "11:00",
    questions: [
      {
        q: "Choose the correct synonym for 'happy'.",
        options: ["sad", "joyful", "angry", "tired"],
        answer: 1,
      },
      {
        q: "Which is a noun?",
        options: ["run", "quickly", "happiness", "blue"],
        answer: 2,
      },
    ],
  },
];

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

  const handleSubmit = (exam: (typeof exams)[0]) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <Header />
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-emerald-700">
          WAEC Exams
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {exams.map((exam) => (
            <Card key={exam.id} className="shadow-lg border-0">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-2 text-xl font-bold text-gray-800">
                  {exam.title}
                </div>
                <div className="text-sm text-gray-600 mb-1">{exam.subject}</div>
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
                {openExam === exam.id ? (
                  <div className="mt-4 space-y-6">
                    {exam.questions.map((q, qIdx) => (
                      <div key={qIdx} className="mb-4">
                        <div className="font-semibold mb-2">
                          Q{qIdx + 1}. {q.q}
                        </div>
                        <div className="flex flex-col gap-2">
                          {q.options.map((opt, optIdx) => (
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
                                checked={answers[exam.id]?.[qIdx] === optIdx}
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
                    ))}
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
                      onClick={() => handleSubmit(exam)}
                    >
                      Submit
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white mt-auto"
                    onClick={() => handleStart(exam.id)}
                  >
                    View / Register
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Feedback Modal */}
        <Dialog open={showFeedback} onOpenChange={setShowFeedback}>
          <DialogContent className="max-w-md text-center">
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
              className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowFeedback(false)}
            >
              Close
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
