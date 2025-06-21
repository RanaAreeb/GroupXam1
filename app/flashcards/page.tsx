"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
} from "lucide-react";

interface Flashcard {
  front: string;
  back: string;
}

interface FlashcardSet {
  id: number;
  title: string;
  subject: string;
  cardCount: number;
  progress: number;
  cards: Flashcard[];
}

const flashcardSets: FlashcardSet[] = [
  {
    id: 1,
    title: "Physics Fundamentals",
    subject: "Physics",
    cardCount: 25,
    progress: 68,
    cards: [
      {
        front: "What is Newton's First Law?",
        back: "An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.",
      },
      {
        front: "Define Velocity",
        back: "Velocity is the rate of change of displacement with respect to time. It's a vector quantity.",
      },
      {
        front: "What is the formula for Force?",
        back: "F = ma (Force equals mass times acceleration)",
      },
    ],
  },
  {
    id: 2,
    title: "Chemical Bonds",
    subject: "Chemistry",
    cardCount: 18,
    progress: 45,
    cards: [
      {
        front: "What is an ionic bond?",
        back: "An ionic bond is formed when electrons are transferred from one atom to another, creating charged ions.",
      },
      {
        front: "Define covalent bond",
        back: "A covalent bond is formed when atoms share electrons to achieve stable electron configurations.",
      },
    ],
  },
  {
    id: 3,
    title: "Cell Biology",
    subject: "Biology",
    cardCount: 30,
    progress: 82,
    cards: [
      {
        front: "What is mitosis?",
        back: "Mitosis is the process of cell division that results in two identical diploid cells.",
      },
      {
        front: "Function of ribosomes",
        back: "Ribosomes are responsible for protein synthesis in cells.",
      },
    ],
  },
];

export default function FlashcardsPage() {
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState(false);

  const handleSetSelect = (set: FlashcardSet) => {
    setSelectedSet(set);
    setCurrentCard(0);
    setIsFlipped(false);
    setStudyMode(true);
  };

  const handleNext = () => {
    if (selectedSet && currentCard < selectedSet.cards.length - 1) {
      setCurrentCard(currentCard + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const backToSets = () => {
    setStudyMode(false);
    setSelectedSet(null);
  };

  if (studyMode && selectedSet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
              >
                groupXam
              </Link>
            </div>
            <nav className="flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/quiz"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Quizzes
              </Link>
              <Link
                href="/exams"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Exams
              </Link>
              <Link href="/flashcards" className="text-emerald-600 font-medium">
                Flashcards
              </Link>
              <Link
                href="/discussions"
                className="text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Discussions
              </Link>
            </nav>
          </div>
        </header>

        <div className="container mx-auto max-w-2xl py-8 px-4">
          {/* Study Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button variant="ghost" onClick={backToSets} className="mb-2">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Sets
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">
                {selectedSet.title}
              </h1>
              <p className="text-gray-600">
                {selectedSet.subject} • {selectedSet.cardCount} cards
              </p>
            </div>
            <Badge variant="secondary">
              {currentCard + 1} / {selectedSet.cards.length}
            </Badge>
          </div>

          {/* Progress */}
          <Progress
            value={((currentCard + 1) / selectedSet.cards.length) * 100}
            className="mb-8 h-2"
          />

          {/* Flashcard */}
          <div className="mb-8">
            <Card
              className="border-0 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl min-h-[300px] flex items-center justify-center"
              onClick={handleFlip}
            >
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Badge
                    className={
                      isFlipped
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
                    }
                  >
                    {isFlipped ? "Answer" : "Question"}
                  </Badge>
                </div>
                <p className="text-lg leading-relaxed">
                  {isFlipped
                    ? selectedSet.cards[currentCard].back
                    : selectedSet.cards[currentCard].front}
                </p>
                <p className="text-sm text-gray-500 mt-6">
                  Click to {isFlipped ? "see question" : "reveal answer"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleFlip}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentCard === selectedSet.cards.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
            >
              groupXam
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/quiz"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Quizzes
            </Link>
            <Link
              href="/exams"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Exams
            </Link>
            <Link href="/flashcards" className="text-emerald-600 font-medium">
              Flashcards
            </Link>
            <Link
              href="/discussions"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Discussions
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Flashcards
            </h1>
            <p className="text-gray-600">Study with interactive flashcards</p>
          </div>
          <Button className="bg-gradient-to-r from-emerald-500 to-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Set
          </Button>
        </div>

        {/* Flashcard Sets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {flashcardSets.map((set) => (
            <Card
              key={set.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200">
                    {set.subject}
                  </Badge>
                  <BookOpen className="w-5 h-5 text-gray-400" />
                </div>
                <CardTitle className="text-lg">{set.title}</CardTitle>
                <CardDescription>
                  {set.cardCount} cards • {set.progress}% complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={set.progress} className="mb-4 h-2" />
                <Button
                  onClick={() => handleSetSelect(set)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                >
                  Study Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State for New Users */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Ready to create your first flashcard set?
          </h3>
          <p className="text-gray-600 mb-6">
            Flashcards are a great way to memorize key concepts and terms
          </p>
          <Button className="bg-gradient-to-r from-emerald-500 to-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Set
          </Button>
        </div>
      </div>
    </div>
  );
}
