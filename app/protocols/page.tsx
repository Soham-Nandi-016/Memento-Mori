"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ExecutorSidebar from "@/components/ExecutorSidebar";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc } from "firebase/firestore";
import { useGlobalTimer } from "@/lib/GlobalTimerContext";

export default function ProtocolsPage() {
  const { data: session } = useSession();
  const [securedAssets, setSecuredAssets] = useState<any[]>([]);
  const { countdown, isSimulating, handoverActive, startSimulation } = useGlobalTimer();

  // Fetch secured assets
  useEffect(() => {
    if (!session?.user?.email) return;

    // 2. Fetch secured assets from inheritance_rules

    // 2. Fetch secured assets from inheritance_rules
    const rulesRef = collection(db, "users", session.user.email, "inheritance_rules");
    const unsubRules = onSnapshot(rulesRef, (snap) => {
      const assets: any[] = [];
      snap.forEach((docSnap) => {
        assets.push({ id: docSnap.id, ...docSnap.data() });
      });
      // Sort newest locked first
      assets.sort((a, b) => new Date(b.lockedAt).getTime() - new Date(a.lockedAt).getTime());
      setSecuredAssets(assets);
    });

    return () => unsubRules();
  }, [session?.user?.email, isSimulating, handoverActive]);

  return (
    <div className="scanline" style={{ height: "100vh", overflow: "hidden", backgroundColor: "var(--background)", display: "flex" }}>
      <ExecutorSidebar />

      <main style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", position: "relative", zIndex: 10, overflowY: "auto", overflowX: "hidden" }}>
        {/* Ambient mesh background */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(ellipse 70% 45% at 55% 8%, ${handoverActive ? 'rgba(244,63,94,0.08)' : 'rgba(191,90,242,0.03)'} 0%, transparent 65%)` }} />

        {/* Header */}
        <div style={{ padding: "40px 28px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', var(--font-inter), sans-serif", fontSize: "2rem", fontWeight: 700, color: handoverActive ? "#f43f5e" : "var(--on-surface)", letterSpacing: "-0.02em", marginBottom: "8px", transition: "color 0.5s ease" }}>
              {handoverActive ? "HANDOVER PROTOCOL INITIATED" : <>Governance <span style={{ color: "var(--accent-violet)", filter: "drop-shadow(0 0 8px rgba(191,90,242,0.4))" }}>Protocols</span></>}
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: handoverActive ? "rgba(244,63,94,0.8)" : "var(--on-surface-variant)" }}>
              {handoverActive ? "CRITICAL: Authorized access keys have been distributed to your Trustee network." : "Execution rules and real-time status of your protected digital legacy."}
            </p>
          </div>
          
          <button 
             onClick={startSimulation}
             disabled={isSimulating || handoverActive}
             className="font-mono flex items-center gap-2" 
             style={{ cursor: "pointer", opacity: (isSimulating || handoverActive) ? 0.5 : 1, padding: "8px 16px", borderRadius: "8px", backgroundColor: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#f43f5e", fontSize: "0.7rem", letterSpacing: "0.05em", transition: "all 0.2s" }}
          >
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
             SIMULATE INACTIVITY
          </button>
        </div>

        {/* 14-Day Dead Man's Switch Countdown */}
        <section style={{ padding: "0 28px 24px", position: "relative", zIndex: 2 }}>
          <div style={{
            borderRadius: "var(--radius-xl)", backgroundColor: handoverActive ? "rgba(244,63,94,0.05)" : "var(--surface-container-low)", padding: "32px",
            border: handoverActive ? "1px solid rgba(244,63,94,0.3)" : "1px solid rgba(255,255,255,0.05)", boxShadow: handoverActive ? "0 0 30px rgba(244,63,94,0.15)" : "var(--shadow-float)", textAlign: "center",
            display: "flex", flexDirection: "column", alignItems: "center", transition: "all 0.5s ease"
          }}>
            <div className="font-label" style={{ fontSize: "0.8rem", color: handoverActive ? "#f43f5e" : "var(--on-surface-variant)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "12px", animation: handoverActive ? "node-breathe 2s infinite" : "none" }}>
              {handoverActive ? "DEAD MAN'S SWITCH : BREACHED" : "DEAD MAN'S SWITCH : ACTIVE"}
            </div>
            <div className="font-mono" style={{ fontSize: "2.5rem", fontWeight: 700, color: handoverActive ? "#f43f5e" : "var(--accent-cyan)", letterSpacing: "0.05em", filter: handoverActive ? "drop-shadow(0 0 12px rgba(244,63,94,0.5))" : "drop-shadow(0 0 12px rgba(0,240,255,0.3))", transition: "color 0.5s ease" }}>
              {countdown}
            </div>
            <p style={{ fontSize: "0.75rem", color: "var(--on-surface-variant)", marginTop: "12px", maxWidth: "400px", lineHeight: 1.6 }}>
              {handoverActive ? "The digital executor engine has bypassed vault encryptions. All secured assets below are currently being decentralized and emailed to their respective Trustees." : "Time remaining until Protocol 0-EX is initiated. Check-in via the Dashboard to reset the cryptographic timer."}
            </p>
          </div>
        </section>

        {/* Protected Assets List */}
        <section style={{ padding: "0 28px 32px", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.1rem", fontWeight: 600, color: "var(--on-surface)" }}>
              Secured Assets ({securedAssets.length})
            </h3>
          </div>

          {securedAssets.length === 0 ? (
            <div style={{ borderRadius: "var(--radius-xl)", backgroundColor: "var(--surface-container-low)", padding: "40px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "1.5rem", color: "var(--on-surface-variant)", marginBottom: "12px" }}>◈</div>
              <p className="font-mono" style={{ fontSize: "0.8rem", color: "var(--on-surface-variant)" }}>NO ASSETS SECURED YET.</p>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Visit the Vault to run an AI Audit and lock your assets to the protocol.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {securedAssets.map((asset) => (
                <div key={asset.id} style={{
                  borderRadius: "var(--radius-lg)", backgroundColor: "var(--surface-container-low)", padding: "16px 20px",
                  border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(34,197,94,0.1)",
                      display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e"
                    }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <div>
                      <h4 className="truncate" style={{ fontFamily: "var(--font-inter)", fontSize: "0.9rem", fontWeight: 600, color: "var(--on-surface)", maxWidth: "300px" }}>
                        {asset.fileName}
                      </h4>
                      <div className="font-mono flex items-center gap-2" style={{ fontSize: "0.6rem", color: "var(--on-surface-variant)", marginTop: "4px", textTransform: "uppercase" }}>
                        {asset.category} • LOCKED ON {new Date(asset.lockedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ textAlign: "right" }}>
                      <div className="font-label" style={{ fontSize: "0.55rem", color: "var(--on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                        Designated Trustee
                      </div>
                      <div style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", fontWeight: 600, color: "var(--on-surface)" }}>
                        {asset.assignedTrusteeId}
                      </div>
                    </div>
                    <div style={{ padding: "4px 10px", borderRadius: "999px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em" }}>
                      SECURED
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
