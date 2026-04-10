"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { useGlobalTimer } from "@/lib/GlobalTimerContext";
import { doc, collection, onSnapshot, addDoc, getDoc, Timestamp } from "firebase/firestore";

function formatDiff(diff: number): string {
  if (diff <= 0) return "OVERDUE";
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff % 86_400_000) / 3_600_000);
  const m = Math.floor((diff % 3_600_000)  / 60_000);
  const s = Math.floor((diff % 60_000)     / 1_000);
  return d > 0 ? `${d}d ${h}h ${m}m` : `${h}h ${m}m ${s}s`;
}

interface TrusteeData {
  id: string;
  name: string;
  role: string;
  initial: string;
  color: string;
  active: boolean;
}

export default function VerificationHUD() {
  const { data: session, status } = useSession();
  const { countdown, handoverActive } = useGlobalTimer();
  const [trustees, setTrustees] = useState<TrusteeData[]>([]);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Listen to trustees subcollection
    const trusteesRef = collection(db, "users", session.user.email, "trustees");
    const unsubTrustees = onSnapshot(trusteesRef, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as TrusteeData));
      setTrustees(data);
    });

    return () => {
      unsubTrustees();
    };
  }, [session?.user?.email]);

  const handleAddTrustee = async () => {
    if (!session?.user?.email) return;
    await addDoc(collection(db, "users", session.user.email, "trustees"), {
      name: "NEW_TRUSTEE",
      role: "UNVERIFIED",
      initial: "?",
      color: "var(--accent-cyan)",
      active: false,
    });
  };
  if (status !== "authenticated") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: "280px",
        right: 0,
        zIndex: 50,
        background: "rgba(21,27,45,0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(59,73,75,0.15)",
        padding: "14px 28px",
        display: "flex",
        alignItems: "center",
        gap: "24px",
        justifyContent: "space-between",
      }}
    >
      {/* Left: HUD label + Live indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Shield icon */}
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            backgroundColor: "rgba(0,240,255,0.08)",
            border: "1px solid rgba(0,240,255,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-cyan)",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 1.5L2.25 4.5v4.5c0 3.6 2.9 6.6 6.75 7.5 3.85-.9 6.75-3.9 6.75-7.5V4.5L9 1.5z"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M6 9l2 2 4-4"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <div
            className="font-label"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--on-surface)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Verification HUD
          </div>
          <div className="font-mono" style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)" }}>
            Live status of designated trustees.
          </div>
        </div>

        {/* Pulsing LIVE indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
          <motion.div
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              boxShadow: "0 0 10px rgba(34,197,94,0.6)",
            }}
          />
          <span className="font-mono" style={{ fontSize: "0.6rem", color: "#22c55e", letterSpacing: "0.1em" }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Center: Trustee circles */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {trustees.map((trustee) => (
          <div key={trustee.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Avatar circle */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-container-high)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: trustee.color,
                  boxShadow: `0 0 0 2px ${
                    trustee.active ? trustee.color + "55" : "rgba(59,73,75,0.3)"
                  }`,
                  fontFamily: "var(--font-inter)",
                }}
              >
                {trustee.initial}
              </div>
              {/* Online/offline dot */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "9px",
                  height: "9px",
                  borderRadius: "50%",
                  backgroundColor: trustee.active ? "#22c55e" : "var(--outline)",
                  border: "2px solid var(--surface-container-low)",
                }}
              />
            </div>

            <div>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  color: "var(--on-surface)",
                  fontFamily: "var(--font-inter)",
                  lineHeight: 1.2,
                }}
              >
                {trustee.name}
              </div>
              <div
                className="font-label"
                style={{
                  fontSize: "0.55rem",
                  color: trustee.active ? trustee.color : "var(--on-surface-variant)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {trustee.role}
              </div>
            </div>
          </div>
        ))}

        {/* Add Trustee */}
        <button
          onClick={handleAddTrustee}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 14px",
            borderRadius: "999px",
            backgroundColor: "var(--surface-container-high)",
            border: "1px solid rgba(0,240,255,0.15)",
            cursor: "pointer",
            color: "var(--on-surface-variant)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,240,255,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-cyan)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,240,255,0.15)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--on-surface-variant)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M7 4v6M4 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span className="font-label" style={{ fontSize: "0.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Add Trustee
          </span>
        </button>
      </div>

      {/* Right: Network stability + clock */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            padding: "5px 10px",
            borderRadius: "999px",
            backgroundColor: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#22c55e" }}
          />
          <span className="font-mono" style={{ fontSize: "0.6rem", color: "#22c55e", letterSpacing: "0.06em" }}>
            NETWORK STABILITY: 99.9%
          </span>
        </div>
        <div className="font-mono" style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)" }}>
          {countdown}
        </div>
      </div>
    </div>
  );
}
