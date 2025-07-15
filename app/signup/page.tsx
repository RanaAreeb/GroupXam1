"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Target,
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Shield,
  Award,
  School,
  Users,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

interface Subject {
  id: string;
  name: string;
  category: string;
  icon: string;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  selectedSubjects: string[];
}

interface InstitutionData {
  institutionName: string;
  institutionType: string;
  subcategory: string;
  adminName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  website: string;
  description: string;
  studentCount: string;
  establishedYear: string;
}

// Institution subcategories
const institutionSubcategories = {
  "K-12": [
    "Primary School",
    "Secondary School",
    "High School",
    "International School",
    "Charter School",
    "Private School",
    "Public School",
  ],
  "University & College": [
    "Public University",
    "Private University",
    "Community College",
    "Technical College",
    "Medical School",
    "Law School",
    "Business School",
    "Engineering School",
    "Arts & Design School",
  ],
  "Pre-employment": [
    "Training Institute",
    "Vocational School",
    "Skill Development Center",
    "Career Training Center",
    "Professional Development Institute",
    "Corporate Training Center",
  ],
  "Compliance assessments": [
    "Certification Body",
    "Accreditation Agency",
    "Regulatory Authority",
    "Professional Association",
    "Industry Standards Organization",
    "Quality Assurance Institute",
  ],
  "Professional certifications": [
    "Certification Institute",
    "Professional Training Center",
    "Skill Assessment Center",
    "Industry Certification Body",
    "Professional Development Organization",
    "Continuing Education Provider",
  ],
};

const subjects: Subject[] = [
  { id: "physics", name: "Physics", category: "Sciences", icon: "⚛️" },
  { id: "chemistry", name: "Chemistry", category: "Sciences", icon: "🧪" },
  {
    id: "organic-chemistry",
    name: "Organic Chemistry",
    category: "Sciences",
    icon: "🔬",
  },
  {
    id: "microbiology",
    name: "Microbiology",
    category: "Sciences",
    icon: "🦠",
  },
  { id: "anatomy", name: "Anatomy", category: "Sciences", icon: "🫀" },
  { id: "physiology", name: "Physiology", category: "Sciences", icon: "🫁" },
  { id: "biology", name: "Biology", category: "Sciences", icon: "🧬" },
  {
    id: "biochemistry",
    name: "Biochemistry",
    category: "Sciences",
    icon: "🧬",
  },
  {
    id: "pharmacology",
    name: "Pharmacology",
    category: "Sciences",
    icon: "💊",
  },
  { id: "ecology", name: "Ecology", category: "Sciences", icon: "🌿" },
  {
    id: "psychology",
    name: "Psychology",
    category: "Social Sciences",
    icon: "🧠",
  },
  {
    id: "mathematics",
    name: "Mathematics",
    category: "Mathematics",
    icon: "📐",
  },
  { id: "economic", name: "Economic", category: "Economics", icon: "📊" },
  {
    id: "micro-economics",
    name: "Micro Economics",
    category: "Economics",
    icon: "📈",
  },
  {
    id: "macro-economics",
    name: "Macro Economics",
    category: "Economics",
    icon: "📉",
  },
  { id: "accounting", name: "Accounting", category: "Economics", icon: "💰" },
  { id: "finance", name: "Finance", category: "Economics", icon: "💳" },
  {
    id: "political-science",
    name: "Political Science",
    category: "Social Sciences",
    icon: "🏛️",
  },
];

export default function SignupPage() {
  const [role, setRole] = useState<"student" | "university">("student");
  const [step, setStep] = useState(1);
  const [institutionStep, setInstitutionStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    selectedSubjects: [],
  });
  const [institutionData, setInstitutionData] = useState<InstitutionData>({
    institutionName: "",
    institutionType: "",
    subcategory: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    studentCount: "",
    establishedYear: "",
  });

  const handleSubjectToggle = (subjectId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subjectId)
        ? prev.selectedSubjects.filter((id) => id !== subjectId)
        : [...prev.selectedSubjects, subjectId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          if (data.requiresVerification) {
            setSuccess(
              "Account created successfully! Please check your email for verification code."
            );
            setTimeout(() => {
              window.location.href = `/verify?email=${encodeURIComponent(
                formData.email
              )}`;
            }, 2000);
          } else {
            setSuccess(
              "Account created successfully! Redirecting to dashboard..."
            );
            setTimeout(() => {
              window.location.href = "/";
            }, 2000);
          }
        } else {
          setError(data.error || "Signup failed. Please try again.");
        }
      } catch (err) {
        setError("Network error. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInstitutionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (institutionStep < 3) {
      setInstitutionStep(institutionStep + 1);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    if (institutionData.password !== institutionData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "university",
          institutionName: institutionData.institutionName,
          institutionType: institutionData.institutionType,
          subcategory: institutionData.subcategory,
          adminName: institutionData.adminName,
          email: institutionData.email,
          password: institutionData.password,
          phone: institutionData.phone,
          address: institutionData.address,
          website: institutionData.website,
          description: institutionData.description,
          studentCount: institutionData.studentCount,
          establishedYear: institutionData.establishedYear,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.requiresVerification) {
          setSuccess(
            "Institution account created! Please check your email for verification code."
          );
          setTimeout(() => {
            window.location.href = `/verify?email=${encodeURIComponent(
              institutionData.email
            )}`;
          }, 2000);
        } else {
          setSuccess(
            "Institution account created! Redirecting to dashboard..."
          );
          setTimeout(() => {
            window.location.href = "/university/dashboard";
          }, 2000);
        }
      } else {
        setError(data.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "50,000+ WAEC practice questions",
    "Personalized study recommendations",
    "Real-time progress tracking",
    "Interactive flashcards",
    "Community support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Image
                src="/logo.png"
                alt="groupXam logo"
                width={220}
                height={220}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {role === "student"
                ? step === 1
                  ? "Create Your Account"
                  : "Choose Your Subjects"
                : institutionStep === 1
                ? "Institution Registration"
                : institutionStep === 2
                ? "Contact Information"
                : "Complete Registration"}
            </h1>
            <p className="text-gray-600">
              {role === "student"
                ? step === 1
                  ? "Start your journey to academic excellence"
                  : "Select 3-5 subjects you want to focus on"
                : institutionStep === 1
                ? "Register your institution to schedule exams and manage students"
                : institutionStep === 2
                ? "Provide your institution's contact details"
                : "Complete your institution profile and create account"}
            </p>
          </div>

          {/* Role Tabs */}
          <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-200">
            <button
              className={`flex-1 py-2 px-4 font-semibold transition-colors ${
                role === "student"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setRole("student")}
              type="button"
            >
              Student
            </button>
            <button
              className={`flex-1 py-2 px-4 font-semibold transition-colors ${
                role === "university"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => setRole("university")}
              type="button"
            >
              Institution
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (role === "student" && step >= 1) ||
                  (role === "university" && institutionStep >= 1)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {(role === "student" && step > 1) ||
                (role === "university" && institutionStep > 1) ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  "1"
                )}
              </div>
              <div
                className={`w-16 h-1 ${
                  (role === "student" && step >= 2) ||
                  (role === "university" && institutionStep >= 2)
                    ? "bg-emerald-500"
                    : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  (role === "student" && step >= 2) ||
                  (role === "university" && institutionStep >= 2)
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {role === "university" ? (
                  institutionStep >= 3 ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    "2"
                  )
                ) : (
                  "2"
                )}
              </div>
              {role === "university" && (
                <>
                  <div
                    className={`w-16 h-1 ${
                      institutionStep >= 3 ? "bg-emerald-500" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      institutionStep >= 3
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {institutionStep >= 3 ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      "3"
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Student Signup Form */}
          {role === "student" && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="pl-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="pl-11 pr-11 h-12 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" required disabled={isLoading} />
                    <Label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isLoading}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-3">
                      {subjects.map((subject) => (
                        <div
                          key={subject.id}
                          className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            formData.selectedSubjects.includes(subject.id)
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Checkbox
                            id={subject.id}
                            checked={formData.selectedSubjects.includes(
                              subject.id
                            )}
                            onCheckedChange={() =>
                              handleSubjectToggle(subject.id)
                            }
                            disabled={isLoading}
                          />
                          <div className="text-2xl">{subject.icon}</div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">
                              {subject.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {subject.category}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-emerald-700">
                      <Target className="w-5 h-5" />
                      <span className="font-medium">
                        Selected: {formData.selectedSubjects.length} subjects
                      </span>
                    </div>
                    <p className="text-sm text-emerald-600 mt-1">
                      Choose at least 3 subjects to continue
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                      className="flex-1 h-12 border-gray-200"
                      disabled={isLoading}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        formData.selectedSubjects.length < 3 || isLoading
                      }
                      className="flex-1 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Creating...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* Institution Signup Form */}
          {role === "university" && (
            <form onSubmit={handleInstitutionSubmit} className="space-y-5">
              {/* Step 1: Basic Information */}
              {institutionStep === 1 && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Step 1: Institution Type
                    </h2>
                    <p className="text-gray-600">
                      Select your institution category and type
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="institutionType">
                        Institution Category
                      </Label>
                      <Select
                        value={institutionData.institutionType}
                        onValueChange={(value) =>
                          setInstitutionData({
                            ...institutionData,
                            institutionType: value,
                            subcategory: "", // Reset subcategory when type changes
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select institution category" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(institutionSubcategories).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {institutionData.institutionType && (
                      <div>
                        <Label htmlFor="subcategory">Institution Type</Label>
                        <Select
                          value={institutionData.subcategory}
                          onValueChange={(value) =>
                            setInstitutionData({
                              ...institutionData,
                              subcategory: value,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select institution type" />
                          </SelectTrigger>
                          <SelectContent>
                            {institutionSubcategories[
                              institutionData.institutionType as keyof typeof institutionSubcategories
                            ]?.map((sub) => (
                              <SelectItem key={sub} value={sub}>
                                {sub}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="institutionName">Institution Name</Label>
                      <Input
                        id="institutionName"
                        type="text"
                        required
                        value={institutionData.institutionName}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            institutionName: e.target.value,
                          })
                        }
                        placeholder="e.g. University of Lagos"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Contact Information */}
              {institutionStep === 2 && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Step 2: Contact Information
                    </h2>
                    <p className="text-gray-600">
                      Provide your institution's contact details
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="adminName">Admin Name</Label>
                      <Input
                        id="adminName"
                        type="text"
                        required
                        value={institutionData.adminName}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            adminName: e.target.value,
                          })
                        }
                        placeholder="e.g. Dr. John Doe"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={institutionData.email}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            email: e.target.value,
                          })
                        }
                        placeholder="admin@institution.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={institutionData.phone}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="+234 123 456 7890"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website (Optional)</Label>
                      <Input
                        id="website"
                        type="url"
                        value={institutionData.website}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            website: e.target.value,
                          })
                        }
                        placeholder="https://www.institution.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        value={institutionData.address}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            address: e.target.value,
                          })
                        }
                        placeholder="Enter your institution's address"
                        rows={3}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Additional Information & Security */}
              {institutionStep === 3 && (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      Step 3: Additional Information
                    </h2>
                    <p className="text-gray-600">
                      Complete your institution profile
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="studentCount">Number of Students</Label>
                        <Input
                          id="studentCount"
                          type="number"
                          value={institutionData.studentCount}
                          onChange={(e) =>
                            setInstitutionData({
                              ...institutionData,
                              studentCount: e.target.value,
                            })
                          }
                          placeholder="e.g. 5000"
                        />
                      </div>

                      <div>
                        <Label htmlFor="establishedYear">
                          Established Year
                        </Label>
                        <Input
                          id="establishedYear"
                          type="number"
                          value={institutionData.establishedYear}
                          onChange={(e) =>
                            setInstitutionData({
                              ...institutionData,
                              establishedYear: e.target.value,
                            })
                          }
                          placeholder="e.g. 1962"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">
                        Institution Description
                      </Label>
                      <Textarea
                        id="description"
                        value={institutionData.description}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Brief description of your institution..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        required
                        value={institutionData.password}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Create a strong password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        required
                        value={institutionData.confirmPassword}
                        onChange={(e) =>
                          setInstitutionData({
                            ...institutionData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-4">
                {institutionStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInstitutionStep(institutionStep - 1)}
                    className="flex-1"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                )}

                <Button
                  type="submit"
                  className="flex-1"
                  disabled={
                    isLoading ||
                    (institutionStep === 1 &&
                      (!institutionData.institutionType ||
                        !institutionData.subcategory ||
                        !institutionData.institutionName))
                  }
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {institutionStep === 3
                        ? "Creating Account..."
                        : "Loading..."}
                    </div>
                  ) : institutionStep === 3 ? (
                    "Create Institution Account"
                  ) : (
                    <>
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-emerald-500 to-blue-500 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white max-w-md">
          <h2 className="text-4xl font-bold mb-6">Start Your Success Story</h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of students who have transformed their academic
            performance with groupXam
          </p>

          <div className="space-y-4 mb-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-emerald-100">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">50K+</div>
              <div className="text-emerald-200 text-sm">Questions</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">95%</div>
              <div className="text-emerald-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-emerald-200 text-sm">Students</div>
            </div>
          </div>

          <div className="p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">K</span>
              </div>
              <div>
                <div className="font-semibold">Kemi S.</div>
                <div className="text-emerald-200 text-sm">
                  WAEC 2023 - 7 A's
                </div>
              </div>
            </div>
            <p className="text-emerald-100 italic">
              "The personalized study plan helped me focus on my weak areas.
              Highly recommended!"
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-white/10 rounded-full"></div>
      </div>
    </div>
  );
}
