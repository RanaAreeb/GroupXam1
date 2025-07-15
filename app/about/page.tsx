"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
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
      {/* Hero Section */}
      <div className="relative z-10 max-w-3xl w-full text-center mb-12 mt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-400 drop-shadow-lg tracking-tight mb-4">
          groupXam
        </h1>
        <p className="text-lg md:text-2xl text-blue-200 font-medium mb-6">
          Where preparation meets academic acceleration.
        </p>
        <div className="mx-auto w-24 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full mb-6" />
        <p className="text-lg text-blue-100">
          groupXam is an online test prep platform for students and educational
          institutions. Founded by{" "}
          <span className="font-semibold text-emerald-300">Albert Varney</span>,{" "}
          <span className="font-semibold text-blue-300">Clifton Kpueh</span> and{" "}
          <span className="font-semibold text-purple-300">Daniel Yekeh</span>.
          We are on a mission to revolutionize test preparation throughout
          Africa for student advancement.
        </p>
      </div>
      {/* Glassmorphic Card */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-700/30 max-w-2xl w-full p-8 mb-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">
          Our Mission
        </h2>
        <p className="text-blue-100 mb-6">
          groupXam supports students and institutions with the educational tools
          and resources they’ll need to excel. Throughout the region of Africa,
          access to educational tools and resources is a luxury. Through
          groupXam, we want to eliminate the barriers and give each student
          access to a world-class test prep application to succeed from primary
          school to successful professionals.
        </p>
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">
          Why groupXam?
        </h2>
        <ul className="list-disc list-inside text-blue-100 space-y-2">
          <li>Cutting-edge, accessible test prep for all students</li>
          <li>Empowering institutions with modern educational technology</li>
          <li>Bridging the gap in educational opportunity across Africa</li>
        </ul>
      </div>
      {/* Futuristic Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-700/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-700/20 via-emerald-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow" />
    </main>
  );
}
