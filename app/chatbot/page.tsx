"use client";

import { useRouter } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import Header from "@/components/ui/header";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Brain, Clock, MessageSquare, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ChatbotPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const handleStartChat = () => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      router.push("/chatbot/chat");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <Header />

        {/* Hero Section */}
        <section className="relative py-16 sm:py-24 px-4 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 px-4 py-2 text-sm font-medium shadow-lg">
                <Sparkles className="w-4 h-4 mr-1 inline" />
                AI-Powered Study Assistant
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-3">
                <Image
                  src="/sunu_icon.png"
                  alt="sunu-I Logo"
                  width={64}
                  height={64}
                  className="object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20"
                  priority
                />
                <span className="text-blue-600">
                  sunu-I
                </span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-700 max-w-3xl mx-auto mb-2 font-semibold">
                Your Intelligent Study Companion
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Get instant answers to your academic questions, analyze images, get exam preparation tips,
                study strategies, and personalized guidance 24/7. Upload pictures of your notes, questions,
                or diagrams for detailed explanations.
              </p>

              {/* Usage Info */}
              <p className="text-sm text-gray-600 max-w-xl mx-auto mb-8">
                Chat without limits—responses are automatically trimmed to stay focused and easy to review.
              </p>

              {/* Start Chat Button */}
              <Button
                onClick={handleStartChat}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Start Chatting
                <ArrowRight className="w-5 h-5 ml-3" />
              </Button>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Smart Answers</h3>
                  <p className="text-gray-600">Get accurate, detailed explanations for any academic topic or exam question.</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Image Analysis</h3>
                  <p className="text-gray-600">Upload photos of notes, diagrams, or questions for instant AI-powered analysis.</p>
                </CardContent>
              </Card>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">24/7 Available</h3>
                  <p className="text-gray-600">Study support whenever you need it, day or night, without any wait time.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 bg-white/50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Ask Your Question</h3>
                <p className="text-gray-600">Type your question or upload an image of your notes, homework, or diagrams.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Get AI Response</h3>
                <p className="text-gray-600">sunu-I analyzes your question or image and provides detailed, helpful explanations.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Learn & Excel</h3>
                <p className="text-gray-600">Use the insights to improve your understanding and ace your exams.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}


