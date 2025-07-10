"use client";

import { useState, useCallback } from "react";
import useSWR from "swr";
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
  _id: string;
  author: string;
  authorInitials: string;
  content: string;
  createdAt?: string;
  replies?: NestedReply[];
  parentId?: string;
}

interface NestedReply extends Reply {}

interface Discussion {
  _id: string;
  title: string;
  subject: string;
  author: string;
  authorInitials: string;
  content: string;
  tags: string[];
  replies: NestedReply[];
  likes: number;
  createdAt?: string;
}

export default function DiscussionsPage() {
  const { isLoggedIn, user } = useAuth();
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showNewPost, setShowNewPost] = useState<boolean>(false);
  const [discussions, setDiscussions] = useState<Discussion[]>([]); // for local updates only
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const params = new URLSearchParams();
  if (selectedSubject && selectedSubject !== "All")
    params.append("subject", selectedSubject);
  if (searchQuery) params.append("search", searchQuery);
  const { data, error, isLoading, mutate } = useSWR(
    `/api/discussions?${params.toString()}`,
    fetcher,
    { revalidateOnFocus: false }
  );
  const [newPost, setNewPost] = useState<{
    title: string;
    subject: string;
    content: string;
    tags: string;
  }>({ title: "", subject: "All", content: "", tags: "" });
  const [replyLoading, setReplyLoading] = useState<Record<string, boolean>>({});
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [visibleDiscussions, setVisibleDiscussions] = useState(3);
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [posting, setPosting] = useState(false);

  // New state management for replies with unique keys
  const [activeReplies, setActiveReplies] = useState<Record<string, string>>(
    {}
  );
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>(
    {}
  );

  // Use SWR data for discussions
  const discussionsData = data && Array.isArray(data) ? data : [];

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
      await mutate(); // revalidate SWR cache
      setShowNewPost(false);
      setNewPost({ title: "", content: "", subject: "All", tags: "" });
    }
  };

  // When creating new replies (including nested), always assign a unique _id
  const generateId = () =>
    Date.now().toString() + Math.random().toString(36).slice(2);

  // Handle reply to main discussion
  const handleMainReply = useCallback(
    async (discussionId: string) => {
      const replyContent = activeReplies[discussionId];
      if (!replyContent) return;

      setReplyLoading((prev) => ({ ...prev, [discussionId]: true }));
      const newId = generateId();

      const res = await fetch("/api/discussions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId,
          reply: {
            _id: newId,
            author: user?.name || "Anonymous",
            authorInitials: user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "AN",
            content: replyContent,
          },
        }),
      });

      setReplyLoading((prev) => ({ ...prev, [discussionId]: false }));

      if (res.ok) {
        setDiscussions((prev) =>
          prev.map((d) =>
            d._id === discussionId
              ? {
                  ...d,
                  replies: [
                    ...d.replies,
                    {
                      _id: newId,
                      author: user?.name || "Anonymous",
                      authorInitials: user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "AN",
                      content: replyContent,
                      createdAt: new Date().toISOString(),
                    },
                  ],
                }
              : d
          )
        );

        // Clear the reply input
        setActiveReplies((prev) => ({ ...prev, [discussionId]: "" }));
        setShowReplyInput((prev) => ({ ...prev, [discussionId]: false }));
      }
    },
    [activeReplies, user]
  );

  // Handle reply to a reply (nested reply)
  const handleNestedReply = useCallback(
    async (
      discussionId: string,
      parentReplyId: string,
      parentReplyAuthor: string
    ) => {
      const replyKey = `${discussionId}_${parentReplyId}`;
      const replyContent = activeReplies[replyKey];
      if (!replyContent) return;

      setReplyLoading((prev) => ({ ...prev, [replyKey]: true }));
      const newId = generateId();

      const res = await fetch("/api/discussions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discussionId,
          reply: {
            _id: newId,
            author: user?.name || "Anonymous",
            authorInitials: user?.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "AN",
            content: replyContent,
            parentId: parentReplyId,
          },
        }),
      });

      setReplyLoading((prev) => ({ ...prev, [replyKey]: false }));

      if (res.ok) {
        setDiscussions((prev) =>
          prev.map((d) =>
            d._id === discussionId
              ? {
                  ...d,
                  replies: addNestedReply(d.replies, parentReplyId, {
                    _id: newId,
                    author: user?.name || "Anonymous",
                    authorInitials: user?.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                      : "AN",
                    content: replyContent,
                    createdAt: new Date().toISOString(),
                    parentId: parentReplyId,
                  }),
                }
              : d
          )
        );

        // Clear the reply input
        setActiveReplies((prev) => ({ ...prev, [replyKey]: "" }));
        setShowReplyInput((prev) => ({ ...prev, [replyKey]: false }));
      }
    },
    [activeReplies, user]
  );

  // Helper to add a nested reply
  function addNestedReply(
    replies: NestedReply[],
    parentId: string,
    newReply: NestedReply
  ): NestedReply[] {
    return replies.map((reply) => {
      if (reply._id === parentId) {
        return {
          ...reply,
          replies: reply.replies ? [...reply.replies, newReply] : [newReply],
        };
      } else if (reply.replies) {
        return {
          ...reply,
          replies: addNestedReply(reply.replies, parentId, newReply),
        };
      }
      return reply;
    });
  }

  // Toggle reply input visibility
  const toggleReplyInput = useCallback(
    (key: string) => {
      setShowReplyInput((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      // Clear the reply text when closing
      if (showReplyInput[key]) {
        setActiveReplies((prev) => ({ ...prev, [key]: "" }));
      }
    },
    [showReplyInput]
  );

  // Update reply text
  const updateReplyText = useCallback((key: string, value: string) => {
    setActiveReplies((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Render replies recursively (one level deep)
  function RenderReplies({
    replies,
    discussion,
    parentId,
  }: {
    replies: NestedReply[];
    discussion: Discussion;
    parentId?: string;
  }) {
    const effectiveParentId = parentId || undefined;
    return (
      <div
        className={
          effectiveParentId
            ? "pl-8 border-l-2 border-emerald-100 mt-2 space-y-3"
            : ""
        }
      >
        {replies.map((reply) => {
          const replyKey = `${discussion._id}_${reply._id}`;
          return (
            <div
              key={reply._id}
              className="flex items-start gap-2 bg-emerald-50/60 rounded-xl p-2 mb-2"
            >
              <Avatar>
                <AvatarFallback className="bg-blue-100 text-blue-700">
                  {reply.authorInitials || "AN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm text-gray-800">
                    {reply.author || "Anonymous"}
                  </div>
                  {/* Author badge if reply author is discussion creator */}
                  {reply.author === discussion.author && (
                    <span className="ml-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold">
                      Author
                    </span>
                  )}
                  <span className="ml-2 text-xs text-gray-400">
                    {reply.createdAt
                      ? new Date(reply.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div className="text-gray-700 text-sm whitespace-pre-line">
                  {reply.content}
                </div>
                {/* Reply to this comment */}
                {isLoggedIn && (
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="text-xs text-emerald-600 hover:underline"
                      onClick={() => toggleReplyInput(replyKey)}
                    >
                      Reply
                    </button>
                  </div>
                )}
                {/* Nested reply input */}
                {isLoggedIn && showReplyInput[replyKey] && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Write a reply..."
                      value={activeReplies[replyKey] || ""}
                      onChange={(e) =>
                        updateReplyText(replyKey, e.target.value)
                      }
                      className="flex-1 rounded-full"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 rounded-full"
                      disabled={replyLoading[replyKey]}
                      onClick={() =>
                        handleNestedReply(
                          discussion._id,
                          reply._id,
                          reply.author
                        )
                      }
                    >
                      <Reply className="w-4 h-4 mr-1" />
                      {replyLoading[replyKey] ? "Sending..." : "Reply"}
                    </Button>
                  </div>
                )}
                {/* Render nested replies (one level deep) */}
                {reply.replies && reply.replies.length > 0 && (
                  <RenderReplies
                    replies={reply.replies}
                    discussion={discussion}
                    parentId={reply._id}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  const filteredDiscussions = discussionsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Discussions" />
      {/* Main feed */}
      <div className="w-full py-8 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-2 md:px-8">
          {/* Header and Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-2">
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
                className="w-full sm:w-72 px-4 py-2 rounded-full border border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 focus:outline-none bg-white shadow-sm"
              />
              <Button className="ml-2" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>
          </div>

          {/* Subject Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-gray-200 sticky top-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 z-10">
            {SUBJECTS.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className={
                  selectedSubject === subject
                    ? "bg-emerald-500 hover:bg-emerald-600 rounded-full px-4"
                    : "rounded-full px-4"
                }
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* New Discussion Inline Form */}
          {showNewPost && (
            <form
              onSubmit={handleNewPost}
              className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 mx-auto shadow-sm"
            >
              <div className="mb-3">
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500 text-lg font-semibold"
                  placeholder="What's happening? (Title)"
                />
              </div>
              <div className="mb-3 flex gap-2">
                <select
                  value={newPost.subject}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, subject: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, tags: e.target.value }))
                  }
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500"
                  placeholder="#tags (comma separated)"
                />
              </div>
              <div className="mb-3">
                <textarea
                  required
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, content: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:border-emerald-500 text-base"
                  rows={3}
                  placeholder="Share your thoughts, ask a question, or start a discussion..."
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
                  className="bg-emerald-600 text-white rounded-full px-6"
                  disabled={posting}
                >
                  {posting ? "Posting..." : "Post"}
                </Button>
              </div>
            </form>
          )}

          {/* Discussions Feed */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="text-center py-12">
                Error loading discussions.
              </div>
            ) : (
              filteredDiscussions
                .slice(0, visibleDiscussions)
                .map((discussion) => {
                  const replies = discussion.replies || [];
                  const commentsOpen = openComments[discussion._id];
                  return (
                    <div
                      key={discussion._id}
                      className="bg-white border border-gray-200 rounded-2xl px-6 py-5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-none mb-2"
                    >
                      {/* Top Row: Avatar, Author, Subject, Time */}
                      <div className="flex items-center gap-3 mb-1">
                        <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">
                            {discussion.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-gray-800">
                          {discussion.author}
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-700 ml-1">
                          {discussion.subject}
                        </Badge>
                        <span className="text-xs text-gray-400 ml-auto">
                          {discussion.createdAt
                            ? new Date(discussion.createdAt).toLocaleString()
                            : ""}
                        </span>
                      </div>
                      {/* Title and Content */}
                      <div className="mb-2">
                        <span className="font-bold text-lg text-gray-900">
                          {discussion.title}
                        </span>
                        <div className="text-gray-700 text-base mt-1 whitespace-pre-line">
                          {discussion.content}
                        </div>
                      </div>
                      {/* Tags as hashtags */}
                      <div className="flex flex-wrap gap-2 mb-2">
                        {discussion.tags &&
                          discussion.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-emerald-600 text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                      {/* Actions Row */}
                      <div className="flex items-center gap-6 text-gray-500 text-sm mb-2">
                        <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                          <ThumbsUp className="w-4 h-4" />{" "}
                          {discussion.likes || 0}
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                          onClick={() =>
                            setOpenComments((prev) => ({
                              ...prev,
                              [discussion._id]: !commentsOpen,
                            }))
                          }
                        >
                          <MessageSquare className="w-4 h-4" /> {replies.length}{" "}
                          {replies.length === 1 ? "Reply" : "Replies"}
                        </button>
                        {isLoggedIn ? (
                          <button
                            className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                            onClick={() => toggleReplyInput(discussion._id)}
                          >
                            <Reply className="w-4 h-4" /> Reply
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-xs">
                            <Reply className="w-4 h-4" />
                            <Link href="/login" className="hover:underline">
                              Sign in to reply
                            </Link>
                          </span>
                        )}
                      </div>

                      {/* Main Reply Input */}
                      {isLoggedIn && showReplyInput[discussion._id] && (
                        <div className="flex items-center gap-2 mt-3 mb-2">
                          <Avatar>
                            <AvatarFallback className="bg-emerald-100 text-emerald-700">
                              {user?.name
                                ? user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "AN"}
                            </AvatarFallback>
                          </Avatar>
                          <Input
                            placeholder="Write a reply..."
                            value={activeReplies[discussion._id] || ""}
                            onChange={(e) =>
                              updateReplyText(discussion._id, e.target.value)
                            }
                            className="flex-1 rounded-full"
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-emerald-600 hover:text-emerald-700 rounded-full"
                            disabled={replyLoading[discussion._id]}
                            onClick={() => handleMainReply(discussion._id)}
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            {replyLoading[discussion._id]
                              ? "Sending..."
                              : "Send"}
                          </Button>
                        </div>
                      )}

                      {/* Replies Thread (if open) */}
                      {commentsOpen && replies.length > 0 && (
                        <RenderReplies
                          replies={replies}
                          discussion={discussion}
                        />
                      )}
                    </div>
                  );
                })
            )}
          </div>

          {/* Show more discussions button */}
          {filteredDiscussions.length > visibleDiscussions && !isLoading && (
            <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                onClick={() => setVisibleDiscussions((v) => v + 5)}
                className="px-8 py-2 border-2 border-emerald-500 text-emerald-700 hover:bg-emerald-50 rounded-full"
              >
                Show more discussions
              </Button>
            </div>
          )}
        </div>

        {/* Floating New Discussion Button */}
        {isLoggedIn && (
          <Button
            className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg rounded-full px-6 py-3 text-lg hover:scale-105 transition-transform"
            onClick={() => setShowNewPost((v) => !v)}
            style={{ display: showNewPost ? "none" : undefined }}
          >
            <Plus className="w-5 h-5 mr-2" /> New Discussion
          </Button>
        )}
      </div>
    </div>
  );
}
