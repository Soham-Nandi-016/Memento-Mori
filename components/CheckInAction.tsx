"use client";

import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

export default function CheckInAction() {
  const { data: session } = useSession();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCheckIn = async () => {
    if (!session?.user?.email) return;
    setIsUpdating(true);
    try {
      const userDocRef = doc(db, "users", session.user.email);
      await setDoc(userDocRef, {
        lastCheckIn: serverTimestamp(),
        nextCheckIn: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }, { merge: true });
      console.log('SYNC SUCCESS');
    } catch (e) {
      console.error('SYNC FAIL', e);
    } finally {
      setTimeout(() => setIsUpdating(false), 1000); // 1s cooldown
    }
  };

  return (
    <button
      onClick={handleCheckIn}
      disabled={isUpdating}
      className="font-mono flex items-center gap-2"
      style={{
        marginTop: "24px",
        padding: "12px 24px",
        borderRadius: "12px",
        backgroundColor: isUpdating ? "rgba(34,197,94,0.1)" : "rgba(0,240,255,0.1)",
        border: isUpdating ? "1px solid rgba(34,197,94,0.3)" : "1px solid rgba(0,240,255,0.3)",
        color: isUpdating ? "#22c55e" : "#00f0ff",
        fontSize: "0.8rem",
        fontWeight: 600,
        letterSpacing: "0.05em",
        cursor: isUpdating ? "default" : "pointer",
        transition: "all 0.3s ease",
        boxShadow: isUpdating ? "0 0 15px rgba(34,197,94,0.15)" : "0 0 20px rgba(0,240,255,0.15)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      {isUpdating ? "VITAL SIGNS CONFIRMED" : "⚡ CONFIRM VITAL SIGNS"}
    </button>
  );
}
