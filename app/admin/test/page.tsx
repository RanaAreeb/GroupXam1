"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AdminTestPage() {
  const { isLoggedIn, user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }

      const adminEmails = ["ranaareeb1029@gmail.com", "cliftonmanneh6@gmail.com", "jtdavis@konductcoachlearning.com"];
      const isAdminUser = adminEmails.includes(user?.email || "");
      setIsAdmin(isAdminUser);

      if (!isAdminUser) {
        router.push("/");
        return;
      }
    }
  }, [isLoggedIn, loading, user, router]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Dashboard Test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Access Verification</h3>
                  <p className="text-gray-600">
                    ✅ You have successfully accessed the admin area
                  </p>
                  <p className="text-gray-600">
                    Email: {user?.email}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Admin Dashboard Features</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Total sign ups per day, week, month, year</li>
                    <li>Country of users distribution</li>
                    <li>Activity log tracking</li>
                    <li>Daily Active Users (DAU)</li>
                    <li>Weekly Active Users (WAU)</li>
                    <li>Monthly Active Users (MAU)</li>
                    <li>Yearly Active Users (YoY)</li>
                    <li>Data export functionality</li>
                  </ul>
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => router.push("/admin/dashboard")}>
                    Go to Admin Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/")}>
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
} 