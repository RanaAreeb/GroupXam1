"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const faqs = [
  {
    q: "What is groupXam?",
    a: "groupXam is an online test prep platform for students and educational institutions, providing world-class resources for academic acceleration.",
  },
  {
    q: "Who can use groupXam?",
    a: "Students from primary to professional level, as well as educational institutions across Africa.",
  },
  {
    q: "Is groupXam free?",
    a: "groupXam offers both free and premium resources to support all learners.",
  },
  {
    q: "How do I contact support?",
    a: "You can reach us via the Contact page for any inquiries or support needs.",
  },
  {
    q: "How is my data protected?",
    a: "We take privacy seriously. Please see our Privacy Policy for details on data protection.",
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null);
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
      {/* FAQ Content */}
      <div className="relative z-10 max-w-2xl w-full text-center mb-10 mt-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-emerald-400 mb-4 drop-shadow-lg">
          Frequently Asked Questions
        </h1>
        <p className="text-base md:text-lg text-blue-100 mb-6">
          Find answers to common questions about groupXam.
        </p>
      </div>
      <div className="relative z-10 bg-gradient-to-br from-emerald-900/60 via-blue-900/60 to-purple-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-700/30 max-w-2xl w-full p-8 animate-fade-in">
        {faqs.map((faq, idx) => (
          <div key={idx} className="mb-4">
            <button
              className="w-full text-left flex justify-between items-center py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700/30 via-blue-700/20 to-purple-700/20 text-emerald-200 font-semibold focus:outline-none transition-all hover:bg-emerald-800/30"
              onClick={() => setOpen(open === idx ? null : idx)}
            >
              <span>{faq.q}</span>
              <span
                className={`ml-2 transition-transform ${
                  open === idx ? "rotate-180" : "rotate-0"
                }`}
              >
                ▼
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                open === idx ? "max-h-40 py-2" : "max-h-0 py-0"
              }`}
            >
              <p className="text-blue-100 px-4">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Futuristic Background Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-500/30 via-blue-500/20 to-purple-700/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-blue-700/20 via-emerald-400/30 to-purple-400/30 rounded-full blur-2xl animate-pulse-slow" />
    </main>
  );
}
