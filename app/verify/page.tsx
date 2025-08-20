"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  Mail,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

// Separate component that uses useSearchParams
function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [showEmailCorrection, setShowEmailCorrection] = useState(false);
  const [correctedEmail, setCorrectedEmail] = useState("");

  useEffect(() => {
    if (!email) {
      router.push("/signup");
      return;
    }

    // Start countdown for resend button
    setTimeLeft(60);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setError("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          verificationCode: verificationCode.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email verified successfully! Redirecting to sign in...");
        setTimeout(() => {
          // Redirect to sign in page
          router.push("/login");
        }, 2000);
      } else {
        // Check for email bounce or delivery failure
        if (data.error && (data.error.includes("delivery") || data.error.includes("bounce") || data.error.includes("not found") || data.error.includes("invalid"))) {
          setError("Email delivery failed. The email address may be invalid or doesn't exist. Please check and correct your email address.");
          setShowEmailCorrection(true);
        } else {
          setError(data.error || "Verification failed");
        }
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("New verification code sent to your email");
        setTimeLeft(60); // Reset countdown
      } else {
        // Check for email bounce or delivery failure
        if (data.error && (data.error.includes("delivery") || data.error.includes("bounce") || data.error.includes("not found") || data.error.includes("invalid"))) {
          setError("Email delivery failed. The email address may be invalid or doesn't exist. Please check and correct your email address.");
          setShowEmailCorrection(true);
        } else {
          setError(data.error || "Failed to resend verification code");
        }
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const handleEmailCorrection = async () => {
    if (!correctedEmail.trim()) {
      setError("Please enter a valid email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correctedEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/update-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldEmail: email,
          newEmail: correctedEmail.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Email updated successfully! New verification code sent.");
        setShowEmailCorrection(false);
        setTimeLeft(60);
        // Update the URL to reflect the new email
        router.replace(`/verify?email=${encodeURIComponent(correctedEmail.trim())}`);
      } else {
        setError(data.error || "Failed to update email address");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image
              src="/logo.png"
              alt="groupXam logo"
              width={120}
              height={120}
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification code to your email address
          </p>
        </div>

        <Card className="shadow-xl border-0 rounded-2xl">
          <CardContent className="p-8">
            {/* Email Display */}
            <div className="flex items-center space-x-3 mb-6 p-4 bg-emerald-50 rounded-lg">
              <Mail className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm text-gray-600">
                  Verification code sent to:
                </p>
                <p className="font-medium text-gray-800">{email}</p>
              </div>
            </div>

            {/* Email Warning for suspicious patterns */}
            {(() => {
              if (!email) return null;
              const localPart = email.split('@')[0];
              const numbersInLocal = (localPart.match(/\d/g) || []).length;
              const isSuspicious = /^\d+[a-zA-Z]/.test(localPart) && numbersInLocal > 3;
              
              if (isSuspicious) {
                return (
                  <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                      <span className="text-yellow-800 text-sm font-medium">Email may be invalid</span>
                    </div>
                    <p className="text-yellow-700 text-sm">
                      This email address pattern might cause delivery issues. If you don't receive the verification code, 
                      the email address may be invalid or doesn't exist.
                    </p>
                    <button
                      onClick={() => setShowEmailCorrection(true)}
                      className="mt-2 text-yellow-800 underline text-sm hover:text-yellow-900"
                    >
                      Correct email address
                    </button>
                  </div>
                );
              }
              return null;
            })()}

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
                
                {/* Email Correction Section */}
                {showEmailCorrection && (
                  <div className="mt-4 p-4 bg-white rounded-lg border border-red-200">
                    <p className="text-sm text-gray-700 mb-3">
                      <strong>Correct your email address:</strong>
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="correctedEmail" className="text-sm font-medium text-gray-700">
                          Correct Email Address
                        </Label>
                        <Input
                          id="correctedEmail"
                          type="email"
                          placeholder="Enter correct email address"
                          value={correctedEmail}
                          onChange={(e) => setCorrectedEmail(e.target.value)}
                          className="mt-1 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          onClick={handleEmailCorrection}
                          className="flex-1 h-10 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                          disabled={isLoading || !correctedEmail.trim()}
                        >
                          {isLoading ? "Updating..." : "Update Email"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowEmailCorrection(false);
                            setCorrectedEmail("");
                            setError("");
                          }}
                          className="h-10 text-sm"
                          disabled={isLoading}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-700 text-sm">{success}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <Label
                  htmlFor="verificationCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Verification Code
                </Label>
                <Input
                  id="verificationCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="mt-2 h-12 text-center text-lg font-mono tracking-widest border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                  maxLength={6}
                  disabled={isLoading}
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter the 6-digit code from your email
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading || !verificationCode.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>

            {/* Resend Code */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleResendCode}
                disabled={isResending || timeLeft > 0}
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                {isResending ? (
                  <div className="flex items-center">
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </div>
                ) : timeLeft > 0 ? (
                  `Resend in ${timeLeft}s`
                ) : (
                  "Resend Code"
                )}
              </Button>
            </div>

            {/* Back to Signup */}
            <div className="mt-8 text-center">
              <Link href="/signup">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Signup
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function VerifyLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading verification page...</p>
      </div>
    </div>
  );
}

// Main page component with Suspense boundary
export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyForm />
    </Suspense>
  );
}
