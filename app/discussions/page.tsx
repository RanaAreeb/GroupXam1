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
  Trash2,
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

// Helper function to generate user initials properly
const generateUserInitials = (fullName: string | undefined): string => {
  if (!fullName) return "AN";
  
  const nameParts = fullName.split(" ").filter(part => 
    !part.includes("(") && !part.includes(")") && part.length > 0
  );
  
  if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
  if (nameParts.length === 2) return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  if (nameParts.length >= 3) return (nameParts[0][0] + nameParts[1][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  return nameParts[0][0].toUpperCase();
};

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
  const [openReplies, setOpenReplies] = useState<Record<string, boolean>>({});

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
          .map((t) => t.trim().replace(/^#+/, "")) // Remove any leading # symbols
          .filter(Boolean),
        author: user?.name || "Anonymous",
        authorInitials: generateUserInitials(user?.name),
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
            authorInitials: generateUserInitials(user?.name),
            content: replyContent,
          },
        }),
      });

      setReplyLoading((prev) => ({ ...prev, [discussionId]: false }));

      if (res.ok) {
        await mutate(); // revalidate SWR cache
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
    [activeReplies, user, mutate]
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
            authorInitials: generateUserInitials(user?.name),
            content: replyContent,
            parentId: parentReplyId,
          },
        }),
      });

      setReplyLoading((prev) => ({ ...prev, [replyKey]: false }));

      if (res.ok) {
        await mutate(); // revalidate SWR cache
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
    [activeReplies, user, mutate]
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

  // Delete discussion handler
  const handleDeleteDiscussion = useCallback(
    async (discussionId: string) => {
      if (!confirm("Are you sure you want to delete this discussion? This action cannot be undone.")) {
        return;
      }

      try {
        const response = await fetch(`/api/discussions/${discussionId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Refresh the discussions list
          await mutate();
        } else {
          alert("Failed to delete discussion. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting discussion:", error);
        alert("Failed to delete discussion. Please try again.");
      }
    },
    [mutate]
  );

  // Update reply text
  const updateReplyText = useCallback((key: string, value: string) => {
    setActiveReplies((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Render replies recursively with depth tracking
  function RenderReplies({
    replies,
    discussion,
    parentId,
    depth = 0,
  }: {
    replies: NestedReply[];
    discussion: Discussion;
    parentId?: string;
    depth?: number;
  }) {
    const effectiveParentId = parentId || undefined;
    const maxDepth = 10; // Allow unlimited nesting since no visual indentation
    const currentDepth = Math.min(depth, maxDepth);
    
    return (
      <div
        className={
          effectiveParentId
            ? `mt-2 space-y-2 sm:space-y-3 max-w-full overflow-hidden`
            : ""
        }
      >
        {replies.map((reply) => {
          const replyKey = `${discussion._id}_${reply._id}`;
          return (
            <div
              key={reply._id}
              className={`flex items-start gap-2 bg-emerald-50/60 rounded-xl p-2 sm:p-3 mb-2`}
            >
              <Avatar className="flex-shrink-0">
                <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                  {reply.authorInitials || "AN"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 max-w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                  <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                    {reply.author || "Anonymous"}
                  </div>
                  {/* Author badge if reply author is discussion creator */}
                  {reply.author === discussion.author && (
                    <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold self-start">
                      Author
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {reply.createdAt
                      ? new Date(reply.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
                <div className="text-gray-700 text-xs sm:text-sm whitespace-pre-line break-words max-w-full">
                  {reply.content}
                </div>
                                {/* Reply to this comment - Mobile optimized */}
                {isLoggedIn && (
                  <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                    <button
                      className="text-xs text-emerald-600 hover:underline px-2 py-1 rounded-full hover:bg-emerald-50"
                      onClick={() => toggleReplyInput(replyKey)}
                    >
                      Reply
                    </button>
                    {/* Toggle nested replies */}
                    {reply.replies && reply.replies.length > 0 && (
                      <button
                        className="text-xs text-emerald-600 hover:underline flex items-center gap-1 px-2 py-1 rounded-full hover:bg-emerald-50"
                        onClick={() =>
                          setOpenReplies((prev) => ({
                            ...prev,
                            [reply._id]: !prev[reply._id],
                          }))
                        }
                      >
                        <MessageSquare className="w-3 h-3" />
                        {reply.replies.length} Replies
                      </button>
                    )}

                  </div>
                )}
                {/* Nested reply input - Mobile optimized */}
                {isLoggedIn && showReplyInput[replyKey] && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
                    <Input
                      placeholder="Write a reply..."
                      value={activeReplies[replyKey] || ""}
                      onChange={(e) =>
                        updateReplyText(replyKey, e.target.value)
                      }
                      className="flex-1 rounded-full text-xs sm:text-sm"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-emerald-600 hover:text-emerald-700 rounded-full text-xs px-3 py-1 w-full sm:w-auto"
                      disabled={replyLoading[replyKey]}
                      onClick={() =>
                        handleNestedReply(
                          discussion._id,
                          reply._id,
                          reply.author
                        )
                      }
                    >
                      <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {replyLoading[replyKey] ? "Sending..." : "Reply"}
                    </Button>
                  </div>
                )}
                {/* Render nested replies only if toggled open */}
                {reply.replies &&
                  reply.replies.length > 0 &&
                  openReplies[reply._id] && (
                    <div className="mt-2">
                      {reply.replies.map((nestedReply) => {
                        const nestedReplyKey = `${discussion._id}_${nestedReply._id}`;
                        return (
                          <div
                            key={nestedReply._id}
                            className={`flex items-start gap-2 bg-emerald-50/60 rounded-xl p-2 sm:p-3 mb-2`}
                          >
                            <Avatar className="flex-shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                                {nestedReply.authorInitials || "AN"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 max-w-full">
                              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                                  {nestedReply.author || "Anonymous"}
                                </div>
                                {/* Author badge if reply author is discussion creator */}
                                {nestedReply.author === discussion.author && (
                                  <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold self-start">
                                    Author
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {nestedReply.createdAt
                                    ? new Date(nestedReply.createdAt).toLocaleString()
                                    : ""}
                                </span>
                              </div>
                              <div className="text-gray-700 text-xs sm:text-sm whitespace-pre-line break-words max-w-full">
                                {nestedReply.content}
                              </div>
                              {/* Reply to this comment - Mobile optimized */}
                              {isLoggedIn && (
                                <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                                  <button
                                    className="text-xs text-emerald-600 hover:underline px-2 py-1 rounded-full hover:bg-emerald-50"
                                    onClick={() => toggleReplyInput(nestedReplyKey)}
                                  >
                                    Reply
                                  </button>
                                  {/* Toggle nested replies */}
                                  {nestedReply.replies && nestedReply.replies.length > 0 && (
                                    <button
                                      className="text-xs text-emerald-600 hover:underline flex items-center gap-1 px-2 py-1 rounded-full hover:bg-emerald-50"
                                      onClick={() =>
                                        setOpenReplies((prev) => ({
                                          ...prev,
                                          [nestedReply._id]: !prev[nestedReply._id],
                                        }))
                                      }
                                    >
                                      <MessageSquare className="w-3 h-3" />
                                      {nestedReply.replies.length} Replies
                                    </button>
                                  )}
                                </div>
                              )}
                              {/* Nested reply input - Mobile optimized */}
                              {isLoggedIn && showReplyInput[nestedReplyKey] && (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
                                  <Input
                                    placeholder="Write a reply..."
                                    value={activeReplies[nestedReplyKey] || ""}
                                    onChange={(e) =>
                                      updateReplyText(nestedReplyKey, e.target.value)
                                    }
                                    className="flex-1 rounded-full text-xs sm:text-sm"
                                    autoFocus
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-emerald-600 hover:text-emerald-700 rounded-full text-xs px-3 py-1 w-full sm:w-auto"
                                    disabled={replyLoading[nestedReplyKey]}
                                    onClick={() =>
                                      handleNestedReply(
                                        discussion._id,
                                        nestedReply._id,
                                        nestedReply.author
                                      )
                                    }
                                  >
                                    <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                    {replyLoading[nestedReplyKey] ? "Sending..." : "Reply"}
                                  </Button>
                                </div>
                              )}
                              {/* Render deeper nested replies */}
                              {nestedReply.replies &&
                                nestedReply.replies.length > 0 &&
                                openReplies[nestedReply._id] && (
                                  <div className="mt-2">
                                    {nestedReply.replies.map((deepNestedReply) => {
                                      const deepNestedReplyKey = `${discussion._id}_${deepNestedReply._id}`;
                                      return (
                                        <div
                                          key={deepNestedReply._id}
                                          className={`flex items-start gap-2 bg-emerald-50/60 rounded-xl p-2 sm:p-3 mb-2`}
                                        >
                                          <Avatar className="flex-shrink-0">
                                            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
                                              {deepNestedReply.authorInitials || "AN"}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div className="flex-1 min-w-0 max-w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                              <div className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                                                {deepNestedReply.author || "Anonymous"}
                                              </div>
                                              {deepNestedReply.author === discussion.author && (
                                                <span className="px-1.5 sm:px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-semibold self-start">
                                                  Author
                                                </span>
                                              )}
                                              <span className="text-xs text-gray-400">
                                                {deepNestedReply.createdAt
                                                  ? new Date(deepNestedReply.createdAt).toLocaleString()
                                                  : ""}
                                              </span>
                                            </div>
                                            <div className="text-gray-700 text-xs sm:text-sm whitespace-pre-line break-words max-w-full">
                                              {deepNestedReply.content}
                                            </div>
                                            {isLoggedIn && (
                                              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-2">
                                                <button
                                                  className="text-xs text-emerald-600 hover:underline px-2 py-1 rounded-full hover:bg-emerald-50"
                                                  onClick={() => toggleReplyInput(deepNestedReplyKey)}
                                                >
                                                  Reply
                                                </button>
                                                {deepNestedReply.replies && deepNestedReply.replies.length > 0 && (
                                                  <button
                                                    className="text-xs text-emerald-600 hover:underline flex items-center gap-1 px-2 py-1 rounded-full hover:bg-emerald-50"
                                                    onClick={() =>
                                                      setOpenReplies((prev) => ({
                                                        ...prev,
                                                        [deepNestedReply._id]: !prev[deepNestedReply._id],
                                                      }))
                                                    }
                                                  >
                                                    <MessageSquare className="w-3 h-3" />
                                                    {deepNestedReply.replies.length} Replies
                                                  </button>
                                                )}
                                              </div>
                                            )}
                                            {isLoggedIn && showReplyInput[deepNestedReplyKey] && (
                                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3">
                                                <Input
                                                  placeholder="Write a reply..."
                                                  value={activeReplies[deepNestedReplyKey] || ""}
                                                  onChange={(e) =>
                                                    updateReplyText(deepNestedReplyKey, e.target.value)
                                                  }
                                                  className="flex-1 rounded-full text-xs sm:text-sm"
                                                  autoFocus
                                                />
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-emerald-600 hover:text-emerald-700 rounded-full text-xs px-3 py-1 w-full sm:w-auto"
                                                  disabled={replyLoading[deepNestedReplyKey]}
                                                  onClick={() =>
                                                    handleNestedReply(
                                                      discussion._id,
                                                      deepNestedReply._id,
                                                      deepNestedReply.author
                                                    )
                                                  }
                                                >
                                                  <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                  {replyLoading[deepNestedReplyKey] ? "Sending..." : "Reply"}
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Utility to build a nested reply tree from a flat array
  function buildReplyTree(flatReplies: Reply[]) {
    const idToReply: Record<string, Reply> = {};
    const rootReplies: Reply[] = [];
    flatReplies.forEach((reply) => {
      idToReply[reply._id] = { ...reply, replies: [] };
    });
    flatReplies.forEach((reply) => {
      if (reply.parentId && idToReply[reply.parentId] && idToReply[reply._id]) {
        idToReply[reply.parentId]?.replies?.push(idToReply[reply._id]!);
      } else if (idToReply[reply._id]) {
        rootReplies.push(idToReply[reply._id]);
      }
    });
    return rootReplies;
  }

  const filteredDiscussions = discussionsData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <AppHeader active="Discussions" />
      {/* Main feed */}
      <div className="w-full py-8 bg-transparent">
        <div className="w-full max-w-6xl mx-auto px-2 md:px-8">
          {/* Header and Search Bar - Mobile optimized */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 px-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">
                Discussions
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                Connect with fellow students and get help
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-72 px-4 py-2 rounded-full border border-gray-300 focus:border-emerald-500 focus:ring-emerald-200 focus:outline-none bg-white shadow-sm text-sm"
              />
              <Button className="w-full sm:w-auto mt-2 sm:mt-0" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            </div>
          </div>

          {/* Subject Tabs - Mobile optimized */}
          <div className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 mb-4 border-b border-gray-200 sticky top-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 z-10 px-2">
            {SUBJECTS.map((subject) => (
              <Button
                key={subject}
                variant={selectedSubject === subject ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSubject(subject)}
                className={
                  selectedSubject === subject
                    ? "bg-emerald-500 hover:bg-emerald-600 rounded-full px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                    : "rounded-full px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
                }
              >
                {subject}
              </Button>
            ))}
          </div>

          {/* New Discussion Inline Form - Mobile optimized */}
          {showNewPost && (
            <form
              onSubmit={handleNewPost}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 mb-8 mx-auto shadow-sm"
            >
              <div className="mb-3">
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500 text-base sm:text-lg font-semibold"
                  placeholder="What's happening? (Title)"
                />
              </div>
              <div className="mb-3 flex flex-col sm:flex-row gap-2">
                <select
                  value={newPost.subject}
                  onChange={(e) =>
                    setNewPost((p) => ({ ...p, subject: e.target.value }))
                  }
                  className="px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500 text-sm"
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
                  className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-emerald-500 text-sm"
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
                  className="w-full px-4 py-2 border rounded-2xl focus:outline-none focus:border-emerald-500 text-sm sm:text-base"
                  rows={3}
                  placeholder="Share your thoughts, ask a question, or start a discussion..."
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewPost(false)}
                  disabled={posting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 text-white rounded-full px-6 w-full sm:w-auto"
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
                  const discussionReplies = buildReplyTree(replies);
                  return (
                    <div
                      key={discussion._id}
                      className="bg-white border border-gray-200 rounded-2xl px-4 sm:px-6 py-4 sm:py-5 hover:bg-emerald-50/40 transition-all cursor-pointer shadow-none mb-3"
                    >
                      {/* Top Row: Avatar, Author, Subject, Time - Mobile optimized */}
                      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-2">
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm">
                            {discussion.authorInitials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                            <span className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                              {discussion.author}
                            </span>
                            <Badge className="bg-emerald-100 text-emerald-700 text-xs self-start sm:self-auto">
                              {discussion.subject}
                            </Badge>
                          </div>
                          <span className="text-xs text-gray-400 mt-1 sm:mt-0">
                            {discussion.createdAt
                              ? new Date(discussion.createdAt).toLocaleString()
                              : ""}
                          </span>
                        </div>
                      </div>
                      {/* Title and Content - Mobile optimized */}
                      <div className="mb-3">
                        <span className="font-bold text-base sm:text-lg text-gray-900 break-words">
                          {discussion.title}
                        </span>
                        <div className="text-gray-700 text-sm sm:text-base mt-2 whitespace-pre-line break-words">
                          {discussion.content}
                        </div>
                      </div>
                      {/* Tags as hashtags - Mobile optimized */}
                      <div className="flex flex-wrap gap-1 sm:gap-2 mb-3">
                        {discussion.tags &&
                          discussion.tags.map((tag: string) => (
                            <span
                              key={tag}
                              className="text-emerald-600 text-xs font-medium px-1.5 py-0.5 bg-emerald-50 rounded-full"
                            >
                              #{tag}
                            </span>
                          ))}
                      </div>
                      {/* Actions Row - Mobile optimized */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-gray-500 text-xs sm:text-sm mb-3">
                        <button className="flex items-center gap-1 hover:text-emerald-600 transition-colors px-2 py-1 rounded-full hover:bg-emerald-50">
                          <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{discussion.likes || 0}</span>
                          <span className="sm:hidden">{discussion.likes || 0}</span>
                        </button>
                        <button
                          className="flex items-center gap-1 hover:text-emerald-600 transition-colors px-2 py-1 rounded-full hover:bg-emerald-50"
                          onClick={() =>
                            setOpenComments((prev) => ({
                              ...prev,
                              [discussion._id]: !commentsOpen,
                            }))
                          }
                        >
                          <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{replies.length} {replies.length === 1 ? "Reply" : "Replies"}</span>
                          <span className="sm:hidden">{replies.length}</span>
                        </button>
                        {isLoggedIn ? (
                          <button
                            className="flex items-center gap-1 hover:text-emerald-600 transition-colors px-2 py-1 rounded-full hover:bg-emerald-50"
                            onClick={() => toggleReplyInput(discussion._id)}
                          >
                            <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Reply</span>
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-400 text-xs px-2 py-1">
                            <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                            <Link href="/login" className="hover:underline">
                              Sign in
                            </Link>
                          </span>
                        )}
                        {/* Delete button - only show to author */}
                        {isLoggedIn && user?.name === discussion.author && (
                          <button
                            className="flex items-center gap-1 hover:text-red-600 transition-colors ml-auto px-2 py-1 rounded-full hover:bg-red-50"
                            onClick={() => handleDeleteDiscussion(discussion._id)}
                            title="Delete discussion"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        )}
                      </div>

                      {/* Main Reply Input - Mobile optimized */}
                      {isLoggedIn && showReplyInput[discussion._id] && (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-3 mb-3">
                          <Avatar className="flex-shrink-0">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs sm:text-sm">
                              {user?.name
                                ? user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "AN"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 w-full">
                            <Input
                              placeholder="Write a reply..."
                              value={activeReplies[discussion._id] || ""}
                              onChange={(e) =>
                                updateReplyText(discussion._id, e.target.value)
                              }
                              className="flex-1 rounded-full text-xs sm:text-sm mb-2 sm:mb-0"
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 rounded-full text-xs px-3 py-1 w-full sm:w-auto"
                              disabled={replyLoading[discussion._id]}
                              onClick={() => handleMainReply(discussion._id)}
                            >
                              <Reply className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                              {replyLoading[discussion._id]
                                ? "Sending..."
                                : "Send"}
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Replies Thread (if open) */}
                      {commentsOpen && replies.length > 0 && (
                        <RenderReplies
                          replies={discussionReplies}
                          discussion={discussion}
                          depth={0}
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

        {/* Floating New Discussion Button - Mobile optimized */}
        {isLoggedIn && (
          <Button
            className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-semibold shadow-lg rounded-full px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg hover:scale-105 transition-transform"
            onClick={() => setShowNewPost((v) => !v)}
            style={{ display: showNewPost ? "none" : undefined }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">New Discussion</span>
            <span className="sm:hidden">New</span>
          </Button>
        )}
      </div>
    </div>
  );
}
