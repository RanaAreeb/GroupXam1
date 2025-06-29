"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import React from "react";

export default function Header({
  navLinks,
  userInitial,
  onLogout,
  isLoggedIn,
}: {
  navLinks?: React.ReactNode;
  userInitial?: string;
  onLogout?: () => void;
  isLoggedIn?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" alt="groupXam logo" width={150} height={150} />
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks}
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-red-600 transition-colors font-medium"
            >
              Logout
            </button>
          )}
          {userInitial && (
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
              {userInitial}
            </div>
          )}
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
            {React.Children.map(navLinks, (child, idx) => (
              <div
                key={idx}
                className="w-full text-lg text-center py-2 rounded hover:bg-emerald-50 transition"
              >
                {child}
              </div>
            ))}
            {isLoggedIn && onLogout && (
              <button
                onClick={onLogout}
                className="w-full text-lg text-center py-2 rounded hover:bg-red-50 text-red-600 font-medium"
              >
                Logout
              </button>
            )}
            {userInitial && (
              <div className="flex items-center justify-center mt-2">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium text-lg">
                  {userInitial}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
