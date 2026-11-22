import type { Metadata, Viewport } from "next";
import { LOGO_MARK_SVG } from "@/components/ui/logoMarkSvg";
import "./globals.css";

const description =
  "Generate complete, accessible design systems in an instant: color scales, typography, spacing and effects, previewed live and exported to CSS, Tailwind, SCSS, JS and design-token formats.";

export const metadata: Metadata = {
  title: {
    default: "ThemeForge",
    template: "%s · ThemeForge",
  },
  description,
  applicationName: "ThemeForge",
  keywords: ["design system", "theme generator", "design tokens", "color palette", "tailwind", "css variables"],
  icons: {
    icon: [{ url: `data:image/svg+xml,${LOGO_MARK_SVG}`, type: "image/svg+xml" }],
  },
  openGraph: {
    title: "ThemeForge",
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
