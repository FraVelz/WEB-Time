import ianaTimeZones from "@/features/pomodoro/lib/ianaTimeZones.json";
import {
  CANONICAL_ZONE_BY_OFFSET,
  OFFSET_REFERENCES_ES,
} from "@/features/pomodoro/lib/offsetReferences";
import { formatGmtOffset, isValidTimeZone } from "@/features/pomodoro/lib/pomodoroTimezone";

/** Una sola entrada por desfase GMT (sin duplicados). */
export type GmtOffsetOption = {
  offsetMinutes: number;
  offsetLabel: string;
  references: string;
  /** Zona IANA de referencia para la cookie y el cálculo del día. */
  canonicalZoneId: string;
  searchText: string;
};

let catalogCache: GmtOffsetOption[] | null = null;
let zoneToOffsetCache: Map<string, number> | null = null;

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .trim();
}

function cityFromZoneId(zoneId: string): string {
  const part = zoneId.split("/").pop() ?? zoneId;
  return part.replace(/_/g, " ");
}

function offsetMinutesFromZone(zoneId: string, date: Date): number {
  const label = formatGmtOffset(zoneId, date);
  const match = label.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  const sign = match[1] === "+" ? 1 : -1;
  return sign * (parseInt(match[2], 10) * 60 + parseInt(match[3] ?? "0", 10));
}

function referencesForOffset(offsetMin: number, canonicalZoneId: string): string {
  const preset = OFFSET_REFERENCES_ES[offsetMin];
  if (preset) return preset;
  const region = canonicalZoneId.split("/")[0]?.replace(/_/g, " ") ?? "";
  const city = cityFromZoneId(canonicalZoneId);
  return region ? `${region} (${city})` : city;
}

function canonicalZoneForOffset(offsetMin: number, sampleZoneId: string): string {
  const preset = CANONICAL_ZONE_BY_OFFSET[offsetMin];
  if (preset && isValidTimeZone(preset)) return preset;
  return sampleZoneId;
}

function offsetSearchVariants(offsetLabel: string): string {
  const match = offsetLabel.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return offsetLabel.toLowerCase();
  const sign = match[1];
  const h = parseInt(match[2], 10);
  const m = match[3] ? parseInt(match[3], 10) : 0;
  const variants = [
    offsetLabel,
    `gmt${sign}${h}`,
    `gmt ${sign}${h}`,
    `gmt${sign === "+" ? "+" : "-"}${h}`,
    `utc${sign}${h}`,
    `utc ${sign}${h}`,
    `utc${sign === "+" ? "+" : "-"}${h}`,
    `gmt${sign}0`,
    `utc${sign}0`,
  ];
  if (h === 0) variants.push("gmt0", "gmt-0", "gmt+0", "utc0", "utc+0", "utc-0", "zulu");
  if (m) {
    variants.push(
      `gmt${sign}${h}:${String(m).padStart(2, "0")}`,
      `utc${sign}${h}:${String(m).padStart(2, "0")}`,
    );
  }
  return variants.join(" ");
}

function getAllIanaTimeZones(): string[] {
  if (typeof Intl !== "undefined" && "supportedValuesOf" in Intl) {
    try {
      const live = Intl.supportedValuesOf("timeZone");
      if (live.length >= ianaTimeZones.length) return [...live];
    } catch {
      /* lista estática */
    }
  }
  return [...ianaTimeZones];
}

function getZoneToOffsetMap(date = new Date()): Map<string, number> {
  if (zoneToOffsetCache) return zoneToOffsetCache;
  const map = new Map<string, number>();
  for (const id of getAllIanaTimeZones()) {
    if (isValidTimeZone(id)) map.set(id, offsetMinutesFromZone(id, date));
  }
  zoneToOffsetCache = map;
  return map;
}

export function buildGmtOffsetCatalog(date = new Date()): GmtOffsetOption[] {
  const zoneToOffset = getZoneToOffsetMap(date);
  const zonesByOffset = new Map<number, string[]>();

  for (const [zoneId, offMin] of zoneToOffset) {
    const list = zonesByOffset.get(offMin) ?? [];
    list.push(zoneId);
    zonesByOffset.set(offMin, list);
  }

  const options: GmtOffsetOption[] = [];

  for (const [offMin, zoneIds] of [...zonesByOffset.entries()].sort((a, b) => a[0] - b[0])) {
    const canonicalZoneId = canonicalZoneForOffset(offMin, zoneIds[0] ?? "UTC");
    const offsetLabel = formatGmtOffset(canonicalZoneId, date);
    const references = referencesForOffset(offMin, canonicalZoneId);

    const zoneKeywords = zoneIds
      .map((id) => `${id} ${cityFromZoneId(id)} ${id.split("/")[0] ?? ""}`)
      .join(" ");

    const searchText = normalizeSearch(
      [offsetLabel, references, offsetSearchVariants(offsetLabel), zoneKeywords].join(" "),
    );

    options.push({
      offsetMinutes: offMin,
      offsetLabel,
      references,
      canonicalZoneId,
      searchText,
    });
  }

  return options;
}

export function getGmtOffsetCatalog(): GmtOffsetOption[] {
  if (!catalogCache) catalogCache = buildGmtOffsetCatalog();
  return catalogCache;
}

export function getOffsetMinutesForZone(zoneId: string, date = new Date()): number | undefined {
  return getZoneToOffsetMap(date).get(zoneId);
}

export function findGmtOffsetByZoneId(zoneId: string): GmtOffsetOption | undefined {
  const offMin = getOffsetMinutesForZone(zoneId);
  if (offMin === undefined) return undefined;
  return getGmtOffsetCatalog().find((g) => g.offsetMinutes === offMin);
}

export function findGmtOffsetByOffsetMinutes(offsetMinutes: number): GmtOffsetOption | undefined {
  return getGmtOffsetCatalog().find((g) => g.offsetMinutes === offsetMinutes);
}

/** Convierte cualquier zona IANA guardada al GMT único correspondiente. */
export function resolveToCanonicalZone(zoneId: string): string {
  const match = findGmtOffsetByZoneId(zoneId);
  return match?.canonicalZoneId ?? zoneId;
}

export function formatGmtOptionLabel(option: GmtOffsetOption): string {
  return `${option.offsetLabel} — ${option.references}`;
}

export function searchGmtOffsets(query: string): GmtOffsetOption[] {
  const catalog = getGmtOffsetCatalog();
  const q = normalizeSearch(query);
  if (!q) return catalog;
  return catalog.filter((g) => g.searchText.includes(q));
}
