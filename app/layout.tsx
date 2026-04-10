import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-provider";
import { SyncProvider } from "@/lib/SyncContext";
import { GlobalTimerProvider } from "@/lib/GlobalTimerContext";
import VerificationHUD from "@/components/VerificationHUD";

export const metadata: Metadata = {
  title: "Memento Mori — Autonomous Digital Legacy Agent",
  description:
    "Your digital legacy, autonomously secured. Memento Mori is the ultimate dead man's switch for your digital existence.",
  keywords: ["digital legacy", "posthumous", "autonomous", "dead man's switch"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            overflow: hidden !important;
            height: 100vh !important;
            width: 100vw !important;
            position: fixed !important;
            margin: 0;
            padding: 0;
          }
        ` }} />
        <AuthProvider>
          <GlobalTimerProvider>
            <SyncProvider>
              {children}
              <VerificationHUD />
            </SyncProvider>
          </GlobalTimerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
