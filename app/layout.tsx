import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title:
    "GroupXam - Ace Your Exams with Confidence | WAEC, WASSCE, JAMB Practice Tests",
  description:
    "Master WAEC, WASSCE, and JAMB exams with GroupXam's comprehensive study platform. Access 10,000+ practice questions, interactive flashcards, mock exams, and real-time progress tracking. Free online exam preparation for students worldwide.",
  keywords: [
    "WAEC",
    "WASSCE",
    "JAMB",
    "NECO",
    "exam preparation",
    "study platform",
    "practice tests",
    "mock exams",
    "flashcards",
    "education",
    "Nigeria education",
    "secondary school exams",
    "university entrance",
    "online learning",
    "free exam practice",
    "WAEC past questions",
    "WASSCE past questions",
    "JAMB past questions",
    "exam revision",
    "test preparation",
    "academic success",
    "student resources",
    "educational technology",
    "e-learning platform",
    "study materials",
    "exam questions",
    "practice papers",
    "revision notes",
    "academic performance",
    "exam success",
    "educational app",
    "learning management system",
    "student portal",
    "academic excellence",
    "exam confidence",
    "study tools",
    "educational resources",
    "academic support",
    "exam readiness",
    "test practice",
    "educational platform",
  ],
  authors: [{ name: "GroupXam Team", url: "https://groupxam.com" }],
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
    title:
      "GroupXam - Ace Your Exams with Confidence | WAEC, WASSCE, JAMB Practice Tests",
    description:
      "Master WAEC, WASSCE, and JAMB exams with GroupXam's comprehensive study platform. Access 10,000+ practice questions, interactive flashcards, mock exams, and real-time progress tracking. Free online exam preparation for students worldwide.",
    url: "https://groupxam.com",
    siteName: "GroupXam",
    images: [
      {
        url: "https://groupxam.com/logo.png",
        width: 1200,
        height: 630,
        alt: "GroupXam - Comprehensive Exam Preparation Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GroupXam - Ace Your Exams with Confidence",
    description:
      "Master WAEC, WASSCE, and JAMB exams with GroupXam's comprehensive study platform. Free online exam preparation for students worldwide.",
    images: ["https://groupxam.com/logo.png"],
    creator: "@groupxam",
    site: "@groupxam",
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
  category: "education",
  classification: "Educational Technology",
  other: {
    "application-name": "GroupXam",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "GroupXam",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-config": "/browserconfig.xml",
    "msapplication-TileColor": "#10b981",
    "msapplication-tap-highlight": "no",
    "theme-color": "#10b981",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#10b981",
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

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalApplication",
              name: "GroupXam",
              description:
                "Comprehensive exam preparation platform for WAEC, WASSCE, and JAMB exams",
              url: "https://groupxam.com",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
              },
              provider: {
                "@type": "Organization",
                name: "GroupXam",
                url: "https://groupxam.com",
                logo: "https://groupxam.com/logo.png",
              },
              audience: {
                "@type": "Audience",
                audienceType:
                  "Students preparing for WAEC, WASSCE, and JAMB exams worldwide",
              },
              educationalLevel: "Secondary Education",
              teaches: [
                "WAEC Exam Preparation",
                "WASSCE Exam Preparation",
                "JAMB Exam Preparation",
                "Academic Test Taking",
                "Study Skills",
              ],
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GroupXam",
              url: "https://groupxam.com",
              logo: "https://groupxam.com/logo.png",
              description:
                "Leading educational technology platform for global exam preparation",
              foundingDate: "2024",
              address: {
                "@type": "PostalAddress",
                addressCountry: "Global",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: "English",
              },
              sameAs: [
                "https://twitter.com/groupxam",
                "https://facebook.com/groupxam",
                "https://instagram.com/groupxam",
              ],
            }),
          }}
        />

        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "GroupXam",
              url: "https://groupxam.com",
              description:
                "Comprehensive exam preparation platform for students worldwide",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://groupxam.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body>
        <CookieConsent />
        {children}
      </body>
    </html>
  );
}
