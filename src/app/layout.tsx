import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lyra — Express Yourself",
  description:
    "A free Discord alternative with unlimited profile customization, Spotify integration, animated avatars, custom themes, and profile effects — all free. Invite-only.",
  keywords: ["chat", "discord alternative", "profile customization", "spotify", "gaming"],
  openGraph: {
    title: "Lyra — Express Yourself",
    description: "A Discord alternative where every feature is free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
