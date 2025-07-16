"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import {
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  ArrowLeft,
  Atom,
  FlaskConical,
  Heart,
  Leaf,
  Microscope,
  Pill,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator,
  Vote,
  Dna,
  Leaf as EcologyIcon,
  BookText,
  Globe,
  Palette,
  Music,
  Languages,
  ScrollText,
  Lightbulb,
  Users,
  MapPin,
  Brain,
  BookMarked,
  Star,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";
import AppHeader from "@/components/ui/app-header";
import {
  getFlashcardSets,
  getFlashcardSet,
  FlashcardSet,
} from "./flashcards-data";

// Subject Categories (same as quiz page)
const subjectCategories = [
  {
    id: "sciences",
    title: "Sciences",
    description: "Physics, Chemistry, Biology and more",
    icon: Atom,
    color: "emerald",
    gradient: "from-emerald-500 to-teal-500",
    bgGradient: "from-emerald-50 to-teal-50",
    subjects: [
      {
        name: "Physics",
        icon: Atom,
        color: "emerald",
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        name: "Chemistry",
        icon: FlaskConical,
        color: "blue",
        gradient: "from-green-500 to-emerald-500",
      },
      {
        name: "Biology",
        icon: Leaf,
        color: "green",
        gradient: "from-emerald-500 to-green-500",
      },
      {
        name: "Anatomy",
        icon: Heart,
        color: "red",
        gradient: "from-red-500 to-pink-500",
      },
      {
        name: "Physiology",
        icon: Brain,
        color: "pink",
        gradient: "from-pink-500 to-purple-500",
      },
      {
        name: "Microbiology",
        icon: Microscope,
        color: "orange",
        gradient: "from-orange-500 to-red-500",
      },
      {
        name: "Biochemistry",
        icon: Dna,
        color: "indigo",
        gradient: "from-indigo-500 to-purple-500",
      },
      {
        name: "Pharmacology",
        icon: Pill,
        color: "violet",
        gradient: "from-violet-500 to-purple-500",
      },
      {
        name: "Ecology",
        icon: EcologyIcon,
        color: "teal",
        gradient: "from-teal-500 to-cyan-500",
      },
      {
        name: "Psychology",
        icon: Brain,
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
      },
    ],
  },
  {
    id: "economics",
    title: "Economics & Business",
    description: "Economics, Accounting, Finance and more",
    icon: DollarSign,
    color: "blue",
    gradient: "from-blue-500 to-cyan-500",
    bgGradient: "from-blue-50 to-cyan-50",
    subjects: [
      {
        name: "Economics",
        icon: DollarSign,
        color: "blue",
        gradient: "from-green-500 to-emerald-500",
      },
      {
        name: "Micro Economics",
        icon: TrendingDown,
        color: "cyan",
        gradient: "from-cyan-500 to-blue-500",
      },
      {
        name: "Macro Economics",
        icon: TrendingUp,
        color: "sky",
        gradient: "from-sky-500 to-blue-500",
      },
      {
        name: "Accounting",
        icon: Calculator,
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
      },
      {
        name: "Finance",
        icon: Calculator,
        color: "purple",
        gradient: "from-purple-500 to-indigo-500",
      },
      {
        name: "Political Science",
        icon: Vote,
        color: "red",
        gradient: "from-red-500 to-orange-500",
      },
    ],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    description: "Algebra, Calculus, Statistics and more",
    icon: Calculator,
    color: "purple",
    gradient: "from-purple-500 to-indigo-500",
    bgGradient: "from-purple-50 to-indigo-50",
    subjects: [
      {
        name: "Statistics",
        icon: Calculator,
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
      },
      {
        name: "Calculus",
        icon: Calculator,
        color: "indigo",
        gradient: "from-indigo-500 to-blue-500",
      },
      {
        name: "Algebra",
        icon: Calculator,
        color: "blue",
        gradient: "from-blue-500 to-cyan-500",
      },
      {
        name: "Arithmetic",
        icon: Calculator,
        color: "emerald",
        gradient: "from-emerald-500 to-green-500",
      },
      {
        name: "Geometry",
        icon: Calculator,
        color: "teal",
        gradient: "from-teal-500 to-emerald-500",
      },
      {
        name: "Trigonometry",
        icon: Calculator,
        color: "cyan",
        gradient: "from-cyan-500 to-blue-500",
      },
      {
        name: "Pythagorean Theorem",
        icon: Calculator,
        color: "orange",
        gradient: "from-orange-500 to-red-500",
      },
    ],
  },
  {
    id: "arts-humanities",
    title: "Arts & Humanities",
    description: "English, Literature, History and more",
    icon: BookText,
    color: "rose",
    gradient: "from-rose-500 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50",
    subjects: [
      {
        name: "English",
        icon: BookText,
        color: "rose",
        gradient: "from-rose-500 to-red-500",
      },
      {
        name: "Literature",
        icon: ScrollText,
        color: "pink",
        gradient: "from-pink-500 to-purple-500",
      },
      {
        name: "History",
        icon: Globe,
        color: "amber",
        gradient: "from-amber-500 to-orange-500",
      },
      {
        name: "Geography",
        icon: MapPin,
        color: "emerald",
        gradient: "from-emerald-500 to-teal-500",
      },
      {
        name: "Philosophy",
        icon: Lightbulb,
        color: "yellow",
        gradient: "from-yellow-500 to-amber-500",
      },
      {
        name: "Sociology",
        icon: Users,
        color: "blue",
        gradient: "from-blue-500 to-indigo-500",
      },
      {
        name: "Art History",
        icon: Palette,
        color: "purple",
        gradient: "from-purple-500 to-pink-500",
      },
      {
        name: "Music Theory",
        icon: Music,
        color: "indigo",
        gradient: "from-indigo-500 to-purple-500",
      },
      {
        name: "Creative Writing",
        icon: BookOpen,
        color: "teal",
        gradient: "from-teal-500 to-cyan-500",
      },
      {
        name: "Foreign Languages",
        icon: Languages,
        color: "cyan",
        gradient: "from-cyan-500 to-blue-500",
      },
      {
        name: "Religious Studies",
        icon: BookMarked,
        color: "orange",
        gradient: "from-orange-500 to-amber-500",
      },
      {
        name: "Cultural Studies",
        icon: Globe,
        color: "violet",
        gradient: "from-violet-500 to-purple-500",
      },
    ],
  },
];

// Get flashcard sets from data files
const getFlashcardSetsFromData = (subject: string) => {
  const sets = getFlashcardSets(subject);
  return sets.map((set) => ({
    ...set,
    progress: Math.floor(Math.random() * 100), // Random progress for demo
    isUserCreated: false,
  }));
};

// Get flashcards from data files
const getFlashcardsFromData = (subject: string, setId: string) => {
  const set = getFlashcardSet(subject, setId);
  return set
    ? set.cards
    : [
        { front: "Sample Question 1", back: "Sample Answer 1" },
        { front: "Sample Question 2", back: "Sample Answer 2" },
        { front: "Sample Question 3", back: "Sample Answer 3" },
      ];
};

export default function FlashcardsPage() {
  const { isLoggedIn, user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<any | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSet, setEditingSet] = useState<any | null>(null);
  const [newSetTitle, setNewSetTitle] = useState("");
  const [newCards, setNewCards] = useState([{ front: "", back: "" }]);
  const [userSets, setUserSets] = useState<any[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubject(null);
    setSelectedSet(null);
  };

  const handleSubjectClick = (subjectName: string) => {
    setSelectedSubject(subjectName);
    setSelectedSet(null);
  };

  const handleSetSelect = (set: any) => {
    setSelectedSet(set);
    setCurrentCard(0);
    setIsFlipped(false);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubject(null);
    setSelectedSet(null);
  };

  const handleBackToSubjects = () => {
    setSelectedSubject(null);
    setSelectedSet(null);
  };

  const handleNext = () => {
    if (selectedSet && currentCard < selectedSet.cards?.length - 1) {
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

  const handleBackToSets = () => {
    setSelectedSet(null);
  };

  const handleCreateSet = async () => {
    if (!isLoggedIn || !user?.email) {
      alert("Please log in to create flashcards");
      return;
    }

    if (
      newSetTitle.trim() &&
      newCards.some((card) => card.front.trim() && card.back.trim())
    ) {
      setIsCreating(true);
      try {
        const validCards = newCards.filter(
          (card) => card.front.trim() && card.back.trim()
        );

        const response = await fetch("/api/flashcards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.email,
            title: newSetTitle,
            subject: selectedSubject,
            cards: validCards,
            difficulty: "Custom",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserSets([...userSets, data.flashcardSet]);
          setNewSetTitle("");
          setNewCards([{ front: "", back: "" }]);
          setShowCreateForm(false);
        } else {
          const errorData = await response.json();
          alert(`Error creating flashcard set: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error creating flashcard set:", error);
        alert("Failed to create flashcard set. Please try again.");
      } finally {
        setIsCreating(false);
      }
    }
  };

  const addNewCard = () => {
    setNewCards([...newCards, { front: "", back: "" }]);
  };

  const removeCard = (index: number) => {
    if (newCards.length > 1) {
      setNewCards(newCards.filter((_, i) => i !== index));
    }
  };

  const updateCard = (
    index: number,
    field: "front" | "back",
    value: string
  ) => {
    const updatedCards = [...newCards];
    updatedCards[index][field] = value;
    setNewCards(updatedCards);
  };

  // Delete user flashcard set
  const handleDeleteSet = async (setId: string) => {
    if (!isLoggedIn || !user?.email) return;

    if (confirm("Are you sure you want to delete this flashcard set?")) {
      try {
        const response = await fetch(
          `/api/flashcards?id=${setId}&userId=${encodeURIComponent(
            user.email
          )}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          setUserSets(userSets.filter((set) => set.id !== setId));
          if (selectedSet?.id === setId) {
            setSelectedSet(null);
          }
        } else {
          alert("Failed to delete flashcard set");
        }
      } catch (error) {
        console.error("Error deleting flashcard set:", error);
        alert("Failed to delete flashcard set");
      }
    }
  };

  // Edit user flashcard set
  const handleEditSet = (set: any) => {
    setEditingSet(set);
    setNewSetTitle(set.title);
    setNewCards(set.cards || [{ front: "", back: "" }]);
    setShowEditForm(true);
  };

  // Update flashcard set
  const handleUpdateSet = async () => {
    if (!isLoggedIn || !user?.email || !editingSet) return;

    if (
      newSetTitle.trim() &&
      newCards.some((card) => card.front.trim() && card.back.trim())
    ) {
      setIsEditing(true);
      try {
        const validCards = newCards.filter(
          (card) => card.front.trim() && card.back.trim()
        );

        const response = await fetch("/api/flashcards", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingSet.id,
            userId: user.email,
            title: newSetTitle,
            cards: validCards,
            difficulty: "Custom",
          }),
        });

        if (response.ok) {
          // Update the set in userSets
          const updatedSet = {
            ...editingSet,
            title: newSetTitle,
            cards: validCards,
            cardCount: validCards.length,
          };

          setUserSets(
            userSets.map((set) => (set.id === editingSet.id ? updatedSet : set))
          );

          // Update selectedSet if it's the one being edited
          if (selectedSet?.id === editingSet.id) {
            setSelectedSet(updatedSet);
          }

          setNewSetTitle("");
          setNewCards([{ front: "", back: "" }]);
          setShowEditForm(false);
          setEditingSet(null);
        } else {
          const errorData = await response.json();
          alert(`Error updating flashcard set: ${errorData.error}`);
        }
      } catch (error) {
        console.error("Error updating flashcard set:", error);
        alert("Failed to update flashcard set. Please try again.");
      } finally {
        setIsEditing(false);
      }
    }
  };

  // Load user's flashcard sets from MongoDB
  const loadUserFlashcards = async () => {
    if (!isLoggedIn || !user?.email) return;

    try {
      const response = await fetch(
        `/api/flashcards?userId=${encodeURIComponent(user.email)}&subject=${
          selectedSubject || ""
        }`
      );
      if (response.ok) {
        const data = await response.json();
        setUserSets(data.flashcardSets || []);
      }
    } catch (error) {
      console.error("Error loading user flashcards:", error);
    }
  };

  // Load user flashcards when subject changes or user logs in
  useEffect(() => {
    if (isLoggedIn && selectedSubject) {
      loadUserFlashcards();
    }
  }, [isLoggedIn, selectedSubject, user?.email]);

  // Reset user sets when user logs out
  useEffect(() => {
    if (!isLoggedIn) {
      setUserSets([]);
    }
  }, [isLoggedIn]);

  const selectedCategoryData = selectedCategory
    ? subjectCategories.find((cat) => cat.id === selectedCategory)
    : null;

  const selectedSubjectData =
    selectedSubject && selectedCategoryData
      ? selectedCategoryData.subjects.find(
          (subj) => subj.name === selectedSubject
        )
      : null;

  // Study mode - show flashcards
  if (selectedSet) {
    const flashcards =
      selectedSet.cards ||
      getFlashcardsFromData(selectedSubject || "", selectedSet.id);

    // Check if flashcards exist
    if (!flashcards || flashcards.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
          <AppHeader userInitial="J" active="Flashcards" />
          <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleBackToSets}
                className="mb-4 text-blue-700 hover:text-blue-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Sets
              </Button>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                No flashcards available
              </h1>
              <p className="text-gray-600">
                This flashcard set appears to be empty or unavailable.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Reset currentCard if it's out of bounds
    if (currentCard >= flashcards.length) {
      setCurrentCard(0);
      return null; // Return null to trigger re-render
    }

    const currentFlashcard = flashcards[currentCard];

    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader userInitial="J" active="Flashcards" />

        <div className="container mx-auto max-w-4xl py-8 px-4">
          {/* Study Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="ghost"
                onClick={handleBackToSets}
                className="mb-2 text-blue-700 hover:text-blue-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Sets
              </Button>
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedSet.title}
              </h1>
              <p className="text-gray-600">
                {selectedSubject} • {flashcards.length} cards
              </p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {currentCard + 1} / {flashcards.length}
            </Badge>
          </div>

          {/* Progress */}
          <Progress
            value={((currentCard + 1) / flashcards.length) * 100}
            className="mb-8 h-3 bg-blue-100"
          />

          {/* Flashcard */}
          <div className="mb-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="border-0 shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-3xl min-h-[400px] flex items-center justify-center bg-gradient-to-br from-white to-blue-50"
                onClick={handleFlip}
              >
                <CardContent className="p-12 text-center w-full">
                  <div className="mb-6">
                    <Badge
                      className={
                        isFlipped
                          ? "bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors duration-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors duration-200"
                      }
                    >
                      {isFlipped ? "Answer" : "Question"}
                    </Badge>
                  </div>
                  <motion.div
                    key={`${currentCard}-${isFlipped}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-xl leading-relaxed font-medium"
                  >
                    {isFlipped ? currentFlashcard.back : currentFlashcard.front}
                  </motion.div>
                  <p className="text-sm text-gray-500 mt-8">
                    Click to {isFlipped ? "see question" : "reveal answer"}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCard === 0}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleFlip}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Flip Card
            </Button>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentCard === flashcards.length - 1}
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
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
      <AppHeader userInitial="J" active="Flashcards" />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white shadow-lg rounded-b-3xl mb-12">
        <div className="container mx-auto text-center relative z-10">
          <nav className="mb-4 text-sm text-emerald-100/80">
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            &gt; <span>Flashcards</span>
            {selectedCategoryData && (
              <>
                {" "}
                &gt; <span>{selectedCategoryData.title}</span>
              </>
            )}
            {selectedSubjectData && (
              <>
                {" "}
                &gt; <span>{selectedSubjectData.name}</span>
              </>
            )}
          </nav>

          <div className="flex justify-center gap-4 mb-6 flex-wrap">
            {subjectCategories.slice(0, 4).map((cat, i) => {
              const Icon = cat.icon;
              return (
                <span
                  key={cat.id}
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 text-white text-2xl shadow-lg"
                >
                  <Icon className="w-7 h-7" />
                </span>
              );
            })}
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 drop-shadow-lg">
            {selectedSubjectData
              ? `${selectedSubjectData.name} Flashcards`
              : selectedCategoryData
              ? selectedCategoryData.title
              : "Interactive Flashcards"}
          </h1>
          <p className="text-lg sm:text-xl text-emerald-100/90 max-w-2xl mx-auto mb-2">
            {selectedSubjectData
              ? `Master ${selectedSubjectData.name} concepts with interactive flashcards`
              : selectedCategoryData
              ? `Study ${selectedCategoryData.title.toLowerCase()} subjects with flashcards`
              : "Study smarter with interactive flashcards. Choose a category to get started!"}
          </p>
        </div>

        {/* Decorative SVG blobs */}
        <svg
          className="absolute -top-24 -left-24 w-96 h-96 opacity-20 blur-2xl"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#10b981"
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
            fill="#3b82f6"
            d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
            transform="translate(100 100)"
          />
        </svg>
      </section>

      <div className="container mx-auto pb-16 px-4">
        {/* Back Buttons */}
        {selectedSubjectData && (
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBackToSubjects}
              className="flex items-center gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Subjects
            </Button>
          </div>
        )}

        {selectedCategoryData && !selectedSubjectData && (
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={handleBackToCategories}
              className="flex items-center gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
          </div>
        )}

        {/* Content */}
        {!selectedCategoryData ? (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">
            {subjectCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <div
                      className={`h-2 bg-gradient-to-r ${category.gradient}`}
                    ></div>
                    <CardContent className="p-8 flex flex-col items-center text-center h-full">
                      <div className="mb-5">
                        <span
                          className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${category.gradient} text-white text-3xl shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-8 h-8" />
                        </span>
                      </div>
                      <div className="font-bold text-xl text-gray-800 mb-2">
                        {category.title}
                      </div>
                      <div className="text-sm text-gray-500 mb-6">
                        {category.description}
                      </div>
                      <div className="text-xs text-gray-400 mb-4">
                        {category.subjects.length} subjects available
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${category.gradient} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all`}
                      >
                        Explore Subjects
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : !selectedSubjectData ? (
          /* Subjects Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {selectedCategoryData.subjects.map((subject) => {
              const SubjIcon = subject.icon;
              const flashcardSets = getFlashcardSetsFromData(subject.name);
              return (
                <motion.div
                  key={subject.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    className="shadow-xl border-0 rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 group cursor-pointer overflow-hidden"
                    onClick={() => handleSubjectClick(subject.name)}
                  >
                    <div
                      className={`h-1 bg-gradient-to-r ${subject.gradient}`}
                    ></div>
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r ${subject.gradient} text-white text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                        >
                          <SubjIcon className="w-7 h-7" />
                        </span>
                      </div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {subject.name}
                      </div>
                      <div className="text-xs text-gray-500 mb-4">
                        {flashcardSets.length} set
                        {flashcardSets.length !== 1 ? "s" : ""} available
                      </div>
                      <Button
                        className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 text-white font-semibold py-2 px-4 rounded-lg shadow group-hover:shadow-lg transition-all`}
                      >
                        View Sets
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Flashcard Sets Grid */
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedSubjectData.name} Flashcard Sets
                </h2>
                <p className="text-gray-600">Choose a set to start studying</p>
              </div>
              {isLoggedIn ? (
                <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Set
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Flashcard Set</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Set Title
                        </label>
                        <Input
                          value={newSetTitle}
                          onChange={(e) => setNewSetTitle(e.target.value)}
                          placeholder="Enter set title..."
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Flashcards
                        </label>
                        <div className="space-y-3">
                          {newCards.map((card, index) => (
                            <div
                              key={index}
                              className="border border-blue-200 rounded-lg p-4"
                            >
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">
                                  Card {index + 1}
                                </span>
                                {newCards.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeCard(index)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Front (Question)
                                  </label>
                                  <Textarea
                                    value={card.front}
                                    onChange={(e) =>
                                      updateCard(index, "front", e.target.value)
                                    }
                                    placeholder="Enter question..."
                                    className="border-blue-200 focus:border-blue-500"
                                    rows={3}
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-500 mb-1">
                                    Back (Answer)
                                  </label>
                                  <Textarea
                                    value={card.back}
                                    onChange={(e) =>
                                      updateCard(index, "back", e.target.value)
                                    }
                                    placeholder="Enter answer..."
                                    className="border-blue-200 focus:border-blue-500"
                                    rows={3}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addNewCard}
                            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Another Card
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleCreateSet}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
                          disabled={
                            isCreating ||
                            !newSetTitle.trim() ||
                            !newCards.some(
                              (card) => card.front.trim() && card.back.trim()
                            )
                          }
                        >
                          {isCreating ? (
                            <>
                              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Creating...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4 mr-2" />
                              Create Set
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowCreateForm(false)}
                          className="border-gray-200 text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-2">
                    Sign in to create your own flashcards
                  </p>
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Edit Flashcard Set Dialog */}
            <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Flashcard Set</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Set Title
                    </label>
                    <Input
                      value={newSetTitle}
                      onChange={(e) => setNewSetTitle(e.target.value)}
                      placeholder="Enter set title..."
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Flashcards
                    </label>
                    <div className="space-y-3">
                      {newCards.map((card, index) => (
                        <div
                          key={index}
                          className="border border-green-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              Card {index + 1}
                            </span>
                            {newCards.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeCard(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Front (Question)
                              </label>
                              <Textarea
                                value={card.front}
                                onChange={(e) =>
                                  updateCard(index, "front", e.target.value)
                                }
                                placeholder="Enter question..."
                                className="border-green-200 focus:border-green-500"
                                rows={3}
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">
                                Back (Answer)
                              </label>
                              <Textarea
                                value={card.back}
                                onChange={(e) =>
                                  updateCard(index, "back", e.target.value)
                                }
                                placeholder="Enter answer..."
                                className="border-green-200 focus:border-green-500"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addNewCard}
                        className="w-full border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Another Card
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleUpdateSet}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={
                        isEditing ||
                        !newSetTitle.trim() ||
                        !newCards.some(
                          (card) => card.front.trim() && card.back.trim()
                        )
                      }
                    >
                      {isEditing ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Set
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditForm(false);
                        setEditingSet(null);
                        setNewSetTitle("");
                        setNewCards([{ front: "", back: "" }]);
                      }}
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ...getFlashcardSetsFromData(selectedSubjectData.name),
                ...userSets,
              ].map((set, index) => {
                const colors = [
                  "from-emerald-500 to-teal-500",
                  "from-blue-500 to-cyan-500",
                  "from-purple-500 to-indigo-500",
                  "from-pink-500 to-rose-500",
                  "from-orange-500 to-amber-500",
                  "from-indigo-500 to-purple-500",
                ];
                const colorClass = colors[index % colors.length];

                return (
                  <motion.div
                    key={set.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
                      onClick={() => handleSetSelect(set)}
                    >
                      <div
                        className={`h-1 bg-gradient-to-r ${colorClass}`}
                      ></div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            className={`${
                              set.isUserCreated
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-blue-100 text-blue-700"
                            } hover:bg-opacity-80 transition-colors duration-200`}
                          >
                            {set.difficulty}
                          </Badge>
                          {set.isUserCreated && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 h-auto text-gray-400 hover:text-gray-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditSet(set);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="p-1 h-auto text-red-400 hover:text-red-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSet(set.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                          {set.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {set.cardCount} cards • {set.progress}% complete
                        </p>
                        <Progress
                          value={set.progress}
                          className="mb-4 h-2 bg-gray-100"
                        />
                        <Button
                          className={`w-full bg-gradient-to-r ${colorClass} hover:opacity-90 text-white`}
                        >
                          Study Now
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
