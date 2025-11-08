"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, Loader2, Image as ImageIcon, XCircle, ArrowLeft, AlertCircle, Sparkles, MoreVertical, Trash2, Copy, Check, Paperclip, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useMaintenance } from "@/hooks/use-maintenance";
import { MAINTENANCE_SECTIONS } from "@/constants/maintenance";

interface DocumentAttachment {
  name: string;
  type: string;
  dataUrl: string;
  size: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  images?: string[];
  documents?: DocumentAttachment[];
}

// Markdown renderer function
const renderMarkdown = (text: string, isUser: boolean) => {
  const textColor = isUser ? "text-white" : "text-gray-800";

  // Split by code blocks first
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts: Array<{ type: 'code' | 'text'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', content: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content: text });
  }

  return parts.map((part, partIndex) => {
    if (part.type === 'code') {
      return (
        <div key={partIndex} className={`${isUser ? "bg-white/10" : "bg-gray-100"} rounded-lg p-3 my-2 font-mono text-sm overflow-x-auto`}>
          <pre className="whitespace-pre-wrap break-words">{part.content.trim()}</pre>
        </div>
      );
    }

    // Process text content for markdown
    const lines = part.content.split('\n');
    const elements: JSX.Element[] = [];
    let inList = false;
    let listItems: string[] = [];

    lines.forEach((line, lineIndex) => {
      const trimmed = line.trim();

      // Headings
      if (trimmed.startsWith('### ')) {
        if (inList) {
          elements.push(renderList(listItems, isUser, elements.length));
          listItems = [];
          inList = false;
        }
        elements.push(
          <h3 key={`h3-${lineIndex}`} className={`${textColor} text-lg font-bold mt-4 mb-2 first:mt-0`}>
            {renderInlineMarkdown(trimmed.substring(4), isUser)}
          </h3>
        );
      } else if (trimmed.startsWith('## ')) {
        if (inList) {
          elements.push(renderList(listItems, isUser, elements.length));
          listItems = [];
          inList = false;
        }
        elements.push(
          <h2 key={`h2-${lineIndex}`} className={`${textColor} text-xl font-bold mt-4 mb-2 first:mt-0`}>
            {renderInlineMarkdown(trimmed.substring(3), isUser)}
          </h2>
        );
      } else if (trimmed.startsWith('# ')) {
        if (inList) {
          elements.push(renderList(listItems, isUser, elements.length));
          listItems = [];
          inList = false;
        }
        elements.push(
          <h1 key={`h1-${lineIndex}`} className={`${textColor} text-2xl font-bold mt-4 mb-2 first:mt-0`}>
            {renderInlineMarkdown(trimmed.substring(2), isUser)}
          </h1>
        );
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        // List items
        if (!inList) {
          inList = true;
        }
        listItems.push(trimmed.replace(/^[-*]\s|^\d+\.\s/, ''));
      } else if (trimmed === '') {
        // Empty line
        if (inList) {
          elements.push(renderList(listItems, isUser, elements.length));
          listItems = [];
          inList = false;
        }
        elements.push(<div key={`empty-${lineIndex}`} className="h-2" />);
      } else {
        // Regular paragraph
        if (inList) {
          elements.push(renderList(listItems, isUser, elements.length));
          listItems = [];
          inList = false;
        }
        elements.push(
          <p key={`p-${lineIndex}`} className={`${textColor} mb-2 last:mb-0 text-base leading-7`}>
            {renderInlineMarkdown(line, isUser)}
          </p>
        );
      }
    });

    // Close any remaining list
    if (inList && listItems.length > 0) {
      elements.push(renderList(listItems, isUser, elements.length));
    }

    return <div key={partIndex}>{elements}</div>;
  });
};

const renderList = (items: string[], isUser: boolean, keyOffset: number) => {
  const textColor = isUser ? "text-white" : "text-gray-800";
  return (
    <ul key={`list-${keyOffset}`} className={`${textColor} list-disc list-inside mb-2 space-y-1 ml-4`}>
      {items.map((item, idx) => (
        <li key={idx} className="leading-7">
          {renderInlineMarkdown(item, isUser)}
        </li>
      ))}
    </ul>
  );
};

const renderInlineMarkdown = (text: string, isUser: boolean): (string | JSX.Element)[] => {
  const textColor = isUser ? "text-white" : "text-gray-800";
  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  // Handle inline code
  const inlineCodeRegex = /`([^`]+)`/g;
  const codeMatches: Array<{ start: number; end: number; content: string }> = [];
  let codeMatch;

  while ((codeMatch = inlineCodeRegex.exec(text)) !== null) {
    codeMatches.push({
      start: codeMatch.index,
      end: codeMatch.index + codeMatch[0].length,
      content: codeMatch[1]
    });
  }

  // Handle bold and italic
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const italicRegex = /(?<!\*)\*([^*]+)\*(?!\*)/g;

  // Combine all matches
  const allMatches: Array<{ start: number; end: number; type: 'code' | 'bold' | 'italic'; content: string }> = [];

  codeMatches.forEach(m => allMatches.push({ ...m, type: 'code' }));

  let boldMatch;
  while ((boldMatch = boldRegex.exec(text)) !== null) {
    // Check if this bold is not inside a code block
    const isInCode = codeMatches.some(c => boldMatch!.index >= c.start && boldMatch!.index < c.end);
    if (!isInCode) {
      allMatches.push({
        start: boldMatch.index,
        end: boldMatch.index + boldMatch[0].length,
        type: 'bold',
        content: boldMatch[1]
      });
    }
  }

  let italicMatch;
  while ((italicMatch = italicRegex.exec(text)) !== null) {
    // Check if this italic is not inside a code block or bold
    const isInCode = codeMatches.some(c => italicMatch!.index >= c.start && italicMatch!.index < c.end);
    const isInBold = allMatches.some(m => m.type === 'bold' && italicMatch!.index >= m.start && italicMatch!.index < m.end);
    if (!isInCode && !isInBold) {
      allMatches.push({
        start: italicMatch.index,
        end: italicMatch.index + italicMatch[0].length,
        type: 'italic',
        content: italicMatch[1]
      });
    }
  }

  // Sort matches by start position
  allMatches.sort((a, b) => a.start - b.start);

  // Remove overlapping matches (prioritize code > bold > italic)
  const filteredMatches = allMatches.filter((match, idx) => {
    return !allMatches.some((other, otherIdx) => {
      if (otherIdx === idx) return false;
      if (match.start >= other.start && match.end <= other.end) {
        return other.type === 'code' || (other.type === 'bold' && match.type === 'italic');
      }
      return false;
    });
  });

  // Build elements
  filteredMatches.forEach((match, idx) => {
    // Add text before match
    if (match.start > lastIndex) {
      const beforeText = text.slice(lastIndex, match.start);
      if (beforeText) {
        elements.push(beforeText);
      }
    }

    // Add match
    if (match.type === 'code') {
      elements.push(
        <code key={`code-${idx}`} className={`${isUser ? "bg-white/20" : "bg-gray-200"} px-1.5 py-0.5 rounded font-mono text-sm`}>
          {match.content}
        </code>
      );
    } else if (match.type === 'bold') {
      elements.push(
        <strong key={`bold-${idx}`} className="font-semibold">
          {match.content}
        </strong>
      );
    } else if (match.type === 'italic') {
      elements.push(
        <em key={`italic-${idx}`} className="italic">
          {match.content}
        </em>
      );
    }

    lastIndex = match.end;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements.length > 0 ? elements : [text];
};

const formatFileSize = (bytes: number) => {
  if (!bytes || Number.isNaN(bytes) || !Number.isFinite(bytes)) {
    return "Unknown size";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export default function ChatPage() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentAttachment[]>([]);
  const [usageData, setUsageData] = useState<any>(null);
  const [showLimitMessage, setShowLimitMessage] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const prefillHandledRef = useRef(false);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const { maintenance: aiMaintenance } = useMaintenance("ai_chat");
  const { maintenance: siteMaintenance } = useMaintenance("whole_site");
  const aiSectionConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "ai_chat");
  const siteSectionConfig = MAINTENANCE_SECTIONS.find((section) => section.id === "whole_site");
  const isChatInMaintenance = Boolean(siteMaintenance?.isActive || aiMaintenance?.isActive);
  const chatMaintenanceMessage =
    (siteMaintenance?.isActive
      ? siteMaintenance?.message || siteSectionConfig?.defaultMessage
      : aiMaintenance?.message || aiSectionConfig?.defaultMessage) ||
    "sunu-I is currently undergoing maintenance. Please check back soon.";

  useEffect(() => {
    checkUsage();
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm sunu-I, your AI study assistant. I'm here to help you with exam preparation, study strategies, and answer any academic questions you have. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isChatInMaintenance) {
      setDocumentError(null);
    }
  }, [isChatInMaintenance]);

  const checkUsage = async () => {
    try {
      const response = await fetch("/api/chat/usage");
      const data = await response.json();
      setUsageData(data);

      if (!data.canUseChat && !data.hasSubscription) {
        setShowLimitMessage(true);
      }
    } catch (error) {
      console.error("Error checking usage:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChatInMaintenance) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImages((prev) => [...prev, base64String]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChatInMaintenance) {
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      return;
    }

    const files = e.target.files;
    if (!files) return;

    const supportedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
      "application/json",
      "text/csv",
    ];

    Array.from(files).forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        setDocumentError("Files must be 8MB or smaller.");
        return;
      }

      if (!supportedTypes.includes(file.type)) {
        setDocumentError("Only PDF, DOC, DOCX, TXT, MD, JSON, and CSV files are supported.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedDocuments((prev) => [
          ...prev,
          {
            name: file.name,
            type: file.type,
            dataUrl: base64String,
            size: file.size,
          },
        ]);
        setDocumentError(null);
      };
      reader.readAsDataURL(file);
    });

    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  const removeDocument = (index: number) =>
    setSelectedDocuments((prev) => prev.filter((_, i) => i !== index));

  const copyToClipboard = async (text: string, messageId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm sunu-I, your AI study assistant. I'm here to help you with exam preparation, study strategies, and answer any academic questions you have. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setSelectedImages([]);
    setSelectedDocuments([]);
    setDocumentError(null);
  };

  const sendChatRequest = async ({
    content,
    images = [],
    documents = [],
    shouldResetInput = false,
  }: {
    content: string;
    images?: string[];
    documents?: DocumentAttachment[];
    shouldResetInput?: boolean;
  }) => {
    if (isChatInMaintenance) {
      return;
    }

    const trimmedContent = content.trim();

    if (trimmedContent.length === 0 && images.length === 0 && documents.length === 0) {
      return;
    }

    if (isLoading) {
      return;
    }

    // Check usage before sending
    if (usageData && !usageData.canUseChat && !usageData.hasSubscription) {
      router.push("/subscription");
      return;
    }

    if (shouldResetInput) {
      setInput("");
      setSelectedImages([]);
      setSelectedDocuments([]);
      setDocumentError(null);
    }

    const userMessage: Message = {
      role: "user",
      content:
        trimmedContent ||
        (documents.length > 0
          ? `Please review the attached document${documents.length > 1 ? "s" : ""}.`
          : images.length > 0
            ? "Please analyze these images."
            : ""),
      timestamp: new Date(),
      images: images.length > 0 ? [...images] : undefined,
      documents: documents.length > 0 ? documents.map((doc) => ({ ...doc })) : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Increment usage count
      await fetch("/api/chat/usage", { method: "POST" });

      // Recheck usage after incrementing
      await checkUsage();

      const historyBase = [...messages, userMessage];

      const conversationHistory = historyBase
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => {
          const attachmentNotes: string[] = [];

          if (msg.documents && msg.documents.length > 0) {
            attachmentNotes.push(
              msg.documents
                .map(
                  (doc) =>
                    `Document: ${doc.name} (${doc.type || "unknown"}, ${formatFileSize(
                      doc.size
                    )})`
                )
                .join("\n")
            );
          }

          if (msg.images && msg.images.length > 0) {
            attachmentNotes.push(`Images attached: ${msg.images.length}`);
          }

          const combinedContent = [msg.content, ...attachmentNotes].filter(Boolean).join("\n\n");

          return {
            role: msg.role,
            content: combinedContent,
          };
        });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmedContent,
          images,
          documents: documents.map((doc) => ({
            name: doc.name,
            type: doc.type,
            dataUrl: doc.dataUrl,
            size: doc.size,
          })),
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // If subscription required, redirect to subscription page
        if (data.requiresSubscription || response.status === 403) {
          router.push("/subscription");
          return;
        }
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: "assistant",
        content: `Sorry, I encountered an error: ${error.message || "Please try again later."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    await sendChatRequest({
      content: input,
      images: selectedImages,
      documents: selectedDocuments,
      shouldResetInput: true,
    });
  };

  useEffect(() => {
    if (prefillHandledRef.current) return;
    if (typeof window === "undefined") return;

    const stored = window.sessionStorage.getItem("groupxam_chat_prefill");
    if (!stored) return;

    if (!usageData) return;

    if (isChatInMaintenance) {
      return;
    }

    try {
      const payload = JSON.parse(stored);
      prefillHandledRef.current = true;
      window.sessionStorage.removeItem("groupxam_chat_prefill");

      const question = typeof payload?.question === "string" ? payload.question : "";
      let prefillDocument: DocumentAttachment | null = null;

      if (payload?.document) {
        const estimatedSize =
          typeof payload.documentSize === "number" && payload.documentSize > 0
            ? payload.documentSize
            : Math.round((payload.document.length * 3) / 4);

        prefillDocument = {
          name: payload.documentName || "Uploaded document",
          type: payload.documentType || "application/octet-stream",
          dataUrl: payload.document,
          size: estimatedSize,
        };
      }

      const prefillImages = Array.isArray(payload?.images)
        ? payload.images.filter((img: unknown): img is string => typeof img === "string")
        : [];

      sendChatRequest({
        content: question || "",
        documents: prefillDocument ? [prefillDocument] : [],
        images: prefillImages,
        shouldResetInput: false,
      });
    } catch (error) {
      console.error("Failed to process chat prefill payload:", error);
      window.sessionStorage.removeItem("groupxam_chat_prefill");
    }
  }, [usageData, sendChatRequest, isChatInMaintenance]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg gap-2">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Link href="/chatbot">
              <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-lg p-2">
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <Image
                src="/sunu_icon.png"
                alt="sunu-I"
                width={32}
                height={32}
                className="object-contain w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0"
              />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                  sunu-I
                </h1>
                <p className="text-xs text-gray-500 hidden sm:block">AI Study Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            {usageData && (
              <Card className="px-2 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200/50">
                <div className="flex items-center gap-1 sm:gap-2">
                  {usageData.hasSubscription ? (
                    <>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-emerald-700 whitespace-nowrap">Unlimited</span>
                    </>
                  ) : (
                    <>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                        <span className="hidden sm:inline">{usageData.remainingTries} {usageData.remainingTries === 1 ? 'try' : 'tries'} left</span>
                        <span className="sm:hidden">{usageData.remainingTries}</span>
                      </span>
                    </>
                  )}
                </div>
              </Card>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="hover:bg-gray-100 rounded-lg p-2"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Limit Message */}
        {showLimitMessage && !usageData?.hasSubscription && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/50 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-amber-900">Free Tries Exhausted</p>
                <p className="text-xs text-amber-700 hidden sm:block">Subscribe now for unlimited access to sunu-I</p>
              </div>
            </div>
            <Link href="/subscription" className="w-full sm:w-auto">
              <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg w-full sm:w-auto">
                <span className="text-xs sm:text-sm">Subscribe Now</span>
              </Button>
            </Link>
          </div>
        )}

        {isChatInMaintenance && (
          <div className="px-4 sm:px-6 mt-4">
            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700">
              <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-semibold">sunu-I is currently offline</p>
                <p className="text-sm leading-relaxed">{chatMaintenanceMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 group ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <Image
                      src="/sunu_icon.png"
                      alt="sunu-I"
                      width={40}
                      height={40}
                      className="object-contain w-10 h-10"
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 max-w-[75%]">
                  <div
                    className={`rounded-2xl px-5 py-4 shadow-lg transition-all duration-200 ${message.role === "user"
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-md"
                      : "bg-white border border-gray-200/50 text-gray-800 rounded-bl-md shadow-md"
                      }`}
                  >
                    {message.images && message.images.length > 0 && (
                      <div className={`grid grid-cols-2 gap-2 mb-3 ${message.role === "user" ? "opacity-90" : ""}`}>
                        {message.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative rounded-lg overflow-hidden border-2 border-white/20">
                            <img
                              src={img}
                              alt={`Upload ${imgIndex + 1}`}
                              className="w-full h-32 object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {message.documents && message.documents.length > 0 && (
                      <div className="flex flex-col gap-2 mb-3">
                        {message.documents.map((doc, docIndex) => (
                          <a
                            key={`${doc.name}-${docIndex}`}
                            href={doc.dataUrl}
                            download={doc.name}
                            className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${message.role === "user"
                              ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                              : "border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileText className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate max-w-[160px] sm:max-w-[220px]">{doc.name}</span>
                            </div>
                            <span className="text-xs opacity-75 ml-2 flex-shrink-0">
                              {formatFileSize(doc.size)}
                            </span>
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="leading-relaxed break-words">
                      {renderMarkdown(message.content, message.role === "user")}
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${message.role === "user" ? "justify-end" : "justify-start"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, index)}
                      className="h-7 px-2 text-xs"
                    >
                      {copiedMessageId === index ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl blur-md opacity-20"></div>
                      <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4 justify-start">
                <div className="flex-shrink-0">
                  <Image
                    src="/sunu_icon.png"
                    alt="sunu-I"
                    width={40}
                    height={40}
                    className="object-contain w-10 h-10"
                  />
                </div>
                <div className="bg-white border border-gray-200/50 rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">sunu-I is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 px-6 py-5 shadow-2xl">
          <div className="max-w-4xl mx-auto">
            {selectedImages.length > 0 && (
              <div className="flex gap-3 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                {selectedImages.map((img, index) => (
                  <div key={index} className="relative flex-shrink-0 group">
                    <div className="relative overflow-hidden rounded-xl border-2 border-gray-200 shadow-md">
                      <img
                        src={img}
                        alt={`Selected ${index + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg transition-transform hover:scale-110"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {selectedDocuments.length > 0 && (
              <div className="flex flex-col gap-2 mb-3">
                {selectedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {(doc.type || "Unknown type").split("/").pop()} · {formatFileSize(doc.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      type="button"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {documentError && (
              <div className="mb-3 text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{documentError}</span>
              </div>
            )}
            <Card className="bg-white border-2 border-gray-200/50 shadow-xl rounded-2xl overflow-hidden">
              <div className="flex items-end gap-2 p-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <input
                  ref={documentInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.md,.json,.csv"
                  onChange={handleDocumentSelect}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-shrink-0 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={
                    isLoading ||
                    isChatInMaintenance ||
                    (usageData && !usageData.canUseChat && !usageData.hasSubscription)
                  }
                >
                  <ImageIcon className="w-5 h-5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => documentInputRef.current?.click()}
                  className="flex-shrink-0 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={
                    isLoading ||
                    isChatInMaintenance ||
                    (usageData && !usageData.canUseChat && !usageData.hasSubscription)
                  }
                >
                  <Paperclip className="w-5 h-5 text-gray-600" />
                </Button>
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask sunu-I anything about your studies..."
                  disabled={
                    isLoading ||
                    isChatInMaintenance ||
                    (usageData && !usageData.canUseChat && !usageData.hasSubscription)
                  }
                  className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base py-6"
                />
                <Button
                  onClick={sendMessage}
                  disabled={
                    isLoading ||
                    isChatInMaintenance ||
                    (!input.trim() && selectedImages.length === 0 && selectedDocuments.length === 0) ||
                    (usageData && !usageData.canUseChat && !usageData.hasSubscription)
                  }
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex-shrink-0 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 h-11 w-11 p-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </Card>
            <p className="text-xs text-center text-gray-500 mt-3">
              sunu-I can make mistakes. Always verify important information.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

