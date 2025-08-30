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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border border-border">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold text-card-foreground">
            Student Information
          </CardTitle>
          {examTitle && (
            <p className="text-sm text-gray-600">
              Required before taking: <span className="font-medium">{examTitle}</span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="studentName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="studentName"
                value={studentInfo.studentName}
                onChange={(e) => handleInputChange("studentName", e.target.value)}
                placeholder="Enter your full name"
                className={errors.studentName ? "border-red-500" : ""}
              />
              {errors.studentName && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="studentRollNumber" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                Roll Number / Student ID *
              </Label>
              <Input
                id="studentRollNumber"
                value={studentInfo.studentRollNumber}
                onChange={(e) => handleInputChange("studentRollNumber", e.target.value)}
                placeholder="e.g., 2024/CS/001 or ST12345"
                className={errors.studentRollNumber ? "border-red-500" : ""}
              />
              {errors.studentRollNumber && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentRollNumber}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="studentInstitution" className="flex items-center gap-2">
                <School className="w-4 h-4" />
                Institution Name *
              </Label>
              <Input
                id="studentInstitution"
                value={studentInfo.studentInstitution}
                onChange={(e) => handleInputChange("studentInstitution", e.target.value)}
                placeholder="e.g., Harvard University or Lincoln High School"
                className={errors.studentInstitution ? "border-red-500" : ""}
              />
              {errors.studentInstitution && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentInstitution}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="studentClass" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
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
                className={errors.studentClass ? "border-red-500" : ""}
              />
              {errors.studentClass && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.studentClass}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="studentCategory">Education Level</Label>
              <Select
                value={studentInfo.studentCategory}
                onValueChange={(value: "K-12" | "University") =>
                  handleInputChange("studentCategory", value)
                }
                disabled={!!examCategory} // Disable if exam category is predefined
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="K-12">K-12 (Primary/Secondary School)</SelectItem>
                  <SelectItem value="University">University/College</SelectItem>
                </SelectContent>
              </Select>
              {examCategory && (
                <p className="text-xs text-gray-500 mt-1">
                  This exam is for {examCategory} students only
                </p>
              )}
            </div>

            <Button type="submit" className="w-full mt-6">
              Continue to Exam
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
