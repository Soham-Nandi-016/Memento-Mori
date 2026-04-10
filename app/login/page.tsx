"use client";

import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden scanline"
      style={{ backgroundColor: "var(--background)" }}
    >
      {/* Ambient orbs — exact Stitch color tokens */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,240,255,0.07) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(191,90,242,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* Main card — glass + xl2 border-radius (24px) + shadow-float */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4 text-center"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(var(--glass-blur))",
          WebkitBackdropFilter: "blur(var(--glass-blur))",
          borderRadius: "var(--radius-xl)",  /* 24px as per Stitch xl */
          boxShadow: `var(--shadow-float), inset 0 0 0 1px var(--glass-border)`,
          padding: "2.5rem",
        }}
      >
        {/* Rotating logo glyph */}
        <motion.div
          className="mx-auto w-14 h-14 mb-6 relative"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ boxShadow: "inset 0 0 0 1px rgba(0,240,255,0.3)" }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{ boxShadow: "inset 0 0 0 1px rgba(191,90,242,0.2)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-2xl"
              style={{
                color: "var(--accent-cyan)",
                filter: "drop-shadow(0 0 8px var(--accent-cyan))",
              }}
            >
              ◈
            </span>
          </div>
        </motion.div>

        {/* Title — display font, tight kerning */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "2rem",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "0.5rem",
          }}
        >
          <span className="text-primary-glow">MEMENTO</span>
          <span style={{ color: "var(--on-surface)" }}> MORI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="text-xs font-label tracking-[0.2em] uppercase mb-1"
          style={{ color: "var(--on-surface-variant)" }}
        >
          Autonomous Digital Legacy Agent
        </motion.p>

        {/* Divider — tonal, not a border */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-3 my-5"
        >
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(to right, transparent, var(--outline-variant))` }}
          />
          <span
            className="text-xs font-mono"
            style={{ color: "var(--outline)" }}
          >
            v1.0.0 // CLASSIFIED
          </span>
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(to left, transparent, var(--outline-variant))` }}
          />
        </motion.div>

        {/* System Status — sunken surface-container-lowest */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="text-left mb-6"
          style={{
            backgroundColor: "var(--surface-container-lowest)",
            borderRadius: "var(--radius-lg)",
            padding: "1rem",
            /* 5% primary tint per Execution Logs spec */
            backgroundImage: "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,240,255,0.05) 0%, transparent 60%)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "var(--accent-cyan)" }}
            />
            <span
              className="text-xs font-label tracking-widest uppercase"
              style={{ color: "var(--accent-cyan)" }}
            >
              System Status
            </span>
          </div>
          {[
            { label: "Dead Man's Switch", status: "ARMED",   color: "var(--accent-cyan)" },
            { label: "Legacy Protocols",  status: "STANDBY", color: "var(--accent-violet)" },
            { label: "Vault Encryption",  status: "ACTIVE",  color: "var(--accent-cyan)" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between items-center py-1"
            >
              <span
                className="text-xs font-mono"
                style={{ color: "var(--on-surface-variant)" }}
              >
                {item.label}
              </span>
              <span
                className="text-xs font-mono font-semibold"
                style={{ color: item.color }}
              >
                [{item.status}]
              </span>
            </div>
          ))}
        </motion.div>

        {/* CTA — bioluminescent gradient button (135°, rounded-full) */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          onClick={handleSignIn}
          disabled={loading}
          className="btn-primary w-full py-3.5 text-sm tracking-[0.06em] font-label font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={!loading ? { scale: 1.02 } : {}}
          whileTap={!loading ? { scale: 0.98 } : {}}
        >
          <span className="flex items-center justify-center gap-3">
            {loading ? (
              <>
                <motion.span
                  className="inline-block w-4 h-4 border-2 rounded-full border-t-transparent"
                  style={{ borderColor: "var(--on-primary)", borderTopColor: "transparent" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                ESTABLISHING LINK...
              </>
            ) : (
              <>
                <span style={{ filter: "drop-shadow(0 0 6px var(--on-primary))" }}>⬡</span>
                Initiate Secure Link
              </>
            )}
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-5 text-xs font-mono leading-relaxed"
          style={{ color: "var(--outline)" }}
        >
          Secured via Google OAuth 2.0 · Drive read access required
        </motion.p>
      </motion.div>

      {/* Corner bracket decorations */}
      {[
        { pos: "top-4 left-4",  bt: "top", bl: "left"  },
        { pos: "top-4 right-4", bt: "top", bl: "right" },
        { pos: "bottom-4 left-4",  bt: "bottom", bl: "left"  },
        { pos: "bottom-4 right-4", bt: "bottom", bl: "right" },
      ].map((c, i) => (
        <div
          key={i}
          className={`absolute ${c.pos} w-5 h-5 pointer-events-none`}
          style={{ opacity: 0.25 }}
        >
          <div
            className="absolute"
            style={{
              [c.bt]: 0, [c.bl]: 0,
              width: "100%", height: "1px",
              backgroundColor: "var(--accent-cyan)",
            }}
          />
          <div
            className="absolute"
            style={{
              [c.bt]: 0, [c.bl]: 0,
              width: "1px", height: "100%",
              backgroundColor: "var(--accent-cyan)",
            }}
          />
        </div>
      ))}
    </div>
  );
}
