"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

interface TimerState {
  countdown: string;
  isSimulating: boolean;
  handoverActive: boolean;
  isOverrideActive: boolean;
  startSimulation: () => void;
  resetOverride: () => void;
}

const GlobalTimerContext = createContext<TimerState | null>(null);

export function useGlobalTimer() {
  const ctx = useContext(GlobalTimerContext);
  if (!ctx) throw new Error("useGlobalTimer must be used within GlobalTimerProvider");
  return ctx;
}

export function GlobalTimerProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [countdown, setCountdown] = useState("CALCULATING...");
  const [isSimulating, setIsSimulating] = useState(false);
  const [handoverActive, setHandoverActive] = useState(false);
  const [isOverrideActive, setIsOverrideActive] = useState(false);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [simStartTime, setSimStartTime] = useState<number | null>(null);

  // Fetch Firestore globally
  useEffect(() => {
    if (!session?.user?.email) return;
    const userDocRef = doc(db, "users", session.user.email);
    
    // Heartbeat logic
    const updateHeartbeat = async () => {
      try {
        const snap = await getDoc(userDocRef);
        if (!snap.exists()) {
          await updateDoc(userDocRef, {
             lastSeen: serverTimestamp(),
             isOverrideActive: false,
             email: session!.user!.email!,
          });
        }
      } catch (e) {}
    };
    updateHeartbeat();

    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.lastSeen) {
          setDeadlineMs(data.lastSeen.toDate().getTime() + 14 * 86_400_000);
        }
        setIsOverrideActive(!!data.isOverrideActive);
      }
    });

    return () => unsubUser();
  }, [session?.user?.email]);

  // Global Countdown
  useEffect(() => {
    if (!deadlineMs) return;
    const intervalTime = isSimulating ? 50 : 1000;
    
    const interval = setInterval(() => {
      if (handoverActive) return;

      if (isSimulating && simStartTime) {
        const elapsed = Date.now() - simStartTime;
        const progress = Math.min(elapsed / 10000, 1);

        if (progress >= 1) {
          setCountdown("ZERO");
          setHandoverActive(true);
          setIsSimulating(false);
          clearInterval(interval);
          return;
        }

        const realDiff = deadlineMs - simStartTime;
        const currentSimDiff = realDiff * (1 - progress);

        const d = Math.floor(currentSimDiff / 86_400_000);
        const h = Math.floor((currentSimDiff % 86_400_000) / 3_600_000);
        const m = Math.floor((currentSimDiff % 3_600_000) / 60_000);
        const s = Math.floor((currentSimDiff % 60_000) / 1_000);
        const ms = Math.floor((currentSimDiff % 1_000) / 10);

        setCountdown(`${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s ${ms.toString().padStart(2, "0")}`);
        return;
      }

      const diff = deadlineMs - Date.now();
      if (diff <= 0) {
        setCountdown("ZERO");
        setHandoverActive(true);
        clearInterval(interval);
      } else {
        const d = Math.floor(diff / 86_400_000);
        const h = Math.floor((diff % 86_400_000) / 3_600_000);
        const m = Math.floor((diff % 3_600_000) / 60_000);
        const s = Math.floor((diff % 60_000) / 1_000);
        setCountdown(`${d}d ${h.toString().padStart(2, "0")}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`);
      }
    }, intervalTime);
    return () => clearInterval(interval);
  }, [deadlineMs, isSimulating, handoverActive, simStartTime]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimStartTime(Date.now());
  };

  const resetOverride = async () => {
    if (!session?.user?.email) return;
    const userDocRef = doc(db, "users", session.user.email);
    
    // Explicitly reset red UI logic optimistic instant execution
    setIsSimulating(false);
    setHandoverActive(false);
    setIsOverrideActive(false);
    setDeadlineMs(Date.now() + 14 * 86_400_000);

    await updateDoc(userDocRef, {
      isOverrideActive: false,
      lastSeen: serverTimestamp(),
    });
  };

  return (
    <GlobalTimerContext.Provider value={{ countdown, isSimulating, handoverActive, isOverrideActive, startSimulation, resetOverride }}>
      {children}
    </GlobalTimerContext.Provider>
  );
}
