"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User, School, Hash, GraduationCap } from "lucide-react";

interface StudentInfo {
  studentName: string;
  studentRollNumber: string;
  studentInstitution: string;
  studentClass: string;
  studentCategory: "K-12" | "University";
}

interface StudentInfoFormProps {
  onSubmit: (studentInfo: StudentInfo) => void;
  examTitle?: string;
  examCategory?: "K-12" | "University";
}

export default function StudentInfoForm({ 
  onSubmit, 
  examTitle,
  examCategory 
}: StudentInfoFormProps) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    studentName: "",
    studentRollNumber: "",
    studentInstitution: "",
    studentClass: "",
    studentCategory: examCategory || "K-12",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!studentInfo.studentName.trim()) {
      newErrors.studentName = "Name is required";
    }
    
    if (!studentInfo.studentRollNumber.trim()) {
      newErrors.studentRollNumber = "Roll number is required";
    }
    
    if (!studentInfo.studentInstitution.trim()) {
      newErrors.studentInstitution = "Institution name is required";
    }
    
    if (!studentInfo.studentClass.trim()) {
      newErrors.studentClass = "Class is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(studentInfo);
    }
  };

  const handleInputChange = (field: keyof StudentInfo, value: string) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white shadow-2xl border-0 overflow-hidden">
        <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white relative">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Student Information
            </CardTitle>
            {examTitle && (
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 mt-4">
                <p className="text-sm text-white/90">
                  Required before taking:
                </p>
                <p className="font-semibold text-lg text-white">{examTitle}</p>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentName" className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                Full Name *
              </Label>
              <Input
                id="studentName"
                value={studentInfo.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Enter your full name"
                className={`h-12 transition-all duration-200 ${
                  errors.studentName 
                    ? "border-red-500 bg-red-50 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.studentName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentRollNumber" className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Hash className="w-4 h-4 text-green-600" />
                </div>
                Roll Number / Student ID *
              </Label>
              <Input
                id="studentRollNumber"
                value={studentInfo.studentRollNumber}
                onChange={(e) => handleInputChange("studentRollNumber", e.target.value)}
                placeholder="e.g., 2024/CS/001 or ST12345"
                className={`h-12 transition-all duration-200 ${
                  errors.studentRollNumber 
                    ? "border-red-500 bg-red-50 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.studentRollNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentRollNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentInstitution" className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <School className="w-4 h-4 text-purple-600" />
                </div>
                Institution Name *
              </Label>
              <Input
                id="studentInstitution"
                value={studentInfo.studentInstitution}
                onChange={(e) => handleInputChange("studentInstitution", e.target.value)}
                placeholder="e.g., Harvard University or Lincoln High School"
                className={`h-12 transition-all duration-200 ${
                  errors.studentInstitution 
                    ? "border-red-500 bg-red-50 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.studentInstitution && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentInstitution}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentClass" className="flex items-center gap-2 text-gray-700 font-medium">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                </div>
                Class / Grade *
              </Label>
              <Input
                id="studentClass"
                value={studentInfo.studentClass}
                onChange={(e) => handleInputChange("studentClass", e.target.value)}
                placeholder={
                  studentInfo.studentCategory === "K-12" 
                    ? "e.g., Grade 12, SS3, Year 11" 
                    : "e.g., Freshman, 2nd Year, Final Year"
                }
                className={`h-12 transition-all duration-200 ${
                  errors.studentClass 
                    ? "border-red-500 bg-red-50 focus:border-red-500" 
                    : "border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                }`}
              />
              {errors.studentClass && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentClass}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentCategory" className="text-gray-700 font-medium">Education Level</Label>
              <Select
                value={studentInfo.studentCategory}
                onValueChange={(value: "K-12" | "University") =>
                  handleInputChange("studentCategory", value)
                }
                disabled={!!examCategory} // Disable if exam category is predefined
              >
                <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K-12">K-12 (Primary/Secondary School)</SelectItem>
                  <SelectItem value="University">University/College</SelectItem>
                </SelectContent>
              </Select>
              {examCategory && (
                <p className="text-xs text-blue-600 mt-1 bg-blue-50 p-2 rounded-lg">
                  ℹ️ This exam is for {examCategory} students only
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]">
                Continue to Exam →
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
