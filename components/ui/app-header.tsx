"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function AppHeader({
  userInitial,
  active,
}: {
  userInitial?: string;
  active?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/quiz", label: "Quizzes" },
    { href: "/exams", label: "Exams" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/discussions", label: "Discussions" },
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="groupXam logo" width={150} height={150} />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                (active === link.label
                  ? "text-emerald-600 font-medium "
                  : "text-gray-600 ") +
                "hover:text-emerald-600 transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Mobile Burger Button */}
        <button
          className="md:hidden p-2"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-white animate-fade-in">
          <div className="px-4 py-6 flex flex-col items-center gap-4">
            {navLinks.map((link) => (
              <div
                key={link.href}
                className="w-full text-lg text-center py-2 rounded hover:bg-emerald-50 transition"
              >
                <Link
                  href={link.href}
                  className={
                    (active === link.label
                      ? "text-emerald-600 font-medium "
                      : "text-gray-600 ") +
                    "hover:text-emerald-600 transition-colors"
                  }
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
