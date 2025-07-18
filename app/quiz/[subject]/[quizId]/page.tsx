"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react";
import AppHeader from "@/components/ui/app-header";

export default function QuizPage({
  params,
}: {
  params: { subject: string; quizId: string };
}) {
  const router = useRouter();
  const [quizQuestions, setQuizQuestions] = useState<any[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedbackEmoji, setQuizFeedbackEmoji] = useState("🎉");
  const [quizTime, setQuizTime] = useState<number>(0);
  const [quizTimeLeft, setQuizTimeLeft] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load quiz data
  useEffect(() => {
    async function loadQuiz() {
      try {
        setLoading(true);

        // Determine if this is a science or coding subject
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

        let apiUrl = "";
        if (scienceSubjects.includes(params.subject.toLowerCase())) {
          apiUrl = `/api/quiz-data/science/${params.subject.toLowerCase()}`;
        } else if (codingSubjects.includes(params.subject.toLowerCase())) {
          // Map subject names to folder names
          let folderName = params.subject.toLowerCase();
          if (params.subject.toLowerCase() === "html/css") {
            folderName = "html-css";
          } else if (params.subject.toLowerCase() === "node.js") {
            folderName = "nodejs";
          }
          apiUrl = `/api/quiz-data/coding/${folderName}`;
        } else if (economicsSubjects.includes(params.subject.toLowerCase())) {
          // Map subject names to folder names
          let folderName = params.subject.toLowerCase();
          if (params.subject.toLowerCase() === "micro economics") {
            folderName = "micro-economics";
          } else if (params.subject.toLowerCase() === "macro economics") {
            folderName = "macro-economics";
          } else if (params.subject.toLowerCase() === "political science") {
            folderName = "political-science";
          }
          apiUrl = `/api/quiz-data/economics/${folderName}`;
        } else if (
          mathematicsSubjects.includes(
            decodeURIComponent(params.subject).toLowerCase()
          )
        ) {
          // Map subject names to folder names
          let folderName = decodeURIComponent(params.subject).toLowerCase();
          if (
            decodeURIComponent(params.subject).toLowerCase() ===
            "pythagorean theorem"
          ) {
            folderName = "pythagorean-theorem";
          }
          apiUrl = `/api/quiz-data/mathematics/${folderName}`;
        } else if (
          artsHumanitiesSubjects.includes(
            decodeURIComponent(params.subject).toLowerCase()
          )
        ) {
          // Map subject names to folder names
          let folderName = decodeURIComponent(params.subject).toLowerCase();
          if (
            decodeURIComponent(params.subject).toLowerCase() === "art history"
          ) {
            folderName = "art-history";
          } else if (
            decodeURIComponent(params.subject).toLowerCase() === "music theory"
          ) {
            folderName = "music-theory";
          } else if (
            decodeURIComponent(params.subject).toLowerCase() ===
            "creative writing"
          ) {
            folderName = "creative-writing";
          } else if (
            decodeURIComponent(params.subject).toLowerCase() ===
            "foreign languages"
          ) {
            folderName = "foreign-languages";
          } else if (
            decodeURIComponent(params.subject).toLowerCase() ===
            "religious studies"
          ) {
            folderName = "religious-studies";
          } else if (
            decodeURIComponent(params.subject).toLowerCase() ===
            "cultural studies"
          ) {
            folderName = "cultural-studies";
          }
          apiUrl = `/api/quiz-data/arts-humanities/${folderName}`;

          // For English and other arts-humanities subjects, try to load the specific quiz first
          try {
            const specificQuizUrl = `/api/quiz-data/arts-humanities/${folderName}/${params.quizId}`;
            const specificResponse = await fetch(specificQuizUrl);
            if (specificResponse.ok) {
              const quiz = await specificResponse.json();
              console.log("Loaded specific quiz:", quiz);
              if (quiz && quiz.questions) {
                setQuizQuestions(quiz.questions);
                setQuizTime(quiz.timeLimit || 0);
                setQuizTimeLeft(quiz.timeLimit || 0);
                setQuizAnswers(Array(quiz.questions.length).fill(-1));
                setLoading(false);
                return;
              }
            }
          } catch (error) {
            console.log(
              "Could not load specific quiz, trying general endpoint"
            );
          }
        }

        if (apiUrl) {
          // Fallback to loading all quizzes and finding the specific one
          const response = await fetch(apiUrl);
          if (response.ok) {
            const quizzes = await response.json();
            console.log("Loaded quizzes:", quizzes);
            const quiz = quizzes.find((q: any) => q.id === params.quizId);
            console.log("Found quiz:", quiz);

            if (quiz) {
              console.log("Quiz questions:", quiz.questions);
              setQuizQuestions(quiz.questions);
              setQuizTime(quiz.timeLimit || 0);
              setQuizTimeLeft(quiz.timeLimit || 0);
              setQuizAnswers(Array(quiz.questions.length).fill(-1));
            } else {
              // Fallback to mock data if quiz not found
              const mockQuestions = [
                {
                  id: 1,
                  question: "What is the main topic of this subject?",
                  options: ["Option A", "Option B", "Option C", "Option D"],
                  correctAnswer: 0,
                  explanation: "This is a sample question.",
                },
                {
                  id: 2,
                  question: "Which of the following is correct?",
                  options: [
                    "First option",
                    "Second option",
                    "Third option",
                    "Fourth option",
                  ],
                  correctAnswer: 1,
                  explanation: "This is a sample question.",
                },
                {
                  id: 3,
                  question: "Choose the best answer:",
                  options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
                  correctAnswer: 2,
                  explanation: "This is a sample question.",
                },
              ];
              setQuizQuestions(mockQuestions);
              setQuizTime(300); // 5 minutes
              setQuizTimeLeft(300);
              setQuizAnswers(Array(mockQuestions.length).fill(-1));
            }
          } else {
            // Fallback to mock data if API fails
            const mockQuestions = [
              {
                id: 1,
                question: "What is the main topic of this subject?",
                options: ["Option A", "Option B", "Option C", "Option D"],
                correctAnswer: 0,
                explanation: "This is a sample question.",
              },
              {
                id: 2,
                question: "Which of the following is correct?",
                options: [
                  "First option",
                  "Second option",
                  "Third option",
                  "Fourth option",
                ],
                correctAnswer: 1,
                explanation: "This is a sample question.",
              },
              {
                id: 3,
                question: "Choose the best answer:",
                options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
                correctAnswer: 2,
                explanation: "This is a sample question.",
              },
            ];
            setQuizQuestions(mockQuestions);
            setQuizTime(300); // 5 minutes
            setQuizTimeLeft(300);
            setQuizAnswers(Array(mockQuestions.length).fill(-1));
          }
        } else {
          // Fallback to mock data if subject not recognized
          const mockQuestions = [
            {
              id: 1,
              question: "What is the main topic of this subject?",
              options: ["Option A", "Option B", "Option C", "Option D"],
              correctAnswer: 0,
              explanation: "This is a sample question.",
            },
            {
              id: 2,
              question: "Which of the following is correct?",
              options: [
                "First option",
                "Second option",
                "Third option",
                "Fourth option",
              ],
              correctAnswer: 1,
              explanation: "This is a sample question.",
            },
            {
              id: 3,
              question: "Choose the best answer:",
              options: ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
              correctAnswer: 2,
              explanation: "This is a sample question.",
            },
          ];
          setQuizQuestions(mockQuestions);
          setQuizTime(300); // 5 minutes
          setQuizTimeLeft(300);
          setQuizAnswers(Array(mockQuestions.length).fill(-1));
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz");
        setLoading(false);
      }
    }
    loadQuiz();
  }, [params.quizId, params.subject]);

  // Timer effect
  useEffect(() => {
    if (!quizQuestions.length || quizSubmitted || !quizTime) return;
    if (quizTimeLeft <= 0) {
      setQuizSubmitted(true);
      return;
    }
    timerRef.current = setTimeout(() => setQuizTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current!);
  }, [quizQuestions.length, quizTimeLeft, quizSubmitted, quizTime]);

  const handleQuizAnswer = (qIdx: number, optIdx: number) => {
    setQuizAnswers((prev) => prev.map((a, i) => (i === qIdx ? optIdx : a)));
  };

  const handleQuizSubmit = () => {
    if (!quizQuestions.length) return;
    let correct = 0;
    for (let i = 0; i < quizAnswers.length; i++) {
      if (quizAnswers[i] === quizQuestions[i]?.correctAnswer) correct++;
    }
    setQuizScore(correct);
    setQuizFeedbackEmoji(
      correct === quizAnswers.length ? "🎉" : correct > 0 ? "👍" : "😅"
    );
    setQuizSubmitted(true);
  };

  const handleBackToQuizzes = () => {
    router.push("/quiz");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader userInitial="J" active="Quizzes" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader userInitial="J" active="Quizzes" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Error Loading Quiz
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={handleBackToQuizzes}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader userInitial="J" active="Quizzes" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackToQuizzes}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
              {decodeURIComponent(params.subject).charAt(0).toUpperCase() +
                decodeURIComponent(params.subject).slice(1)}{" "}
              Quiz
            </h1>
            <p className="text-lg text-gray-600">
              {quizQuestions.length} Questions
              {quizTime > 0 && (
                <span className="ml-4 font-semibold text-emerald-700 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4" />
                  Time Left: {Math.floor(quizTimeLeft / 60)}:
                  {(quizTimeLeft % 60).toString().padStart(2, "0")}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress
            value={((currentQuestion + 1) / quizQuestions.length) * 100}
            className="h-3 bg-gray-200"
          />
          <div className="flex justify-center gap-2 mt-4">
            {quizQuestions.map((_, idx) => (
              <button
                key={idx}
                className={`w-4 h-4 rounded-full border-2 ${
                  currentQuestion === idx
                    ? "bg-emerald-500 border-emerald-700"
                    : quizAnswers[idx] !== -1
                    ? "bg-blue-500 border-blue-700"
                    : "bg-white border-gray-300"
                }`}
                onClick={() => setCurrentQuestion(idx)}
                aria-label={`Go to question ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto">
          {!quizSubmitted ? (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              {/* Motivational Tip */}
              <div className="mb-6 text-center text-emerald-700 font-semibold text-lg">
                "Every question is a step closer to mastery!"
              </div>

              {/* Question */}
              <div className="mb-8">
                <div className="font-semibold mb-4 text-xl text-gray-800">
                  Q{currentQuestion + 1}.{" "}
                  {quizQuestions[currentQuestion]?.question || ""}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {Array.isArray(quizQuestions[currentQuestion]?.options) ? (
                    quizQuestions[currentQuestion].options.map(
                      (opt: string, optIdx: number) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all text-base shadow-sm border-2 ${
                            quizAnswers[currentQuestion] === optIdx
                              ? "bg-gradient-to-r from-emerald-100 to-blue-100 border-emerald-400"
                              : "bg-white border border-gray-200 hover:border-emerald-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${currentQuestion}`}
                            checked={quizAnswers[currentQuestion] === optIdx}
                            onChange={() =>
                              handleQuizAnswer(currentQuestion, optIdx)
                            }
                            className="accent-emerald-600"
                          />
                          <span className="flex-1">
                            {typeof opt === "string" ? opt : ""}
                          </span>
                        </label>
                      )
                    )
                  ) : (
                    <div>Options not available</div>
                  )}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setCurrentQuestion((q) => Math.max(0, q - 1))}
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
                    Submit Quiz
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Results */
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-8 text-center"
            >
              <div className="text-6xl mb-6 animate-bounce">
                {quizFeedbackEmoji}
              </div>

              <h2 className="text-3xl font-bold mb-4 text-emerald-700">
                Quiz Complete!
              </h2>

              <div className="text-2xl font-bold mb-4 text-gray-800">
                You scored {quizScore} out of {quizAnswers.length}
              </div>

              <Progress
                value={(quizScore / quizAnswers.length) * 100}
                className="mb-6 h-4 bg-gray-200"
              />

              {quizScore === quizAnswers.length && (
                <div className="text-emerald-600 font-bold text-xl mb-4">
                  Perfect Score! 🎉
                </div>
              )}

              {quizScore < quizAnswers.length && (
                <div className="text-gray-600 mb-6">
                  Review your answers and try again!
                </div>
              )}

              {/* Answer Summary */}
              <div className="mt-8 text-left">
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">
                  Answer Summary
                </h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {quizQuestions.map((question, qIdx) => {
                    const userAnswer = quizAnswers[qIdx];
                    const correctAnswer = question.correctAnswer;
                    const isCorrect = userAnswer === correctAnswer;

                    return (
                      <div
                        key={qIdx}
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                              isCorrect ? "bg-green-500" : "bg-red-500"
                            }`}
                          >
                            {isCorrect ? "✓" : "✗"}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-800 mb-2">
                              Q{qIdx + 1}. {question.question || ""}
                            </div>
                            <div className="space-y-1">
                              {Array.isArray(question.options) ? (
                                question.options.map(
                                  (option: string, optIdx: number) => (
                                    <div
                                      key={optIdx}
                                      className={`text-sm p-2 rounded ${
                                        optIdx === correctAnswer
                                          ? "bg-green-100 text-green-800 font-semibold"
                                          : optIdx === userAnswer && !isCorrect
                                          ? "bg-red-100 text-red-800 font-semibold"
                                          : "bg-gray-50 text-gray-600"
                                      }`}
                                    >
                                      {typeof option === "string" ? option : ""}
                                      {optIdx === correctAnswer && (
                                        <span className="ml-2 text-green-600">
                                          ✓ Correct Answer
                                        </span>
                                      )}
                                      {optIdx === userAnswer && !isCorrect && (
                                        <span className="ml-2 text-red-600">
                                          ✗ Your Answer
                                        </span>
                                      )}
                                    </div>
                                  )
                                )
                              ) : (
                                <div>Options not available</div>
                              )}
                            </div>
                            {!isCorrect && (
                              <div className="mt-2 text-sm text-red-600">
                                You selected:{" "}
                                {userAnswer !== -1 &&
                                Array.isArray(question.options)
                                  ? question.options[userAnswer]
                                  : "No answer"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 mt-8">
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg"
                  onClick={handleBackToQuizzes}
                >
                  Back to Quizzes
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setQuizSubmitted(false);
                    setQuizAnswers(Array(quizQuestions.length).fill(-1));
                    setCurrentQuestion(0);
                    setQuizTimeLeft(quizTime);
                    setQuizScore(0);
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
