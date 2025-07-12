"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-blue-950 to-purple-950 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-700 via-blue-700 to-purple-700 text-white font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>
      {/* Terms of Use Content */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
          Terms of Use
        </h1>
        <p className="text-lg text-blue-100 mb-6">
          Please read these terms carefully before using groupXam.
        </p>
      </div>
      <div className="relative z-10 bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-700/30 max-w-2xl w-full p-8 animate-fade-in text-blue-100">
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          1. Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing or using groupXam, you agree to be bound by these Terms
          of Use. If you do not agree, please do not use our platform.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          2. Use of Service
        </h2>
        <p className="mb-4">
          You agree to use groupXam for lawful purposes only and in accordance
          with all applicable laws and regulations.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          3. Intellectual Property
        </h2>
        <p className="mb-4">
          All content on groupXam is the property of its respective owners.
          Unauthorized use is prohibited.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">
          4. Changes to Terms
        </h2>
        <p className="mb-4">
          We may update these terms at any time. Continued use of the platform
          constitutes acceptance of the new terms.
        </p>
        <h2 className="text-xl font-bold mb-2 text-emerald-300">5. Contact</h2>
        <p>
          If you have questions about these terms, please contact us via the
          Contact page.
        </p>
      </div>
      {/* Futuristic Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-700/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-700/20 via-emerald-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow" />
    </main>
  );
}
