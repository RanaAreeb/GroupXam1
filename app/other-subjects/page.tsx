"use client";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Target,
  Brain,
  BookOpen,
  Clock,
  MessageSquare,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";
import Link from "next/link";

const subjects = [
  { name: "Mathematics", icon: <Target className="w-7 h-7" /> },
  { name: "Biology", icon: <Brain className="w-7 h-7" /> },
  { name: "Chemistry", icon: <BookOpen className="w-7 h-7" /> },
  { name: "Physics", icon: <Clock className="w-7 h-7" /> },
  { name: "English", icon: <MessageSquare className="w-7 h-7" /> },
  { name: "Economics", icon: <Star className="w-7 h-7" /> },
  { name: "Geography", icon: <ArrowRight className="w-7 h-7" /> },
  { name: "Civic", icon: <Play className="w-7 h-7" /> },
];

export default function OtherSubjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Other Subjects" />
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white shadow-lg rounded-b-3xl mb-12">
        <div className="container mx-auto text-center relative z-10">
          <nav className="mb-4 text-sm text-emerald-100/80">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            &gt; <span>Other Subjects</span>
          </nav>
          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {subjects.map((s, i) => (
              <span
                key={s.name}
                className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white text-2xl shadow-lg"
              >
                {s.icon}
              </span>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
            Explore Other Subjects
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-2">
            Practice and master a wide range of subjects beyond the core exams.
            Choose a subject to get started!
          </p>
        </div>
        {/* Decorative SVG blob */}
        <svg
          className="absolute -top-24 -left-24 w-96 h-96 opacity-20 blur-2xl"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#a5b4fc"
            d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          className="absolute -bottom-24 -right-24 w-96 h-96 opacity-10 blur-2xl"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#6ee7b7"
            d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </section>
      {/* Subject Cards */}
      <div className="container mx-auto pb-16 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="mb-5">
                  <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-3xl shadow-lg group-hover:scale-110 transition-transform">
                    {subject.icon}
                  </span>
                </div>
                <div className="font-bold text-xl text-gray-800 mb-2">
                  {subject.name}
                </div>
                <div className="text-sm text-gray-500 mb-6">
                  Start Practicing
                </div>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all"
                >
                  <Link href="/quiz">Start Practicing</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
