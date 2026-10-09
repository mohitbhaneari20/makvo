import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { BRAND } from "@/lib/brand";
import { AppProvider } from "@/lib/store";
import { Shell } from "@/components/shell/Shell";

export const metadata: Metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "A professional network where designers, developers, creators and studios showcase their work, connect with each other, and get hired.",
};
export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#F6F7ED" }, { media: "(prefers-color-scheme: dark)", color: "#001F3F" }],
  width: "device-width", initialScale: 1,
};

// Runs before paint so the saved theme applies without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("makvo-theme")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light";}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body style={{ ["--font-sans" as string]: "var(--font-geist-sans)", ["--font-mono" as string]: "var(--font-geist-mono)" }}>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
