"use client";

import { useSyncContext } from "@/lib/SyncContext";
import ExecutorSidebar from "@/components/ExecutorSidebar";
import VerificationHUD from "@/components/VerificationHUD";

function formatFileSize(bytes?: string): string {
  const n = parseInt(bytes ?? "0", 10);
  if (!n) return "--";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function getIcon(mime: string): JSX.Element {
  if (mime.includes("folder")) return <span style={{ color: "var(--primary-fixed)" }}>DIR</span>;
  if (mime.includes("pdf")) return <span style={{ color: "var(--error)" }}>PDF</span>;
  if (mime.includes("image")) return <span style={{ color: "var(--accent-cyan)" }}>IMG</span>;
  if (mime.includes("video")) return <span style={{ color: "var(--accent-violet)" }}>VID</span>;
  return <span style={{ color: "var(--on-surface-variant)" }}>DOC</span>;
}

export default function ArchivePage() {
  const { assets } = useSyncContext();

  return (
    <div
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        display: "flex",
      }}
    >
      <ExecutorSidebar />

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
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          paddingBottom: "80px",
          position: "relative",
          zIndex: 10,
          overflowY: "auto",
        }}
      >
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
            Archive
          </span>
        </header>

        <section style={{ padding: "48px 28px 32px", flexShrink: 0 }}>
          <p
            className="font-label"
            style={{ fontSize: "0.7rem", color: "var(--on-surface-variant)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px" }}
          >
            Digital Artifacts
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
            <span style={{ color: "var(--on-surface)" }}>Indexed </span>
            <span className="text-primary-glow">Archive</span>
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--on-surface-variant)", maxWidth: "480px", lineHeight: 1.7 }}>
            {assets.length} synchronized assets pulled directly from the central data stream.
          </p>
        </section>

        <section style={{ padding: "0 28px", paddingBottom: "40px", flex: 1, minHeight: 0 }}>
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--surface-container-low)",
              boxShadow: "var(--shadow-float)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60px 2fr 1fr 1fr",
                padding: "16px 20px",
                borderBottom: "1px solid rgba(59,73,75,0.2)",
                backgroundColor: "var(--surface-container)",
                fontFamily: "var(--font-label)",
                fontSize: "0.6rem",
                color: "var(--on-surface-variant)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              <div>Type</div>
              <div>Filename</div>
              <div>Size</div>
              <div>ID / Hash</div>
            </div>

            {assets.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "var(--on-surface-variant)" }}>
                No assets loaded. Return to the Terminal to initialize sequence.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", maxWidth: "100%" }}>
                {assets.map((file, i) => (
                  <div
                    key={file.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "60px 2fr 1fr 1fr",
                      padding: "14px 20px",
                      borderBottom: i === assets.length - 1 ? "none" : "1px solid rgba(59,73,75,0.1)",
                      alignItems: "center",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.75rem",
                      color: "var(--on-surface)",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0,240,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div style={{ fontSize: "0.65rem" }}>{getIcon(file.mimeType || "")}</div>
                    <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: "16px" }}>
                      {file.name}
                    </div>
                    <div style={{ color: "var(--on-surface-variant)" }}>{formatFileSize(file.size)}</div>
                    <div style={{ color: "var(--on-surface-variant)", opacity: 0.5, fontSize: "0.65rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {file.id.slice(0, 12)}...
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <VerificationHUD />
    </div>
  );
}
