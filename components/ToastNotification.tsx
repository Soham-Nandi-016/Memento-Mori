"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastPayload {
  message: string;
  type: "success" | "error";
}

export default function ToastNotification() {
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ToastPayload>).detail;
      setToast(detail);
      setVisible(true);
    };

    window.addEventListener("show-toast", handler);
    return () => window.removeEventListener("show-toast", handler);
  }, []);

  // Auto-dismiss after 4 seconds
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [visible, toast]);

  const isSuccess = toast?.type === "success";

  const accentColor = isSuccess ? "var(--accent-cyan, #00f0ff)" : "#f43f5e";
  const bgGlow = isSuccess
    ? "rgba(0,240,255,0.06)"
    : "rgba(244,63,94,0.06)";
  const borderColor = isSuccess
    ? "rgba(0,240,255,0.25)"
    : "rgba(244,63,94,0.25)";
  const shadowColor = isSuccess
    ? "0 0 28px rgba(0,240,255,0.15), 0 8px 32px rgba(0,0,0,0.5)"
    : "0 0 28px rgba(244,63,94,0.15), 0 8px 32px rgba(0,0,0,0.5)";

  return (
    <AnimatePresence>
      {visible && toast && (
        <motion.div
          key={`${toast.message}-${Date.now()}`}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.97 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "14px",
            padding: "16px 20px",
            backgroundColor: "var(--surface-container-low, #12121a)",
            background: `linear-gradient(135deg, ${bgGlow} 0%, rgba(18,18,26,0.98) 100%)`,
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--radius-xl, 16px)",
            boxShadow: shadowColor,
            minWidth: "280px",
            maxWidth: "380px",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Accent top bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "20%",
              right: "20%",
              height: "1px",
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
              borderRadius: "999px",
            }}
          />

          {/* Icon */}
          <div
            style={{
              flexShrink: 0,
              width: "34px",
              height: "34px",
              borderRadius: "10px",
              backgroundColor: isSuccess
                ? "rgba(0,240,255,0.1)"
                : "rgba(244,63,94,0.1)",
              border: `1px solid ${borderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
            }}
          >
            {isSuccess ? <CheckCircle size={16} /> : <XCircle size={16} />}
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontFamily: "'Space Grotesk', var(--font-inter), sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: accentColor,
                marginBottom: "2px",
              }}
            >
              {isSuccess ? "TRANSMISSION CONFIRMED" : "TRANSMISSION ERROR"}
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "13px",
                color: "var(--on-surface, #e2e2ef)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {toast.message}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setVisible(false)}
            style={{
              flexShrink: 0,
              background: "transparent",
              border: "none",
              color: "var(--on-surface-variant, #8a8aab)",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              transition: "color 0.2s",
            }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 4, ease: "linear" }}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              height: "2px",
              width: "100%",
              background: `linear-gradient(90deg, ${accentColor}, transparent)`,
              borderRadius: "0 0 var(--radius-xl, 16px) var(--radius-xl, 16px)",
              transformOrigin: "left",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
