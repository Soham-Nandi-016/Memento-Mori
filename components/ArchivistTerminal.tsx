"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSyncContext } from "@/lib/SyncContext";

// ── Colour map ─────────────────────────────────────────────────────────────
function lineColor(type: string | undefined): string {
  switch (type) {
    case "sync":       return "var(--on-secondary-container)";
    case "error":      return "var(--error)";
    case "info":       return "var(--primary-fixed)";
    case "processing": return "var(--accent-violet)";
    default:           return "var(--on-surface-variant)";
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function ArchivistTerminal() {
  const {
    lines,
    isScanning,
    isProcessing,
    scanComplete,
    nextPageToken,
    totalLoaded,
    batchCount,
    hasBoot,
    runScan,
    triggerBoot,
  } = useSyncContext();

  // ── Smart scroll refs ──────────────────────────────────────────────────
  const scrollRef     = useRef<HTMLDivElement>(null);   // scrollable container

  // Only auto-scroll if the user is already near the bottom (50px threshold)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
    if (isAtBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [lines]);

  // (Old auto-scroll effect removed in favour of threshold logic above)

  // ── Trigger boot once on first mount ──────────────────────────────────
  useEffect(() => {
    if (!hasBoot) triggerBoot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div
      className="overflow-hidden flex flex-col flex-shrink-0 !h-[400px]"
      style={{
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--surface-container-lowest)",
        backgroundImage:
          "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(0,240,255,0.05) 0%, transparent 60%)",
        boxShadow: "var(--shadow-float)",
      }}
    >
      {/* ── Terminal chrome ────────────────────────────────────── */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 flex-shrink-0"
        style={{ backgroundColor: "var(--surface-container-high)" }}
      >
        {/* Traffic-light dots */}
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--error)",                  opacity: 0.7 }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--primary-fixed)",          opacity: 0.7 }} />
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--on-secondary-container)", opacity: 0.7 }} />
        </div>
        <span className="text-xs font-label ml-2 tracking-widest uppercase" style={{ color: "var(--on-surface-variant)" }}>
          Archivist Terminal — Drive Sync
        </span>

        {/* Right-side indicators */}
        <div className="ml-auto flex items-center gap-2">
          {totalLoaded > 0 && (
            <span className="text-xs font-mono" style={{ color: "var(--on-surface-variant)" }}>
              {totalLoaded} indexed
            </span>
          )}

          {isScanning && (
            <motion.div
              className="flex items-center gap-1.5"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent-cyan)" }} />
              <span className="text-xs font-mono" style={{ color: "var(--accent-cyan)" }}>
                {isProcessing ? "PROCESSING" : "SCANNING"}
              </span>
            </motion.div>
          )}

          {scanComplete && !isScanning && (
            <span className="text-xs font-mono" style={{ color: "var(--primary-fixed)" }}>● SYNCED</span>
          )}

          {nextPageToken && !isScanning && !scanComplete && (
            <span className="text-xs font-mono" style={{ color: "var(--accent-violet)" }}>◎ MORE</span>
          )}

          {/* Smart-scroll re-lock button */}
          <button
            onClick={() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
              }
            }}
            title="Jump to latest"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--accent-cyan)",
              fontSize: "0.65rem",
              fontFamily: "var(--font-mono)",
              opacity: 0.6,
              padding: "0 2px",
            }}
          >
            ↓ LIVE
          </button>
        </div>
      </div>

      {/* ── Terminal body — fixed height, own scrollport ────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto overscroll-contain max-h-[400px] p-4 space-y-0.5 font-mono text-xs"
        style={{ backgroundColor: "var(--surface-container-lowest)" }}
      >
        <AnimatePresence>
          {lines.map((line) => {
            if (!line) return null;
            const isProc = line?.ephemeral;
            return (
              <motion.div
                key={line.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                style={{
                  color: lineColor(line?.type ?? "default"),
                  ...(isProc && { textShadow: "0 0 12px rgba(191,90,242,0.5)" }),
                }}
              >
                {isProc ? (
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="mr-2"
                    style={{ color: "var(--accent-violet)" }}
                  >
                    ◎
                  </motion.span>
                ) : (
                  <span className="mr-2" style={{ color: "var(--outline-variant)", opacity: 0.7 }}>
                    {new Date().toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                )}
                {line?.content || ""}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Block cursor while scanning */}
        {isScanning && !isProcessing && (
          <div className="flex items-center gap-1" style={{ color: "#94a3b8" }}>
            <span className="cursor-blink">█</span>
          </div>
        )}

        {/* Scroll sentinels removed - logic handled directly by scrollport maths */}
      </div>

      {/* ── Load Next Batch footer ──────────────────────────────── */}
      <AnimatePresence>
        {nextPageToken && !isScanning && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex-shrink-0"
            style={{
              padding: "8px 16px",
              backgroundColor: "var(--surface-container-high)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span className="font-mono text-xs" style={{ color: "var(--on-surface-variant)" }}>
              Batch {batchCount} complete · more assets available
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                // Re-lock scroll to bottom when fetching a new batch
                if (scrollRef.current) {
                  scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
                }
                runScan(nextPageToken, batchCount);
              }}
              style={{
                padding: "4px 14px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 100%)",
                color: "var(--on-primary)",
                border: "none",
                fontFamily: "var(--font-label)",
                fontSize: "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Load Next Batch →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
