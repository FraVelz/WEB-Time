export function pad(n: number): string {
  return String(Math.floor(n)).padStart(2, "0");
}

export function formatMmSs(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

export function formatCronometro(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export function parseMmSs(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) return 0;
  const parts = trimmed.split(":").map((p) => parseInt(p, 10) || 0);
  if (parts.length >= 2) {
    const [m, sec] = parts;
    return Math.max(0, m * 60 + Math.min(59, sec));
  }
  if (parts.length === 1) return Math.max(0, parts[0] * 60);
  return 0;
}
