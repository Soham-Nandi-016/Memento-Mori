"use client";

import { useSession } from "next-auth/react";
import { useState, useMemo, useEffect } from "react";
import { useSyncContext } from "@/lib/SyncContext";
import { DriveFile } from "@/app/actions/drive";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, onSnapshot } from "firebase/firestore";
import { motion } from "framer-motion";

interface AICategory {
  category: "Academic" | "Project" | "Personal" | "Uncategorized";
  trustee: "Michael Ross" | "Elena Vance" | "Thomas Reed" | "Pending Audit";
}

export default function VaultClient() {
  const { data: session } = useSession();
  const { assets } = useSyncContext();
  
  const [analyzing, setAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [auditResults, setAuditResults] = useState<Record<string, AICategory>>({});
  const [lockedFiles, setLockedFiles] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [trustees, setTrustees] = useState<any[]>([]);

  // 0. Auto-hydrate persistence & fetch Trustees
  useEffect(() => {
    if (!session?.user?.email) return;

    // Fetch Inheritance Rules
    const rulesRef = collection(db, "users", session.user.email, "inheritance_rules");
    const unsubRules = onSnapshot(rulesRef, (snap) => {
      const newLocked: Record<string, boolean> = {};
      const newAudit: Record<string, AICategory> = { ...auditResults };

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.fileId) {
          newLocked[data.fileId] = true;
          newAudit[data.fileId] = {
            category: data.category,
            trustee: data.assignedTrusteeId,
          };
        }
      });
      setLockedFiles(newLocked);
      setAuditResults((prev) => ({ ...prev, ...newAudit }));
    });

    // Fetch Trustees for AI context
    const trusteesRef = collection(db, "users", session.user.email, "trustees");
    const unsubTrustees = onSnapshot(trusteesRef, (snap) => {
      const tList: any[] = [];
      snap.forEach(docSnap => tList.push({ id: docSnap.id, ...docSnap.data() }));
      setTrustees(tList);
    });

    return () => {
      unsubRules();
      unsubTrustees();
    };
  }, [session?.user?.email]);

  // 1. Run AI Audit (Batches of 10)
  const handleRunAudit = async () => {
    if (assets.length === 0) return;
    if (trustees.length === 0) {
      setToastMessage("ERROR: You must define at least 1 Trustee before scanning.");
      setTimeout(() => setToastMessage(null), 5000);
      return;
    }

    setAnalyzing(true);
    setScanProgress(0);
    
    // Process in batches of 10 to respect 5 RPM limits
    const chunkSize = 10;
    const newResults: Record<string, AICategory> = { ...auditResults };

    try {
      for (let i = 0; i < assets.length; i += chunkSize) {
        // Enforce 12-second cooldown between batches
        if (i > 0) {
          console.log(`[VaultClient] Cooldown active. Waiting 12 seconds before batch ${i / chunkSize + 1}...`);
          await new Promise(r => setTimeout(r, 12000));
        }

        const chunk = assets.slice(i, i + chunkSize);
        const res = await fetch("/api/executor/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: chunk, trustees: trustees }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.results && Array.isArray(data.results)) {
            data.results.forEach((item: any) => {
              newResults[item.id] = { category: item.category, trustee: item.trustee };
            });
          }
        }
        
        setScanProgress(Math.min(100, Math.round(((i + chunk.length) / assets.length) * 100)));
      }
      setAuditResults(newResults);
    } catch (err) {
      console.error("AI Audit failed:", err);
    } finally {
      setAnalyzing(false);
      setScanProgress(100);
      setTimeout(() => setScanProgress(0), 1500);
    }
  };

  // 2. Lock to Protocol
  const handleLock = async (file: DriveFile, ai: AICategory) => {
    if (!session?.user?.email) return;

    try {
      const docRef = doc(db, "users", session.user.email, "inheritance_rules", file.id);
      await setDoc(docRef, {
        fileId: file.id,
        fileName: file.name,
        mimeType: file.mimeType,
        category: ai.category,
        assignedTrusteeId: ai.trustee,
        lockedAt: new Date().toISOString(),
      });
      
      setToastMessage(`SUCCESS: [${file.name}] secured for ${ai.trustee}.`);
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error("Lock failed:", err);
    }
  };

  // 3. Helper to style the Trustee Badge
  const getTrusteeBadge = (trustee: string) => {
    if (trustee === "Michael Ross") return { initial: "M", color: "var(--accent-cyan)", bg: "rgba(0,240,255,0.08)" };
    if (trustee === "Elena Vance") return { initial: "E", color: "var(--accent-violet)", bg: "rgba(191,90,242,0.08)" };
    if (trustee === "Thomas Reed") return { initial: "T", color: "var(--accent-cyan)", bg: "rgba(0,240,255,0.08)" };
    return { initial: "?", color: "var(--on-surface-variant)", bg: "var(--surface-container-high)" };
  };

  return (
    <section style={{ padding: "0 28px 32px", position: "relative" }}>
      {/* Toast Notification */}
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={{
            position: "fixed",
            top: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "rgba(34,197,94,0.15)",
            border: "1px solid rgba(34,197,94,0.4)",
            color: "#22c55e",
            padding: "12px 24px",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: 600,
            zIndex: 100,
            backdropFilter: "blur(12px)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          {toastMessage}
        </motion.div>
      )}

      {/* Action Header & Scanning Progress */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p className="font-mono" style={{ fontSize: "0.7rem", color: "var(--on-surface-variant)" }}>
            Awaiting digital verification of Drive assets.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRunAudit}
            disabled={analyzing || trustees.length === 0}
            className="btn-primary"
            style={{ padding: "10px 24px", fontSize: "0.75rem", background: analyzing ? "rgba(0,240,255,0.2)" : undefined, opacity: (analyzing || trustees.length === 0) ? 0.5 : 1 }}
          >
            {analyzing ? `SCANNING ASSETS... ${scanProgress}%` : "RUN AI AUDIT"}
          </motion.button>
        </div>

        {/* Dynamic Scanning Bar */}
        {scanProgress > 0 && scanProgress < 100 && (
          <div style={{ width: "100%", height: "2px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "2px", overflow: "hidden" }}>
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${scanProgress}%` }}
              transition={{ duration: 0.5 }}
              style={{ height: "100%", backgroundColor: "var(--accent-cyan)", boxShadow: "0 0 10px var(--accent-cyan)" }}
            />
          </div>
        )}
      </div>

      {/* CSS Grid of Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {assets.map((file) => {
          const ai = auditResults[file.id] || { category: "Uncategorized", trustee: "Pending Audit" };
          const badge = getTrusteeBadge(ai.trustee);
          const isLocked = lockedFiles[file.id];

          return (
            <div
              key={file.id}
              style={{
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--surface-container-low)",
                padding: "20px",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "var(--shadow-float)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: "radial-gradient(circle at top right, rgba(0,240,255,0.03), transparent 60%)",
                  pointerEvents: "none",
                }}
              />

              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <span className="font-mono" style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)", textTransform: "uppercase" }}>
                    {file.mimeType?.split("/")[1] || "FILE"}
                  </span>
                  
                  <span
                    className="font-label"
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: ai.category !== "Uncategorized" ? "rgba(0,240,255,0.08)" : "var(--surface-container)",
                      border: ai.category !== "Uncategorized" ? "1px solid rgba(0,240,255,0.15)" : "1px solid transparent",
                      color: ai.category !== "Uncategorized" ? "var(--accent-cyan)" : "var(--on-surface-variant)",
                      fontSize: "0.55rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                    }}
                  >
                    {ai.category}
                  </span>
                </div>

                <h3
                  className="truncate"
                  title={file.name}
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "var(--on-surface)",
                    marginBottom: "16px",
                  }}
                >
                  {file.name}
                </h3>

                <div style={{ flex: 1 }} />

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "8px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        backgroundColor: badge.bg,
                        border: `1px solid ${badge.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        color: badge.color,
                        opacity: badge.initial === "?" ? 0.6 : 1,
                      }}
                    >
                      {badge.initial}
                    </div>
                    <div>
                      <div className="font-label" style={{ fontSize: "0.5rem", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Assign To
                      </div>
                      <div className="font-mono truncate" style={{ fontSize: "0.65rem", color: "var(--on-surface)", maxWidth: "100px" }}>
                        {ai.trustee}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={!isLocked && ai.category !== "Uncategorized" ? { scale: 1.02 } : {}}
                    whileTap={!isLocked && ai.category !== "Uncategorized" ? { scale: 0.98 } : {}}
                    onClick={() => handleLock(file, ai)}
                    disabled={isLocked || ai.category === "Uncategorized"}
                    style={{
                      background: isLocked ? "rgba(34,197,94,0.15)" : "var(--surface-container-high)",
                      border: isLocked ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(255,255,255,0.05)",
                      color: isLocked ? "#22c55e" : (ai.category === "Uncategorized" ? "var(--on-surface-variant)" : "var(--on-surface)"),
                      padding: "6px 12px",
                      borderRadius: "6px",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      cursor: (isLocked || ai.category === "Uncategorized") ? "not-allowed" : "pointer",
                      transition: "all 0.2s",
                      opacity: ai.category === "Uncategorized" ? 0.5 : 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    {isLocked ? (
                      <>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        SECURED
                      </>
                    ) : (
                      "LOCK TO PROTOCOL"
                    )}
                  </motion.button>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
