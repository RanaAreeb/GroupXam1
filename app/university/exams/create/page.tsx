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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Save,
  Calendar,
  Clock,
  Users,
  Settings,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
  type: "multiple-choice" | "true-false" | "short-answer";
}

export default function CreateExamPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [examData, setExamData] = useState({
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
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
    type: "multiple-choice",
  });

  const addQuestion = () => {
    if (currentQuestion.question.trim()) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString(),
      };
      setQuestions([...questions, newQuestion]);
      setCurrentQuestion({
        id: "",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
        type: "multiple-choice",
      });
    }
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestionOption = (
    questionId: string,
    optionIndex: number,
    value: string
  ) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const saveExam = () => {
    console.log("Saving exam:", { examData, questions });
    // Handle exam saving
  };

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/university/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Create New Exam
                </h1>
                <p className="text-sm text-gray-600">
                  Design and configure your exam
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={saveExam}>
                <Save className="w-4 h-4 mr-2" />
                Save Exam
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
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
                            <SelectItem value="engineering">
                              Engineering
                            </SelectItem>
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
                          setExamData({
                            ...examData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the exam content and objectives..."
                        rows={3}
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
                          setExamData({
                            ...examData,
                            instructions: e.target.value,
                          })
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
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={examData.duration}
                          onChange={(e) =>
                            setExamData({
                              ...examData,
                              duration: e.target.value,
                            })
                          }
                          placeholder="120"
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
                          setExamData({
                            ...examData,
                            requirements: e.target.value,
                          })
                        }
                        placeholder="Senior Secondary Certificate&#10;Mathematics Background&#10;Basic Programming Knowledge"
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Questions Tab */}
              <TabsContent value="questions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        value={currentQuestion.question}
                        onChange={(e) =>
                          setCurrentQuestion({
                            ...currentQuestion,
                            question: e.target.value,
                          })
                        }
                        placeholder="Enter your question here..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="questionType">Question Type</Label>
                        <Select
                          value={currentQuestion.type}
                          onValueChange={(value: any) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="multiple-choice">
                              Multiple Choice
                            </SelectItem>
                            <SelectItem value="true-false">
                              True/False
                            </SelectItem>
                            <SelectItem value="short-answer">
                              Short Answer
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="points">Points</Label>
                        <Input
                          id="points"
                          type="number"
                          value={currentQuestion.points}
                          onChange={(e) =>
                            setCurrentQuestion({
                              ...currentQuestion,
                              points: parseInt(e.target.value) || 1,
                            })
                          }
                          min="1"
                        />
                      </div>
                    </div>

                    {currentQuestion.type === "multiple-choice" && (
                      <div className="space-y-4">
                        <Label>Options</Label>
                        {currentQuestion.options.map((option, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="radio"
                              name="correctAnswer"
                              checked={currentQuestion.correctAnswer === index}
                              onChange={() =>
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  correctAnswer: index,
                                })
                              }
                            />
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...currentQuestion.options];
                                newOptions[index] = e.target.value;
                                setCurrentQuestion({
                                  ...currentQuestion,
                                  options: newOptions,
                                });
                              }}
                              placeholder={`Option ${index + 1}`}
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      onClick={addQuestion}
                      disabled={!currentQuestion.question.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>

                {/* Questions List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Questions ({questions.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary">Q{index + 1}</Badge>
                              <Badge variant="outline">
                                {question.points} pts
                              </Badge>
                              <Badge variant="outline">{question.type}</Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm font-medium mb-2">
                            {question.question}
                          </p>
                          {question.type === "multiple-choice" && (
                            <div className="space-y-1">
                              {question.options.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                      optIndex === question.correctAnswer
                                        ? "bg-green-100 border-green-500"
                                        : "bg-gray-100"
                                    }`}
                                  >
                                    {optIndex === question.correctAnswer && (
                                      <CheckCircle className="w-3 h-3 text-green-600" />
                                    )}
                                  </span>
                                  <span
                                    className={
                                      optIndex === question.correctAnswer
                                        ? "font-medium"
                                        : ""
                                    }
                                  >
                                    {option}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
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
                          <Label htmlFor="passingScore">
                            Passing Score (%)
                          </Label>
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
                              <span>Total Questions:</span>
                              <span className="font-medium">
                                {questions.length}
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
                          <span>{questions.length} questions</span>
                          <span>•</span>
                          <span>{totalPoints} points</span>
                          <span>•</span>
                          <span>{examData.duration || 0} minutes</span>
                        </div>
                      </div>

                      {questions.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-medium">Sample Questions</h4>
                          {questions.slice(0, 3).map((question, index) => (
                            <div
                              key={question.id}
                              className="border rounded-lg p-4"
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <Badge variant="secondary">Q{index + 1}</Badge>
                                <Badge variant="outline">
                                  {question.points} pts
                                </Badge>
                              </div>
                              <p className="mb-3">{question.question}</p>
                              {question.type === "multiple-choice" && (
                                <div className="space-y-2">
                                  {question.options.map((option, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className="flex items-center space-x-2"
                                    >
                                      <input
                                        type="radio"
                                        name={`preview-${question.id}`}
                                      />
                                      <span className="text-sm">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                          {questions.length > 3 && (
                            <p className="text-center text-gray-500 text-sm">
                              ... and {questions.length - 3} more questions
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Questions</span>
                  <Badge variant="secondary">{questions.length}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Points</span>
                  <Badge variant="secondary">{totalPoints}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <Badge variant="secondary">{examData.duration || 0}m</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Max Students</span>
                  <Badge variant="secondary">{examData.maxStudents || 0}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline">
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="w-full" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Exam
                </Button>
                <Button className="w-full" onClick={saveExam}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Publish Exam
                </Button>
              </CardContent>
            </Card>

            {questions.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <p className="text-sm text-gray-600">
                    No questions added yet
                  </p>
                  <p className="text-xs text-gray-500">
                    Add questions to complete your exam
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
