"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle, Info } from "lucide-react";
import StudentInfoForm from "@/app/components/student-info-form";

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface Assessment {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  universityName?: string;
  category?: "K-12" | "University";
  date: string;
  time: string;
  duration: number;
  mcqs: MCQ[];
}

export default function AssessmentAttemptPage({
  params,
}: {
  params: { assessmentId: string };
}) {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [cheatWarning, setCheatWarning] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSubmitted, setShowSubmitted] = useState(false);
  const [showCheatWarning, setShowCheatWarning] = useState(false);
  const [showFinalCheat, setShowFinalCheat] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const [studentInfo, setStudentInfo] = useState<{
    studentName: string;
    studentRollNumber: string;
    studentInstitution: string;
    studentClass: string;
    studentCategory: "K-12" | "University";
  } | null>(null);
  const [showStudentForm, setShowStudentForm] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Accessibility state
  const [accessibility, setAccessibility] = useState({
    highContrast: false,
    screenReader: false,
  });

  // Read aloud function using Web Speech API
  function readAloud(text: string) {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new window.SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  }

  // Fetch assessment and check registration
  useEffect(() => {
    async function fetchAssessment() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/exams?id=${params.assessmentId}`);
        const data = await res.json();
        if (!data || !data._id) {
          setError("Assessment not found.");
          setLoading(false);
          return;
        }
        // Check registration
        const regRes = await fetch("/api/exams/submissions");
        const regData = await regRes.json();
        const registered =
          Array.isArray(regData) &&
          regData.some(
            (r) =>
              r.examId === (data._id || data.id) &&
              r.studentEmail === user?.email
          );
        if (!registered) {
          setError("You are not registered for this assessment.");
          setLoading(false);
          return;
        }
        // Check time window
        const now = new Date();
        const start = new Date(`${data.date}T${data.time}`);
        const end = new Date(start.getTime() + (data.duration || 60) * 60000);
        if (now < start) {
          setError("This assessment has not started yet.");
          setLoading(false);
          return;
        }
        if (now > end) {
          setError("This assessment is over.");
          setLoading(false);
          return;
        }
        setAssessment(data);
        setAnswers(Array(data.mcqs.length).fill(-1));
        setTimer(Math.floor((end.getTime() - now.getTime()) / 1000));
      } catch {
        setError("Failed to load assessment.");
      } finally {
        setLoading(false);
      }
    }
    if (isLoggedIn && user?.role === "student") fetchAssessment();
  }, [isLoggedIn, user, params.assessmentId]);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !submitted) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && !submitted && assessment) {
      handleSubmit();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timer, submitted, assessment]);

  // Tab switch/blur detection
  useEffect(() => {
    const onBlur = () => {
      setCheatWarning((w) => w + 1);
      setShowCheatWarning(true);
      setSecurityAlerts((prev) => [...prev, "Tab switch detected"]);
      if (cheatWarning >= 1 && !submitted) setShowFinalCheat(true);
      if (cheatWarning >= 2 && !submitted) handleSubmit();
    };
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
    };
  }, [cheatWarning, submitted]);

  // Disable copy/paste/right-click
  useEffect(() => {
    const onCopy = (e: Event) => {
      e.preventDefault();
      setSecurityAlerts((prev) => [...prev, "Copy attempt detected"]);
    };
    const onPaste = (e: Event) => {
      e.preventDefault();
      setSecurityAlerts((prev) => [...prev, "Paste attempt detected"]);
    };
    const onContextMenu = (e: Event) => {
      e.preventDefault();
      setSecurityAlerts((prev) => [...prev, "Right-click attempt detected"]);
    };
    document.addEventListener("copy", onCopy);
    document.addEventListener("paste", onPaste);
    document.addEventListener("contextmenu", onContextMenu);
    return () => {
      document.removeEventListener("copy", onCopy);
      document.removeEventListener("paste", onPaste);
      document.removeEventListener("contextmenu", onContextMenu);
    };
  }, []);

  const handleAnswer = (idx: number) => {
    setAnswers((prev) => {
      const arr = [...prev];
      arr[current] = idx;
      return arr;
    });
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    // Submit answers to backend (implement /api/exams/submit if needed)
    await fetch("/api/exams/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: assessment?._id || assessment?.id,
        answers,
        securityAlerts, // <-- send security alerts
        studentRollNumber: studentInfo?.studentRollNumber || "",
        studentInstitution: studentInfo?.studentInstitution || "",
        studentClass: studentInfo?.studentClass || "",
        timeTaken: assessment ? (assessment.duration * 60 - timer) / 60 : 0,
      }),
    });
  };

  const percent =
    assessment && timer > 0 ? (timer / (assessment.duration * 60)) * 100 : 0;

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!assessment) return null;

  // Show student info form first
  if (showStudentForm) {
    return (
      <StudentInfoForm
        examTitle={assessment.title}
        examCategory={assessment.category as "K-12" | "University"}
        onSubmit={(info: {
          studentName: string;
          studentRollNumber: string;
          studentInstitution: string;
          studentClass: string;
          studentCategory: "K-12" | "University";
        }) => {
          setStudentInfo(info);
          setShowStudentForm(false);
        }}
      />
    );
  }

  return (
    <>
      {/* Accessibility Top Bar */}
      <div className="fixed top-0 left-0 w-full z-50 bg-gray-900 text-white flex items-center gap-6 px-6 py-2 shadow-lg border-b border-gray-800">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-base">Accessibility:</span>
          {/* High Contrast Toggle */}
          <label
            className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded transition ${
              accessibility.highContrast
                ? "bg-yellow-600/80"
                : "hover:bg-gray-800/80"
            }`}
            title="Switch to high contrast, large text mode for visually impaired users."
          >
            <input
              type="checkbox"
              checked={accessibility.highContrast}
              onChange={(e) =>
                setAccessibility((a) => ({
                  ...a,
                  highContrast: e.target.checked,
                }))
              }
              className="accent-yellow-400 w-5 h-5"
            />
            <span className="flex items-center gap-1">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
              High Contrast
            </span>
            <Info className="w-4 h-4 ml-1 text-yellow-300" />
          </label>
          {/* Screen Reader Toggle */}
          <label
            className={`flex items-center gap-2 cursor-pointer px-3 py-1 rounded transition ${
              accessibility.screenReader
                ? "bg-blue-700/80"
                : "hover:bg-gray-800/80"
            }`}
            title="Enable ARIA live regions and screen reader support."
          >
            <input
              type="checkbox"
              checked={accessibility.screenReader}
              onChange={(e) =>
                setAccessibility((a) => ({
                  ...a,
                  screenReader: e.target.checked,
                }))
              }
              className="accent-blue-400 w-5 h-5"
            />
            <span className="flex items-center gap-1">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M2 12h2m16 0h2M7 12a5 5 0 0 1 10 0" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Screen Reader
            </span>
            <Info className="w-4 h-4 ml-1 text-blue-300" />
          </label>
        </div>
      </div>
      <div
        className={
          accessibility.highContrast ? "bg-black text-white text-lg" : ""
        }
        aria-live={accessibility.screenReader ? "polite" : undefined}
        style={{ paddingTop: 56 }} // offset for fixed bar
      >
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-emerald-50 py-8 px-2">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 relative">
            {/* Cheating Prevention Info Banner */}
            <div className="mb-4">
              <div className="flex items-center bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 text-sm">
                  Cheating Prevention: Tab switching, copy, paste, and
                  right-click are disabled. Multiple tab switches will
                  auto-submit your exam.
                </span>
              </div>
            </div>
            {/* Tab Switch Warning */}
            {showCheatWarning && !submitted && (
              <div className="mb-4">
                <div className="flex items-center bg-red-50 border-l-4 border-red-400 p-3 rounded">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <span className="text-red-800 text-sm font-semibold">
                    Tab switch detected! Please do not leave or switch tabs
                    during the assessment.
                  </span>
                </div>
              </div>
            )}
            {/* Final Warning Before Auto-Submit */}
            {showFinalCheat && !submitted && (
              <div className="mb-4">
                <div className="flex items-center bg-red-100 border-l-4 border-red-500 p-3 rounded">
                  <AlertCircle className="w-5 h-5 text-red-700 mr-2" />
                  <span className="text-red-900 text-sm font-bold">
                    Final Warning: One more tab switch will auto-submit your
                    assessment!
                  </span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1 text-gray-800">
                  {assessment.title}
                </h1>
                <div className="text-gray-500 text-sm mb-1">
                  {assessment.subject} &middot; {assessment.universityName}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm mb-2">
                  Time Left: {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </span>
                <Progress value={percent} className="w-32 h-2 bg-blue-200" />
              </div>
            </div>
            <div className="mb-6">
              <div className="font-semibold mb-2 text-lg text-gray-700">
                Question {current + 1} of {assessment.mcqs.length}
              </div>
              <div className="mb-4 text-base text-gray-800 font-medium">
                {assessment.mcqs[current].question}
              </div>
              <div className="space-y-3">
                {assessment.mcqs[current].options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-150 ${
                      answers[current] === idx
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${current}`}
                      checked={answers[current] === idx}
                      onChange={() => handleAnswer(idx)}
                      disabled={submitted}
                      className="accent-blue-600 w-5 h-5"
                    />
                    <span className="text-gray-700 text-base">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <Button
                variant="outline"
                disabled={current === 0 || submitted}
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              >
                Previous
              </Button>
              {current < assessment.mcqs.length - 1 ? (
                <Button
                  variant="outline"
                  disabled={current === assessment.mcqs.length - 1 || submitted}
                  onClick={() =>
                    setCurrent((c) =>
                      Math.min(assessment.mcqs.length - 1, c + 1)
                    )
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold text-base shadow-md"
                  disabled={submitted}
                  onClick={() => setShowConfirm(true)}
                >
                  Submit Assessment
                </Button>
              )}
            </div>
            {/* Confirmation Dialog */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Assessment?</DialogTitle>
                </DialogHeader>
                <div className="mb-4 text-gray-700">
                  Are you sure you want to submit your answers? You won't be
                  able to change them after submission.
                </div>
                <div className="flex gap-4 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={async () => {
                      setShowConfirm(false);
                      await handleSubmit();
                      setShowSubmitted(true);
                    }}
                  >
                    Yes, Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* Submission Feedback Dialog */}
            <Dialog open={showSubmitted} onOpenChange={setShowSubmitted}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assessment Submitted!</DialogTitle>
                </DialogHeader>
                <div className="mb-4 text-green-700 font-semibold">
                  Your answers have been submitted successfully.
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowSubmitted(false)}>Close</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </>
  );
}
