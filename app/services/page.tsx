"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Eye,
  GraduationCap,
  Building,
  MapPin,
  CalendarDays,
  Timer,
  UserCheck,
  Award,
  Download,
  FileText,
  Mail,
  Phone,
  User,
  ArrowRight,
  Target,
  Brain,
  MessageSquare,
  Star,
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";

interface Assessment {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  universityName?: string;
  date: string;
  time: string;
  duration?: number;
  description?: string;
  maxStudents?: number;
  registrationDeadline?: string;
  registrationTime?: string;
}

interface RegistrationForm {
  name: string;
  email: string;
  phone: string;
  regNo: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  parentName: string;
  parentPhone: string;
}

interface RollNumberSlip {
  examId: string;
  examTitle: string;
  studentName: string;
  rollNumber: string;
  examDate: string;
  examTime: string;
  examCenter: string;
  instructions: string;
}

export default function ServicesPage() {
  const { isLoggedIn, user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]);
  const [submittedExams, setSubmittedExams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Registration form state
  const [showRegistrationForm, setShowRegistrationForm] = useState<
    string | null
  >(null);
  const [registrationForm, setRegistrationForm] = useState<RegistrationForm>({
    name: "",
    email: "",
    phone: "",
    regNo: "",
    address: "",
    dateOfBirth: "",
    gender: "",
    parentName: "",
    parentPhone: "",
  });
  const [rollNumberSlip, setRollNumberSlip] = useState<RollNumberSlip | null>(
    null
  );

  // Animated counters
  const [totalExams, setTotalExams] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalUniversities, setTotalUniversities] = useState(0);

  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);

  const fetchRegistrations = async () => {
    if (isLoggedIn && user?.role === "student") {
      try {
        const regRes = await fetch("/api/exams/submissions");
        const regData = await regRes.json();
        const regExamIds = Array.isArray(regData)
          ? regData
              .filter((r) => r.studentEmail === user.email)
              .map((r) => r.examId)
          : [];
        setRegistrations(regExamIds);
        setTotalStudents(regExamIds.length);
        // Track submitted exams
        const submittedIds = Array.isArray(regData)
          ? regData
              .filter(
                (r) => r.studentEmail === user.email && r.status === "submitted"
              )
              .map((r) => r.examId)
          : [];
        setSubmittedExams(submittedIds);
      } catch (error) {
        setRegistrations([]);
        setSubmittedExams([]);
        setTotalStudents(0);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/exams");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        const exams = Array.isArray(data) ? data : [];
        setAssessments(exams);
        setTotalExams(exams.length);
        setTotalUniversities(new Set(exams.map((a) => a.universityName)).size);
        await fetchRegistrations(); // Ensure this is awaited before setting loading to false
      } catch (error) {
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isLoggedIn, user]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        fetchRegistrations();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    // Add interval to auto-refresh registrations/submissions every 30 seconds
    const interval = setInterval(() => {
      fetchRegistrations();
    }, 30000);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [isLoggedIn, user]);

  const handleRegister = async (assessment: Assessment) => {
    if (!isLoggedIn) {
      setShowRegistrationForm(assessment._id || assessment.id || "");
      return;
    }
    setRegistering(assessment._id || assessment.id || "");
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: assessment._id || assessment.id,
          regNo: "",
          name: user?.name || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess("Registered successfully!");
        await fetchRegistrations();
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch (error) {
      setRegisterError("Registration failed");
    } finally {
      setRegistering(null);
    }
  };

  const handleGuestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRegistrationForm) return;

    setRegistering(showRegistrationForm);
    setRegisterError("");
    setRegisterSuccess("");

    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: showRegistrationForm,
          ...registrationForm,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess("Registered successfully!");
        setRegistrations((prev) => [...prev, showRegistrationForm]);
        const assessment = assessments.find(
          (a) => (a._id || a.id) === showRegistrationForm
        );
        if (assessment) {
          generateRollNumberSlip(assessment, registrationForm.name);
        }
        setShowRegistrationForm(null);
        setRegistrationForm({
          name: "",
          email: "",
          phone: "",
          regNo: "",
          address: "",
          dateOfBirth: "",
          gender: "",
          parentName: "",
          parentPhone: "",
        });
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch {
      setRegisterError("Network error. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  const generateRollNumberSlip = (
    assessment: Assessment,
    studentName: string
  ) => {
    const rollNumber = `RN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const slip: RollNumberSlip = {
      examId: assessment._id || assessment.id || "",
      examTitle: assessment.title,
      studentName,
      rollNumber,
      examDate: assessment.date,
      examTime: assessment.time,
      examCenter: `${assessment.universityName} Main Campus`,
      instructions:
        "Please arrive 30 minutes before the exam time. Bring your roll number slip and valid ID.",
    };
    setRollNumberSlip(slip);
  };

  const downloadRollNumberSlip = () => {
    if (!rollNumberSlip) return;

    const slipContent = `
ROLL NUMBER SLIP
================

Exam Title: ${rollNumberSlip.examTitle}
Student Name: ${rollNumberSlip.studentName}
Roll Number: ${rollNumberSlip.rollNumber}
Exam Date: ${rollNumberSlip.examDate}
Exam Time: ${rollNumberSlip.examTime}
Exam Center: ${rollNumberSlip.examCenter}

Instructions: ${rollNumberSlip.instructions}

This slip must be presented on exam day for verification.
    `;

    const blob = new Blob([slipContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `roll_number_slip_${rollNumberSlip.rollNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredAssessments = assessments.filter((a) => {
    let match = true;
    if (searchTerm) {
      match =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (a.universityName || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase());
    }
    if (selectedSubject !== "all") {
      match = match && a.subject === selectedSubject;
    }
    return match;
  });

  const subjects = [
    { name: "Mathematics", icon: <Target className="w-6 h-6" /> },
    { name: "Biology", icon: <Brain className="w-6 h-6" /> },
    { name: "Chemistry", icon: <BookOpen className="w-6 h-6" /> },
    { name: "Physics", icon: <Clock className="w-6 h-6" /> },
    { name: "English", icon: <MessageSquare className="w-6 h-6" /> },
    { name: "Economics", icon: <Star className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
            University Entrance Exams
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Register for upcoming university entrance examinations and take your
            first step towards higher education
          </p>

          {/* Stats */}
          <div className="flex justify-center space-x-6 mb-8">
            <Badge className="bg-white text-emerald-600 px-6 py-3 shadow-lg">
              <BookOpen className="w-5 h-5 mr-2" />
              {totalExams} Upcoming Exams
            </Badge>
            <Badge className="bg-white text-emerald-600 px-6 py-3 shadow-lg">
              <Users className="w-5 h-5 mr-2" />
              {totalStudents} Students Registered
            </Badge>
            <Badge className="bg-white text-emerald-600 px-6 py-3 shadow-lg">
              <Building className="w-5 h-5 mr-2" />
              {totalUniversities} Universities
            </Badge>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search exams, universities, or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="Filter by subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {[...new Set(assessments.map((a) => a.subject))].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading assessments...</p>
            </div>
          ) : filteredAssessments.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No exams found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAssessments.map((a) => {
                const isRegistered = registrations.includes(
                  a._id || a.id || ""
                );
                const isSubmitted = submittedExams.includes(
                  a._id || a.id || ""
                );
                const now = new Date();
                const start = new Date(`${a.date}T${a.time}`);
                const canStart = isRegistered && !isSubmitted && now >= start;
                const regDeadlineDateTime = a.registrationDeadline
                  ? new Date(
                      `${a.registrationDeadline}T${
                        a.registrationTime || "23:59"
                      }`
                    )
                  : null;
                const isPastDeadline =
                  regDeadlineDateTime && regDeadlineDateTime < now;

                return (
                  <Card
                    key={a._id || a.id}
                    className="hover:shadow-lg transition-all duration-300 border-0 shadow-md"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <CardTitle className="text-xl text-gray-800">
                          {a.title}
                        </CardTitle>
                        <Badge
                          className={`${
                            isRegistered
                              ? "bg-green-100 text-green-800"
                              : isPastDeadline
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {isRegistered
                            ? "Registered"
                            : isPastDeadline
                            ? "Closed"
                            : "Open"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-2" />
                        {a.universityName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {a.subject}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6">{a.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{new Date(a.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{a.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Timer className="w-4 h-4 mr-2 text-gray-500" />
                          <span>{a.duration || 120} minutes</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="w-4 h-4 mr-2 text-gray-500" />
                          <span>Max: {a.maxStudents || 500}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        {isLoggedIn && user?.role === "student" ? (
                          canStart ? (
                            <Button
                              asChild
                              className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              <Link
                                href={`/assessments/${a._id || a.id}/attempt`}
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Start Assessment
                              </Link>
                            </Button>
                          ) : isSubmitted ? (
                            <span className="text-blue-700 font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Submitted
                            </span>
                          ) : isRegistered ? (
                            <span className="text-green-700 font-medium flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Registered
                            </span>
                          ) : (
                            <Dialog
                              open={showRegistrationForm === (a._id || a.id)}
                              onOpenChange={(open) =>
                                setShowRegistrationForm(
                                  open ? (a._id || a.id) ?? null : null
                                )
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => handleRegister(a)}
                                  disabled={
                                    registering === (a._id || a.id) ||
                                    !!isPastDeadline
                                  }
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {registering === (a._id || a.id)
                                    ? "Registering..."
                                    : "Register"}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Register for Exam</DialogTitle>
                                </DialogHeader>

                                <form
                                  onSubmit={handleGuestRegistration}
                                  className="space-y-6"
                                >
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="name">Full Name *</Label>
                                      <Input
                                        id="name"
                                        value={registrationForm.name}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            name: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="email">
                                        Email Address *
                                      </Label>
                                      <Input
                                        id="email"
                                        type="email"
                                        value={registrationForm.email}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            email: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="phone">
                                        Phone Number *
                                      </Label>
                                      <Input
                                        id="phone"
                                        value={registrationForm.phone}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            phone: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="regNo">
                                        Registration Number
                                      </Label>
                                      <Input
                                        id="regNo"
                                        value={registrationForm.regNo}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            regNo: e.target.value,
                                          })
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="dateOfBirth">
                                        Date of Birth *
                                      </Label>
                                      <Input
                                        id="dateOfBirth"
                                        type="date"
                                        value={registrationForm.dateOfBirth}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            dateOfBirth: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="gender">Gender *</Label>
                                      <Select
                                        value={registrationForm.gender}
                                        onValueChange={(value) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            gender: value,
                                          })
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="male">
                                            Male
                                          </SelectItem>
                                          <SelectItem value="female">
                                            Female
                                          </SelectItem>
                                          <SelectItem value="other">
                                            Other
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                      id="address"
                                      value={registrationForm.address}
                                      onChange={(e) =>
                                        setRegistrationForm({
                                          ...registrationForm,
                                          address: e.target.value,
                                        })
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="parentName">
                                        Parent/Guardian Name *
                                      </Label>
                                      <Input
                                        id="parentName"
                                        value={registrationForm.parentName}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            parentName: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="parentPhone">
                                        Parent/Guardian Phone *
                                      </Label>
                                      <Input
                                        id="parentPhone"
                                        value={registrationForm.parentPhone}
                                        onChange={(e) =>
                                          setRegistrationForm({
                                            ...registrationForm,
                                            parentPhone: e.target.value,
                                          })
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div className="flex justify-end space-x-4">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() =>
                                        setShowRegistrationForm(null)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      type="submit"
                                      disabled={
                                        registering === showRegistrationForm
                                      }
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                      {registering === showRegistrationForm
                                        ? "Registering..."
                                        : "Register"}
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                          )
                        ) : (
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => handleRegister(a)}
                              disabled={!!isPastDeadline}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Register Now
                            </Button>
                          </DialogTrigger>
                        )}

                        <Dialog
                          open={showDetailsFor === (a._id || a.id)}
                          onOpenChange={(open) =>
                            setShowDetailsFor(
                              open ? (a._id || a.id) ?? null : null
                            )
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              <Eye className="w-4 h-4 mr-2" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Exam Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div className="font-bold text-lg">{a.title}</div>
                              <div className="text-gray-700">
                                {a.description}
                              </div>
                              <div className="flex flex-col gap-1 text-sm mt-2">
                                <div>
                                  <b>University:</b> {a.universityName}
                                </div>
                                <div>
                                  <b>Subject:</b> {a.subject}
                                </div>
                                <div>
                                  <b>Date:</b> {a.date}
                                </div>
                                <div>
                                  <b>Time:</b> {a.time}
                                </div>
                                <div>
                                  <b>Duration:</b> {a.duration || 120} minutes
                                </div>
                                <div>
                                  <b>Max Students:</b> {a.maxStudents || 500}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {registerSuccess && registering === (a._id || a.id) && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-green-700 text-sm">
                            {registerSuccess}
                          </p>
                        </div>
                      )}
                      {registerError && registering === (a._id || a.id) && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-red-700 text-sm">
                            {registerError}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Registration Form Dialog */}
      <Dialog
        open={!!showRegistrationForm}
        onOpenChange={() => setShowRegistrationForm(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register for Exam</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleGuestRegistration} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={registrationForm.name}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={registrationForm.email}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={registrationForm.phone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="regNo">Registration Number</Label>
                <Input
                  id="regNo"
                  value={registrationForm.regNo}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      regNo: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={registrationForm.dateOfBirth}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={registrationForm.gender}
                  onValueChange={(value) =>
                    setRegistrationForm({ ...registrationForm, gender: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={registrationForm.address}
                onChange={(e) =>
                  setRegistrationForm({
                    ...registrationForm,
                    address: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  value={registrationForm.parentName}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      parentName: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="parentPhone">Parent/Guardian Phone *</Label>
                <Input
                  id="parentPhone"
                  value={registrationForm.parentPhone}
                  onChange={(e) =>
                    setRegistrationForm({
                      ...registrationForm,
                      parentPhone: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationForm(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={registering === showRegistrationForm}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {registering === showRegistrationForm
                  ? "Registering..."
                  : "Register"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Roll Number Slip Dialog */}
      <Dialog
        open={!!rollNumberSlip}
        onOpenChange={() => setRollNumberSlip(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Roll Number Slip
            </DialogTitle>
          </DialogHeader>

          {rollNumberSlip && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Exam:</span>
                    <span>{rollNumberSlip.examTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Name:</span>
                    <span>{rollNumberSlip.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Roll Number:</span>
                    <span className="font-bold text-blue-600">
                      {rollNumberSlip.rollNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Date:</span>
                    <span>{rollNumberSlip.examDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Time:</span>
                    <span>{rollNumberSlip.examTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Center:</span>
                    <span>{rollNumberSlip.examCenter}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Instructions:</p>
                <p>{rollNumberSlip.instructions}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  onClick={downloadRollNumberSlip}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Slip
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setRollNumberSlip(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
