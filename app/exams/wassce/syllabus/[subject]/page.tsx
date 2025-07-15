"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, FileText } from "lucide-react";
import AppHeader from "@/components/ui/app-header";

const syllabusFiles = {
  economics: "/pdf/ECONOMICS.pdf",
  "english-language": "/pdf/ENGLISH LANGUAGE.pdf",
  geography: "/pdf/GEOGRAPHY.pdf",
  "general-mathematics": "/pdf/GENERAL MATHEMATICS OR MATHEMATICS (CORE).pdf",
  "further-mathematics":
    "/pdf/FURTHER MATHEMATICS OR MATHEMATICS (ELECTIVE).pdf",
  history: "/pdf/HISTORY.pdf",
  "computer-studies": "/pdf/COMPUTER STUDIES.pdf",
  physics: "/pdf/PHYSICS.pdf",
  "literature-in-english": "/pdf/LITERATURE IN ENGLISH.pdf",
  chemistry: "/pdf/CHEMISTRY.pdf",
  biology: "/pdf/BIOLOGY.pdf",
};

const subjectNames = {
  economics: "Economics",
  "english-language": "English Language",
  geography: "Geography",
  "general-mathematics": "General Mathematics",
  "further-mathematics": "Further Mathematics",
  history: "History",
  "computer-studies": "Computer Studies",
  physics: "Physics",
  "literature-in-english": "Literature in English",
  chemistry: "Chemistry",
  biology: "Biology",
};

export default function SyllabusPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subject = params?.subject as string;
  const pdfUrl = syllabusFiles[subject as keyof typeof syllabusFiles];
  const subjectName = subjectNames[subject as keyof typeof subjectNames];

  useEffect(() => {
    if (!pdfUrl) {
      setError("Syllabus not found");
      setLoading(false);
      return;
    }

    // Check if PDF exists
    fetch(pdfUrl, { method: "HEAD" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("PDF not found");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Syllabus PDF not available");
        setLoading(false);
      });
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${subjectName} Syllabus.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBack = () => {
    router.push("/exams/wassce");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Exams" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading syllabus...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Exams" />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <FileText className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Syllabus Not Available
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button
              onClick={handleBack}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Back to WASSCE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to WASSCE
          </Button>

          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800">
              {subjectName} Syllabus
            </h1>
            <p className="text-lg text-gray-600">
              WASSCE {subjectName} Syllabus 2025
            </p>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-emerald-600" />
              <span className="font-semibold text-gray-800">
                {subjectName} Syllabus
              </span>
            </div>
            <Button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
          </div>

          <div className="h-[80vh] w-full">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full border-0"
              title={`${subjectName} Syllabus`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
