"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, setDoc, updateDoc, serverTimestamp, getDoc, Timestamp } from "firebase/firestore";
import { useGlobalTimer } from "@/lib/GlobalTimerContext";

// ── Route map for nav nodes ────────────────────────────────────────────────
const NODE_ROUTES: Record<string, string> = {
  terminal:  "/",
  vault:     "/vault",
  trustees:  "/trustees",
  protocols: "/protocols",
  archive:   "/archive",
};

// ── Nav node definitions ───────────────────────────────────────────────────
interface NavNode {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_NODES: NavNode[] = [
  {
    id: "terminal",
    label: "Terminal",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M4 6l2.5 2L4 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 10h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "vault",
    label: "Vault",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
        <circle cx="7" cy="8" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M12.5 6h2M12.5 10h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "trustees",
    label: "Trustees",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M1 13c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
        <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M14 13c0-1.7-1-3-3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "protocols",
    label: "Protocols",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L2 4.5v4c0 2.8 2.4 5.1 6 6 3.6-.9 6-3.2 6-6v-4L8 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
        <path d="M5.5 8l1.5 1.5L10.5 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "archive",
    label: "Archive",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="3.5" width="13" height="3" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M2.5 6.5v6a1 1 0 001 1h9a1 1 0 001-1v-6" stroke="currentColor" strokeWidth="1.2"/>
        <path d="M6 9.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
];

// Removed localStorage countdown helpers in favor of Firestore

function formatDiff(diff: number): string {
  if (diff <= 0) return "OVERDUE";
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000)  / 60_000);
  const s = Math.floor((diff % 60_000)     / 1_000);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ExecutorSidebar() {
  const { data: session } = useSession();
  const router   = undefined; // removed — using Link instead
  const pathname = usePathname();

  // Derive which node is active from the current URL
  const activeNode =
    Object.entries(NODE_ROUTES).find(([, route]) => route === pathname)?.[0] ??
    "terminal";

  // ── Firestore State ────────────────────────────────────────────────────────
  const { countdown, isSimulating, handoverActive, isOverrideActive, resetOverride } = useGlobalTimer();

  // 4. Toggle manual override
  const handleOverrideToggle = async () => {
    if (!session?.user?.email) return;
    const userDocRef = doc(db, "users", session.user.email);
    // Setting override state and proving life by resetting the heartbeat (lastSeen)
    await updateDoc(userDocRef, { 
       isOverrideActive: !isOverrideActive,
       lastSeen: serverTimestamp()
    });
  };

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        width: "280px",
        backgroundColor: "var(--surface-container-low)",
        borderRight: "1px solid rgba(59, 73, 75, 0.12)",
        display: "flex",
        flexDirection: "column",
        zIndex: 40,
        overflowY: "auto",
      }}
    >
      {/* ── Brand mark ─────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(59,73,75,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "1.1rem", color: "var(--accent-cyan)", filter: "drop-shadow(0 0 6px var(--accent-cyan))" }}
          >
            ◈
          </motion.div>
          <div>
            <div style={{ fontFamily: "var(--font-inter)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "-0.02em" }}>
              <span className="text-primary-glow">MEMENTO</span>
              <span style={{ color: "var(--on-surface)" }}> MORI</span>
            </div>
            <div className="font-mono" style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", letterSpacing: "0.05em" }}>
              Dashboard&nbsp;&nbsp;Vault&nbsp;&nbsp;Nodes
            </div>
          </div>
        </div>
      </div>

      {/* ── Executor-01 Profile ─────────────────────────────── */}
      <div
        style={{
          margin: "16px 16px 8px",
          padding: "16px",
          borderRadius: "var(--radius-xl)",
          backgroundColor: "var(--surface-container)",
          boxShadow: "var(--shadow-float)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: "var(--surface-container-high)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.5rem",
                boxShadow: "0 0 0 2px rgba(0,240,255,0.25), 0 0 20px rgba(0,240,255,0.1)",
                overflow: "hidden",
              }}
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Executor"}
                  width={56}
                  height={56}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <span style={{ color: "var(--accent-cyan)" }}>◈</span>
              )}
            </div>
            {/* Online pulse dot */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--accent-cyan)",
                border: "2px solid var(--surface-container)",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              className="font-label"
              style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--on-surface)", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              EXECUTOR-01
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: "0.6rem",
                color: isOverrideActive ? "var(--error)" : "var(--on-surface-variant)",
                marginTop: "2px",
                letterSpacing: "0.04em",
                fontWeight: isOverrideActive ? 700 : 400,
              }}
            >
              {isOverrideActive ? "SECURE MODE: ACTIVE" : "DEAD MAN'S SWITCH: ACTIVE"}
            </div>
          </div>
        </div>

        {/* Live countdown chip */}
        <div
          style={{
            marginTop: "12px",
            padding: "8px 10px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "rgba(0,240,255,0.06)",
            border: "1px solid rgba(0,240,255,0.12)",
          }}
        >
          <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--accent-cyan)", letterSpacing: "0.04em" }}>
            Next check-in required in{" "}
            <span style={{ fontWeight: 700 }}>{countdown}</span>
          </div>
          <div className="font-mono" style={{ fontSize: "0.55rem", color: "var(--on-surface-variant)", marginTop: "2px" }}>
            Failure will trigger Protocol 0-EX
          </div>
        </div>
      </div>

      {/* ── Navigation Nodes ────────────────────────────────── */}
      <nav style={{ padding: "4px 12px", flex: 1 }}>
        {NAV_NODES.map((node) => {
          const isActive = activeNode === node.id;
          return (
            <Link
              key={node.id}
              href={NODE_ROUTES[node.id]}
              style={{ textDecoration: "none", display: "block", marginBottom: "2px" }}
            >
            <motion.div
              whileHover={{ x: 3 }}
              transition={{ duration: 0.15 }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "var(--radius-lg)",
                backgroundColor: isActive ? "rgba(0,240,255,0.08)" : "transparent",
                border: "none",
                borderLeft: isActive ? "2px solid var(--accent-cyan)" : "2px solid transparent",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.2s ease",
                position: "relative",
              }}
            >
              <span
                style={{
                  color: isActive ? "var(--accent-cyan)" : "var(--on-surface-variant)",
                  display: "flex",
                  alignItems: "center",
                  filter: isActive ? "drop-shadow(0 0 6px var(--accent-cyan))" : "none",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                }}
              >
                {node.icon}
              </span>
              <span
                className="font-label"
                style={{
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? "var(--on-surface)" : "var(--on-surface-variant)",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  transition: "color 0.2s ease",
                }}
              >
                {node.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  style={{
                    marginLeft: "auto",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent-cyan)",
                    boxShadow: "0 0 8px var(--accent-cyan)",
                  }}
                />
              )}
            </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Manual Override CTA ──────────────────────────────── */}
      <div style={{ padding: "12px 16px 20px" }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (isOverrideActive || isSimulating || handoverActive) {
              resetOverride();
            } else {
              handleOverrideToggle();
            }
          }}
          className="btn-primary"
          style={{
            width: "100%",
            padding: "11px 16px",
            fontSize: "0.7rem",
            fontFamily: "var(--font-label)",
            letterSpacing: "0.12em",
            fontWeight: 700,
            cursor: "pointer",
            background: (isOverrideActive || handoverActive) ? "rgba(244,63,94,0.15)" : undefined,
            border: (isOverrideActive || handoverActive) ? "1px solid rgba(244,63,94,0.4)" : undefined,
            color: (isOverrideActive || handoverActive) ? "#f43f5e" : undefined,
          }}
        >
          {(isOverrideActive || handoverActive) ? "DISABLE OVERRIDE" : "MANUAL OVERRIDE"}
        </motion.button>
      </div>
    </aside>
  );
}
