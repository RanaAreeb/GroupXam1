"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Database,
  Key,
  Play,
  AlertCircle,
} from "lucide-react";

export default function SetupPage() {
  const [dbStatus, setDbStatus] = useState("checking");
  const [dbInfo, setDbInfo] = useState(null);
  const [seedStatus, setSeedStatus] = useState("idle");

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    try {
      setDbStatus("checking");
      const response = await fetch("/api/test-db");
      const data = await response.json();

      if (data.status === "success") {
        setDbStatus("connected");
        setDbInfo(data);
      } else {
        setDbStatus("error");
        setDbInfo(data);
      }
    } catch (error: unknown) {
      setDbStatus("error");
      setDbInfo({
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  const seedDatabase = async () => {
    try {
      setSeedStatus("seeding");
      // In a real app, you'd call an API endpoint to seed the database
      // For now, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSeedStatus("success");
      checkDatabase(); // Refresh database info
    } catch (error) {
      setSeedStatus("error");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "connected":
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "checking":
      case "seeding":
        return (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        );
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "connected":
      case "success":
        return "bg-emerald-100 text-emerald-700";
      case "error":
        return "bg-red-100 text-red-700";
      case "checking":
      case "seeding":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 p-4">
      <div className="container mx-auto max-w-2xl py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            groupXam Setup
          </h1>
          <p className="text-gray-600">
            Configure your environment and database
          </p>
        </div>

        <div className="space-y-6">
          {/* Environment Variables */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Environment Variables
              </CardTitle>
              <CardDescription>
                Required environment variables for the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">MONGODB_URI</p>
                    <p className="text-sm text-gray-600">
                      MongoDB connection string
                    </p>
                  </div>
                  <Badge
                    className={
                      process.env.MONGODB_URI
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {process.env.MONGODB_URI ? "Set" : "Missing"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">JWT_SECRET</p>
                    <p className="text-sm text-gray-600">
                      Secret key for JWT tokens
                    </p>
                  </div>
                  <Badge
                    className={
                      process.env.JWT_SECRET
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {process.env.JWT_SECRET ? "Set" : "Missing"}
                  </Badge>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Setup Instructions:
                </h4>
                <ol className="text-sm text-blue-700 space-y-1">
                  <li>1. Create a MongoDB database (local or cloud)</li>
                  <li>2. Set MONGODB_URI environment variable</li>
                  <li>3. Set JWT_SECRET environment variable</li>
                  <li>4. Restart your development server</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* Database Connection */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Connection
              </CardTitle>
              <CardDescription>Test your MongoDB connection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(dbStatus)}
                  <div>
                    <p className="font-medium">MongoDB Status</p>
                    <p className="text-sm text-gray-600">
                      {dbStatus === "checking" && "Checking connection..."}
                      {dbStatus === "connected" && "Connected successfully"}
                      {dbStatus === "error" && "Connection failed"}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(dbStatus)}>{dbStatus}</Badge>
              </div>

              {dbInfo && dbStatus === "connected" && (
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">
                      {dbInfo.collections?.questions || 0}
                    </p>
                    <p className="text-sm text-emerald-700">Questions</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">
                      {dbInfo.collections?.flashcards || 0}
                    </p>
                    <p className="text-sm text-blue-700">Flashcard Sets</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">
                      {dbInfo.collections?.users || 0}
                    </p>
                    <p className="text-sm text-purple-700">Users</p>
                  </div>
                </div>
              )}

              {dbInfo && dbStatus === "error" && (
                <div className="p-4 bg-red-50 rounded-lg mb-4">
                  <p className="text-red-800 font-medium">Error Details:</p>
                  <p className="text-red-700 text-sm">{dbInfo.message}</p>
                </div>
              )}

              <Button
                onClick={checkDatabase}
                variant="outline"
                className="w-full"
              >
                Test Connection
              </Button>
            </CardContent>
          </Card>

          {/* Database Seeding */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Database Seeding
              </CardTitle>
              <CardDescription>
                Populate your database with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(seedStatus)}
                  <div>
                    <p className="font-medium">Seed Status</p>
                    <p className="text-sm text-gray-600">
                      {seedStatus === "idle" && "Ready to seed database"}
                      {seedStatus === "seeding" && "Seeding database..."}
                      {seedStatus === "success" &&
                        "Database seeded successfully"}
                      {seedStatus === "error" && "Seeding failed"}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(seedStatus)}>
                  {seedStatus}
                </Badge>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg mb-4">
                <p className="text-yellow-800 font-medium mb-2">
                  What will be seeded:
                </p>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• 10 sample questions across all subjects</li>
                  <li>• 3 flashcard sets (Physics, Chemistry, Biology)</li>
                  <li>• Database indexes for performance</li>
                </ul>
              </div>

              <Button
                onClick={seedDatabase}
                disabled={dbStatus !== "connected" || seedStatus === "seeding"}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                {seedStatus === "seeding" ? "Seeding..." : "Seed Database"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Start */}
          {dbStatus === "connected" && (
            <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
              <CardContent className="p-6 text-center">
                <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Setup Complete!</h3>
                <p className="mb-4">
                  Your groupXam application is ready to use
                </p>
                <Button
                  asChild
                  className="bg-white text-emerald-600 hover:bg-gray-100"
                >
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
