"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface Assessment {
  _id?: string;
  id?: string;
  title: string;
  subject: string;
  universityName?: string;
  date: string;
  time: string;
  description?: string;
}

export default function AssessmentsPage() {
  const { isLoggedIn, user } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [registrations, setRegistrations] = useState<string[]>([]); // examIds
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/exams");
        const data = await res.json();
        setAssessments(Array.isArray(data) ? data : []);
        // Fetch registrations for this user
        if (isLoggedIn && user?.role === "student") {
          const regRes = await fetch("/api/exams/submissions");
          const regData = await regRes.json();
          const regExamIds = Array.isArray(regData)
            ? regData
                .filter((r) => r.studentEmail === user.email)
                .map((r) => r.examId)
            : [];
          setRegistrations(regExamIds);
        }
      } catch {
        setError("Failed to load assessments.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isLoggedIn, user]);

  const handleRegister = async (assessment: Assessment) => {
    setRegistering(assessment._id || assessment.id || "");
    setRegisterError("");
    setRegisterSuccess("");
    try {
      const res = await fetch("/api/exams/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: assessment._id || assessment.id,
          regNo: "", // Optionally prompt for regNo
          name: user?.name || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setRegisterSuccess("Registered successfully!");
        setRegistrations((prev) => [
          ...prev,
          assessment._id || assessment.id || "",
        ]);
      } else {
        setRegisterError(data.error || "Registration failed");
      }
    } catch {
      setRegisterError("Network error. Please try again.");
    } finally {
      setRegistering(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Assessments</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="space-y-6">
          {assessments.length === 0 && (
            <div>No upcoming assessments found.</div>
          )}
          {assessments.map((a) => {
            const isRegistered = registrations.includes(a._id || a.id || "");
            const now = new Date();
            const start = new Date(`${a.date}T${a.time}`);
            const canStart = isRegistered && now >= start;
            return (
              <div
                key={a._id || a.id}
                className="border rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <div className="text-xl font-semibold">{a.title}</div>
                  <div className="text-gray-600 text-sm mb-1">
                    {a.subject} &middot; {a.universityName}
                  </div>
                  <div className="text-gray-500 text-xs mb-2">
                    {a.date} at {a.time}
                  </div>
                  <div className="text-gray-700 mb-2">{a.description}</div>
                </div>
                <div className="flex flex-col gap-2 min-w-[180px]">
                  {isLoggedIn && user?.role === "student" ? (
                    canStart ? (
                      <Button
                        asChild
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Link href={`/assessments/${a._id || a.id}/attempt`}>
                          Start Assessment
                        </Link>
                      </Button>
                    ) : isRegistered ? (
                      <span className="text-green-700 font-medium">
                        Registered
                      </span>
                    ) : (
                      <Button
                        onClick={() => handleRegister(a)}
                        disabled={registering === (a._id || a.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {registering === (a._id || a.id)
                          ? "Registering..."
                          : "Register"}
                      </Button>
                    )
                  ) : (
                    <Button
                      asChild
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Link href="/login">Sign in to Register</Link>
                    </Button>
                  )}
                  {registerSuccess && registering === (a._id || a.id) && (
                    <span className="text-green-700 text-xs">
                      {registerSuccess}
                    </span>
                  )}
                  {registerError && registering === (a._id || a.id) && (
                    <span className="text-red-600 text-xs">
                      {registerError}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
