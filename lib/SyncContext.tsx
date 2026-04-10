"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import { fetchDriveFiles, DriveFile } from "@/app/actions/drive";

// ── Types ──────────────────────────────────────────────────────────────────
export interface TerminalLine {
  id: number;
  content: string;
  type: "system" | "sync" | "error" | "info" | "processing";
  ephemeral?: boolean;
}

export interface SyncState {
  lines: TerminalLine[];
  assets: DriveFile[]; // Stores the raw indexed files for the Archive
  isScanning: boolean;
  isProcessing: boolean;
  scanComplete: boolean;
  nextPageToken: string | null;
  totalLoaded: number;
  batchCount: number;
  hasBoot: boolean;
}

interface SyncContextValue extends SyncState {
  runScan: (token: string | null, batchNum: number) => Promise<void>;
  triggerBoot: () => void;
  addLine: (line: Omit<TerminalLine, "id">) => void;
}

// ── Constants ──────────────────────────────────────────────────────────────
const BOOT_LINES: TerminalLine[] = [
  { id: 0, content: "[SYS] ARCHIVIST TERMINAL v2.4.1 initializing...", type: "system" },
  { id: 1, content: "[SYS] Establishing secure OAuth bridge...",        type: "system" },
  { id: 2, content: "[SYS] Drive API handshake complete.",              type: "info"   },
  { id: 3, content: "[SCAN] Enumerating legacy assets...",              type: "system" },
];

const PROCESSING_MSGS = [
  "Analyzing metadata signatures...",
  "Cross-referencing sentimental index...",
  "Parsing inheritance vectors...",
  "Decoding legacy fingerprints...",
  "Mapping asset provenance chains...",
  "Verifying cryptographic seals...",
  "Extracting temporal markers...",
  "Cataloguing digital artifacts...",
];

// ── Helpers ────────────────────────────────────────────────────────────────
function formatFileSize(bytes?: string): string {
  const n = parseInt(bytes ?? "0", 10);
  if (!n) return "";
  if (n < 1024) return ` [${n}B]`;
  if (n < 1024 * 1024) return ` [${(n / 1024).toFixed(1)}KB]`;
  return ` [${(n / (1024 * 1024)).toFixed(1)}MB]`;
}

function shortMime(mime: string): string {
  const map: Record<string, string> = {
    "application/vnd.google-apps.folder":       "DIR",
    "application/vnd.google-apps.document":     "DOC",
    "application/vnd.google-apps.spreadsheet":  "XLS",
    "application/vnd.google-apps.presentation": "PPT",
    "application/pdf":  "PDF",
    "image/jpeg": "JPG", "image/png": "PNG", "image/gif": "GIF",
    "video/mp4":  "MP4", "audio/mpeg": "MP3",
  };
  return map[mime] ?? mime.split("/")[1]?.toUpperCase().slice(0, 4) ?? "???";
}

// ── Context ────────────────────────────────────────────────────────────────
const SyncContext = createContext<SyncContextValue | null>(null);

export function useSyncContext() {
  const ctx = useContext(SyncContext);
  if (!ctx) throw new Error("useSyncContext must be used within SyncProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────────
export function SyncProvider({ children }: { children: ReactNode }) {
  const [lines, setLines]             = useState<TerminalLine[]>([]);
  const [assets, setAssets]           = useState<DriveFile[]>([]);
  const [isScanning, setIsScanning]   = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [totalLoaded, setTotalLoaded] = useState(0);
  const [batchCount, setBatchCount]   = useState(0);
  const [hasBoot, setHasBoot]         = useState(false);

  const idCounter  = useRef(10);
  const procTimer  = useRef<ReturnType<typeof setInterval> | null>(null);
  // Capture latest totalLoaded in a ref so runScan closure doesn't go stale
  const totalRef   = useRef(0);
  totalRef.current = totalLoaded;

  const nextId = useCallback(() => ++idCounter.current, []);

  const addLine = useCallback(
    (line: Omit<TerminalLine, "id">) => {
      setLines((prev) => [...prev, { ...line, id: nextId() }]);
    },
    [nextId]
  );

  // ── Processing animation ─────────────────────────────────────────────────
  const startProcessingAnim = useCallback(() => {
    setIsProcessing(true);
    setLines((prev) => [
      ...prev,
      { id: nextId(), content: `[AI]  ${PROCESSING_MSGS[0]}`, type: "processing", ephemeral: true },
    ]);
    let msgIdx = 1;
    procTimer.current = setInterval(() => {
      const msg = PROCESSING_MSGS[msgIdx % PROCESSING_MSGS.length];
      msgIdx++;
      setLines((prev) =>
        prev.map((l) => {
          if (!l) return l;
          return l?.ephemeral ? { ...l, content: `[AI]  ${msg}` } : l;
        })
      );
    }, 420);
  }, [nextId]);

  const stopProcessingAnim = useCallback(() => {
    if (procTimer.current) {
      clearInterval(procTimer.current);
      procTimer.current = null;
    }
    setLines((prev) => prev.filter((l) => l != null && !l?.ephemeral));
    setIsProcessing(false);
  }, []);

  // ── Core scan (stable — no totalLoaded in deps, uses ref instead) ────────
  const runScan = useCallback(
    async (token: string | null, batchNum: number) => {
      setIsScanning(true);
      addLine(
        batchNum === 0
          ? { content: "[NET] Fetching Google Drive manifest...", type: "system" }
          : { content: `[NET] Fetching batch ${batchNum + 1} — page token acquired.`, type: "system" }
      );
      startProcessingAnim();

      try {
        const result = await fetchDriveFiles(token, 100);
        stopProcessingAnim();

        const { files, nextPageToken: npt } = result;
        const newTotal = totalRef.current + files.length;

        addLine({
          content: `[OK]  Batch ${batchNum + 1}: ${files.length} assets retrieved. Total indexed: ${newTotal}.`,
          type: "info",
        });

        for (let i = 0; i < files.length; i++) {
          if (i > 0 && i % 10 === 0) {
            startProcessingAnim();
            await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
            stopProcessingAnim();
            addLine({
              content: `[AI]  Metadata analysis: ${i}/${files.length} assets profiled.`,
              type: "processing",
            });
          }
          const f = files[i];
          await new Promise((r) => setTimeout(r, 30 + Math.random() * 60));
          addLine({
            content: `[SYNC] [${shortMime(f.mimeType ?? "")}]${formatFileSize(f.size)} ${f.name}`,
            type: "sync",
          });
        }

        setAssets(prev => [...prev, ...files]);
        setNextPageToken(npt);
        setTotalLoaded(newTotal);
        setBatchCount(batchNum + 1);

        if (npt) {
          addLine({
            content: `[ARCH] Batch complete. ${newTotal} assets logged. More pages available — click 'Load Next Batch'.`,
            type: "info",
          });
        } else {
          addLine({
            content: `[ARCH] Deep scan complete. ${newTotal} legacy assets fully indexed.`,
            type: "info",
          });
          setScanComplete(true);
        }
      } catch (err: unknown) {
        stopProcessingAnim();
        const msg = err instanceof Error ? err.message : "Unknown error";
        addLine({ content: `[ERR] Drive sync failed: ${msg}`, type: "error" });
        addLine({ content: "[SYS] Retrying on next heartbeat cycle...", type: "system" });
        setScanComplete(true);
      } finally {
        setIsScanning(false);
      }
    },
    [addLine, startProcessingAnim, stopProcessingAnim]
  );

  // ── Boot — only runs once across all navigations ─────────────────────────
  const triggerBoot = useCallback(() => {
    // FINAL SYNC LOOP KILL: Check if we've already booted or already have files
    if (hasBoot || totalRef.current > 0) return;
    setHasBoot(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(timer);
        setTimeout(() => runScan(null, 0), 600);
      }
    }, 300);
  }, [hasBoot, runScan]);

  return (
    <SyncContext.Provider
      value={{
        lines,
        assets,
        isScanning,
        isProcessing,
        scanComplete,
        nextPageToken,
        totalLoaded,
        batchCount,
        hasBoot,
        runScan,
        triggerBoot,
        addLine,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
}
