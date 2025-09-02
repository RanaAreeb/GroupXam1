"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Settings } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  // For burger animation
  const [burgerHover, setBurgerHover] = useState(false);
  
  // Prioritize auth hook state over prop, but don't show anything while loading
  // If auth hook has loaded and says not logged in, respect that over props
  const userIsLoggedIn = loading ? false : authLoggedIn;

  // Close user menu when auth state changes (like on logout)
  useEffect(() => {
    if (!authLoggedIn) {
      setShowUserMenu(false);
    }
  }, [authLoggedIn]);

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
          
          {/* User Account Section */}
          {userIsLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-emerald-600 transition-colors font-medium bg-white/80 rounded-full px-4 py-2 shadow-md hover:shadow-lg"
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
                <span className="hidden lg:inline">{user?.name || "Account"}</span>
              </button>
              
              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
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
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
               Sign In
              </Link>
              <Link
                href="/signup"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
        {/* Mobile Nav - Show navLinks here too */}
        <nav className="md:hidden flex items-center space-x-3">
          {navLinks}
          
          {/* Mobile User Account Section */}
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
                <span className="hidden sm:inline text-sm">{user?.name || "Account"}</span>
              </button>
              
              {/* Mobile Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="w-4 h-4 mr-3" />
                    My Profile
                  </Link>
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
            <div className="flex items-center space-x-2">
              <Link
                href="/login"
                className="text-gray-600 hover:text-emerald-600 transition-colors font-medium text-sm px-3 py-2"
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
        {/* Mobile Burger Button */}
      </div>
    </header>
  );
}
