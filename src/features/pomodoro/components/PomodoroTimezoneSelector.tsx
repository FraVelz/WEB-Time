"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ensureTimeZoneCookie,
  getTimeZone,
  POMODORO_TIMEZONE_UPDATED_EVENT,
  setTimeZone,
} from "@/features/pomodoro/lib/pomodoroCookies";
import { formatGmtOffset, getBrowserTimeZone } from "@/features/pomodoro/lib/pomodoroTimezone";
import {
  findGmtOffsetByZoneId,
  formatGmtOptionLabel,
  getGmtOffsetCatalog,
  searchGmtOffsets,
  type GmtOffsetOption,
} from "@/features/pomodoro/lib/timezoneCatalog";

const inputClassName =
  "border-border bg-bg text-text focus-visible:ring-accent w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus-visible:ring-2";

function GmtRow({
  option,
  selected,
  onSelect,
}: {
  option: GmtOffsetOption;
  selected: boolean;
  onSelect: (option: GmtOffsetOption) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(option)}
      className={`hover:bg-surface-hover flex w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
        selected ? "bg-accent/15 ring-accent/40 ring-1" : ""
      }`}
    >
      <span className="text-text font-medium">{formatGmtOptionLabel(option)}</span>
    </button>
  );
}

export function PomodoroTimezoneSelector() {
  const [mounted, setMounted] = useState(false);
  const [timeZone, setTimeZoneState] = useState("UTC");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    ensureTimeZoneCookie();
    setTimeZoneState(getTimeZone());
    setMounted(true);

    const onUpdate = () => setTimeZoneState(getTimeZone());
    window.addEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, onUpdate);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter("");
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setFilter("");
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    searchRef.current?.focus();

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const catalog = useMemo(() => getGmtOffsetCatalog(), []);
  const filtered = useMemo(() => searchGmtOffsets(filter), [filter]);
  const selectedGmt = useMemo(
    () => findGmtOffsetByZoneId(timeZone) ?? findGmtOffsetByZoneId(getBrowserTimeZone()),
    [timeZone],
  );

  const handleSelect = (option: GmtOffsetOption) => {
    setTimeZone(option.canonicalZoneId);
    setTimeZoneState(option.canonicalZoneId);
    setOpen(false);
    setFilter("");
  };

  if (!mounted) return null;

  const currentOffset = formatGmtOffset(timeZone);
  const isSearching = filter.trim().length > 0;
  const listOptions = isSearching ? filtered : catalog;

  return (
    <div className="border-border bg-surface rounded-2xl border p-5 md:p-6">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-text text-base font-semibold">Zona horaria (GMT)</h3>
          <p className="text-muted mt-1 max-w-xl text-sm leading-relaxed">
            Solo hay un desfase por GMT (sin repetidos). Busca tu país para saber cuál te corresponde
            — por ejemplo <span className="text-text">Colombia</span> → GMT-5 — y selecciónalo. Se
            guarda en la cookie{" "}
            <code className="text-text font-mono text-xs">pomodoro_timezone</code>.
          </p>
        </div>
        <p className="text-muted font-mono text-xs">
          Activo: <span className="text-text">{currentOffset}</span>
        </p>
      </div>

      <label className="text-muted mb-1.5 block text-xs font-medium" htmlFor="pomodoro-tz-trigger">
        Desfase GMT
      </label>

      <div ref={rootRef} className="relative">
        <button
          type="button"
          id="pomodoro-tz-trigger"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls="pomodoro-tz-listbox"
          onClick={() => setOpen((prev) => !prev)}
          className={`${inputClassName} hover:bg-surface-hover flex w-full cursor-pointer items-center justify-between gap-2 text-left transition-colors`}
        >
          <span className={selectedGmt ? "text-text font-medium" : "text-muted"}>
            {selectedGmt ? formatGmtOptionLabel(selectedGmt) : "Seleccionar desfase GMT"}
          </span>
          <svg
            className={`text-muted h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open && (
          <div className="border-border bg-bg absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border shadow-lg">
            <div className="border-border border-b p-2">
              <label className="sr-only" htmlFor="pomodoro-tz-filter">
                Buscar tu país o GMT
              </label>
              <input
                ref={searchRef}
                id="pomodoro-tz-filter"
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Ej. Colombia, España, GMT-5, UTC+0…"
                className={inputClassName}
                autoComplete="off"
              />
              <p className="text-muted mt-1.5 px-1 font-mono text-[10px]">
                {isSearching
                  ? `${filtered.length} desfase(s) encontrado(s)`
                  : `${catalog.length} desfases GMT únicos`}
              </p>
            </div>

            <div
              id="pomodoro-tz-listbox"
              role="listbox"
              aria-label="Desfases GMT"
              className="max-h-[min(280px,40vh)] overflow-y-auto p-2"
            >
              {isSearching && filtered.length === 0 ? (
                <p className="text-muted px-3 py-4 text-sm">
                  No hay resultados. Busca el nombre de tu país (ej.{" "}
                  <span className="text-text">México</span>) o el GMT directamente (ej.{" "}
                  <span className="text-text">GMT-5</span>).
                </p>
              ) : (
                <div className="space-y-0.5">
                  {listOptions.map((option) => (
                    <GmtRow
                      key={option.offsetMinutes}
                      option={option}
                      selected={selectedGmt?.offsetMinutes === option.offsetMinutes}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
