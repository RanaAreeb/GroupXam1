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

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  explanation?: string;
}

interface ExamData {
  title: string;
  subject: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  maxStudents: string;
  registrationDeadline: string;
  requirements: string;
  instructions: string;
  passingScore: string;
  allowReview: boolean;
  shuffleQuestions: boolean;
  showResults: boolean;
  timeLimit: boolean;
  mcqs: MCQ[];
}

export default function CreateExamForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState<ExamData>({
    title: "",
    subject: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    maxStudents: "",
    registrationDeadline: "",
    requirements: "",
    instructions: "",
    passingScore: "60",
    allowReview: true,
    shuffleQuestions: false,
    showResults: true,
    timeLimit: true,
    mcqs: [],
  });

  const [currentMCQ, setCurrentMCQ] = useState<MCQ>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
    explanation: "",
  });

  const addMCQ = () => {
    if (
      currentMCQ.question.trim() &&
      currentMCQ.options.every((opt) => opt.trim())
    ) {
      const newMCQ = {
        ...currentMCQ,
        id: Date.now().toString(),
      };
      setExamData({
        ...examData,
        mcqs: [...examData.mcqs, newMCQ],
      });
      setCurrentMCQ({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
        explanation: "",
      });
    }
  };

  const removeMCQ = (id: string) => {
    setExamData({
      ...examData,
      mcqs: examData.mcqs.filter((mcq) => mcq.id !== id),
    });
  };

  const updateMCQOption = (
    mcqId: string,
    optionIndex: number,
    value: string
  ) => {
    setExamData({
      ...examData,
      mcqs: examData.mcqs.map((mcq) => {
        if (mcq.id === mcqId) {
          const newOptions = [...mcq.options];
          newOptions[optionIndex] = value;
          return { ...mcq, options: newOptions };
        }
        return mcq;
      }),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating exam with MCQs:", examData);
    setIsOpen(false);
    // Reset form
    setExamData({
      title: "",
      subject: "",
      description: "",
      date: "",
      time: "",
      duration: "",
      maxStudents: "",
      registrationDeadline: "",
      requirements: "",
      instructions: "",
      passingScore: "60",
      allowReview: true,
      shuffleQuestions: false,
      showResults: true,
      timeLimit: true,
      mcqs: [],
    });
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={examData.duration}
                      onChange={(e) =>
                        setExamData({ ...examData, duration: e.target.value })
                      }
                      placeholder="120"
                      required
                    />
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
                  <div>
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
                <CardTitle>Add MCQ Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={currentMCQ.question}
                    onChange={(e) =>
                      setCurrentMCQ({ ...currentMCQ, question: e.target.value })
                    }
                    placeholder="Enter your MCQ question here..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      value={currentMCQ.points}
                      onChange={(e) =>
                        setCurrentMCQ({
                          ...currentMCQ,
                          points: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="explanation">Explanation (Optional)</Label>
                    <Input
                      id="explanation"
                      value={currentMCQ.explanation}
                      onChange={(e) =>
                        setCurrentMCQ({
                          ...currentMCQ,
                          explanation: e.target.value,
                        })
                      }
                      placeholder="Explain the correct answer..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Options</Label>
                  {currentMCQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentMCQ.correctAnswer === index}
                        onChange={() =>
                          setCurrentMCQ({ ...currentMCQ, correctAnswer: index })
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...currentMCQ.options];
                          newOptions[index] = e.target.value;
                          setCurrentMCQ({ ...currentMCQ, options: newOptions });
                        }}
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={addMCQ}
                  disabled={
                    !currentMCQ.question.trim() ||
                    currentMCQ.options.some((opt) => !opt.trim())
                  }
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCQ
                </Button>
              </CardContent>
            </Card>

            {/* MCQs List */}
            <Card>
              <CardHeader>
                <CardTitle>MCQ Questions ({examData.mcqs.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {examData.mcqs.map((mcq, index) => (
                    <div key={mcq.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">Q{index + 1}</Badge>
                          <Badge variant="outline">{mcq.points} pts</Badge>
                          <Badge variant="outline">MCQ</Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMCQ(mcq.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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

                {examData.mcqs.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium mb-2">
                      No MCQs added yet
                    </h3>
                    <p>Add MCQ questions to create your exam</p>
                  </div>
                )}
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
