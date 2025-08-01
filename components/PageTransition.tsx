"use client";

import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 ease-in-out">
      {children}
    </div>
  );
}
