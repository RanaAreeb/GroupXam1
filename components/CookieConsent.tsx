"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookieConsent");
      if (!consent) setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[95vw] max-w-xl bg-gradient-to-r from-emerald-700/80 via-blue-700/80 to-purple-700/80 backdrop-blur-2xl border border-emerald-400/40 rounded-2xl shadow-2xl px-6 py-5 flex flex-col sm:flex-row items-center gap-4 animate-slide-down" style={{ left: '50%', transform: 'translateX(-50%)' }}>
      <div className="flex-1 text-white text-sm sm:text-base">
        <span className="font-semibold text-emerald-300">groupXam</span> uses
        cookies to enhance your experience. By continuing, you agree to our{" "}
        <a
          href="/privacy-policy"
          className="underline hover:text-emerald-200 transition-colors"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="/terms-of-use"
          className="underline hover:text-emerald-200 transition-colors"
        >
          Terms of Use
        </a>
        .
      </div>
      <button
        onClick={acceptCookies}
        className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-500 hover:from-emerald-500 hover:to-blue-600 text-white font-bold px-6 py-2 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        Accept
      </button>
    </div>
  );
}
