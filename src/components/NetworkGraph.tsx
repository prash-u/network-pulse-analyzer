import { useEffect, useMemo, useRef, useState } from "react";
import type { Edge, Gene } from "@/data/datasets";

type Node = Gene & { x: number; y: number; vx: number; vy: number; degree: number };

interface Props {
  genes: Gene[];
  edges: Edge[];
  selected?: string | null;
  onSelect?: (sym: string | null) => void;
}

// Lightweight force-directed layout — no external libs.
export const NetworkGraph = ({ genes, edges, selected, onSelect }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 560 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect;
      setSize({ w: Math.max(320, r.width), h: Math.max(360, r.height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const degreeMap = useMemo(() => {
    const m = new Map<string, number>();
    edges.forEach((e) => {
      m.set(e.source, (m.get(e.source) ?? 0) + 1);
      m.set(e.target, (m.get(e.target) ?? 0) + 1);
    });
    return m;
  }, [edges]);

  // Initialize nodes
  useEffect(() => {
    const cx = size.w / 2;
    const cy = size.h / 2;
    setNodes(
      genes.map((g, i) => {
        const angle = (i / genes.length) * Math.PI * 2;
        const r = Math.min(size.w, size.h) * 0.32;
        return {
          ...g,
          x: cx + Math.cos(angle) * r + (Math.random() - 0.5) * 30,
          y: cy + Math.sin(angle) * r + (Math.random() - 0.5) * 30,
          vx: 0,
          vy: 0,
          degree: degreeMap.get(g.symbol) ?? 0,
        };
      })
    );
  }, [genes, edges, size.w, size.h, degreeMap]);

  // Simulation
  useEffect(() => {
    if (!nodes.length) return;
    let raf = 0;
    let alpha = 1;
    const step = () => {
      alpha *= 0.985;
      if (alpha < 0.01) return;
      setNodes((prev) => {
        const next = prev.map((n) => ({ ...n }));
        const cx = size.w / 2;
        const cy = size.h / 2;
        // repulsion
        for (let i = 0; i < next.length; i++) {
          for (let j = i + 1; j < next.length; j++) {
            const a = next[i];
            const b = next[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist2 = dx * dx + dy * dy + 0.01;
            const f = 2400 / dist2;
            const dist = Math.sqrt(dist2);
            const fx = (dx / dist) * f;
            const fy = (dy / dist) * f;
            a.vx += fx;
            a.vy += fy;
            b.vx -= fx;
            b.vy -= fy;
          }
        }
        // edge attraction
        edges.forEach((e) => {
          const a = next.find((n) => n.symbol === e.source);
          const b = next.find((n) => n.symbol === e.target);
          if (!a || !b) return;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
          const target = 130;
          const f = (dist - target) * 0.04 * e.score;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        });
        // centering + damping
        next.forEach((n) => {
          n.vx += (cx - n.x) * 0.005;
          n.vy += (cy - n.y) * 0.005;
          n.vx *= 0.82 * alpha;
          n.vy *= 0.82 * alpha;
          n.x += n.vx;
          n.y += n.vy;
          n.x = Math.max(40, Math.min(size.w - 40, n.x));
          n.y = Math.max(40, Math.min(size.h - 40, n.y));
        });
        return next;
      });
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genes, edges, size.w, size.h]);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.symbol, n])), [nodes]);
  const activeSym = hover ?? selected ?? null;
  const neighborSet = useMemo(() => {
    if (!activeSym) return new Set<string>();
    const s = new Set<string>([activeSym]);
    edges.forEach((e) => {
      if (e.source === activeSym) s.add(e.target);
      if (e.target === activeSym) s.add(e.source);
    });
    return s;
  }, [activeSym, edges]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[480px] rounded-lg overflow-hidden bg-gradient-to-br from-sidebar-background via-sidebar-background to-[hsl(195_70%_10%)]">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <svg width={size.w} height={size.h} className="relative">
        <defs>
          <radialGradient id="upGrad">
            <stop offset="0%" stopColor="hsl(190 100% 70%)" />
            <stop offset="100%" stopColor="hsl(186 95% 35%)" />
          </radialGradient>
          <radialGradient id="downGrad">
            <stop offset="0%" stopColor="hsl(320 85% 75%)" />
            <stop offset="100%" stopColor="hsl(320 85% 45%)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map((e, i) => {
          const a = nodeMap.get(e.source);
          const b = nodeMap.get(e.target);
          if (!a || !b) return null;
          const dim = activeSym && !(neighborSet.has(e.source) && neighborSet.has(e.target));
          return (
            <line
              key={i}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="hsl(190 100% 60%)"
              strokeOpacity={dim ? 0.08 : 0.25 + e.score * 0.4}
              strokeWidth={0.5 + e.score * 1.5}
            />
          );
        })}

        {nodes.map((n) => {
          const r = 8 + Math.min(18, n.degree * 2.5) + Math.min(8, Math.abs(n.log2FC) * 1.5);
          const isActive = activeSym === n.symbol;
          const isNeighbor = activeSym && neighborSet.has(n.symbol);
          const dim = activeSym && !isNeighbor;
          return (
            <g
              key={n.symbol}
              transform={`translate(${n.x}, ${n.y})`}
              style={{ cursor: "pointer", opacity: dim ? 0.25 : 1, transition: "opacity 0.2s" }}
              onMouseEnter={() => setHover(n.symbol)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(selected === n.symbol ? null : n.symbol)}
            >
              <circle
                r={r}
                fill={n.direction === "up" ? "url(#upGrad)" : "url(#downGrad)"}
                stroke={isActive ? "hsl(190 100% 80%)" : "hsl(200 60% 6%)"}
                strokeWidth={isActive ? 2.5 : 1.5}
                filter={isActive ? "url(#glow)" : undefined}
              />
              <text
                y={r + 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                fill="hsl(200 20% 95%)"
                style={{ pointerEvents: "none", fontFamily: "JetBrains Mono, monospace" }}
              >
                {n.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 text-xs text-sidebar-foreground/80 bg-sidebar-background/70 backdrop-blur px-3 py-2 rounded-md border border-sidebar-border">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "radial-gradient(circle, hsl(190 100% 70%), hsl(186 95% 35%))" }} /> Upregulated</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: "radial-gradient(circle, hsl(320 85% 75%), hsl(320 85% 45%))" }} /> Downregulated</span>
        <span className="opacity-70">Size = degree × |log2FC|</span>
      </div>
    </div>
  );
};
