"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WhiteboardPage() {
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

      {/* Coming Soon Content */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10 mt-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-400 drop-shadow-lg tracking-tight mb-4">
          Interactive Whiteboard
        </h1>
        <p className="text-lg md:text-2xl text-blue-200 font-medium mb-6">
          Coming Soon!
        </p>
        <div className="mx-auto w-24 h-1 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 rounded-full mb-6" />
        <p className="text-lg text-blue-100">
          We're working hard to bring you an amazing interactive whiteboard
          experience. This feature will include drawing tools, collaboration
          features, and much more!
        </p>
      </div>

      {/* Glassmorphic Card */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-700/30 max-w-2xl w-full p-8 mb-10 animate-fade-in">
        <h2 className="text-2xl font-bold text-emerald-300 mb-4">
          Features Coming Soon
        </h2>
        <ul className="list-disc list-inside text-blue-100 space-y-2">
          <li>Real-time drawing and annotation tools</li>
          <li>Collaborative whiteboard sessions</li>
          <li>Multiple drawing tools (pen, brush, shapes, text)</li>
          <li>Save and share your work</li>
          <li>Perfect for exam preparation and study groups</li>
        </ul>
      </div>

      {/* Futuristic Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-700/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-700/20 via-emerald-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow" />
    </main>
  );
}
