export interface Slot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface CurveResult {
  d: string;
  sampleAt: (t: number) => { x: number; y: number };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function makeCurve(slot: Slot, steepness = 6): CurveResult {
  const { x: ox, y: oy, w, h } = slot;
  const samples = 64;
  const pts: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = ox + t * w;
    const yNorm = 1 / (1 + steepness * t);
    const y = oy + (1 - yNorm) * h * 0.9 + h * 0.05;
    pts.push([x, y]);
  }
  const d = "M " + pts.map((p) => p.join(",")).join(" L ");
  const sampleAt = (t: number) => {
    const i = Math.round(clamp(t, 0, 1) * samples);
    return { x: pts[i][0], y: pts[i][1] };
  };
  return { d, sampleAt };
}

export function makeSinglePriceFill(
  slot: Slot,
  priceT: number,
  steepness = 6,
): string {
  const curve = makeCurve(slot, steepness);
  const pt = curve.sampleAt(priceT);
  const baseY = slot.y + slot.h;
  return `M ${slot.x} ${baseY} L ${slot.x} ${pt.y} L ${pt.x} ${pt.y} L ${pt.x} ${baseY} Z`;
}

export function makeStaircaseFill(
  slot: Slot,
  stepTs: number[],
  steepness = 6,
): string {
  const curve = makeCurve(slot, steepness);
  const baseY = slot.y + slot.h;
  const pts = stepTs.map((t) => curve.sampleAt(t));
  const parts = [`M ${slot.x} ${baseY}`];
  let prevX = slot.x;
  for (const pt of pts) {
    parts.push(`L ${prevX} ${pt.y}`);
    parts.push(`L ${pt.x} ${pt.y}`);
    prevX = pt.x;
  }
  parts.push(`L ${prevX} ${baseY} Z`);
  return parts.join(" ");
}

export function makeFullCurveFill(slot: Slot, steepness = 6): string {
  const curve = makeCurve(slot, steepness);
  const baseY = slot.y + slot.h;
  const samples = 64;
  const parts: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = curve.sampleAt(t);
    parts.push(`${i === 0 ? "M" : "L"} ${p.x} ${p.y}`);
  }
  parts.push(`L ${slot.x + slot.w} ${baseY}`);
  parts.push(`L ${slot.x} ${baseY} Z`);
  return parts.join(" ");
}

export function makeParabolaPath(
  slot: Slot,
  peakT: number,
  peakH: number,
): string {
  const samples = 48;
  const pts: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    let y =
      slot.y +
      slot.h * (1 - (1 - Math.pow((t - peakT) * 2.6, 2)) * peakH * 0.85);
    const x = slot.x + 30 + t * (slot.w - 60);
    y = Math.max(slot.y + 20, Math.min(slot.y + slot.h - 20, y));
    pts.push([x, y]);
  }
  return "M " + pts.map((p) => p.join(",")).join(" L ");
}

export function makeSigmoidPath(slot: Slot): string {
  const samples = 64;
  const pts: [number, number][] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = slot.x + 30 + t * (slot.w - 60);
    const yNorm = 1 / (1 + Math.exp(7 * (t - 0.5)));
    const y = slot.y + (1 - yNorm) * slot.h * 0.74 + slot.h * 0.13;
    pts.push([x, y]);
  }
  return "M " + pts.map((p) => p.join(",")).join(" L ");
}
