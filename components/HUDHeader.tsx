"use client";

import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HUDHeader() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
      style={{
        /* Glassmorphism: surface-container @ 75% + backdrop-blur-xl */
        background: "rgba(25, 31, 49, 0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        /* Ghost border: outline-variant @ 15% — felt, not seen */
        boxShadow: `0 1px 0 rgba(59, 73, 75, 0.15), var(--shadow-float)`,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          className="text-xl"
          style={{
            color: "var(--accent-cyan)",
            filter: "drop-shadow(0 0 6px var(--accent-cyan))",
          }}
        >
          ◈
        </motion.div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 700,
              fontSize: "0.875rem",
              letterSpacing: "-0.02em",
            }}
          >
            <span className="text-primary-glow">MEMENTO</span>
            <span style={{ color: "var(--on-surface)" }}> MORI</span>
          </div>
          <div
            className="text-xs font-mono"
            style={{ color: "var(--on-surface-variant)" }}
          >
            LEGACY AGENT v1.0
          </div>
        </div>
      </div>

      {/* Center — status indicators (no dividers, tonal spacing) */}
      <div className="hidden md:flex items-center gap-7">
        {[
          { label: "HEARTBEAT", status: "ACTIVE",  accentVar: "--accent-cyan" },
          { label: "SWITCH",    status: "ARMED",   accentVar: "--accent-violet" },
          { label: "VAULT",     status: "SEALED",  accentVar: "--accent-cyan" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: `var(${s.accentVar})` }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            />
            <span
              className="text-xs font-label"
              style={{ color: "var(--on-surface-variant)" }}
            >
              {s.label}:
            </span>
            <span
              className="text-xs font-mono font-semibold"
              style={{ color: `var(${s.accentVar})` }}
            >
              {s.status}
            </span>
          </div>
        ))}
      </div>

      {/* User HUD */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2.5 px-3 py-2 transition-all"
          style={{
            backgroundColor: "var(--surface-container-high)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "inset 0 0 0 1px rgba(0,240,255,0.15)",
          }}
        >
          {session?.user?.image ? (
            <div
              className="relative w-7 h-7 rounded-full overflow-hidden"
              style={{ boxShadow: `0 0 0 1.5px var(--accent-cyan), 0 0 10px rgba(0,240,255,0.25)` }}
            >
              <Image
                src={session.user.image}
                alt={session.user.name || "Agent"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                backgroundColor: "var(--surface-container-highest)",
                color: "var(--accent-cyan)",
              }}
            >
              {session?.user?.name?.[0] ?? "?"}
            </div>
          )}
          <div className="text-left hidden sm:block">
            <div
              className="text-xs font-semibold"
              style={{ color: "var(--on-surface)" }}
            >
              {session?.user?.name ?? "Agent"}
            </div>
            <div
              className="text-xs font-mono"
              style={{ color: "var(--on-surface-variant)" }}
            >
              AUTHORIZED
            </div>
          </div>
          <span style={{ color: "var(--outline)" }}>▾</span>
        </button>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute right-0 mt-2 w-52 z-50 overflow-hidden"
            style={{
              background: "rgba(35, 41, 60, 0.92)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "var(--radius-lg)",
              boxShadow: `var(--shadow-float), inset 0 0 0 1px var(--glass-border)`,
            }}
          >
            <div
              className="px-4 py-3"
              style={{ borderBottom: "1px solid rgba(59,73,75,0.2)" }}
            >
              <div
                className="text-xs font-mono truncate"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {session?.user?.email}
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full px-4 py-3 text-left text-xs font-mono transition-colors hover:bg-white/5"
              style={{ color: "var(--error)" }}
            >
              TERMINATE SESSION
            </button>
          </motion.div>
        )}
      </div>
    </header>
  );
}
