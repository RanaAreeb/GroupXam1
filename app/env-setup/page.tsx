"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";

interface EnvVar {
  name: string;
  value: string | null;
  required: boolean;
  description: string;
  status: "present" | "missing" | "empty";
}

export default function EnvSetupPage() {
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkEnvironmentVariables();
  }, []);

  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch("/api/devtools");
      const data = await response.json();

      const envVarsList: EnvVar[] = [
        {
          name: "MONGODB_URI",
          value: data.env.MONGODB_URI,
          required: true,
          description: "MongoDB connection string",
          status: getStatus(data.env.MONGODB_URI),
        },
        {
          name: "JWT_SECRET",
          value: data.env.JWT_SECRET,
          required: true,
          description: "Secret key for JWT token signing",
          status: getStatus(data.env.JWT_SECRET),
        },
        {
          name: "GMAIL_ADDRESS",
          value: data.env.GMAIL_ADDRESS,
          required: true,
          description: "Gmail address for sending verification emails",
          status: getStatus(data.env.GMAIL_ADDRESS),
        },
        {
          name: "GOOGLE_APP_PASSWORD",
          value: data.env.GOOGLE_APP_PASSWORD,
          required: true,
          description: "Google App Password for Gmail SMTP",
          status: getStatus(data.env.GOOGLE_APP_PASSWORD),
        },
        {
          name: "CONTACT_RECIPIENT_EMAIL",
          value: data.env.CONTACT_RECIPIENT_EMAIL,
          required: false,
          description: "Email address to receive contact form submissions",
          status: getStatus(data.env.CONTACT_RECIPIENT_EMAIL),
        },
        {
          name: "NEXT_PUBLIC_BASE_URL",
          value: data.env.NEXT_PUBLIC_BASE_URL,
          required: false,
          description: "Base URL for the application (used in emails)",
          status: getStatus(data.env.NEXT_PUBLIC_BASE_URL),
        },
      ];

      setEnvVars(envVarsList);
    } catch (error) {
      console.error("Error checking environment variables:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatus = (value: string | null): "present" | "missing" | "empty" => {
    if (!value) return "missing";
    if (value.trim() === "") return "empty";
    return "present";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "missing":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "empty":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <Badge className="bg-green-100 text-green-800">Present</Badge>;
      case "missing":
        return <Badge className="bg-red-100 text-red-800">Missing</Badge>;
      case "empty":
        return <Badge className="bg-yellow-100 text-yellow-800">Empty</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "border-green-200 bg-green-50";
      case "missing":
        return "border-red-200 bg-red-50";
      case "empty":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking environment variables...</p>
        </div>
      </div>
    );
  }

  const requiredVars = envVars.filter((env) => env.required);
  const optionalVars = envVars.filter((env) => !env.required);
  const allRequiredPresent = requiredVars.every(
    (env) => env.status === "present"
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Environment Setup
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page helps you verify that all required environment variables
            are properly configured. Make sure to set up your .env.local file
            with the necessary variables.
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {allRequiredPresent ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              )}
              Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {allRequiredPresent ? (
              <div className="text-green-700 bg-green-50 p-4 rounded-lg">
                <p className="font-medium">
                  ✅ All required environment variables are configured!
                </p>
                <p className="text-sm mt-1">
                  Your application should be ready to run with email
                  verification.
                </p>
              </div>
            ) : (
              <div className="text-yellow-700 bg-yellow-50 p-4 rounded-lg">
                <p className="font-medium">
                  ⚠️ Some required environment variables are missing or empty.
                </p>
                <p className="text-sm mt-1">
                  Please configure the missing variables below to enable all
                  features.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Required Variables */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Required Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requiredVars.map((env) => (
              <div
                key={env.name}
                className={`p-4 rounded-lg border ${getStatusColor(
                  env.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(env.status)}
                    <span className="font-mono font-medium text-sm">
                      {env.name}
                    </span>
                  </div>
                  {getStatusBadge(env.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{env.description}</p>
                {env.status === "present" && (
                  <p className="text-xs text-gray-500 font-mono">
                    Value: {env.value?.substring(0, 20)}...
                  </p>
                )}
                {env.status === "missing" && (
                  <p className="text-xs text-red-600">
                    Add this variable to your .env.local file
                  </p>
                )}
                {env.status === "empty" && (
                  <p className="text-xs text-yellow-600">
                    Variable exists but has no value
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Optional Variables */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              Optional Environment Variables
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {optionalVars.map((env) => (
              <div
                key={env.name}
                className={`p-4 rounded-lg border ${getStatusColor(
                  env.status
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(env.status)}
                    <span className="font-mono font-medium text-sm">
                      {env.name}
                    </span>
                  </div>
                  {getStatusBadge(env.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{env.description}</p>
                {env.status === "present" && (
                  <p className="text-xs text-gray-500 font-mono">
                    Value: {env.value?.substring(0, 20)}...
                  </p>
                )}
                {env.status === "missing" && (
                  <p className="text-xs text-gray-500">
                    Optional - can be added for enhanced functionality
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">
                Email Verification Setup
              </h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Create a Gmail account or use an existing one</li>
                <li>Enable 2-factor authentication on your Gmail account</li>
                <li>
                  Generate an App Password: Gmail → Settings → Security → App
                  Passwords
                </li>
                <li>
                  Add the Gmail address and App Password to your .env.local file
                </li>
                <li>
                  Set NEXT_PUBLIC_BASE_URL to your domain (e.g.,
                  http://localhost:3000 for development)
                </li>
              </ol>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">
                Example .env.local file:
              </h3>
              <pre className="text-xs text-gray-700 bg-white p-3 rounded border overflow-x-auto">
                {`MONGODB_URI=mongodb://localhost:27017/groupxam
JWT_SECRET=your-super-secret-jwt-key-here
GMAIL_ADDRESS=your-email@gmail.com
GOOGLE_APP_PASSWORD=your-16-digit-app-password
CONTACT_RECIPIENT_EMAIL=contact@yourdomain.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button
            onClick={checkEnvironmentVariables}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            Refresh Status
          </Button>
        </div>
      </div>
    </div>
  );
}
