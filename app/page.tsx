import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Clock,
  Brain,
  MessageSquare,
  Play,
  Star,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Header from "@/components/ui/header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header
        navLinks={
          <>
            <Link
              href="#features"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              How it Works
            </Link>
            <Link
              href="/login"
              className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              Login
            </Link>
          </>
        }
      />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto text-center relative">
          <Badge className="mb-4 sm:mb-6 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium">
            🎓 Trusted by 10,000+ Students
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Ace Your Exams
            </span>
            <br />
            <span className="text-gray-800">with Confidence</span>
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
            The most comprehensive study platform for WAEC/WASSCE preparation.
            Practice with thousands of questions, master concepts with
            flashcards, and track your progress.
          </p>

          {/* Main Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 hover:border-emerald-600 hover:text-emerald-600 transition-all duration-300"
            >
              <Link href="/demo" className="flex items-center justify-center">
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600 mb-1 sm:mb-2">
                50K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Practice Questions
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">
                95%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Success Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1 sm:mb-2">
                24/7
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                Study Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features - Interactive Cards */}
      <section id="features" className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              Everything You Need to{" "}
              <span className="text-emerald-600">Excel</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Comprehensive tools designed to help you master every aspect of
              your WAEC/WASSCE preparation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {/* Quiz Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Practice Quizzes
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Test your knowledge with interactive quizzes and get instant
                  feedback
                </p>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-md text-sm sm:text-base"
                >
                  <Link href="/quiz">Start Quiz</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Exam Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Timed Exams
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Simulate real exam conditions with our timed practice tests
                </p>
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-md text-sm sm:text-base"
                >
                  <Link href="/exams">Take Exam</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Flashcards Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Smart Flashcards
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Memorize key concepts with our intelligent flashcard system
                </p>
                <Button
                  asChild
                  className="w-full bg-purple-600 hover:bg-purple-700 shadow-md text-sm sm:text-base"
                >
                  <Link href="/flashcards">Study Cards</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Discussions Card */}
            <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gradient-to-br from-emerald-50 to-blue-50">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Study Groups
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
                  Connect with peers and get help from the community
                </p>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 shadow-md text-sm sm:text-base"
                >
                  <Link href="/discussions">Join Discussion</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-12 sm:py-20 px-4 bg-gradient-to-br from-gray-50 to-emerald-50"
      >
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              How <span className="text-emerald-600">groupXam</span> Works
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Simple steps to transform your WAEC preparation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  1
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Sign Up & Choose Subjects
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Create your account and select the subjects you want to focus on
                for your WAEC preparation
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  2
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Practice & Learn
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Take quizzes, study with flashcards, and participate in timed
                exams to build your knowledge
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl">
                <span className="text-xl sm:text-2xl font-bold text-white">
                  3
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">
                Track Progress & Excel
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Monitor your improvement, identify weak areas, and achieve your
                target grades
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-4">
              What Students Say
            </h2>
            <p className="text-base sm:text-xl text-gray-600 px-4">
              Join thousands of successful students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">
                  "groupXam helped me improve my grades significantly. The
                  practice questions are exactly like the real WAEC exams!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      Adaora O.
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      WAEC 2023 - 8 A's
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">
                  "The flashcards feature is amazing! I could study anywhere and
                  the progress tracking kept me motivated."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                    K
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      Kemi S.
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      WAEC 2023 - 7 A's
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 italic">
                  "The discussion forum helped me understand difficult concepts.
                  The community is very supportive!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base">
                    C
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      Chidi M.
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      WAEC 2023 - 6 A's
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 bg-gradient-to-r from-emerald-500 to-blue-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto text-center relative">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
            Ready to Ace Your WAEC?
          </h2>
          <p className="text-base sm:text-xl text-emerald-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Join over 10,000 students who have transformed their grades with
            groupXam. Start your journey to academic excellence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-white text-emerald-600 hover:bg-gray-100 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 shadow-xl"
            >
              <Link href="/demo">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
            <div>
              <div className="flex items-center space-x-3 mb-4 sm:mb-6 justify-center sm:justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">groupXam</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Empowering students to achieve academic excellence through
                innovative learning tools and comprehensive exam preparation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                Platform
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                <li>
                  <Link
                    href="/quiz"
                    className="hover:text-white transition-colors"
                  >
                    Practice Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    href="/exams"
                    className="hover:text-white transition-colors"
                  >
                    Timed Exams
                  </Link>
                </li>
                <li>
                  <Link
                    href="/flashcards"
                    className="hover:text-white transition-colors"
                  >
                    Flashcards
                  </Link>
                </li>
                <li>
                  <Link
                    href="/discussions"
                    className="hover:text-white transition-colors"
                  >
                    Discussions
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tutorials"
                    className="hover:text-white transition-colors"
                  >
                    Tutorials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-400">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-white transition-colors"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-sm sm:text-base text-gray-400">
            <p>
              &copy; 2025 groupXam. All rights reserved. Made with ❤️ for
              students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
