"use client";

import { motion } from "framer-motion";
import { useRef, useCallback } from "react";

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
  size: number;
}

const NODES: Node[] = [
  { id: "core", x: 50, y: 50, label: "CORE", color: "#00f2ff", size: 14 },
  { id: "vault", x: 25, y: 25, label: "VAULT", color: "#b44fff", size: 9 },
  { id: "switch", x: 75, y: 20, label: "D.M.S.", color: "#00f2ff", size: 10 },
  { id: "drive", x: 80, y: 70, label: "DRIVE", color: "#b44fff", size: 8 },
  { id: "contacts", x: 20, y: 72, label: "CONTACTS", color: "#00f2ff", size: 8 },
  { id: "stream", x: 55, y: 82, label: "STREAM", color: "#b44fff", size: 7 },
  { id: "proto", x: 38, y: 15, label: "PROTOCOLS", color: "#00f2ff", size: 7 },
];

const EDGES = [
  ["core", "vault"], ["core", "switch"], ["core", "drive"],
  ["core", "contacts"], ["core", "stream"], ["vault", "proto"],
  ["switch", "proto"], ["drive", "stream"], ["contacts", "vault"],
];

function getNodePos(id: string, w: number, h: number) {
  const n = NODES.find((x) => x.id === id)!;
  return { x: (n.x / 100) * w, y: (n.y / 100) * h };
}

export default function NodeGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const W = 460;
  const H = 320;

  return (
    <div className="relative w-full" style={{ aspectRatio: "460/320" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-violet">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="node-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2ff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {EDGES.map(([a, b], i) => {
          const p1 = getNodePos(a, W, H);
          const p2 = getNodePos(b, W, H);
          const nodeA = NODES.find((n) => n.id === a)!;
          return (
            <motion.line
              key={i}
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke={nodeA.color}
              strokeWidth="0.5"
              strokeOpacity="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
            />
          );
        })}

        {/* Data flow pulses */}
        {EDGES.map(([a, b], i) => {
          const p1 = getNodePos(a, W, H);
          const p2 = getNodePos(b, W, H);
          return (
            <motion.circle
              key={`pulse-${i}`}
              r="2"
              fill="#00f2ff"
              filter="url(#glow-cyan)"
              initial={{ cx: p1.x, cy: p1.y, opacity: 0 }}
              animate={{
                cx: [p1.x, p2.x],
                cy: [p1.y, p2.y],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.4,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3,
              }}
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const x = (node.x / 100) * W;
          const y = (node.y / 100) * H;
          const isCore = node.id === "core";

          return (
            <g key={node.id}>
              {/* Outer glow ring */}
              <motion.circle
                cx={x} cy={y}
                r={isCore ? 28 : node.size + 10}
                fill={`${node.color}08`}
                stroke={node.color}
                strokeWidth="0.5"
                strokeOpacity="0.2"
                animate={{ r: isCore ? [28, 34, 28] : [node.size + 10, node.size + 14, node.size + 10], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
              />
              {/* Core halo */}
              {isCore && (
                <circle cx={x} cy={y} r={22} fill="url(#node-core)" />
              )}
              {/* Node body */}
              <motion.circle
                cx={x} cy={y}
                r={node.size}
                fill={`${node.color}22`}
                stroke={node.color}
                strokeWidth={isCore ? "1.5" : "1"}
                filter={`url(#glow-${node.color === "#00f2ff" ? "cyan" : "violet"})`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
              />
              {/* Label */}
              <motion.text
                x={x}
                y={y + node.size + 12}
                textAnchor="middle"
                fill={node.color}
                fontSize={isCore ? "7" : "6"}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="500"
                opacity="0.8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.8 }}
              >
                {node.label}
              </motion.text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
