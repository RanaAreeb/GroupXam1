"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function AppHeader({
  userInitial,
  active,
}: {
  userInitial?: string;
  active?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [burgerHover, setBurgerHover] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/quiz", label: "Quizzes" },
    { href: "/exams", label: "Exams" },
    { href: "/flashcards", label: "Flashcards" },
    { href: "/discussions", label: "Study Groups" },
    { href: "/whiteboard", label: "Whiteboard" },
    { href: "/services", label: "ProctorIT" },
  ];

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md transition-shadow duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="groupXam logo"
            width={150}
            height={150}
            className="transition-transform duration-300 group-hover:scale-105"
          />
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
          {isLoggedIn && (
            <button
              onClick={logout}
              className="text-gray-600 hover:text-red-600 transition-colors font-medium ml-4"
            >
              Logout
            </button>
          )}
        </nav>
        {/* Mobile Burger Button */}
        <button
          className="md:hidden p-2 relative z-30 focus:outline-none"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((open) => !open)}
          onMouseEnter={() => setBurgerHover(true)}
          onMouseLeave={() => setBurgerHover(false)}
        >
          <div
            className={clsx(
              "w-8 h-8 relative transition-all duration-300",
              burgerHover && "scale-110"
            )}
          >
            <span
              className={clsx(
                "absolute left-0 w-8 h-1 bg-emerald-700 rounded transition-all duration-300 origin-center",
                mobileMenuOpen ? "rotate-45 top-3.5" : "rotate-0 top-1"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 top-3.5 w-8 h-1 bg-emerald-700 rounded transition-all duration-300",
                mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              )}
            />
            <span
              className={clsx(
                "absolute left-0 w-8 h-1 bg-emerald-700 rounded transition-all duration-300 origin-center",
                mobileMenuOpen ? "-rotate-45 top-3.5" : "rotate-0 top-6"
              )}
            />
          </div>
        </button>
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/30 animate-fade-in">
          <div className="absolute top-0 left-0 right-0 bg-white rounded-b-2xl shadow-xl animate-slide-down px-4 pt-4 pb-8 flex flex-col items-center">
            {/* Nav Links */}
            <div className="w-full flex flex-col items-center space-y-4 mt-16">
              {navLinks.map((link) => (
                <div
                  key={link.href}
                  className="w-full text-lg text-center py-3 rounded-xl font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 shadow transition-all duration-200"
                >
                  <Link
                    href={link.href}
                    className={
                      (active === link.label
                        ? "text-emerald-600 font-medium "
                        : "text-emerald-600 ") +
                      "hover:text-emerald-700 transition-colors"
                    }
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
              {isLoggedIn && (
                <button
                  onClick={logout}
                  className="w-full text-lg text-center py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-semibold shadow"
                >
                  Logout
                </button>
              )}

              {/* Legal Links */}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
