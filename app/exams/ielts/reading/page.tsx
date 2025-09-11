"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IELTSReadingPracticePage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main IELTS page with reading practice enabled
    router.replace("/exams/ielts?tab=practice&showReading=true");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Redirecting to Reading Practice...</p>
      </div>
    </div>
  );
}



