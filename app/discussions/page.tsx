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
import { useAuth } from "@/hooks/use-auth";

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
  const { isLoggedIn, user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNewPost, setShowNewPost] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newPost, setNewPost] = useState<{
    title: string;
    subject: string;
    content: string;
    tags: string;
  }>({ title: "", subject: "All", content: "", tags: "" });
  const [replying, setReplying] = useState<Record<string, string>>({}); // { [discussionId]: replyText }
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [visibleDiscussions, setVisibleDiscussions] = useState(3);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [posting, setPosting] = useState(false);

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

  // Handle new discussion submit
  const handleNewPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const res = await fetch("/api/discussions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...newPost,
        tags: newPost.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        author: user?.name || "Anonymous",
        authorInitials: user?.name
          ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
          : "AN",
      }),
    });
    setPosting(false);
    if (res.ok) {
      const created = await res.json();
      setDiscussions((prev) => [created, ...prev]);
      setShowNewPost(false);
      setNewPost({ title: "", content: "", subject: "All", tags: "" });
    }
  };

  // Handle reply
  const handleReply = async (discussionId: string) => {
    if (!replying[discussionId]) return;
    setReplyLoading((prev) => ({ ...prev, [discussionId]: true }));
    const res = await fetch("/api/discussions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        discussionId,
        reply: {
          author: user?.name || "Anonymous",
          authorInitials: user?.name
            ? user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
            : "AN",
          content: replying[discussionId],
        },
      }),
    });
    setReplying((prev) => ({ ...prev, [discussionId]: "" }));
    setReplyLoading((prev) => ({ ...prev, [discussionId]: false }));
    // Update only the replies for this discussion in state
    if (res.ok) {
      setDiscussions((prev) =>
        prev.map((d) =>
          d._id === discussionId
            ? {
                ...d,
                replies: [
                  ...d.replies,
                  {
                    author: user?.name || "Anonymous",
                    authorInitials: user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "AN",
                    content: replying[discussionId],
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            : d
        )
      );
    }
  };

  const filteredDiscussions = discussions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Discussions" />
      <div className="container mx-auto py-8 px-4">
        {/* Header and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Discussions
            </h1>
            <p className="text-gray-500 text-base">
              Connect with fellow students and get help
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-72 px-4 py-2 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 focus:outline-none shadow-sm bg-white"
            />
            <Button className="ml-2" onClick={() => setSearchQuery("")}>
              Clear
            </Button>
          </div>
          <Button
            className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-md"
            onClick={() => setShowNewPost((v) => !v)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Discussion
          </Button>
        </div>
        {/* Subject Tabs */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
        {/* New Discussion Inline Form */}
        {showNewPost && (
          <form
            onSubmit={handleNewPost}
            className="bg-white rounded-lg shadow-md p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Title
              </label>
              <input
                type="text"
                required
                value={newPost.title}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="Enter a clear topic title"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Subject
              </label>
              <select
                value={newPost.subject}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, subject: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Content
              </label>
              <textarea
                required
                value={newPost.content}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, content: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
                rows={4}
                placeholder="Describe your question or topic in detail"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-1">
                Tags{" "}
                <span className="text-xs text-gray-400">(comma separated)</span>
              </label>
              <input
                type="text"
                value={newPost.tags}
                onChange={(e) =>
                  setNewPost((p) => ({ ...p, tags: e.target.value }))
                }
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-emerald-500"
                placeholder="e.g. exam, help, WAEC"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowNewPost(false)}
                disabled={posting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 text-white"
                disabled={posting}
              >
                {posting ? "Posting..." : "Post Discussion"}
              </Button>
            </div>
          </form>
        )}
        {/* Discussions List */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDiscussions
                .slice(0, visibleDiscussions)
                .map((discussion) => {
                  const replies = discussion.replies || [];
                  const showAll = expandedReplies[discussion._id];
                  const visibleReplies = showAll
                    ? replies
                    : replies.slice(0, 3);
                  const commentsOpen = openComments[discussion._id];
                  return (
                    <Card
                      key={discussion._id}
                      className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer max-w-xl mx-auto"
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
                                  ? new Date(
                                      discussion.createdAt
                                    ).toLocaleString()
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
                            {/* Comments Icon */}
                            <button
                              className="flex items-center gap-1 text-emerald-600 hover:text-emerald-800 text-sm font-medium mb-2 focus:outline-none"
                              onClick={() =>
                                setOpenComments((prev) => ({
                                  ...prev,
                                  [discussion._id]: !commentsOpen,
                                }))
                              }
                            >
                              <MessageSquare className="w-4 h-4" />
                              {replies.length}{" "}
                              {replies.length === 1 ? "Comment" : "Comments"}
                            </button>
                            {/* Replies (hidden by default, show on icon click) */}
                            {commentsOpen && (
                              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                <div className="font-semibold mb-2 text-emerald-700 flex items-center gap-2">
                                  Replies:
                                  <span className="text-xs text-gray-500">
                                    ({replies.length})
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  {visibleReplies.map((reply, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2"
                                    >
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
                                  {replies.length > 3 && (
                                    <button
                                      className="text-xs text-emerald-600 hover:underline mt-2"
                                      onClick={() =>
                                        setExpandedReplies((prev) => ({
                                          ...prev,
                                          [discussion._id]: !showAll,
                                        }))
                                      }
                                    >
                                      {showAll
                                        ? "Show less"
                                        : `Show more comments (${
                                            replies.length - 3
                                          })`}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                            {/* Reply Form (show only if comments open) */}
                            {commentsOpen && (
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
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
            {/* Show more discussions button */}
            {filteredDiscussions.length > visibleDiscussions && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setVisibleDiscussions((v) => v + 3)}
                  className="px-8 py-2 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50"
                >
                  Show more discussions
                </Button>
              </div>
            )}
          </>
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
