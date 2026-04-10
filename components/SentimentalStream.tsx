"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface MemoryCard {
  id: string;
  title: string;
  date: string;
  month: string;
  year: string;
  bgGradient: string;
  overlayColor: string;
}

const MEMORIES: MemoryCard[] = [
  {
    id: "m1",
    title: "The Last Summit",
    date: "June 2024",
    month: "JUNE 2024",
    year: "2024",
    bgGradient: "linear-gradient(180deg, #c97b2a 0%, #e8a84e 30%, #f5c678 50%, #e07620 70%, #7c3d0a 100%)",
    overlayColor: "rgba(12,19,36,0.45)",
  },
  {
    id: "m2",
    title: "Parisian Reverie",
    date: "Dec 2023",
    month: "DEC 2023",
    year: "2023",
    bgGradient: "linear-gradient(180deg, #d4c5b0 0%, #b8a898 30%, #9b8e80 55%, #7a6e65 80%, #3e3530 100%)",
    overlayColor: "rgba(12,19,36,0.5)",
  },
  {
    id: "m3",
    title: "The Great Archive",
    date: "Oct 2022",
    month: "OCT 2022",
    year: "2022",
    bgGradient: "linear-gradient(180deg, #7c5a32 0%, #a07348 30%, #8b6040 55%, #5c3e25 80%, #2a1e10 100%)",
    overlayColor: "rgba(12,19,36,0.45)",
  },
  {
    id: "m4",
    title: "Midnight Reflection",
    date: "Mar 2022",
    month: "MAR 2022",
    year: "2022",
    bgGradient: "linear-gradient(180deg, #0d2040 0%, #1a3860 30%, #0f2848 60%, #071525 100%)",
    overlayColor: "rgba(12,19,36,0.3)",
  },
  {
    id: "m5",
    title: "Garden of Light",
    date: "Jul 2021",
    month: "JUL 2021",
    year: "2021",
    bgGradient: "linear-gradient(180deg, #2d6a2d 0%, #4a8c3a 30%, #6ab04c 55%, #3d7530 80%, #1a3615 100%)",
    overlayColor: "rgba(12,19,36,0.5)",
  },
];

export default function SentimentalStream() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragStart, setDragStart] = useState(0);
  const [dragging, setDragging] = useState(false);

  const scroll = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 280 : -280, behavior: "smooth" });
  };

  return (
    <div>
      {/* Section header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--on-surface)",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Sentimental Stream
          </h2>
          <p className="font-mono" style={{ fontSize: "0.7rem", color: "var(--on-surface-variant)", marginTop: "4px" }}>
            Historical memory buffers currently held in trust.
          </p>
        </div>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--accent-cyan)",
            fontFamily: "var(--font-label)",
            fontSize: "0.7rem",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          VIEW ALL
          <span style={{ fontSize: "1rem" }}>→</span>
        </button>
      </div>

      {/* Carousel */}
      <div style={{ position: "relative" }}>
        {/* Track */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: "16px",
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: dragging ? "grabbing" : "grab",
            paddingBottom: "4px",
          }}
          onMouseDown={(e) => {
            setDragging(true);
            setDragStart(e.clientX);
          }}
          onMouseMove={(e) => {
            if (!dragging) return;
            trackRef.current?.scrollBy({ left: -(e.movementX) });
          }}
          onMouseUp={() => setDragging(false)}
          onMouseLeave={() => setDragging(false)}
        >
          {MEMORIES.map((memory, i) => (
            <motion.div
              key={memory.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, scale: 1.01 }}
              style={{
                flexShrink: 0,
                width: "200px",
                height: "240px",
                borderRadius: "24px",    // Stitch spec: 24px corner radius
                overflow: "hidden",
                position: "relative",
                background: memory.bgGradient,
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), var(--shadow-float)",
                cursor: "pointer",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              {/* Photo-style scene with CSS art */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: memory.bgGradient,
                }}
              />
              {/* Atmospheric fog layer */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)`,
                }}
              />
              {/* Glassmorphism bottom overlay — 24px blur per Stitch spec */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "16px",
                  background:
                    "linear-gradient(to top, rgba(7,13,31,0.9) 0%, rgba(7,13,31,0.6) 50%, transparent 100%)",
                  backdropFilter: "blur(2px)",
                  WebkitBackdropFilter: "blur(2px)",
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: "0.55rem",
                    color: "rgba(220,225,251,0.6)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  {memory.month}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--on-surface)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.2,
                  }}
                >
                  {memory.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fade edges */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 4,
            width: "40px",
            background: "linear-gradient(to right, var(--background), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 4,
            width: "40px",
            background: "linear-gradient(to left, var(--background), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}
