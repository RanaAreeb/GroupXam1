"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Users,
  Eye,
  Edit,
  FileText,
  Timer,
  Search,
  Filter,
  CheckCircle,
  Plus,
} from "lucide-react";
import CreateExamForm from "./create-exam-form";

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

interface ExamListProps {
  exams: Exam[];
}

export default function ExamList({ exams }: ExamListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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

  const ViewMCQsDialog = ({ exam }: { exam: Exam }) => {
    if (!exam.mcqs || exam.mcqs.length === 0) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              View MCQs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>MCQs for {exam.title}</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No MCQs available</h3>
              <p>This exam doesn't have any MCQs configured yet.</p>
            </div>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            View MCQs ({exam.mcqs.length})
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>MCQs for {exam.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {exam.mcqs.map((mcq, index) => (
              <div key={mcq.id} className="border rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary">Q{index + 1}</Badge>
                  <Badge variant="outline">{mcq.points} pts</Badge>
                  <Badge variant="outline">MCQ</Badge>
                </div>
                <p className="text-sm font-medium mb-3">{mcq.question}</p>
                <div className="space-y-2">
                  {mcq.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          optIndex === mcq.correctAnswer
                            ? "bg-green-100 border-green-500"
                            : "bg-gray-100"
                        }`}
                      >
                        {optIndex === mcq.correctAnswer && (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        )}
                      </span>
                      <span
                        className={
                          optIndex === mcq.correctAnswer
                            ? "font-medium text-green-700"
                            : ""
                        }
                      >
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </span>
                    </div>
                  ))}
                </div>
                {mcq.explanation && (
                  <div className="mt-3 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    <strong>Explanation:</strong> {mcq.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Exams</h2>
        <CreateExamForm />
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search exams..." className="pl-10 w-64" />
        </div>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            <SelectItem value="computer-science">Computer Science</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="medicine">Medicine</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="arts">Arts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <Card key={exam.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <Badge className={getStatusColor(exam.status)}>
                  {exam.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{exam.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{formatDate(exam.date)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{exam.time}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Timer className="w-4 h-4 mr-2 text-gray-500" />
                  <span>{exam.duration} min</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    {exam.registeredStudents}/{exam.maxStudents}
                  </span>
                </div>
              </div>

              {/* MCQ Info */}
              {exam.mcqs && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {exam.mcqs.length} MCQs
                      </span>
                    </div>
                    <span className="text-sm text-blue-600">
                      {exam.mcqs.reduce((sum, mcq) => sum + mcq.points, 0)}{" "}
                      points total
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <ViewMCQsDialog exam={exam} />
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Results
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {exams.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No exams created yet</h3>
              <p className="mb-4">Create your first exam to get started</p>
              <CreateExamForm />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
