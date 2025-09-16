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
  className?: string;
  department?: string;
  category?: "K-12" | "University";
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
  studentRollNumber?: string;
  studentInstitution?: string;
  studentClass?: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  status: "submitted" | "reviewed";
}

export default function UniversityDashboard() {
  const { user, logout } = useAuth();
  
  // Check if user has university access directly from auth context
  const hasAccess = user?.access?.university || user?.access?.proctor || false;
  const paymentLoading = false; // No longer using payment protection hook
  const [activeTab, setActiveTab] = useState("overview");
  const [exams, setExams] = useState<Exam[]>([]);
  const [submittedExams, setSubmittedExams] = useState<SubmittedExam[]>([]);
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real exams from API
  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exams");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to fetch exams");
        setExams([]);
      } else {
        const data = await res.json();
        setExams(data);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real submissions from API
  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/exams/submissions");
      if (!res.ok) {
        setSubmittedExams([]);
      } else {
        const data = await res.json();
        setSubmittedExams(data);
      }
    } catch {
      setSubmittedExams([]);
    }
  };

  useEffect(() => {
    // Only fetch data if user has access
    if (hasAccess) {
      fetchExams();
      fetchSubmissions();
    }
  }, [hasAccess]);

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


  // Show payment required message if no access
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Payment Required
              </h2>
              <p className="text-gray-600 mb-6">
                You need to purchase a Universities package to access the dashboard features.
                This includes creating exams, managing submissions, and accessing proctoring tools.
              </p>
              <div className="space-y-4">
                <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <a href="/services?package=universities">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    View Universities Package
                  </a>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <a href="/">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Back to Home
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto py-8">
          <div className="text-center text-foreground">
            Loading dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Dashboard Header */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-card-foreground">
                K-12 & University Dashboard
              </h1>
              <p className="text-gray-600">
                Manage exams for K-12 schools and universities - view student submissions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="font-semibold text-card-foreground">
                  {user?.name || "Education Admin"}
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
                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Exams</p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {exams.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          Total Registrations
                        </p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {exams.reduce(
                            (sum, exam) => sum + (exam.registeredStudents || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Submissions</p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {submittedExams.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Award className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Avg Score</p>
                        <p className="text-2xl font-bold text-card-foreground">
                          {submittedExams.length > 0
                            ? Math.round(
                                submittedExams.reduce(
                                  (sum, exam) => sum + (exam.score || 0),
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
                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle>Recent Exams</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {exams.slice(0, 3).map((exam, index) => (
                        <div
                          key={exam.id || `exam-${index}`}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold text-card-foreground">
                              {exam.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-gray-600">
                                {formatDate(exam.date)}
                              </p>
                              {exam.category && (
                                <Badge variant="outline" className="text-xs">
                                  {exam.category}
                                </Badge>
                              )}
                              {exam.className && (
                                <Badge variant="secondary" className="text-xs">
                                  {exam.className}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(exam.status)}>
                            {exam.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border border-border">
                  <CardHeader>
                    <CardTitle>Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {submittedExams.slice(0, 3).map((submission, index) => (
                        <div
                          key={submission.id || `submission-${index}`}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-semibold text-card-foreground">
                              {submission.studentName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {submission.examTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-card-foreground">
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
              <ExamList exams={exams} onExamsChanged={fetchExams} />
            </TabsContent>

            {/* Submissions Tab */}
            <TabsContent value="submissions" className="space-y-6">
              <SubmissionsList submissions={submittedExams} />
            </TabsContent>

            {/* Create Exam Tab */}
            <TabsContent value="create" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-card-foreground">
                  Create New Exam
                </h2>
              </div>
              <Card className="bg-card border border-border">
                <CardContent className="p-6">
                  <CreateExamForm onExamCreatedAction={fetchExams} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
