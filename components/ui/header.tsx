"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Settings, ChevronDown, Calculator, BookOpen, Users, FileText, Brain, MessageSquare } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import React from "react";
import { useAuth } from "@/hooks/use-auth";

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
  const { isLoggedIn: authLoggedIn, user, logout: authLogout, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileToolsMenu, setShowMobileToolsMenu] = useState(false);

  // Prioritize auth hook state over prop, but don't show anything while loading
  // If auth hook has loaded and says not logged in, respect that over props
  const userIsLoggedIn = loading ? false : authLoggedIn;

  // Close user menu when auth state changes (like on logout)
  useEffect(() => {
    if (!authLoggedIn) {
      setShowUserMenu(false);
    }
  }, [authLoggedIn]);

  // Close tools menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.tools-dropdown')) {
        setShowToolsMenu(false);
      }
    };

    if (showToolsMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showToolsMenu]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.mobile-menu')) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMobileMenu]);

  const handleLogout = async () => {
    setShowUserMenu(false); // Close menu immediately

    if (onLogout) {
      await onLogout();
    } else {
      await authLogout();
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-md transition-shadow duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <Image
            src="/logo.png"
            alt="groupXam logo"
            width={120}
            height={120}
            className="w-24 h-8 sm:w-32 sm:h-10 md:w-36 md:h-12 transition-transform duration-300 group-hover:scale-105 object-contain"
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
          {/* Tools Dropdown */}
          <div className="relative tools-dropdown">
            <button
              onClick={() => setShowToolsMenu(!showToolsMenu)}
              className="flex items-center space-x-1 text-gray-600 hover:text-emerald-600 transition-colors font-medium"
            >
              <span>Tools</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showToolsMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Tools Dropdown Menu */}
            {showToolsMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <Link
                  href={userIsLoggedIn ? "/quiz" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <BookOpen className="w-5 h-5 mr-3 text-emerald-600" />
                  <div>
                    <div className="font-medium">Quizzes</div>
                    <div className="text-xs text-gray-500">Interactive practice tests</div>
                  </div>
                </Link>
                <Link
                  href={userIsLoggedIn ? "/exams" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <Brain className="w-5 h-5 mr-3 text-blue-600" />
                  <div>
                    <div className="font-medium">Exam Prep</div>
                    <div className="text-xs text-gray-500">WAEC, WASSCE, JAMB, IELTS</div>
                  </div>
                </Link>
                <Link
                  href={userIsLoggedIn ? "/calculator" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <Calculator className="w-5 h-5 mr-3 text-cyan-600" />
                  <div>
                    <div className="font-medium">Calculator</div>
                    <div className="text-xs text-gray-500">Scientific calculator</div>
                  </div>
                </Link>
                <Link
                  href={userIsLoggedIn ? "/whiteboard" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <FileText className="w-5 h-5 mr-3 text-orange-600" />
                  <div>
                    <div className="font-medium">Whiteboard</div>
                    <div className="text-xs text-gray-500">Draw and solve problems</div>
                  </div>
                </Link>
                <Link
                  href={userIsLoggedIn ? "/flashcards" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <BookOpen className="w-5 h-5 mr-3 text-purple-600" />
                  <div>
                    <div className="font-medium">Flashcards</div>
                    <div className="text-xs text-gray-500">Study with flashcards</div>
                  </div>
                </Link>
                <Link
                  href={userIsLoggedIn ? "/discussions" : "/login"}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-emerald-50 transition-colors"
                  onClick={() => setShowToolsMenu(false)}
                >
                  <MessageSquare className="w-5 h-5 mr-3 text-cyan-600" />
                  <div>
                    <div className="font-medium">Study Groups</div>
                    <div className="text-xs text-gray-500">Collaborate with peers</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Pricing Link */}
          <Link
            href="/subscription"
            className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
          >
            Pricing
          </Link>

          {navLinks}

          {/* User Account Section */}
          {userIsLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium bg-white/80 rounded-full px-3 py-2 shadow-md hover:shadow-lg"
              >
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium">
                    {(user?.name || userInitial || "U").charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-sm">{user?.name || "Account"}</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
                  {/* Admin Dashboard - Only visible to admin users */}
                  {(user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com" || user?.email === "jtdavis@konductcoachlearning.com") && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  {/* Dashboard - Only visible to university users */}
                  {user?.role === "university" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Burger Menu */}
        <div className="md:hidden relative mobile-menu">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex items-center justify-center w-10 h-10 text-gray-600 hover:text-emerald-600 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Mobile Menu Dropdown */}
          {showMobileMenu && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 z-50">
              {/* User Profile Section - Always at top */}
              {userIsLoggedIn && (
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {(user?.name || userInitial || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-gray-900">{user?.name || "Account"}</div>
                      <div className="text-sm text-gray-500">Welcome back!</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tools Section - Collapsible */}
              <div className="px-2 py-2">
                <button
                  onClick={() => setShowMobileToolsMenu(!showMobileToolsMenu)}
                  className="flex items-center justify-between w-full px-2 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <Brain className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="font-medium">Tools</span>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showMobileToolsMenu ? 'rotate-180' : ''}`} />
                </button>

                {showMobileToolsMenu && (
                  <div className="ml-4 space-y-1">
                    <Link
                      href={userIsLoggedIn ? "/quiz" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <BookOpen className="w-4 h-4 mr-3 text-emerald-600" />
                      Quizzes
                    </Link>
                    <Link
                      href={userIsLoggedIn ? "/exams" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Brain className="w-4 h-4 mr-3 text-blue-600" />
                      Exam Prep
                    </Link>
                    <Link
                      href={userIsLoggedIn ? "/calculator" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Calculator className="w-4 h-4 mr-3 text-cyan-600" />
                      Calculator
                    </Link>
                    <Link
                      href={userIsLoggedIn ? "/whiteboard" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <FileText className="w-4 h-4 mr-3 text-orange-600" />
                      Whiteboard
                    </Link>
                    <Link
                      href={userIsLoggedIn ? "/flashcards" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <BookOpen className="w-4 h-4 mr-3 text-purple-600" />
                      Flashcards
                    </Link>
                    <Link
                      href={userIsLoggedIn ? "/discussions" : "/login"}
                      className="flex items-center px-3 py-2 text-gray-600 hover:bg-emerald-50 transition-colors rounded-lg text-sm"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <MessageSquare className="w-4 h-4 mr-3 text-cyan-600" />
                      Study Groups
                    </Link>
                  </div>
                )}
              </div>

              {/* Other Links */}
              <div className="px-2 py-2">
                <Link
                  href="/subscription"
                  className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-bold text-sm">$</span>
                  </div>
                  <span className="font-medium">Pricing</span>
                </Link>
                {navLinks}
              </div>

              {/* User Account Actions */}
              {userIsLoggedIn ? (
                <div className="px-2 py-2 border-t border-gray-100">
                  <Link
                    href="/profile"
                    className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3 text-gray-500" />
                    <span className="font-medium">My Profile</span>
                  </Link>
                  {/* Admin Dashboard - Only visible to admin users */}
                  {(user?.email === "ranaareeb1029@gmail.com" || user?.email === "cliftonmanneh6@gmail.com" || user?.email === "jtdavis@konductcoachlearning.com") && (
                    <Link
                      href="/admin/dashboard"
                      className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      <span className="font-medium">Admin Dashboard</span>
                    </Link>
                  )}
                  {/* Dashboard - Only visible to university users */}
                  {user?.role === "university" && (
                    <Link
                      href="/dashboard"
                      className="flex items-center px-2 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-500" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMobileMenu(false);
                    }}
                    className="w-full flex items-center px-2 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    <X className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <div className="px-4 py-3 border-t border-gray-100 space-y-2">
                  <Link
                    href="/login"
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full text-center border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2.5 rounded-lg transition-colors font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}