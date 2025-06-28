"use client";

import { useState, useEffect } from "react";
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
import AppHeader from "@/components/ui/app-header";

const SUBJECTS = [
  "All",
  "Physics",
  "Chemistry",
  "Organic Chemistry",
  "Microbiology",
  "Anatomy",
  "Physiology",
  "Biology",
  "Biochemistry",
  "Pharmacology",
  "Ecology",
  "Psychology",
  "Economic",
  "Micro economics",
  "Macro economics",
  "Accounting",
  "Finance",
  "Political science",
];

interface Reply {
  author: string;
  authorInitials: string;
  content: string;
  createdAt?: string;
}

interface Discussion {
  _id: string;
  title: string;
  subject: string;
  author: string;
  authorInitials: string;
  content: string;
  tags: string[];
  replies: Reply[];
  likes: number;
  createdAt?: string;
}

export default function DiscussionsPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNewPost, setShowNewPost] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<{
    title: string;
    subject: string;
    content: string;
  }>({ title: "", subject: "", content: "" });
  const [replying, setReplying] = useState<Record<string, string>>({}); // { [discussionId]: replyText }
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});

  // Fetch discussions from API
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSubject && selectedSubject !== "All")
      params.append("subject", selectedSubject);
    if (searchQuery) params.append("search", searchQuery);
    fetch(`/api/discussions?${params.toString()}`)
      .then((res) => res.json())
      .then((data: Discussion[]) =>
        setDiscussions(Array.isArray(data) ? data : [])
      )
      .finally(() => setLoading(false));
  }, [selectedSubject, searchQuery, showNewPost]);

  // Handle new post form
  const handleNewPost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newPost.title || !newPost.subject || !newPost.content) return;
    setLoading(true);
    await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPost,
        author: "Anonymous", // Replace with user info if available
        authorInitials: "AN",
      }),
    });
    setShowNewPost(false);
    setNewPost({ title: "", subject: "", content: "" });
    setLoading(false);
  };

  // Handle reply
  const handleReply = async (discussionId: string) => {
    if (!replying[discussionId]) return;
    setReplyLoading((prev) => ({ ...prev, [discussionId]: true }));
    await fetch("/api/discussions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discussionId,
        reply: {
          author: "Anonymous",
          authorInitials: "AN",
          content: replying[discussionId],
        },
      }),
    });
    setReplying((prev) => ({ ...prev, [discussionId]: "" }));
    setReplyLoading((prev) => ({ ...prev, [discussionId]: false }));
    // Refetch discussions
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSubject && selectedSubject !== "All")
      params.append("subject", selectedSubject);
    if (searchQuery) params.append("search", searchQuery);
    fetch(`/api/discussions?${params.toString()}`)
      .then((res) => res.json())
      .then((data: Discussion[]) =>
        setDiscussions(Array.isArray(data) ? data : [])
      )
      .finally(() => setLoading(false));
  };

  const filteredDiscussions = discussions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Discussions" />
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
            <Plus className="w-4 h-4 mr-2" /> New Discussion
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
            {SUBJECTS.map((subject) => (
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
              <form className="space-y-4" onSubmit={handleNewPost}>
                <Input
                  placeholder="Discussion title..."
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, title: e.target.value }))
                  }
                  required
                />
                <select
                  className="w-full p-2 border rounded-md"
                  value={newPost.subject}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, subject: e.target.value }))
                  }
                  required
                >
                  <option value="">Select Subject</option>
                  {SUBJECTS.filter((s) => s !== "All").map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <Textarea
                  placeholder="What would you like to discuss?"
                  rows={4}
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, content: e.target.value }))
                  }
                  required
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-blue-500"
                  >
                    Post Discussion
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setShowNewPost(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        {/* Discussions List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-6">
            {filteredDiscussions.map((discussion) => (
              <Card
                key={discussion._id}
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
                          {discussion.createdAt
                            ? new Date(discussion.createdAt).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-emerald-600 transition-colors">
                        {discussion.title}
                      </h3>
                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {discussion.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags &&
                          discussion.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                      </div>
                      {/* Replies */}
                      {discussion.replies && discussion.replies.length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <div className="font-semibold mb-2 text-emerald-700">
                            Replies:
                          </div>
                          <div className="space-y-2">
                            {discussion.replies.map((reply, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <Avatar>
                                  <AvatarFallback className="bg-blue-100 text-blue-700">
                                    {reply.authorInitials || "AN"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-sm text-gray-800">
                                    {reply.author || "Anonymous"}
                                    <span className="ml-2 text-xs text-gray-400">
                                      {reply.createdAt
                                        ? new Date(
                                            reply.createdAt
                                          ).toLocaleString()
                                        : ""}
                                    </span>
                                  </div>
                                  <div className="text-gray-600 text-sm">
                                    {reply.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Reply Form */}
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          placeholder="Write a reply..."
                          value={replying[discussion._id] || ""}
                          onChange={(e) =>
                            setReplying((prev) => ({
                              ...prev,
                              [discussion._id]: e.target.value,
                            }))
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-emerald-600 hover:text-emerald-700"
                          disabled={replyLoading[discussion._id]}
                          onClick={() => handleReply(discussion._id)}
                        >
                          <Reply className="w-4 h-4 mr-1" /> Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Empty State */}
        {!loading && filteredDiscussions.length === 0 && (
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
              <Plus className="w-4 h-4 mr-2" /> Start Discussion
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
