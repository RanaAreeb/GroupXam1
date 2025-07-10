"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Download, Search, FileText } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import jsPDF from "jspdf";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";

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
  securityAlerts?: string[]; // <-- new field for alerts
}

interface SubmissionsListProps {
  submissions: SubmittedExam[];
}

export default function SubmissionsList({ submissions }: SubmissionsListProps) {
  const [viewedSubmission, setViewedSubmission] =
    useState<SubmittedExam | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("details");

  // Get unique exams from submissions
  const exams = Array.from(
    new Map(submissions.map((s) => [s.examId, s.examTitle])).entries()
  ).map(([id, title]) => ({ id, title }));

  // Filter submissions by selected exam
  const filteredSubmissions = selectedExamId
    ? submissions.filter((s) => s.examId === selectedExamId)
    : [];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadSubmission = (submission: SubmittedExam) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Submission Report", 10, 15);
    doc.setFontSize(12);
    doc.text(`Student: ${submission.studentName}`, 10, 30);
    doc.text(`Email: ${submission.studentEmail}`, 10, 38);
    doc.text(`Exam: ${submission.examTitle}`, 10, 46);
    doc.text(`Submitted: ${formatDateTime(submission.submittedAt)}`, 10, 54);
    doc.text(
      `Score: ${submission.score}% (${submission.score}/${submission.totalQuestions})`,
      10,
      62
    );
    doc.text(`Time Taken: ${submission.timeTaken} min`, 10, 70);
    doc.text(`Status: ${submission.status}`, 10, 78);
    // Add answers if available
    if ((submission as any).answers) {
      doc.text("Answers:", 10, 90);
      ((submission as any).answers as number[]).forEach((ans, idx) => {
        doc.text(
          `Q${idx + 1}: Option ${
            typeof ans === "number" ? String.fromCharCode(65 + ans) : ans
          }`,
          10,
          98 + idx * 8
        );
      });
    }
    doc.save(
      `submission_${submission.studentEmail}_${submission.examTitle}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Student Submissions
        </h2>
        {/* Exam selection step */}
        <div className="flex flex-wrap gap-2">
          {exams.map((exam) => (
            <Button
              key={exam.id}
              variant={selectedExamId === exam.id ? "default" : "outline"}
              onClick={() => setSelectedExamId(exam.id)}
              className="capitalize"
            >
              {exam.title && exam.title.trim() ? exam.title : "Unknown Exam"}
            </Button>
          ))}
        </div>
      </div>

      {/* Show submissions only if exam is selected */}
      {selectedExamId && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Alerts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.studentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {submission.score}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.score}/{submission.totalQuestions}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.timeTaken} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          className={
                            submission.status === "reviewed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {submission.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {submission.securityAlerts &&
                        submission.securityAlerts.length > 0 ? (
                          <span title="Security Alerts">
                            <AlertCircle className="w-5 h-5 text-red-500 inline" />
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setViewedSubmission(submission);
                              setActiveTab("details");
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadSubmission(submission)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedExamId && filteredSubmissions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">
                No submissions for this exam yet
              </h3>
              <p>
                Student exam submissions will appear here once they start taking
                exams.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Submission Dialog with Tabs */}
      <Dialog
        open={!!viewedSubmission}
        onOpenChange={() => setViewedSubmission(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {viewedSubmission && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="mt-4"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <div className="space-y-2">
                  <div>
                    <b>Student:</b> {viewedSubmission.studentName} (
                    {viewedSubmission.studentEmail})
                  </div>
                  <div>
                    <b>Exam:</b> {viewedSubmission.examTitle}
                  </div>
                  <div>
                    <b>Submitted:</b>{" "}
                    {formatDateTime(viewedSubmission.submittedAt)}
                  </div>
                  <div>
                    <b>Score:</b> {viewedSubmission.score}% (
                    {viewedSubmission.score}/{viewedSubmission.totalQuestions})
                  </div>
                  <div>
                    <b>Time Taken:</b> {viewedSubmission.timeTaken} min
                  </div>
                  <div>
                    <b>Status:</b> {viewedSubmission.status}
                  </div>
                  {/* Add answers display here if available in submission */}
                </div>
              </TabsContent>
              <TabsContent value="alerts">
                {viewedSubmission.securityAlerts &&
                viewedSubmission.securityAlerts.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {viewedSubmission.securityAlerts.map((alert, idx) => (
                      <li
                        key={idx}
                        className="text-red-600 flex items-center gap-2"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {alert}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500">
                    No security alerts for this submission.
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
