"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Placeholder for sending email with Google App Password
  const sendEmail = async () => {
    // TODO: Integrate with backend/email API using Google App Password
    return new Promise((resolve) => setTimeout(resolve, 1200));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex flex-col items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated SVG Blobs */}
      <svg
        className="absolute -top-32 -left-32 w-[40vw] h-[40vw] opacity-30 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#6ee7b7"
          d="M44.8,-67.2C56.7,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.7,0.8,70.2,13.7C65.7,26.6,54.7,37.4,42.2,46.2C29.7,55,14.8,61.8,-0.7,62.7C-16.2,63.6,-32.4,58.6,-44.2,48.6C-56,38.6,-63.4,23.6,-66.2,7.6C-69,-8.4,-67.2,-25.4,-58.7,-36.7C-50.2,-48,-35,-53.7,-20.1,-60.2C-5.2,-66.7,9.4,-74.1,24.2,-74.2C39,-74.3,55,-67.2,44.8,-67.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <svg
        className="absolute -bottom-32 -right-32 w-[40vw] h-[40vw] opacity-20 blur-2xl z-0"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#a5b4fc"
          d="M38.2,-60.2C51.2,-54.2,63.2,-44.2,68.2,-31.2C73.2,-18.2,71.2,-2.2,66.2,12.8C61.2,27.8,53.2,41.8,41.2,50.8C29.2,59.8,14.2,63.8,-0.8,64.8C-15.8,65.8,-31.8,63.8,-44.8,55.8C-57.8,47.8,-67.8,33.8,-70.8,18.8C-73.8,3.8,-69.8,-12.2,-61.8,-25.2C-53.8,-38.2,-41.8,-48.2,-28.8,-54.2C-15.8,-60.2,-1.8,-62.2,12.2,-62.2C26.2,-62.2,52.2,-66.2,38.2,-60.2Z"
          transform="translate(100 100)"
        />
      </svg>
      <div className="w-full max-w-xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/40 p-10 text-center relative overflow-hidden animate-fade-in-up z-10">
        <div className="absolute top-4 left-4">
          <Link href="/" passHref>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/70 hover:bg-emerald-100 shadow"
            >
              <ArrowLeft className="w-5 h-5 text-emerald-600" />
            </Button>
          </Link>
        </div>
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="groupXam logo"
            width={120}
            height={120}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Have a question, suggestion, or need help? Fill out the form below and
          our team will get back to you soon.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="bg-white/90"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-white/90"
          />
          <Input
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="bg-white/90"
          />
          <Textarea
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            className="bg-white/90"
            rows={4}
          />
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold text-lg py-3 rounded-xl shadow-lg mt-2 flex items-center justify-center gap-2"
            disabled={submitting}
          >
            <Send className="w-5 h-5" />
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </form>
        {success && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-semibold animate-fade-in">
            <Mail className="inline-block w-5 h-5 mr-2 align-middle" />
            Your message has been sent! We'll get back to you soon.
          </div>
        )}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold animate-fade-in">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
