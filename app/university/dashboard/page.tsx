"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Calendar,
  Clock,
  Users,
  BookOpen,
  FileText,
  Eye,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  ArrowRight,
  CalendarDays,
  Timer,
  UserCheck,
  Award,
  Target,
  Brain,
  MessageSquare,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import CreateExamForm from "./create-exam-form";
import ExamList from "./exam-list";
import SubmissionsList from "./submissions-list";

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  totalQuestions: number;
  maxStudents: number;
  registeredStudents: number;
  status: "draft" | "scheduled" | "ongoing" | "completed";
  description: string;
  requirements: string[];
  registrationDeadline: string;
  createdAt: string;
  mcqs?: MCQ[];
}

interface SubmittedExam {
  id: string;
  examId: string;
  examTitle: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  status: "submitted" | "reviewed";
}

export default function UniversityDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([]);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockExams: Exam[] = [
      {
        id: "1",
        title: "Computer Science Entrance Exam 2024",
        subject: "Computer Science",
        date: "2024-03-15",
        time: "10:00 AM",
        duration: 120,
        totalQuestions: 100,
        maxStudents: 500,
        registeredStudents: 342,
        status: "scheduled",
        description:
          "Comprehensive entrance examination for Computer Science program",
        requirements: [
          "Senior Secondary Certificate",
          "Mathematics Background",
        ],
        registrationDeadline: "2024-03-10",
        createdAt: "2024-02-15",
        mcqs: [
          {
            id: "mcq1",
            question: "What is the time complexity of binary search?",
            options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
            correctAnswer: 1,
            points: 2,
            explanation:
              "Binary search has logarithmic time complexity as it divides the search space in half with each iteration.",
          },
          {
            id: "mcq2",
            question: "Which data structure follows LIFO principle?",
            options: ["Queue", "Stack", "Tree", "Graph"],
            correctAnswer: 1,
            points: 1,
            explanation: "Stack follows Last In First Out (LIFO) principle.",
          },
          {
            id: "mcq3",
            question: "What is the primary function of an operating system?",
            options: [
              "To run applications",
              "To manage hardware resources",
              "To provide internet access",
              "To create files",
            ],
            correctAnswer: 1,
            points: 2,
            explanation:
              "The primary function of an operating system is to manage hardware resources and provide an interface for applications.",
          },
        ],
      },
      {
        id: "2",
        title: "Engineering Aptitude Test",
        subject: "Engineering",
        date: "2024-03-25",
        time: "9:00 AM",
        duration: 150,
        totalQuestions: 120,
        maxStudents: 400,
        registeredStudents: 156,
        status: "draft",
        description: "Aptitude test for various engineering disciplines",
        requirements: ["Senior Secondary Certificate", "Physics & Mathematics"],
        registrationDeadline: "2024-03-20",
        createdAt: "2024-02-20",
        mcqs: [
          {
            id: "mcq4",
            question: "What is Ohm's Law?",
            options: ["V = IR", "P = VI", "F = ma", "E = mc²"],
            correctAnswer: 0,
            points: 2,
            explanation:
              "Ohm's Law states that voltage (V) equals current (I) multiplied by resistance (R).",
          },
          {
            id: "mcq5",
            question: "Which of the following is a vector quantity?",
            options: ["Temperature", "Mass", "Force", "Time"],
            correctAnswer: 2,
            points: 1,
            explanation:
              "Force is a vector quantity as it has both magnitude and direction.",
          },
        ],
      },
    ];

    const mockSubmittedExams: SubmittedExam[] = [
      {
        id: "1",
        examId: "1",
        examTitle: "Computer Science Entrance Exam 2024",
        studentName: "John Doe",
        studentEmail: "john.doe@email.com",
        submittedAt: "2024-03-15T12:30:00Z",
        score: 85,
        totalQuestions: 100,
        timeTaken: 110,
        status: "submitted",
      },
      {
        id: "2",
        examId: "1",
        examTitle: "Computer Science Entrance Exam 2024",
        studentName: "Jane Smith",
        studentEmail: "jane.smith@email.com",
        submittedAt: "2024-03-15T11:45:00Z",
        score: 92,
        totalQuestions: 100,
        timeTaken: 95,
        status: "reviewed",
      },
    ];

    setExams(mockExams);
    setSubmittedExams(mockSubmittedExams);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8">
          <div className="text-center">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Dashboard Header */}
      <section className="bg-white border-b">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                University Dashboard
              </h1>
              <p className="text-gray-600">
                Manage exams and view student submissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-gray-800">
                  {user?.name || "University Admin"}
                </p>
              </div>
              <Button variant="outline" onClick={logout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="create">Create Exam</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Exams</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {exams.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Registrations
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {exams.reduce(
                            (sum, exam) => sum + exam.registeredStudents,
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submissions</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {submittedExams.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Score</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {submittedExams.length > 0
                            ? Math.round(
                                submittedExams.reduce(
                                  (sum, exam) => sum + exam.score,
                                  0
                                ) / submittedExams.length
                              )
                            : 0}
                          %
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Exams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {exams.slice(0, 3).map((exam) => (
                        <div
                          key={exam.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {exam.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(exam.date)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(exam.status)}>
                            {exam.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submittedExams.slice(0, 3).map((submission) => (
                        <div
                          key={submission.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {submission.studentName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {submission.examTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              {submission.score}%
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDate(submission.submittedAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Exams Tab */}
            <TabsContent value="exams" className="space-y-6">
              <ExamList exams={exams} />
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <SubmissionsList submissions={submittedExams} />
            </TabsContent>

            {/* Create Exam Tab */}
            <TabsContent value="create" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Create New Exam
                </h2>
              </div>
              <Card>
                <CardContent className="p-6">
                  <CreateExamForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
