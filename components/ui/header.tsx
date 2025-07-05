"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import React from "react";

export default function Header({
  navLinks,
  userInitial,
  onLogout,
  isLoggedIn,
  verticalNav = false,
}: {
  navLinks?: React.ReactNode;
  userInitial?: string;
  onLogout?: () => void;
  isLoggedIn?: boolean;
  verticalNav?: boolean;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // For burger animation
  const [burgerHover, setBurgerHover] = useState(false);

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
        <nav
          className={
            verticalNav
              ? "hidden md:flex flex-col items-center space-y-3"
              : "hidden md:flex items-center space-x-6"
          }
        >
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
        {/* Mobile Nav - Show navLinks here too */}
        <nav className="md:hidden flex items-center space-x-3">{navLinks}</nav>
        {/* Mobile Burger Button */}
      </div>
    </header>
  );
}
