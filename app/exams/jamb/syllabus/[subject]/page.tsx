"use client";
import { useState } from "react";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  BookOpen,
  ArrowLeft,
  Clock,
  Target,
  Users,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const syllabusData = {
  "use-of-english": {
    title: "Use of English",
    description: "JAMB Use of English Syllabus 2025",
    topics: [
      "Comprehension/Summary",
      "Lexis and Structure",
      "Oral Forms",
      "Literature",
    ],
    duration: "2 hours",
    questions: 60,
    pdfUrl: "/pdf/ENGLISH LANGUAGE.pdf",
  },
  mathematics: {
    title: "Mathematics",
    description: "JAMB Mathematics Syllabus 2025",
    topics: [
      "Number and Numeration",
      "Algebra",
      "Geometry and Trigonometry",
      "Statistics and Probability",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/GENERAL MATHEMATICS OR MATHEMATICS (CORE).pdf",
  },
  physics: {
    title: "Physics",
    description: "JAMB Physics Syllabus 2025",
    topics: [
      "Mechanics",
      "Thermal Physics",
      "Waves",
      "Electricity and Magnetism",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/PHYSICS.pdf",
  },
  chemistry: {
    title: "Chemistry",
    description: "JAMB Chemistry Syllabus 2025",
    topics: [
      "Physical Chemistry",
      "Inorganic Chemistry",
      "Organic Chemistry",
      "Environmental Chemistry",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/CHEMISTRY.pdf",
  },
  biology: {
    title: "Biology",
    description: "JAMB Biology Syllabus 2025",
    topics: ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/BIOLOGY.pdf",
  },
  economics: {
    title: "Economics",
    description: "JAMB Economics Syllabus 2025",
    topics: [
      "Basic Economic Concepts",
      "Microeconomics",
      "Macroeconomics",
      "International Trade",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/ECONOMICS.pdf",
  },
  geography: {
    title: "Geography",
    description: "JAMB Geography Syllabus 2025",
    topics: [
      "Physical Geography",
      "Human Geography",
      "Regional Geography",
      "Practical Geography",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/GEOGRAPHY.pdf",
  },
  history: {
    title: "History",
    description: "JAMB History Syllabus 2025",
    topics: [
      "Nigerian History",
      "African History",
      "World History",
      "Historical Methods",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/HISTORY.pdf",
  },
  "computer-studies": {
    title: "Computer Studies",
    description: "JAMB Computer Studies Syllabus 2025",
    topics: [
      "Computer Fundamentals",
      "Programming",
      "Data Processing",
      "Computer Applications",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/COMPUTER STUDIES.pdf",
  },
  "literature-in-english": {
    title: "Literature in English",
    description: "JAMB Literature in English Syllabus 2025",
    topics: ["Prose", "Poetry", "Drama", "Literary Appreciation"],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/LITERATURE IN ENGLISH.pdf",
  },
  government: {
    title: "Government",
    description: "JAMB Government Syllabus 2025",
    topics: [
      "Political Concepts",
      "Nigerian Government",
      "International Relations",
      "Political Theory",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/GOVERNMENT.pdf",
  },
  "agricultural-science": {
    title: "Agricultural Science",
    description: "JAMB Agricultural Science Syllabus 2025",
    topics: [
      "Crop Production",
      "Animal Production",
      "Agricultural Economics",
      "Agricultural Technology",
    ],
    duration: "2 hours",
    questions: 50,
    pdfUrl: "/pdf/AGRICULTURAL SCIENCE.pdf",
  },
};

export default function JambSyllabusPage({
  params,
}: {
  params: { subject: string };
}) {
  const subjectData = syllabusData[params.subject as keyof typeof syllabusData];

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Exams" />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Subject Not Found
            </h1>
            <Link href="/exams/jamb">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to JAMB Exams
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/exams/jamb">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to JAMB Exams
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {subjectData.title}
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {subjectData.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                      Syllabus Overview
                    </h2>
                    <p className="text-gray-600">
                      Complete coverage for JAMB 2025
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Main Topics Covered
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjectData.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-700 font-medium">
                            {topic}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Exam Format
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Duration</div>
                        <div className="font-semibold text-gray-800">
                          {subjectData.duration}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Questions</div>
                        <div className="font-semibold text-gray-800">
                          {subjectData.questions}
                        </div>
                      </div>
                      <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-600">Format</div>
                        <div className="font-semibold text-gray-800">
                          Multiple Choice
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                      Study Tips
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>
                          Review all topics thoroughly before the exam
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Practice with past questions and mock exams</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>
                          Focus on understanding concepts rather than
                          memorization
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>
                          Manage your time effectively during the exam
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>Read questions carefully before answering</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Download Card */}
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Download Syllabus
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Get the complete official syllabus in PDF format
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold"
                  >
                    <a
                      href={subjectData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/exams/jamb">
                      <Target className="w-4 h-4 mr-2" />
                      Practice Questions
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/exams/jamb">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Mock Exams
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/quiz">
                      <Target className="w-4 h-4 mr-2" />
                      Take Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Exam Info */}
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Exam Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Exam Type:</span>
                    <Badge className="bg-emerald-100 text-emerald-700">
                      JAMB UTME
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{subjectData.duration}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Questions:</span>
                    <span className="font-medium">{subjectData.questions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">Multiple Choice</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
