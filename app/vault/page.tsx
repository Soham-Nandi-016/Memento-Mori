import { requireAuth } from "@/lib/auth";
import ExecutorSidebar from "@/components/ExecutorSidebar";
import VaultClient from "./VaultClient";

export const metadata = { title: "Vault — Memento Mori" };

export default async function VaultPage() {
  await requireAuth();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--background)", display: "flex" }}>
      <ExecutorSidebar />

      {/* Ambient mesh */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 40% at 20% 10%, rgba(0,240,255,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 50% 40% at 80% 80%, rgba(191,90,242,0.04) 0%, transparent 65%)
          `,
        }}
      />

      <main
        style={{
          marginLeft: "280px",
          flex: 1,
          paddingBottom: "150px",
          position: "relative",
          zIndex: 10,
          overflowY: "auto",
        }}
      >
        {/* Top bar */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "14px 28px",
            background: "rgba(12,19,36,0.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(59,73,75,0.12)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", color: "var(--on-surface-variant)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Memento Mori
          </span>
          <span style={{ color: "var(--outline)", fontSize: "0.7rem" }}>/</span>
          <span style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", color: "var(--accent-cyan)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Vault
          </span>
        </header>

        {/* Hero */}
        <section style={{ padding: "48px 28px 32px" }}>
          <p
            className="font-label"
            style={{ fontSize: "0.7rem", color: "var(--on-surface-variant)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}
          >
            Asset Repository
          </p>
          <h1
            style={{
              fontFamily: "'Space Grotesk', var(--font-inter), sans-serif",
              fontSize: "clamp(2rem, 3.5vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            <span style={{ color: "var(--on-surface)" }}>Asset </span>
            <span className="text-primary-glow">Vault</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", maxWidth: "480px", lineHeight: 1.7 }}>
            Encrypted asset repository. All indexed files from your Google Drive are stored and catalogued here for legacy distribution.
          </p>
        </section>

        {/* Vault Client (Replaces Coming Soon) */}
        <VaultClient />
      </main>
    </div>
  );
}
