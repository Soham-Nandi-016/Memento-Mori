"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import ExecutorSidebar from "@/components/ExecutorSidebar";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, addDoc, doc, deleteDoc } from "firebase/firestore";
import { UserMinus } from "lucide-react";
import { motion } from "framer-motion";

export default function TrusteesPage() {
  const { data: session } = useSession();
  const [trustees, setTrustees] = useState<any[]>([]);
  const [securedAssets, setSecuredAssets] = useState<any[]>([]);
  
  // Form State
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "", relationship: "" });
  const [isAdding, setIsAdding] = useState(false);

  // Fetch real-time Trustees and Assets
  useEffect(() => {
    if (!session?.user?.email) return;

    const trusteesRef = collection(db, "users", session.user.email, "trustees");
    const unsubTrustees = onSnapshot(trusteesRef, (snap) => {
      const tList: any[] = [];
      snap.forEach(docSnap => tList.push({ id: docSnap.id, ...docSnap.data() }));
      setTrustees(tList);
    });

    const rulesRef = collection(db, "users", session.user.email, "inheritance_rules");
    const unsubRules = onSnapshot(rulesRef, (snap) => {
      const aList: any[] = [];
      snap.forEach(docSnap => aList.push({ id: docSnap.id, ...docSnap.data() }));
      setSecuredAssets(aList);
    });

    return () => {
      unsubTrustees();
      unsubRules();
    };
  }, [session?.user?.email]);

  const handleAddTrustee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email || !form.name) return;
    setIsAdding(true);
    
    try {
      const rulesRef = collection(db, "users", session.user.email, "trustees");
      await addDoc(rulesRef, {
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone,
        relationship: form.relationship,
        status: "Verified", // Simulated auto-verification for demo purposes
        createdAt: new Date().toISOString()
      });
      setForm({ name: "", role: "", email: "", phone: "", relationship: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeauthorize = async (id: string) => {
    if (!session?.user?.email) return;
    try {
      await deleteDoc(doc(db, "users", session.user.email, "trustees", id));
    } catch (err) {
      console.error(err);
    }
  };

  const getAssetCount = (trusteeName: string) => {
    return securedAssets.filter(a => a.assignedTrusteeId === trusteeName).length;
  };

  return (
    <div className="scanline" style={{ height: "100vh", overflow: "hidden", backgroundColor: "var(--background)", display: "flex" }}>
      <ExecutorSidebar />

      <main style={{ marginLeft: "280px", flex: 1, display: "flex", flexDirection: "column", height: "calc(100vh - 80px)", position: "relative", zIndex: 10, overflowY: "auto", overflowX: "hidden", paddingBottom: "150px" }}>
        
        {/* Ambient mesh background */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: `radial-gradient(ellipse 70% 45% at 55% 8%, rgba(0,240,255,0.03) 0%, transparent 65%)` }} />

        {/* Header */}
        <div style={{ padding: "40px 28px 24px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
          <div>
            <h1 style={{ fontFamily: "'Space Grotesk', var(--font-inter), sans-serif", fontSize: "2rem", fontWeight: 700, color: "var(--on-surface)", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Trustee <span className="text-primary-glow" style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.4))" }}>Identity Matrix</span>
            </h1>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "var(--on-surface-variant)" }}>
              Add and manage the verified stewards authorized to inherit your digital protocol architectures.
            </p>
          </div>
          <div className="font-mono flex items-center gap-2" style={{ padding: "6px 16px", borderRadius: "999px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "0.7rem", letterSpacing: "0.05em" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#22c55e", animation: "node-breathe 2s ease-in-out infinite" }} />
            NETWORK LIVE
          </div>
        </div>

        {/* Trustee Form */}
        <section style={{ padding: "0 28px 24px", position: "relative", zIndex: 2 }}>
           <form onSubmit={handleAddTrustee} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: "12px", alignItems: "end", backgroundColor: "var(--surface-container-low)", padding: "24px", borderRadius: "var(--radius-xl)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div>
                <label className="font-label" style={{ display: "block", fontSize: "0.6rem", color: "var(--on-surface-variant)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full" style={{ backgroundColor: "var(--surface-container-high)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", padding: "10px 12px", color: "var(--on-surface)", fontSize: "0.8rem", outline: "none" }} placeholder="e.g. Michael Ross" />
              </div>
              <div>
                <label className="font-label" style={{ display: "block", fontSize: "0.6rem", color: "var(--on-surface-variant)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Designated Role</label>
                <input type="text" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required className="w-full" style={{ backgroundColor: "var(--surface-container-high)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", padding: "10px 12px", color: "var(--on-surface)", fontSize: "0.8rem", outline: "none" }} placeholder="e.g. Legal Trustee" />
              </div>
              <div>
                <label className="font-label" style={{ display: "block", fontSize: "0.6rem", color: "var(--on-surface-variant)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className="w-full" style={{ backgroundColor: "var(--surface-container-high)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", padding: "10px 12px", color: "var(--on-surface)", fontSize: "0.8rem", outline: "none" }} placeholder="e.g. ross@pearsonspecter.com" />
              </div>
              <div>
                 <label className="font-label" style={{ display: "block", fontSize: "0.6rem", color: "var(--on-surface-variant)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>Validation Contact</label>
                 <input type="text" value={form.relationship} onChange={e => setForm({...form, relationship: e.target.value})} required className="w-full" style={{ backgroundColor: "var(--surface-container-high)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "var(--radius-md)", padding: "10px 12px", color: "var(--on-surface)", fontSize: "0.8rem", outline: "none" }} placeholder="e.g. Colleague / Friend" />
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!form.name || isAdding} className="btn-primary" style={{ padding: "11px 24px", fontSize: "0.75rem", alignSelf: "end" }}>
                {isAdding ? "INITIALIZING..." : "ADD TRUSTEE"}
              </motion.button>
           </form>
        </section>

        {/* Trustee Grid */}
        <section style={{ padding: "0 28px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px", position: "relative", zIndex: 2 }}>
          {trustees.map((t) => (
            <div
              key={t.id}
              style={{
                borderRadius: "var(--radius-xl)",
                backgroundColor: "var(--surface-container-low)",
                padding: "24px",
                border: "1px solid rgba(255,255,255,0.05)",
                boxShadow: "var(--shadow-float)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <div style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(circle at top right, rgba(0,240,255,0.05), transparent 60%)`, pointerEvents: "none" }} />
              
              <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "var(--surface-container-high)", border: `1px solid rgba(0,240,255,0.3)`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent-cyan)"
                  }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1.05rem", fontWeight: 600, color: "var(--on-surface)", marginBottom: "4px" }}>
                      {t.name}
                    </h3>
                    <div className="font-label" style={{ fontSize: "0.6rem", color: "var(--accent-cyan)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {t.role}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <div style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: "0.6rem", fontWeight: 600 }}>
                    VERIFIED
                  </div>
                  <motion.button
                    onClick={() => handleDeauthorize(t.id)}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(244,63,94,0.1)", color: "#f43f5e", borderColor: "rgba(244,63,94,0.4)", boxShadow: "0 0 10px rgba(244,63,94,0.3)" }}
                    style={{
                      display: "flex", alignItems: "center", gap: "4px", background: "transparent", border: "1px solid transparent", color: "var(--on-surface-variant)", fontSize: "0.55rem", padding: "4px 8px", borderRadius: "4px", cursor: "pointer", transition: "all 0.2s"
                    }}
                  >
                    <UserMinus size={12} /> DEAUTHORIZE
                  </motion.button>
                </div>
              </div>

              <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "8px", flex: 1, padding: "16px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                 <div style={{ display: "flex", justifyContent: "space-between" }}>
                   <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", textTransform: "uppercase" }}>Contact Vector</span>
                   <span style={{ fontSize: "0.7rem", color: "var(--on-surface)" }}>{t.email}</span>
                 </div>
                 <div style={{ display: "flex", justifyContent: "space-between" }}>
                   <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--on-surface-variant)", textTransform: "uppercase" }}>Relationship</span>
                   <span style={{ fontSize: "0.7rem", color: "var(--on-surface)" }}>{t.relationship}</span>
                 </div>
              </div>

              <div style={{ position: "relative", zIndex: 2, marginTop: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "var(--surface-container-high)", padding: "12px", borderRadius: "var(--radius-lg)" }}>
                <span className="font-mono text-xs" style={{ color: "var(--on-surface-variant)" }}>ASSIGNED ASSETS</span>
                <span style={{ fontSize: "0.9rem", color: "var(--accent-cyan)", fontWeight: 700 }}>{getAssetCount(t.name)} SECURED</span>
              </div>
              
              <motion.button whileHover={{ scale: 1.02 }} className="w-full mt-4" style={{ position: "relative", zIndex: 2, padding: "10px", backgroundColor: "rgba(0,240,255,0.05)", border: "1px solid rgba(0,240,255,0.15)", borderRadius: "var(--radius-md)", color: "var(--accent-cyan)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.05em" }}>
                SEND VERIFICATION PULSE
              </motion.button>
            </div>
          ))}
          {trustees.length === 0 && (
             <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "var(--on-surface-variant)" }}>
               <p className="font-mono text-sm">NO TRUSTEES DETECTED IN NETWORK.</p>
             </div>
          )}
        </section>

      </main>
    </div>
  );
}
