"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const [step, setStep] = useState(1);
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
          setSuccess(
            "Account created successfully! Redirecting to dashboard..."
          );
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
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
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                groupXam
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 ? "Create Your Account" : "Choose Your Subjects"}
            </h1>
            <p className="text-gray-600">
              {step === 1
                ? "Start your journey to academic excellence"
                : "Select 3-5 subjects you want to focus on"}
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-700 text-sm">{success}</span>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
              </div>
              <div
                className={`w-16 h-1 ${
                  step >= 2 ? "bg-emerald-500" : "bg-gray-200"
                }`}
              ></div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                2
              </div>
            </div>
          </div>

          {/* Form Card */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
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

              {step === 1 && (
                <div className="mt-8 text-center">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
