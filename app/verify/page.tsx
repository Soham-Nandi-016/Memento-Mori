"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";

type VerifyState = "loading" | "success" | "error" | "invalid";

function VerifyContent() {
  const searchParams = useSearchParams();
  const trusteeId = searchParams.get("id");
  const userEmail = searchParams.get("user");
  const [state, setState] = useState<VerifyState>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!trusteeId || !userEmail) {
      setState("invalid");
      return;
    }

    const verify = async () => {
      try {
        const trusteeRef = doc(
          db,
          "users",
          decodeURIComponent(userEmail),
          "trustees",
          trusteeId
        );
        await updateDoc(trusteeRef, { status: "Verified" });
        setState("success");
      } catch (err: any) {
        setErrorMsg(err.message || "Verification failed. Token may be invalid.");
        setState("error");
      }
    };

    verify();
  }, [trusteeId, userEmail]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(ellipse 60% 40% at 50% 10%, rgba(0,240,255,0.06) 0%, transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#12121a",
          borderRadius: "16px",
          border: "1px solid rgba(0,240,255,0.12)",
          overflow: "hidden",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Top glow bar */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.5) 50%, transparent 100%)",
          }}
        />

        <div style={{ padding: "48px 40px 40px" }}>
          {/* Brand */}
          <div
            style={{
              marginBottom: "32px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.25em",
                color: "var(--accent-cyan, #00f0ff)",
                textTransform: "uppercase",
              }}
            >
              Memento Mori
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.25)",
                textTransform: "uppercase",
              }}
            >
              Consensus Verification Protocol
            </span>
          </div>

          {/* Icon */}
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "rgba(0,240,255,0.08)",
              border: "1px solid rgba(0,240,255,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              marginBottom: "28px",
            }}
          >
            {state === "loading" ? "⟳" : state === "success" ? "🔐" : "⚠"}
          </div>

          {/* Loading state */}
          {state === "loading" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Verifying Identity{" "}
                <span style={{ color: "var(--accent-cyan, #00f0ff)" }}>
                  Token...
                </span>
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(226,226,239,0.5)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Authenticating with the consensus network. Please wait.
              </p>
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  height: "2px",
                  borderRadius: "999px",
                  background:
                    "linear-gradient(90deg, transparent, var(--accent-cyan, #00f0ff), transparent)",
                  marginTop: "8px",
                }}
              />
            </motion.div>
          )}

          {/* Success state */}
          {state === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Verification Pulse{" "}
                <span style={{ color: "var(--accent-cyan, #00f0ff)" }}>
                  Received.
                </span>
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(226,226,239,0.65)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                Your stewardship has been activated. You are now recognized as
                a{" "}
                <strong style={{ color: "#e2e2ef" }}>
                  Verified Trusted Steward
                </strong>{" "}
                within the Memento Mori consensus network.
              </p>

              {/* Confirmation badge */}
              <div
                style={{
                  marginTop: "8px",
                  padding: "16px 20px",
                  backgroundColor: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.2)",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    boxShadow: "0 0 10px rgba(34,197,94,0.6)",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.6rem",
                      color: "#22c55e",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      marginBottom: "2px",
                    }}
                  >
                    Consensus Network Updated
                  </div>
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                      color: "rgba(226,226,239,0.5)",
                    }}
                  >
                    ID: <span style={{ color: "rgba(226,226,239,0.8)" }}>{trusteeId}</span>
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(226,226,239,0.25)",
                  lineHeight: 1.6,
                  margin: 0,
                  marginTop: "8px",
                }}
              >
                You may close this window. Your legacy stewardship role has been
                permanently registered.
              </p>
            </motion.div>
          )}

          {/* Error / Invalid state */}
          {(state === "error" || state === "invalid") && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  margin: 0,
                }}
              >
                Verification{" "}
                <span style={{ color: "#f43f5e" }}>Failed.</span>
              </h1>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(226,226,239,0.55)",
                  lineHeight: 1.75,
                  margin: 0,
                }}
              >
                {state === "invalid"
                  ? "This verification link is malformed or missing required parameters."
                  : errorMsg}
              </p>
              <div
                style={{
                  padding: "14px 18px",
                  backgroundColor: "rgba(244,63,94,0.06)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: "10px",
                  fontFamily: "monospace",
                  fontSize: "0.65rem",
                  color: "#f43f5e",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                TOKEN VALIDATION FAILED — CONTACT PROTOCOL ADMINISTRATOR
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom glow bar */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.2) 50%, transparent 100%)",
          }}
        />
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#0a0a0f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(226,226,239,0.3)",
            fontFamily: "monospace",
            fontSize: "0.7rem",
            letterSpacing: "0.1em",
          }}
        >
          INITIALIZING...
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
