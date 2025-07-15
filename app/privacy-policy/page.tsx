"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-blue-950 to-purple-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-4 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>
      {/* Privacy Policy Content */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10 mt-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
          Privacy Policy
        </h1>
        <p className="text-base md:text-lg text-blue-100 mb-6">
          Your privacy is important to us. Please read our policy below.
        </p>
      </div>
      <div className="relative z-10 bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-700/30 max-w-2xl w-full p-8 animate-fade-in text-blue-100">
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          1. Introduction
        </h2>
        <p className="mb-4">
          This Privacy Policy explains how groupXam collects, uses, and protects
          your information. By using our platform, you agree to the terms
          outlined here.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          2. Data Collection
        </h2>
        <p className="mb-4">
          We collect information you provide directly, such as when you sign up
          or contact us. We may also collect usage data to improve our services.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          3. Data Usage
        </h2>
        <p className="mb-4">
          Your data is used to provide and improve our services, personalize
          your experience, and communicate with you. We do not sell your data to
          third parties.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          4. Data Protection
        </h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your
          information. However, no method is 100% secure.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          5. Children's Privacy
        </h2>
        <p className="mb-4">
          Our services are not intended for individuals under the age of 13. We
          do not knowingly collect personal information from children under 13.
          If we become aware of such data, we will take steps to delete it.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">6. Contact</h2>
        <p>
          If you have questions about this policy, please contact us via the
          Contact page.
        </p>
      </div>
      {/* Futuristic Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-700/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-700/20 via-emerald-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow" />
    </main>
  );
}
