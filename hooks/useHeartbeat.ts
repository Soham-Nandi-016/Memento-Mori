"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export interface HeartbeatState {
  isAlive: boolean;
  lastBeat: Date | null;
  nextBeat: Date | null;
  countdown: number; // seconds remaining until switch triggers
  totalCycles: number;
}

const DEFAULT_INTERVAL_HOURS = 72; // 72-hour Dead Man's Switch window

/**
 * useHeartbeat — Dead Man's Switch Hook
 *
 * Monitors the user's "heartbeat" — a periodic signal proving they are alive.
 * If the countdown reaches zero without a beat, legacy protocols are triggered.
 *
 * TODO:
 *   - Persist lastBeat to the database via /api/heartbeat endpoint
 *   - Broadcast trigger event to vaultService when countdown hits 0
 *   - Add configurable interval (default: 72h)
 *   - Implement push notification reminders at 48h, 24h, 6h marks
 */
export function useHeartbeat(intervalHours = DEFAULT_INTERVAL_HOURS) {
  const [state, setState] = useState<HeartbeatState>({
    isAlive: true,
    lastBeat: null,
    nextBeat: null,
    countdown: intervalHours * 3600,
    totalCycles: 0,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const recordBeat = useCallback(() => {
    const now = new Date();
    const nextBeat = new Date(now.getTime() + intervalHours * 3600 * 1000);
    setState((prev) => ({
      isAlive: true,
      lastBeat: now,
      nextBeat,
      countdown: intervalHours * 3600,
      totalCycles: prev.totalCycles + 1,
    }));
    // TODO: POST to /api/heartbeat to persist the beat timestamp
  }, [intervalHours]);

  // Countdown tick
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState((prev) => {
        const newCountdown = prev.countdown - 1;
        if (newCountdown <= 0) {
          // TODO: Dispatch to vaultService.triggerLegacyProtocols()
          return { ...prev, isAlive: false, countdown: 0 };
        }
        return { ...prev, countdown: newCountdown };
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatCountdown = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return { ...state, recordBeat, formatCountdown };
}
