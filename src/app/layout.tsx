import type { Metadata } from "next";
import { Playfair_Display, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CursorEffects from "@/components/ui/CursorEffects";
import { RESTAURANT } from "@/lib/restaurant";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${RESTAURANT.name} | Authentic Rajasthani Restaurant in Agra`,
  description: `${RESTAURANT.description} Traditional thalis, Dal Baati combos, breakfast, takeaway & delivery. No onion & garlic options.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": RESTAURANT.name,
    "servesCuisine": [...RESTAURANT.cuisine],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": RESTAURANT.address.street + ", " + RESTAURANT.address.area,
      "addressLocality": RESTAURANT.address.city,
      "addressRegion": RESTAURANT.address.state,
      "addressCountry": "IN"
    },
    "telephone": RESTAURANT.phones[0].number,
    "email": RESTAURANT.email,
    "priceRange": "₹6–310",
    "url": "https://chokhojeeman.com",
    "sameAs": [RESTAURANT.facebook.url],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": String(RESTAURANT.rating.value),
      "reviewCount": String(RESTAURANT.rating.reviews)
    }
  };

  return (
    <html lang="en" className={`${playfair.variable} ${cormorant.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col pt-20 grain-overlay">
        <NextAuthProvider>
          <CursorEffects />
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  );
}
