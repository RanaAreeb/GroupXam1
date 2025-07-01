"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";

interface ScheduledExam {
  id: string;
  title: string;
  university: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  totalQuestions: number;
  maxStudents: number;
  registeredStudents: number;
  status: "upcoming" | "ongoing" | "completed" | "registration_closed";
  description: string;
  requirements: string[];
  registrationDeadline: string;
  examLink?: string;
}

export default function ServicesPage() {
  const { isLoggedIn, user } = useAuth();
  const [exams, setExams] = useState<ScheduledExam[]>([]);
  const [filteredExams, setFilteredExams] = useState<ScheduledExam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockExams: ScheduledExam[] = [
      {
        id: "1",
        title: "Computer Science Entrance Exam 2024",
        university: "University of Lagos",
        subject: "Computer Science",
        date: "2024-03-15",
        time: "10:00 AM",
        duration: 120,
        totalQuestions: 100,
        maxStudents: 500,
        registeredStudents: 342,
        status: "upcoming",
        description:
          "Comprehensive entrance examination for Computer Science program covering programming, algorithms, and mathematics.",
        requirements: [
          "Senior Secondary Certificate",
          "Mathematics Background",
          "Basic Programming Knowledge",
        ],
        registrationDeadline: "2024-03-10",
      },
      {
        id: "2",
        title: "Medicine Admission Test",
        university: "University of Ibadan",
        subject: "Medicine",
        date: "2024-03-20",
        time: "2:00 PM",
        duration: 180,
        totalQuestions: 150,
        maxStudents: 300,
        registeredStudents: 298,
        status: "registration_closed",
        description:
          "Rigorous admission test for medical school covering biology, chemistry, physics, and general knowledge.",
        requirements: [
          "Senior Secondary Certificate",
          "Biology & Chemistry Background",
          "Minimum 70% in SSCE",
        ],
        registrationDeadline: "2024-03-15",
      },
      {
        id: "3",
        title: "Engineering Aptitude Test",
        university: "Federal University of Technology",
        subject: "Engineering",
        date: "2024-03-25",
        time: "9:00 AM",
        duration: 150,
        totalQuestions: 120,
        maxStudents: 400,
        registeredStudents: 156,
        status: "upcoming",
        description:
          "Aptitude test for various engineering disciplines including mechanical, electrical, and civil engineering.",
        requirements: [
          "Senior Secondary Certificate",
          "Physics & Mathematics Background",
        ],
        registrationDeadline: "2024-03-20",
      },
      {
        id: "4",
        title: "Business Administration Entrance",
        university: "Covenant University",
        subject: "Business",
        date: "2024-03-12",
        time: "11:00 AM",
        duration: 90,
        totalQuestions: 80,
        maxStudents: 200,
        registeredStudents: 200,
        status: "ongoing",
        description:
          "Entrance examination for Business Administration program covering economics, mathematics, and general knowledge.",
        requirements: [
          "Senior Secondary Certificate",
          "Mathematics Background",
        ],
        registrationDeadline: "2024-03-08",
        examLink: "/exam/4",
      },
    ];

    setExams(mockExams);
    setFilteredExams(mockExams);
    setLoading(false);
  }, []);

  useEffect(() => {
    let filtered = exams;

    if (searchTerm) {
      filtered = filtered.filter(
        (exam) =>
          exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exam.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter((exam) => exam.subject === selectedSubject);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((exam) => exam.status === selectedStatus);
    }

    setFilteredExams(filtered);
  }, [searchTerm, selectedSubject, selectedStatus, exams]);

  const handleRegister = async (examId: string) => {
    if (!isLoggedIn) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    // Mock registration
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId
          ? { ...exam, registeredStudents: exam.registeredStudents + 1 }
          : exam
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      case "registration_closed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Calendar className="w-4 h-4" />;
      case "ongoing":
        return <Play className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "registration_closed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto py-8">
          <div className="text-center">Loading scheduled exams...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-12">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">University Entrance Exams</h1>
          <p className="text-xl mb-8">
            Register for upcoming university entrance examinations and take your
            first step towards higher education
          </p>
          <div className="flex justify-center space-x-4">
            <Badge className="bg-white text-emerald-600 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              {exams.reduce(
                (sum, exam) => sum + exam.registeredStudents,
                0
              )}{" "}
              Students Registered
            </Badge>
            <Badge className="bg-white text-emerald-600 px-4 py-2">
              <Building className="w-4 h-4 mr-2" />
              {new Set(exams.map((exam) => exam.university)).size} Universities
            </Badge>
            <Badge className="bg-white text-emerald-600 px-4 py-2">
              <Calendar className="w-4 h-4 mr-2" />
              {exams.filter((exam) => exam.status === "upcoming").length}{" "}
              Upcoming Exams
            </Badge>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search exams, universities, or subjects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="Computer Science">
                    Computer Science
                  </SelectItem>
                  <SelectItem value="Medicine">Medicine</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="registration_closed">
                    Registration Closed
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Exams Grid */}
      <section className="py-8">
        <div className="container mx-auto">
          {filteredExams.length === 0 ? (
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
              {filteredExams.map((exam) => (
                <Card
                  key={exam.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      <Badge className={getStatusColor(exam.status)}>
                        <div className="flex items-center">
                          {getStatusIcon(exam.status)}
                          <span className="ml-1 capitalize">
                            {exam.status.replace("_", " ")}
                          </span>
                        </div>
                      </Badge>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Building className="w-4 h-4 mr-1" />
                      {exam.university}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <BookOpen className="w-4 h-4 mr-1" />
                      {exam.subject}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{exam.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatDate(exam.date)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{formatTime(exam.time)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Timer className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{exam.duration} minutes</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>
                          {exam.registeredStudents}/{exam.maxStudents}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">
                        Requirements:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {exam.requirements.map((req, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        Registration deadline:{" "}
                        {formatDate(exam.registrationDeadline)}
                      </div>
                      <div className="flex gap-2">
                        {exam.status === "ongoing" && exam.examLink ? (
                          <Button asChild>
                            <Link href={exam.examLink}>
                              <Play className="w-4 h-4 mr-2" />
                              Take Exam
                            </Link>
                          </Button>
                        ) : exam.status === "upcoming" ? (
                          <Button
                            onClick={() => handleRegister(exam.id)}
                            disabled={
                              exam.registeredStudents >= exam.maxStudents
                            }
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            {exam.registeredStudents >= exam.maxStudents
                              ? "Full"
                              : "Register"}
                          </Button>
                        ) : (
                          <Button variant="outline" disabled>
                            Registration Closed
                          </Button>
                        )}
                        <Button variant="outline" asChild>
                          <Link href={`/exam-details/${exam.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Register for upcoming university entrance exams and take the first
            step towards your academic future.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Create Account</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
