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
  Trash2,
} from "lucide-react";
import CreateExamForm from "./create-exam-form";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import MCQManager, { MCQ } from "./MCQManager";

interface Exam {
  id?: string;
  _id?: string;
  title: string;
  subject: string;
  className?: string;
  department?: string;
  category?: "K-12" | "University";
  date: string;
  time: string;
  timezone?: string;
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
  registrationTime?: string;
}

interface ExamListProps {
  exams: Exam[];
  onExamsChanged: () => void;
}

export default function ExamList({ exams, onExamsChanged }: ExamListProps) {
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

  const [editExam, setEditExam] = useState<Exam | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteExamId, setDeleteExamId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Edit Exam handler
  const handleEditExam = async (updatedExam: Exam) => {
    setEditLoading(true);
    setEditError(null);
    try {
      const res = await fetch("/api/exams", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedExam),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "Failed to update exam");
      } else {
        setEditExam(null);
        onExamsChanged();
      }
    } catch (err) {
      setEditError("Network error. Please try again.");
    } finally {
      setEditLoading(false);
    }
  };

  // Delete Exam handler
  const handleDeleteExam = async (id: string) => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/exams?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setDeleteError(data.error || "Failed to delete exam");
      } else {
        setDeleteExamId(null);
        onExamsChanged();
      }
    } catch (err) {
      setDeleteError("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Exams</h2>
        <CreateExamForm onExamCreatedAction={() => {}} />
          
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
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="K-12">K-12 Schools</SelectItem>
            <SelectItem value="University">Universities</SelectItem>
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
          <Card
            key={exam.id || exam._id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{exam.title}</CardTitle>
                <Badge className={getStatusColor(exam.status)}>
                  {exam.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{exam.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {exam.category && (
                  <Badge variant="outline" className="text-xs">
                    {exam.category}
                  </Badge>
                )}
                {exam.className && (
                  <Badge variant="secondary" className="text-xs">
                    Class: {exam.className}
                  </Badge>
                )}
                {exam.department && (
                  <Badge variant="secondary" className="text-xs">
                    {exam.department}
                  </Badge>
                )}
              </div>
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
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span>
                    Reg. Deadline: {formatDate(exam.registrationDeadline)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Reg. Time: {exam.registrationTime || "-"}</span>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditExam(exam)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <ViewMCQsDialog exam={exam} />
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Results
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteExamId(exam.id ?? exam._id ?? "")}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
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
              <CreateExamForm onExamCreatedAction={() => {}} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Exam Modal */}
      {editExam && (
        <Dialog
          open={!!editExam}
          onOpenChange={(open) => !open && setEditExam(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Exam</DialogTitle>
            </DialogHeader>
            {/* Simple form for editing (expand as needed) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditExam(editExam);
              }}
              className="space-y-4"
            >
              <Label>Title</Label>
              <Input
                value={editExam.title}
                onChange={(e) =>
                  setEditExam({ ...editExam, title: e.target.value })
                }
              />
              <Label>Date</Label>
              <Input
                type="date"
                value={editExam.date}
                onChange={(e) =>
                  setEditExam({ ...editExam, date: e.target.value })
                }
              />
              <Label>Time</Label>
              <Input
                value={editExam.time}
                onChange={(e) =>
                  setEditExam({ ...editExam, time: e.target.value })
                }
              />
              <Label>MCQs</Label>
              <MCQManager
                mcqs={editExam.mcqs || []}
                setMcqs={(newMcqs: MCQ[]) =>
                  setEditExam({ ...editExam, mcqs: newMcqs })
                }
              />
              <Label>Registration Deadline</Label>
              <Input
                type="date"
                value={editExam.registrationDeadline}
                onChange={(e) =>
                  setEditExam({
                    ...editExam,
                    registrationDeadline: e.target.value,
                  })
                }
              />
              <Label>Registration Time</Label>
              <Input
                type="time"
                value={editExam.registrationTime || ""}
                onChange={(e) =>
                  setEditExam({ ...editExam, registrationTime: e.target.value })
                }
              />
              {editError && (
                <div className="text-red-600 text-sm">{editError}</div>
              )}
              <div className="flex gap-2">
                <Button type="submit" disabled={editLoading}>
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditExam(null)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Exam Confirmation */}
      {deleteExamId && (
        <Dialog
          open={!!deleteExamId}
          onOpenChange={(open) => !open && setDeleteExamId(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Exam</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              Are you sure you want to delete this exam? This action cannot be
              undone.
            </div>
            {deleteError && (
              <div className="text-red-600 text-sm mb-2">{deleteError}</div>
            )}
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={() => handleDeleteExam(deleteExamId)}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
              <Button variant="outline" onClick={() => setDeleteExamId(null)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
