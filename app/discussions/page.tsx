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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  ThumbsUp,
  Reply,
  Search,
  Plus,
  Clock,
  BookOpen,
} from "lucide-react";

const discussions = [
  {
    id: 1,
    title: "Help with Organic Chemistry Mechanisms",
    subject: "Chemistry",
    author: "Sarah M.",
    authorInitials: "SM",
    timeAgo: "2 hours ago",
    replies: 8,
    likes: 12,
    content:
      "I'm struggling with understanding SN1 and SN2 reaction mechanisms. Can someone explain the key differences?",
    tags: ["organic-chemistry", "mechanisms", "help"],
  },
  {
    id: 2,
    title: "Physics Problem: Projectile Motion",
    subject: "Physics",
    author: "John D.",
    authorInitials: "JD",
    timeAgo: "4 hours ago",
    replies: 15,
    likes: 23,
    content:
      "Working on a projectile motion problem where a ball is thrown at 45° angle. Need help with finding maximum height.",
    tags: ["physics", "projectile-motion", "problem-solving"],
  },
  {
    id: 3,
    title: "WAEC Mathematics Past Questions Discussion",
    subject: "Mathematics",
    author: "Emma K.",
    authorInitials: "EK",
    timeAgo: "1 day ago",
    replies: 32,
    likes: 45,
    content:
      "Let's discuss the 2023 WAEC Mathematics questions. I found question 15 particularly challenging.",
    tags: ["waec", "mathematics", "past-questions"],
  },
  {
    id: 4,
    title: "Biology: Photosynthesis vs Cellular Respiration",
    subject: "Biology",
    author: "Mike R.",
    authorInitials: "MR",
    timeAgo: "2 days ago",
    replies: 19,
    likes: 31,
    content:
      "Can someone help me create a comparison table between photosynthesis and cellular respiration?",
    tags: ["biology", "photosynthesis", "cellular-respiration"],
  },
];

const subjects = [
  "All",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Economics",
];

export default function DiscussionsPage() {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPost, setShowNewPost] = useState(false);

  const filteredDiscussions = discussions.filter((discussion) => {
    const matchesSubject =
      selectedSubject === "All" || discussion.subject === selectedSubject;
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

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
            <Link
              href="/flashcards"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Flashcards
            </Link>
            <Link href="/discussions" className="text-emerald-600 font-medium">
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
              Discussions
            </h1>
            <p className="text-gray-600">
              Connect with fellow students and get help
            </p>
          </div>
          <Button
            onClick={() => setShowNewPost(true)}
            className="bg-gradient-to-r from-emerald-500 to-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Discussion
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className={
                  selectedSubject === subject
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : ""
                }
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <Card className="border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle>Start a New Discussion</CardTitle>
              <CardDescription>
                Ask a question or share knowledge with the community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input placeholder="Discussion title..." />
                <select className="w-full p-2 border rounded-md">
                  <option>Select Subject</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Biology</option>
                  <option>Mathematics</option>
                  <option>Economics</option>
                </select>
                <Textarea
                  placeholder="What would you like to discuss?"
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-emerald-500 to-blue-500">
                    Post Discussion
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewPost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Discussions List */}
        <div className="space-y-6">
          {filteredDiscussions.map((discussion) => (
            <Card
              key={discussion.id}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      {discussion.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-emerald-100 text-emerald-700">
                        {discussion.subject}
                      </Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">
                        {discussion.timeAgo}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition-colors">
                      {discussion.title}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {discussion.content}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {discussion.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{discussion.replies} replies</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{discussion.likes} likes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>by {discussion.author}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-emerald-600 hover:text-emerald-700"
                      >
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredDiscussions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No discussions found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Be the first to start a discussion!"}
            </p>
            <Button
              onClick={() => setShowNewPost(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Discussion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
