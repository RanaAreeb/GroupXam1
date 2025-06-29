"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  BookOpen,
  Target,
  Users,
  Trophy,
  Play,
  AlertCircle,
  Star,
  Search,
  GraduationCap,
  School,
  Calculator,
  Atom,
  FlaskConical,
  Brain,
  Heart,
  Leaf,
  Microscope,
  Pill,
  TreePine,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calculator as FinanceIcon,
  Vote,
  BookMarked,
  Globe,
  TestTube,
  Dna,
  Leaf as EcologyIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import AppHeader from "@/components/ui/app-header";

// Exam Types
const examTypes = [
  {
    id: "waec",
    title: "WAEC",
    description: "West African Examinations Council",
    icon: GraduationCap,
    color: "emerald",
    count: 45,
    difficulty: "Advanced",
  },
  {
    id: "wassce",
    title: "WASSCE",
    description: "West African Senior School Certificate Examination",
    icon: School,
    color: "blue",
    count: 38,
    difficulty: "Advanced",
  },
  {
    id: "sat",
    title: "SAT",
    description: "Scholastic Assessment Test",
    icon: BookMarked,
    color: "purple",
    count: 25,
    difficulty: "Advanced",
  },
  {
    id: "act",
    title: "ACT",
    description: "American College Testing",
    icon: TestTube,
    color: "orange",
    count: 22,
    difficulty: "Advanced",
  },
];

// Subject Categories
const subjectCategories = [
  {
    id: "sciences",
    title: "Sciences",
    description: "Physics, Chemistry, Biology & Related Sciences",
    icon: Atom,
    color: "emerald",
    subjects: [
      {
        name: "Physics",
        icon: Atom,
        subcategories: [
          "Mechanics",
          "Thermodynamics",
          "Electromagnetism",
          "Optics",
          "Modern Physics",
        ],
        examCount: 12,
        color: "emerald",
      },
      {
        name: "Chemistry",
        icon: FlaskConical,
        subcategories: [
          "Inorganic Chemistry",
          "Physical Chemistry",
          "Analytical Chemistry",
          "Chemical Bonding",
          "Reactions",
        ],
        examCount: 15,
        color: "blue",
      },
      {
        name: "Organic Chemistry",
        icon: TestTube,
        subcategories: [
          "Alkanes & Alkenes",
          "Alcohols & Ethers",
          "Carboxylic Acids",
          "Amines",
          "Polymers",
        ],
        examCount: 10,
        color: "purple",
      },
      {
        name: "Microbiology",
        icon: Microscope,
        subcategories: [
          "Bacterial Structure",
          "Microbial Growth",
          "Pathogenesis",
          "Immunology",
          "Virology",
        ],
        examCount: 8,
        color: "orange",
      },
      {
        name: "Anatomy",
        icon: Heart,
        subcategories: [
          "Skeletal System",
          "Muscular System",
          "Nervous System",
          "Cardiovascular System",
          "Digestive System",
        ],
        examCount: 9,
        color: "red",
      },
      {
        name: "Physiology",
        icon: Brain,
        subcategories: [
          "Cell Physiology",
          "Neurophysiology",
          "Cardiovascular Physiology",
          "Respiratory Physiology",
          "Endocrinology",
        ],
        examCount: 11,
        color: "pink",
      },
      {
        name: "Biology",
        icon: Leaf,
        subcategories: [
          "Cell Biology",
          "Genetics",
          "Ecology",
          "Evolution",
          "Human Biology",
        ],
        examCount: 14,
        color: "green",
      },
      {
        name: "Biochemistry",
        icon: Dna,
        subcategories: [
          "Proteins",
          "Carbohydrates",
          "Lipids",
          "Nucleic Acids",
          "Enzymes",
        ],
        examCount: 7,
        color: "indigo",
      },
      {
        name: "Pharmacology",
        icon: Pill,
        subcategories: [
          "Drug Actions",
          "Pharmacokinetics",
          "Toxicology",
          "Clinical Pharmacology",
          "Drug Interactions",
        ],
        examCount: 6,
        color: "violet",
      },
      {
        name: "Ecology",
        icon: EcologyIcon,
        subcategories: [
          "Population Ecology",
          "Community Ecology",
          "Ecosystem Ecology",
          "Conservation Biology",
          "Environmental Science",
        ],
        examCount: 8,
        color: "teal",
      },
      {
        name: "Psychology",
        icon: Brain,
        subcategories: [
          "Cognitive Psychology",
          "Social Psychology",
          "Developmental Psychology",
          "Clinical Psychology",
          "Behavioral Psychology",
        ],
        examCount: 9,
        color: "amber",
      },
    ],
  },
  {
    id: "economics",
    title: "Economics & Business",
    description: "Economics, Finance, Accounting & Political Science",
    icon: DollarSign,
    color: "blue",
    subjects: [
      {
        name: "Economics",
        icon: DollarSign,
        subcategories: [
          "Supply & Demand",
          "Market Structures",
          "Economic Systems",
          "International Trade",
          "Economic Development",
        ],
        examCount: 12,
        color: "blue",
      },
      {
        name: "Micro Economics",
        icon: TrendingDown,
        subcategories: [
          "Consumer Behavior",
          "Production Theory",
          "Cost Analysis",
          "Market Equilibrium",
          "Elasticity",
        ],
        examCount: 10,
        color: "cyan",
      },
      {
        name: "Macro Economics",
        icon: TrendingUp,
        subcategories: [
          "National Income",
          "Inflation",
          "Unemployment",
          "Fiscal Policy",
          "Monetary Policy",
        ],
        examCount: 11,
        color: "sky",
      },
      {
        name: "Accounting",
        icon: Calculator,
        subcategories: [
          "Financial Accounting",
          "Managerial Accounting",
          "Cost Accounting",
          "Auditing",
          "Taxation",
        ],
        examCount: 13,
        color: "emerald",
      },
      {
        name: "Finance",
        icon: FinanceIcon,
        subcategories: [
          "Corporate Finance",
          "Investment Analysis",
          "Financial Markets",
          "Risk Management",
          "Portfolio Theory",
        ],
        examCount: 9,
        color: "purple",
      },
      {
        name: "Political Science",
        icon: Vote,
        subcategories: [
          "Political Theory",
          "Comparative Politics",
          "International Relations",
          "Public Policy",
          "Political Institutions",
        ],
        examCount: 8,
        color: "red",
      },
    ],
  },
  {
    id: "mathematics",
    title: "Mathematics",
    description: "All Mathematical Disciplines",
    icon: Calculator,
    color: "purple",
    subjects: [
      {
        name: "Statistics",
        icon: Calculator,
        subcategories: [
          "Descriptive Statistics",
          "Inferential Statistics",
          "Probability",
          "Hypothesis Testing",
          "Regression Analysis",
        ],
        examCount: 15,
        color: "purple",
      },
      {
        name: "Calculus",
        icon: Calculator,
        subcategories: [
          "Limits & Continuity",
          "Differentiation",
          "Integration",
          "Applications",
          "Multivariable Calculus",
        ],
        examCount: 18,
        color: "indigo",
      },
      {
        name: "Algebra",
        icon: Calculator,
        subcategories: [
          "Linear Algebra",
          "Abstract Algebra",
          "Number Theory",
          "Group Theory",
          "Ring Theory",
        ],
        examCount: 16,
        color: "blue",
      },
      {
        name: "Arithmetic",
        icon: Calculator,
        subcategories: [
          "Basic Operations",
          "Fractions & Decimals",
          "Percentages",
          "Ratios & Proportions",
          "Number Systems",
        ],
        examCount: 12,
        color: "emerald",
      },
      {
        name: "Geometry",
        icon: Calculator,
        subcategories: [
          "Euclidean Geometry",
          "Coordinate Geometry",
          "Trigonometry",
          "Analytic Geometry",
          "Solid Geometry",
        ],
        examCount: 14,
        color: "teal",
      },
      {
        name: "Trigonometry",
        icon: Calculator,
        subcategories: [
          "Trigonometric Functions",
          "Identities",
          "Equations",
          "Applications",
          "Inverse Functions",
        ],
        examCount: 11,
        color: "cyan",
      },
      {
        name: "Pythagorean Theorem",
        icon: Calculator,
        subcategories: [
          "Right Triangles",
          "Applications",
          "Proofs",
          "Extensions",
          "Real-world Problems",
        ],
        examCount: 8,
        color: "orange",
      },
    ],
  },
];

const recentExams = [
  {
    id: 1,
    title: "WAEC Physics 2024",
    subject: "Physics",
    examType: "WAEC",
    duration: "3 hours",
    questions: 50,
    difficulty: "Advanced",
    participants: 1250,
    rating: 4.8,
    lastTaken: "2 days ago",
    bestScore: 85,
    color: "emerald",
  },
  {
    id: 2,
    title: "SAT Mathematics",
    subject: "Mathematics",
    examType: "SAT",
    duration: "2.5 hours",
    questions: 58,
    difficulty: "Advanced",
    participants: 890,
    rating: 4.6,
    lastTaken: "1 week ago",
    bestScore: 78,
    color: "blue",
  },
  {
    id: 3,
    title: "WASSCE Chemistry",
    subject: "Chemistry",
    examType: "WASSCE",
    duration: "2 hours",
    questions: 35,
    difficulty: "Advanced",
    participants: 675,
    rating: 4.7,
    lastTaken: "3 days ago",
    bestScore: 92,
    color: "purple",
  },
  {
    id: 4,
    title: "ACT Biology",
    subject: "Biology",
    examType: "ACT",
    duration: "2 hours",
    questions: 45,
    difficulty: "Advanced",
    participants: 1100,
    rating: 4.9,
    lastTaken: "5 days ago",
    bestScore: 88,
    color: "emerald",
  },
];

const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

export default function ExamsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories/subjects by search
  const filteredCategories = subjectCategories
    .map((cat) => ({
      ...cat,
      subjects: cat.subjects.filter((subj) =>
        subj.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((cat) => cat.subjects.length > 0);

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: {
        bg: "from-emerald-500 to-emerald-600",
        light: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        button: "bg-emerald-600 hover:bg-emerald-700",
      },
      blue: {
        bg: "from-blue-500 to-blue-600",
        light: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700",
      },
      purple: {
        bg: "from-purple-500 to-purple-600",
        light: "bg-purple-50",
        text: "text-purple-600",
        border: "border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700",
      },
      orange: {
        bg: "from-orange-500 to-orange-600",
        light: "bg-orange-50",
        text: "text-orange-600",
        border: "border-orange-200",
        button: "bg-orange-600 hover:bg-orange-700",
      },
      red: {
        bg: "from-red-500 to-red-600",
        light: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        button: "bg-red-600 hover:bg-red-700",
      },
      pink: {
        bg: "from-pink-500 to-pink-600",
        light: "bg-pink-50",
        text: "text-pink-600",
        border: "border-pink-200",
        button: "bg-pink-600 hover:bg-pink-700",
      },
      green: {
        bg: "from-green-500 to-green-600",
        light: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
        button: "bg-green-600 hover:bg-green-700",
      },
      indigo: {
        bg: "from-indigo-500 to-indigo-600",
        light: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-200",
        button: "bg-indigo-600 hover:bg-indigo-700",
      },
      violet: {
        bg: "from-violet-500 to-violet-600",
        light: "bg-violet-50",
        text: "text-violet-600",
        border: "border-violet-200",
        button: "bg-violet-600 hover:bg-violet-700",
      },
      teal: {
        bg: "from-teal-500 to-teal-600",
        light: "bg-teal-50",
        text: "text-teal-600",
        border: "border-teal-200",
        button: "bg-teal-600 hover:bg-teal-700",
      },
      amber: {
        bg: "from-amber-500 to-amber-600",
        light: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        button: "bg-amber-600 hover:bg-amber-700",
      },
      cyan: {
        bg: "from-cyan-500 to-cyan-600",
        light: "bg-cyan-50",
        text: "text-cyan-600",
        border: "border-cyan-200",
        button: "bg-cyan-600 hover:bg-cyan-700",
      },
      sky: {
        bg: "from-sky-500 to-sky-600",
        light: "bg-sky-50",
        text: "text-sky-600",
        border: "border-sky-200",
        button: "bg-sky-600 hover:bg-sky-700",
      },
    };
    return colors[color as keyof typeof colors] || colors.emerald;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader userInitial="J" active="Exams" />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              Practice Exams
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            All subjects are organized by category. Click to explore
            subcategories and start practicing!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="space-y-6">
          {filteredCategories.map((category) => {
            const Icon = category.icon;
            const isCatOpen = expandedCategory === category.id;
            return (
              <Card key={category.id} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <button
                    className="flex items-center w-full text-left focus:outline-none"
                    onClick={() =>
                      setExpandedCategory(isCatOpen ? null : category.id)
                    }
                  >
                    <div
                      className={`w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mr-4`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {category.title}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {category.description}
                      </p>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">
                      {category.subjects.length} subjects
                    </span>
                  </button>
                  {isCatOpen && (
                    <div className="mt-6 space-y-4">
                      {category.subjects.map((subject) => {
                        const SubjIcon = subject.icon;
                        const isSubjOpen = expandedSubject === subject.name;
                        return (
                          <div
                            key={subject.name}
                            className="bg-gray-50 rounded-lg p-4"
                          >
                            <button
                              className="flex items-center w-full text-left focus:outline-none"
                              onClick={() =>
                                setExpandedSubject(
                                  isSubjOpen ? null : subject.name
                                )
                              }
                            >
                              <SubjIcon className="w-5 h-5 text-gray-600 mr-3" />
                              <span className="font-medium text-gray-800">
                                {subject.name}
                              </span>
                              <Badge
                                variant="secondary"
                                className="ml-2 text-xs"
                              >
                                {subject.examCount} exams
                              </Badge>
                              <span className="ml-auto text-xs text-gray-500">
                                {isSubjOpen ? "▲" : "▼"}
                              </span>
                            </button>
                            {isSubjOpen && (
                              <div className="mt-3 ml-8">
                                <div className="text-sm text-gray-700 font-semibold mb-1">
                                  Subcategories:
                                </div>
                                <ul className="list-disc ml-5 text-gray-600 text-sm space-y-1">
                                  {subject.subcategories.map((subcat) => (
                                    <li key={subcat}>{subcat}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 mt-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                200+
              </div>
              <div className="text-sm text-gray-600">Exams Available</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">15K+</div>
              <div className="text-sm text-gray-600">Students Practicing</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-purple-600 mb-1">96%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-blue-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                2.5h
              </div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </CardContent>
          </Card>
        </div>

        {/* Exam Types */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Choose Your Exam Type
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {examTypes.map((examType) => {
              const Icon = examType.icon;
              const colors = getColorClasses(examType.color);

              return (
                <Card
                  key={examType.id}
                  className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {examType.title}
                    </h3>
                    <p className="text-gray-600 mb-3 text-xs leading-relaxed">
                      {examType.description}
                    </p>
                    <div className="flex justify-between items-center mb-4 text-xs">
                      <Badge variant="secondary">{examType.count} Exams</Badge>
                      <Badge className={colors.text}>
                        {examType.difficulty}
                      </Badge>
                    </div>
                    <Button
                      className={`w-full ${colors.button} shadow-md text-sm`}
                    >
                      Browse {examType.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-emerald-500 to-blue-500 text-white">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">
                  Exam Preparation Tips
                </h3>
                <ul className="space-y-2 text-emerald-100">
                  <li>• Read all questions carefully before starting</li>
                  <li>
                    • Manage your time effectively - don't spend too long on one
                    question
                  </li>
                  <li>• Review your answers before submitting</li>
                  <li>• Take practice exams regularly to build confidence</li>
                  <li>
                    • Focus on your weak areas and practice specific subjects
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
