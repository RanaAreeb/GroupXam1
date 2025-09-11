"use client";
import { use } from "react";
import AppHeader from "@/components/ui/app-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, ArrowLeft, Target, Clock, Users, BookOpen, Headphones, MessageSquare } from "lucide-react";
import Link from "next/link";

const syllabusData: Record<string, { 
  title: string; 
  description: string; 
  topics: string[]; 
  duration: string; 
  questions: number; 
  sections: Array<{
    title: string;
    description: string;
    tasks: string[];
    tips: string[];
  }>;
  bandDescriptors: Array<{
    band: string;
    description: string;
  }>;
  pdfUrl?: string;
}> = {
  reading: {
    title: "IELTS Reading",
    description: "Comprehensive guide to IELTS Reading test format, question types, and scoring criteria",
    topics: [
      "True/False/Not Given", "Multiple Choice", "Matching Headings", 
      "Sentence Completion", "Summary Completion", "Yes/No/Not Given",
      "Matching Information", "Short Answer", "Matching Endings"
    ],
    duration: "60 minutes",
    questions: 40,
    sections: [
      {
        title: "Test Format",
        description: "The IELTS Reading test consists of three passages with increasing difficulty",
        tasks: [
          "Academic: 3 long texts from books, journals, magazines, newspapers",
          "General Training: 3 sections with texts from advertisements, notices, official documents",
          "40 questions total across all passages",
          "No extra time for transferring answers"
        ],
        tips: [
          "Read questions first to understand what to look for",
          "Skim the passage to get the general idea",
          "Use keywords to locate specific information",
          "Don't spend too much time on difficult questions"
        ]
      },
      {
        title: "Question Types",
        description: "Various question types test different reading skills",
        tasks: [
          "Multiple choice: Choose the best answer from options",
          "True/False/Not Given: Determine if statements agree with the text",
          "Matching headings: Match headings to paragraphs",
          "Sentence completion: Complete sentences with words from the text"
        ],
        tips: [
          "Look for paraphrasing in questions and answers",
          "Pay attention to word limits for completion tasks",
          "Use elimination strategy for multiple choice",
          "Check spelling and grammar in your answers"
        ]
      }
    ],
    bandDescriptors: [
      { band: "9", description: "Expert user - Has fully operational command of the language" },
      { band: "8", description: "Very good user - Has fully operational command with occasional inaccuracies" },
      { band: "7", description: "Good user - Has operational command though with occasional inaccuracies" },
      { band: "6", description: "Competent user - Has generally effective command despite some inaccuracies" }
    ]
  },
  listening: {
    title: "IELTS Listening",
    description: "Complete guide to IELTS Listening test structure, question types, and preparation strategies",
    topics: [
      "Multiple Choice", "Form Completion", "Note Completion", 
      "Table Completion", "Sentence Completion", "Short Answer",
      "Map/Plan Labelling"
    ],
    duration: "30 minutes + 10 minutes transfer",
    questions: 40,
    sections: [
      {
        title: "Test Format",
        description: "Four sections with increasing difficulty, covering different contexts",
        tasks: [
          "Section 1: Conversation between two people in everyday context",
          "Section 2: Monologue in everyday context (e.g., speech about local facilities)",
          "Section 3: Conversation between up to 4 people in educational context",
          "Section 4: Monologue on academic subject (e.g., university lecture)"
        ],
        tips: [
          "Listen for keywords and synonyms",
          "Pay attention to signposting language",
          "Use the time before each section to read questions",
          "Check your spelling and grammar during transfer time"
        ]
      },
      {
        title: "Question Types",
        description: "Various formats test different listening skills",
        tasks: [
          "Multiple choice: Choose correct answer from options",
          "Form completion: Fill in missing information",
          "Note completion: Complete notes with key information",
          "Map/Plan labelling: Label locations on a map or plan"
        ],
        tips: [
          "Predict possible answers before listening",
          "Listen for numbers, dates, and proper nouns carefully",
          "Don't leave blanks - make educated guesses",
          "Use British and American spelling variations"
        ]
      }
    ],
    bandDescriptors: [
      { band: "9", description: "Expert user - Understands extended speech even when not clearly structured" },
      { band: "8", description: "Very good user - Understands extended speech with minimal effort" },
      { band: "7", description: "Good user - Understands extended speech on familiar topics" },
      { band: "6", description: "Competent user - Understands main points of clear standard speech" }
    ]
  },
  writing: {
    title: "IELTS Writing",
    description: "Detailed guide to IELTS Writing tasks, assessment criteria, and band descriptors",
    topics: [
      "Task 1: Academic (Graphs/Charts/Processes)", "Task 1: General Training (Letters)",
      "Task 2: Essay Writing", "Assessment Criteria", "Band Descriptors"
    ],
    duration: "60 minutes",
    questions: 2,
    sections: [
      {
        title: "Task 1 (20 minutes)",
        description: "Different requirements for Academic and General Training",
        tasks: [
          "Academic: Describe visual information (graphs, charts, diagrams, processes)",
          "General Training: Write a letter (formal, semi-formal, or informal)",
          "Minimum 150 words",
          "Spend about 20 minutes on this task"
        ],
        tips: [
          "Academic: Focus on trends, comparisons, and key features",
          "General Training: Follow appropriate letter format and tone",
          "Use a variety of vocabulary and sentence structures",
          "Check word count and time management"
        ]
      },
      {
        title: "Task 2 (40 minutes)",
        description: "Essay writing for both Academic and General Training",
        tasks: [
          "Write an essay in response to a point of view, argument, or problem",
          "Minimum 250 words",
          "Spend about 40 minutes on this task",
          "Present and justify an opinion or discuss a topic"
        ],
        tips: [
          "Plan your essay before writing",
          "Use clear paragraph structure (introduction, body, conclusion)",
          "Support your ideas with examples and explanations",
          "Use formal academic language and avoid contractions"
        ]
      }
    ],
    bandDescriptors: [
      { band: "9", description: "Expert user - Uses language with full flexibility and precision" },
      { band: "8", description: "Very good user - Uses language with flexibility and precision" },
      { band: "7", description: "Good user - Uses language with flexibility and precision" },
      { band: "6", description: "Competent user - Uses language with flexibility and precision" }
    ]
  },
  speaking: {
    title: "IELTS Speaking",
    description: "Complete guide to IELTS Speaking test format, assessment criteria, and preparation tips",
    topics: [
      "Part 1: Introduction & Interview", "Part 2: Individual Long Turn",
      "Part 3: Two-way Discussion", "Assessment Criteria", "Fluency & Coherence"
    ],
    duration: "11-14 minutes",
    questions: 3,
    sections: [
      {
        title: "Part 1: Introduction & Interview (4-5 minutes)",
        description: "General questions about yourself and familiar topics",
        tasks: [
          "Answer questions about home, work, studies, hobbies",
          "Give personal information and opinions",
          "Speak naturally and confidently",
          "Use a range of vocabulary and grammar"
        ],
        tips: [
          "Give detailed answers, not just yes/no responses",
          "Use examples to support your points",
          "Speak clearly and at a natural pace",
          "Don't memorize answers - be authentic"
        ]
      },
      {
        title: "Part 2: Individual Long Turn (3-4 minutes)",
        description: "Speak for 1-2 minutes on a given topic using a cue card",
        tasks: [
          "1 minute preparation time with cue card",
          "Speak for 1-2 minutes on the topic",
          "Answer follow-up questions",
          "Use the prompts on the cue card to structure your talk"
        ],
        tips: [
          "Use the preparation time wisely - make notes",
          "Structure your talk with introduction, main points, conclusion",
          "Keep talking until the examiner stops you",
          "Use personal examples and experiences"
        ]
      },
      {
        title: "Part 3: Two-way Discussion (4-5 minutes)",
        description: "Abstract discussion related to Part 2 topic",
        tasks: [
          "Discuss abstract ideas and concepts",
          "Express and justify opinions",
          "Compare and contrast different viewpoints",
          "Speculate about future developments"
        ],
        tips: [
          "Give detailed, well-developed answers",
          "Use complex grammar and vocabulary",
          "Support your opinions with reasons and examples",
          "Engage with the examiner's questions"
        ]
      }
    ],
    bandDescriptors: [
      { band: "9", description: "Expert user - Speaks fluently with only rare repetition or self-correction" },
      { band: "8", description: "Very good user - Speaks fluently with occasional repetition or self-correction" },
      { band: "7", description: "Good user - Speaks at length without noticeable effort" },
      { band: "6", description: "Competent user - Is willing to speak at length with some hesitation" }
    ]
  },
};

export default function IeltsSyllabusPage({ params }: { params: Promise<{ subject: string }> }) {
  const resolvedParams = use(params);
  const key = (resolvedParams.subject || "reading").toLowerCase();
  const subjectData = syllabusData[key];

  if (!subjectData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <AppHeader active="Exams" />
        <div className="container mx-auto py-12 px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Subject Not Found</h1>
          <Link href="/exams/ielts">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to IELTS
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Exams" />
      <div className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <Link href="/exams/ielts">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to IELTS Exams
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {subjectData.title}
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subjectData.description}</p>
            {key === "reading" && (
              <div className="mt-4">
                <Link href="/exams/ielts?tab=practice&showReading=true">
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full">
                    Start Reading Practice
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Test Overview */}
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Test Overview</h2>
                    <p className="text-gray-600">Format, duration, and question types</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Question Types</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {subjectData.topics.map((topic, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span className="text-gray-700 font-medium">{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-semibold text-gray-800">{subjectData.duration}</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <Target className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Questions</div>
                      <div className="font-semibold text-gray-800">{subjectData.questions}</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                      <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Format</div>
                      <div className="font-semibold text-gray-800">Multiple choice & tasks</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Sections */}
            {subjectData.sections.map((section, index) => (
              <Card key={index} className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{section.title}</h2>
                  <p className="text-gray-600 mb-6">{section.description}</p>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Tasks</h3>
                      <ul className="space-y-2">
                        {section.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips & Strategies</h3>
                      <ul className="space-y-2">
                        {section.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Band Descriptors */}
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Band Score Descriptors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {subjectData.bandDescriptors.map((descriptor, i) => (
                    <div key={i} className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg border border-emerald-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-emerald-600 text-white font-bold text-lg px-3 py-1">
                          {descriptor.band}
                        </Badge>
                      </div>
                      <p className="text-gray-700 text-sm">{descriptor.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Official Resources</h3>
                <p className="text-gray-600 text-sm mb-4">Get free official IELTS preparation materials and information.</p>
                <div className="space-y-2">
                  <Button asChild className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-semibold text-sm">
                    <a href="https://www.ielts.org" target="_blank" rel="noopener noreferrer">IELTS Official Website</a>
                  </Button>
                  
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-xl border-0 rounded-2xl bg-white/80 backdrop-blur-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {key === "reading" && (
                    <Button asChild className="w-full justify-start bg-emerald-600 hover:bg-emerald-700 text-white">
                      <Link href="/exams/ielts?tab=practice&showReading=true">
                        <BookOpen className="w-4 h-4 mr-2" />Reading Practice
                      </Link>
                    </Button>
                  )}
                  {key === "listening" && (
                    <Button asChild className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                      <Link href="/exams/ielts?tab=practice&showListening=true">
                        <Headphones className="w-4 h-4 mr-2" />Listening Practice
                      </Link>
                    </Button>
                  )}
                  {key === "writing" && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/exams/ielts?tab=practice">
                        <MessageSquare className="w-4 h-4 mr-2" />Writing Practice
                      </Link>
                    </Button>
                  )}
                  {key === "speaking" && (
                    <Button asChild variant="outline" className="w-full justify-start">
                      <Link href="/exams/ielts?tab=practice">
                        <MessageSquare className="w-4 h-4 mr-2" />Speaking Practice
                      </Link>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="w-full justify-start">
                    <Link href="/exams/ielts?tab=mock">
                      <Target className="w-4 h-4 mr-2" />Mock Exams
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


