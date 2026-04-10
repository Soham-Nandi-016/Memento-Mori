import { requireAuth } from "@/lib/auth";
import ExecutorSidebar from "@/components/ExecutorSidebar";
import ArchivistTerminal from "@/components/ArchivistTerminal";
import SentimentalStream from "@/components/SentimentalStream";
import NodeGraph from "@/components/NodeGraph";
import VerificationHUD from "@/components/VerificationHUD";
import HUDHeader from "@/components/HUDHeader";
import CheckInAction from "@/components/CheckInAction";

/**
 * Memento Mori — Command Center (Pixel-Perfect Rebuild)
 *
 * 3 Primary Layout Containers:
 *  1. <aside>   — ExecutorSidebar, fixed left 280px (navigation core)
 *  2. <main>    — Main Viewport, ml-[280px], scrollable content area
 *  3. <div>     — VerificationHUD, fixed bottom bar (trustee status)
 *
 * Stitch Design DNA:
 *  - bg: #0c1324, surface-container nesting (no 1px borders)
 *  - Space Grotesk for "Legacy Node-01" headline
 *  - Bioluminescent SVG background in hero section
 *  - 24px (xl) corner radii on all major containers
 *  - Elevation: 0 20px 40px -10px rgba(0,219,233,0.08)
 */
export default async function DashboardPage() {
  await requireAuth();

  return (
    <div
      className="scanline"
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--background)",
        display: "flex",
      }}
    >
      {/* ─────────────────────────────────────────────────────────────────
          CONTAINER 1: Left Sidebar (Executor-01)
          Fixed, 280px wide, full-height navigation panel
      ──────────────────────────────────────────────────────────────────── */}
      <ExecutorSidebar />

      {/* ─────────────────────────────────────────────────────────────────
          Ambient mesh background — fixed, full viewport
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 45% at 55% 8%, rgba(0,240,255,0.055) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 85% 85%, rgba(191,90,242,0.05) 0%, transparent 65%)
          `,
        }}
      />

      {/* ─────────────────────────────────────────────────────────────────
          CONTAINER 2: Main Viewport (Content Area)
          Occupies remaining width to the right of the sidebar
      ──────────────────────────────────────────────────────────────────── */}
      <main
        style={{
          marginLeft: "280px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 80px)",
          position: "relative",
          zIndex: 10,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* ── Top Nav Bar ─────────────────────────────────────────────── */}
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            gap: "32px",
            padding: "14px 28px",
            background: "rgba(12,19,36,0.85)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(59,73,75,0.12)",
          }}
        >
          {/* Nav links */}
          {["Dashboard", "Vault", "Nodes"].map((link, i) => (
            <button
              key={link}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-inter)",
                fontSize: "0.8rem",
                fontWeight: i === 0 ? 600 : 400,
                color: i === 0 ? "var(--on-surface)" : "var(--on-surface-variant)",
                letterSpacing: "0.01em",
                paddingBottom: "2px",
                borderBottom: i === 0 ? "1.5px solid var(--accent-cyan)" : "1.5px solid transparent",
                transition: "color 0.2s ease",
              }}
            >
              {link}
            </button>
          ))}

          {/* Right — status icons */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Network Stability chip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "999px",
                backgroundColor: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.18)",
              }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "#22c55e",
                  boxShadow: "0 0 8px rgba(34,197,94,0.7)",
                  animation: "node-breathe 2s ease-in-out infinite",
                }}
              />
              <span className="font-mono" style={{ fontSize: "0.6rem", color: "#22c55e", letterSpacing: "0.06em" }}>
                NETWORK STABILITY: 99.9%
              </span>
            </div>
            {/* Icon placeholders */}
            {["⟳", "🔔", "⚙", "◈"].map((icon, i) => (
              <button
                key={i}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-container-high)",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--on-surface-variant)",
                  fontSize: i === 3 ? "0.9rem" : "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </header>

        {/* ── Hero Section: Bioluminescent backdrop + Legacy Node-01 ──── */}
        <section
          style={{
            position: "relative",
            overflow: "hidden",
            minHeight: "340px",
            padding: "40px 28px 32px",
          }}
        >
          {/* SVG bioluminescent network background */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              opacity: 0.5,
            }}
            viewBox="0 0 800 340"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <radialGradient id="hero-glow-1" cx="30%" cy="40%" r="50%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="hero-glow-2" cx="70%" cy="60%" r="40%">
                <stop offset="0%" stopColor="#bf5af2" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#bf5af2" stopOpacity="0" />
              </radialGradient>
              <filter id="hero-blur">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            {/* Background gradients */}
            <rect width="800" height="340" fill="url(#hero-glow-1)" />
            <rect width="800" height="340" fill="url(#hero-glow-2)" />

            {/* Network lines */}
            {[
              [120, 80, 280, 140], [280, 140, 450, 90], [450, 90, 600, 180],
              [600, 180, 720, 120], [280, 140, 380, 240], [450, 90, 500, 200],
              [600, 180, 550, 260], [120, 80, 200, 190], [200, 190, 380, 240],
              [380, 240, 500, 200], [500, 200, 620, 280], [720, 120, 760, 220],
              [50, 200, 120, 80], [50, 200, 200, 190],
            ].map(([x1, y1, x2, y2], i) => (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#00f0ff"
                strokeWidth="0.4"
                strokeOpacity="0.3"
              />
            ))}

            {/* Nodes */}
            {[
              [120, 80, 4, "#00f0ff"], [280, 140, 6, "#00f0ff"], [450, 90, 5, "#bf5af2"],
              [600, 180, 4, "#00f0ff"], [720, 120, 3, "#bf5af2"], [380, 240, 4, "#00f0ff"],
              [500, 200, 3, "#bf5af2"], [200, 190, 3, "#00f0ff"], [50, 200, 3, "#bf5af2"],
            ].map(([cx, cy, r, color], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r={(r as number) + 6} fill={color as string} fillOpacity="0.05" />
                <circle cx={cx} cy={cy} r={r} fill={color as string} fillOpacity="0.8" />
              </g>
            ))}
          </svg>

          {/* Dark to transparent gradient at bottom of hero */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "120px",
              background: "linear-gradient(to top, var(--background) 0%, transparent 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Hero content */}
          <div style={{ position: "relative", zIndex: 2, maxWidth: "480px" }}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', var(--font-inter), sans-serif",
                fontSize: "clamp(2.5rem, 4vw, 3.8rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                margin: "0 0 16px",
              }}
            >
              <span style={{ color: "var(--on-surface)" }}>Legacy </span>
              <span className="text-primary-glow">Node-01</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
                color: "var(--on-surface-variant)",
                maxWidth: "400px",
              }}
            >
               The autonomous steward of your digital existence. Monitoring 4.2TB
              of sentimental assets across 12 decentralized encrypted vaults.
            </p>
            <CheckInAction />
          </div>
        </section>

        {/* ── Cards Row: Monologue.sys + Asset Vault + Legacy Protocols ── */}
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr",
            gap: "16px",
            padding: "0 28px 28px",
          }}
        >
          {/* Monologue.sys Terminal */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--surface-container-low)",
              padding: "20px",
              boxShadow: "var(--shadow-float)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <span
                className="font-mono"
                style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                MONOLOGUE.SYS
              </span>
              <span style={{ fontSize: "0.7rem", color: "var(--accent-cyan)", opacity: 0.6 }}>&lt;&gt;</span>
            </div>
            <ArchivistTerminal />
          </div>

          {/* Asset Vault */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--surface-container-low)",
              padding: "20px",
              boxShadow: "var(--shadow-float)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(0,240,255,0.08)",
                  border: "1px solid rgba(0,240,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-cyan)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="9" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M16 8h2M16 13h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </div>
              <span
                className="font-mono"
                style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)", opacity: 0.6 }}
              >
                01
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Asset Vault
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.5, flex: 1 }}>
              4,281 Encrypted objects across 14 cloud providers.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "16px" }}>
              <div
                style={{
                  width: "38px",
                  height: "22px",
                  borderRadius: "11px",
                  backgroundColor: "rgba(0,240,255,0.8)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  padding: "2px",
                  transition: "background 0.2s",
                }}
              >
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", backgroundColor: "var(--on-primary)", marginLeft: "auto" }} />
              </div>
              <span className="font-label" style={{ fontSize: "0.6rem", color: "var(--accent-cyan)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                + 69 NEW
              </span>
            </div>
          </div>

          {/* Legacy Protocols */}
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              backgroundColor: "var(--surface-container-low)",
              padding: "20px",
              boxShadow: "var(--shadow-float)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(191,90,242,0.08)",
                  border: "1px solid rgba(191,90,242,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent-violet)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 1.5L2 5.5v5c0 4 3 7.3 7.5 8.5C14 17.8 17 14.5 17 10.5v-5L10 1.5z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 10l2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                className="font-mono"
                style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)", opacity: 0.6 }}
              >
                02
              </span>
            </div>
            <h3
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--on-surface)",
                letterSpacing: "-0.02em",
                marginBottom: "6px",
              }}
            >
              Legacy Protocols
            </h3>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", lineHeight: 1.5, flex: 1 }}>
              Execution rules for post-mortem digital inheritance.
            </p>
            <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
              <span
                className="font-label"
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(0,240,255,0.08)",
                  border: "1px solid rgba(0,240,255,0.2)",
                  fontSize: "0.55rem",
                  color: "var(--accent-cyan)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                ACTIVE
              </span>
              <span
                className="font-label"
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(191,90,242,0.08)",
                  border: "1px solid rgba(191,90,242,0.2)",
                  fontSize: "0.55rem",
                  color: "var(--accent-violet)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                PROXIMA-DELPHI
              </span>
            </div>
          </div>
        </section>

        {/* ── Sentimental Stream ─────────────────────────────────────── */}
        <section style={{ padding: "0 28px 32px" }}>
          <SentimentalStream />
        </section>
      </main>

      {/* ─────────────────────────────────────────────────────────────────
          CONTAINER 3: Verification HUD (Bottom Status Bar)
          Fixed bottom bar, right of the 280px sidebar
      ──────────────────────────────────────────────────────────────────── */}
      <VerificationHUD />
    </div>
  );
}
