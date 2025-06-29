import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GroupXam - Ace Your Exams with Confidence",
  description:
    "The most comprehensive study platform for WAEC/WASSCE preparation. Practice with thousands of questions, master concepts with flashcards, and track your progress.",
  keywords: [
    "WAEC",
    "WASSCE",
    "SAT",
    "ACT",
    "exam preparation",
    "study platform",
    "practice tests",
    "flashcards",
    "education",
  ],
  authors: [{ name: "GroupXam Team" }],
  creator: "GroupXam",
  publisher: "GroupXam",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://groupxam.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "GroupXam - Ace Your Exams with Confidence",
    description:
      "The most comprehensive study platform for WAEC/WASSCE preparation. Practice with thousands of questions, master concepts with flashcards, and track your progress.",
    url: "https://groupxam.com",
    siteName: "GroupXam",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "GroupXam - Study Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GroupXam - Ace Your Exams with Confidence",
    description:
      "The most comprehensive study platform for WAEC/WASSCE preparation.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/logo.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body>{children}</body>
    </html>
  );
}
