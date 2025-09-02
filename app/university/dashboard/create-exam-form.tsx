"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Eye,
  Save,
  CheckCircle,
  AlertCircle,
  FileText,
  Settings,
  Timer,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import MCQManager, { MCQ } from "./MCQManager";

// Common timezones list
const commonTimezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Europe/Moscow", label: "Moscow Time (MSK)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
  { value: "Pacific/Auckland", label: "New Zealand Time (NZST)" },
];

interface ExamData {
  title: string;
  subject: string;
  className: string;
  department: string;
  category: "K-12" | "University";
  description: string;
  date: string;
  time: string;
  timezone: string;
  duration: string;
  maxStudents: string;
  registrationDeadline: string;
  registrationTime?: string;
  requirements: string;
  instructions: string;
  passingScore: string;
  allowReview: boolean;
  shuffleQuestions: boolean;
  showResults: boolean;
  timeLimit: boolean;
  mcqs: MCQ[];
}

export default function CreateExamForm({
  onExamCreatedAction,
}: {
  onExamCreatedAction: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState<ExamData>({
    title: "",
    subject: "",
    className: "",
    department: "",
    category: "K-12",
    description: "",
    date: "",
    time: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Auto-detect institution's timezone
    duration: "",
    maxStudents: "",
    registrationDeadline: "",
    registrationTime: "",
    requirements: "",
    instructions: "",
    passingScore: "60",
    allowReview: true,
    shuffleQuestions: false,
    showResults: true,
    timeLimit: true,
    mcqs: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate duration
    const durationNum = Number(examData.duration);
    if (durationNum < 30 || durationNum > 240) {
      setError("Duration must be between 30 and 240 minutes");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(examData),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create exam");
      } else {
        setIsOpen(false);
        setExamData({
          title: "",
          subject: "",
          className: "",
          department: "",
          category: "K-12",
          description: "",
          date: "",
          time: "",
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          duration: "",
          maxStudents: "",
          registrationDeadline: "",
          registrationTime: "",
          requirements: "",
          instructions: "",
          passingScore: "60",
          allowReview: true,
          shuffleQuestions: false,
          showResults: true,
          timeLimit: true,
          mcqs: [],
        });
        if (onExamCreatedAction) onExamCreatedAction();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalPoints = examData.mcqs.reduce((sum, mcq) => sum + mcq.points, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New Exam
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Exam with MCQs</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="mcqs">MCQs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      value={examData.title}
                      onChange={(e) =>
                        setExamData({ ...examData, title: e.target.value })
                      }
                      placeholder="e.g. Computer Science Entrance Exam 2024"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={examData.subject}
                      onValueChange={(value) =>
                        setExamData({ ...examData, subject: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">
                          Computer Science
                        </SelectItem>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="arts">Arts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* New Class field */}
                  <div>
                    <Label htmlFor="className">Class</Label>
                    <Input
                      id="className"
                      value={examData.className}
                      onChange={(e) =>
                        setExamData({ ...examData, className: e.target.value })
                      }
                      placeholder="e.g. SS1, 100 Level, etc."
                      required
                    />
                  </div>
                  {/* New Department field */}
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={examData.department}
                      onChange={(e) =>
                        setExamData({ ...examData, department: e.target.value })
                      }
                      placeholder="e.g. Science, Arts, Engineering, etc."
                      required
                    />
                  </div>
                  {/* Category field */}
                  <div>
                    <Label htmlFor="category">Education Level</Label>
                    <Select
                      value={examData.category}
                      onValueChange={(value: "K-12" | "University") =>
                        setExamData({ ...examData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select education level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="K-12">K-12 (Primary/Secondary School)</SelectItem>
                        <SelectItem value="University">University/College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={examData.description}
                    onChange={(e) =>
                      setExamData({ ...examData, description: e.target.value })
                    }
                    placeholder="Describe the exam content and objectives..."
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instructions">
                    Instructions for Students
                  </Label>
                  <Textarea
                    id="instructions"
                    value={examData.instructions}
                    onChange={(e) =>
                      setExamData({ ...examData, instructions: e.target.value })
                    }
                    placeholder="Provide clear instructions for students taking this exam..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Schedule & Capacity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Exam Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={examData.date}
                      onChange={(e) =>
                        setExamData({ ...examData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Exam Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={examData.time}
                      onChange={(e) =>
                        setExamData({ ...examData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={examData.timezone}
                      onValueChange={(value) =>
                        setExamData({ ...examData, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {commonTimezones.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={examData.duration}
                      onChange={(e) =>
                        setExamData({ ...examData, duration: e.target.value })
                      }
                      placeholder="120"
                      min="30"
                      max="240"
                      required
                    />
                    <span className="text-xs text-gray-500">
                      (30 to 240 minutes)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxStudents">Maximum Students</Label>
                    <Input
                      id="maxStudents"
                      type="number"
                      value={examData.maxStudents}
                      onChange={(e) =>
                        setExamData({
                          ...examData,
                          maxStudents: e.target.value,
                        })
                      }
                      placeholder="500"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label htmlFor="registrationDeadline">
                        Registration Deadline
                      </Label>
                      <Input
                        id="registrationDeadline"
                        type="date"
                        value={examData.registrationDeadline}
                        onChange={(e) =>
                          setExamData({
                            ...examData,
                            registrationDeadline: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor="registrationTime">
                        Registration Time
                      </Label>
                      <Input
                        id="registrationTime"
                        type="time"
                        value={examData.registrationTime || ""}
                        onChange={(e) =>
                          setExamData({
                            ...examData,
                            registrationTime: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="requirements">
                    Requirements (one per line)
                  </Label>
                  <Textarea
                    id="requirements"
                    value={examData.requirements}
                    onChange={(e) =>
                      setExamData({ ...examData, requirements: e.target.value })
                    }
                    placeholder="Senior Secondary Certificate&#10;Mathematics Background&#10;Basic Programming Knowledge"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* MCQs Tab */}
          <TabsContent value="mcqs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage MCQs</CardTitle>
              </CardHeader>
              <CardContent>
                <MCQManager
                  mcqs={examData.mcqs}
                  setMcqs={(newMcqs: MCQ[]) =>
                    setExamData({ ...examData, mcqs: newMcqs })
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Time Limit</Label>
                        <p className="text-sm text-gray-600">
                          Enforce time restrictions
                        </p>
                      </div>
                      <Switch
                        checked={examData.timeLimit}
                        onCheckedChange={(checked) =>
                          setExamData({ ...examData, timeLimit: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Shuffle Questions</Label>
                        <p className="text-sm text-gray-600">
                          Randomize question order
                        </p>
                      </div>
                      <Switch
                        checked={examData.shuffleQuestions}
                        onCheckedChange={(checked) =>
                          setExamData({
                            ...examData,
                            shuffleQuestions: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Allow Review</Label>
                        <p className="text-sm text-gray-600">
                          Students can review answers
                        </p>
                      </div>
                      <Switch
                        checked={examData.allowReview}
                        onCheckedChange={(checked) =>
                          setExamData({ ...examData, allowReview: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Show Results</Label>
                        <p className="text-sm text-gray-600">
                          Display results after submission
                        </p>
                      </div>
                      <Switch
                        checked={examData.showResults}
                        onCheckedChange={(checked) =>
                          setExamData({ ...examData, showResults: checked })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="passingScore">Passing Score (%)</Label>
                      <Input
                        id="passingScore"
                        type="number"
                        value={examData.passingScore}
                        onChange={(e) =>
                          setExamData({
                            ...examData,
                            passingScore: e.target.value,
                          })
                        }
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-2">Exam Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total MCQs:</span>
                          <span className="font-medium">
                            {examData.mcqs.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Points:</span>
                          <span className="font-medium">{totalPoints}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-medium">
                            {examData.duration || 0} minutes
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Max Students:</span>
                          <span className="font-medium">
                            {examData.maxStudents || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preview Tab */}
          <TabsContent value="preview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exam Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">
                      {examData.title || "Untitled Exam"}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {examData.description || "No description provided"}
                    </p>
                    <div className="flex justify-center space-x-4 text-sm text-gray-500">
                      <span>{examData.mcqs.length} MCQs</span>
                      <span>•</span>
                      <span>{totalPoints} points</span>
                      <span>•</span>
                      <span>{examData.duration || 0} minutes</span>
                    </div>
                  </div>

                  {examData.mcqs.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Sample MCQs</h4>
                      {examData.mcqs.slice(0, 3).map((mcq, index) => (
                        <div key={mcq.id} className="border rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-3">
                            <Badge variant="secondary">Q{index + 1}</Badge>
                            <Badge variant="outline">{mcq.points} pts</Badge>
                          </div>
                          <p className="mb-3">{mcq.question}</p>
                          <div className="space-y-2">
                            {mcq.options.map((option, optIndex) => (
                              <div
                                key={optIndex}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="radio"
                                  name={`preview-${mcq.id}`}
                                />
                                <span className="text-sm">
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {examData.mcqs.length > 3 && (
                        <p className="text-center text-gray-500 text-sm">
                          ... and {examData.mcqs.length - 3} more MCQs
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={examData.mcqs.length === 0}>
            <Save className="w-4 h-4 mr-2" />
            Create Exam
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
