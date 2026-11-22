import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ThemeForge — AI Design System Builder",
  description: "Generate complete, production-ready design systems with AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
