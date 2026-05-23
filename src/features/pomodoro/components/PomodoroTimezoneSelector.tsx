"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    ensureTimeZoneCookie();
    setTimeZoneState(getTimeZone());
    setMounted(true);

    const onUpdate = () => setTimeZoneState(getTimeZone());
    window.addEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, onUpdate);
    return () => window.removeEventListener(POMODORO_TIMEZONE_UPDATED_EVENT, onUpdate);
  }, []);

  const catalog = useMemo(() => getGmtOffsetCatalog(), []);
  const filtered = useMemo(() => searchGmtOffsets(filter), [filter]);
  const selectedGmt = useMemo(
    () => findGmtOffsetByZoneId(timeZone) ?? findGmtOffsetByZoneId(getBrowserTimeZone()),
    [timeZone],
  );

  const handleSelect = (option: GmtOffsetOption) => {
    setTimeZone(option.canonicalZoneId);
    setTimeZoneState(option.canonicalZoneId);
    setListOpen(false);
    setFilter("");
  };

  if (!mounted) return null;

  const browserGmt = findGmtOffsetByZoneId(getBrowserTimeZone());
  const currentOffset = formatGmtOffset(timeZone);
  const isSearching = filter.trim().length > 0;
  const showList = listOpen || isSearching;
  const browserDiffers =
    browserGmt && selectedGmt && browserGmt.offsetMinutes !== selectedGmt.offsetMinutes;

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

      {selectedGmt && (
        <p className="text-muted mb-3 text-sm">
          Seleccionado:{" "}
          <span className="text-text font-medium">{formatGmtOptionLabel(selectedGmt)}</span>
        </p>
      )}

      <label className="text-muted mb-1.5 block text-xs font-medium" htmlFor="pomodoro-tz-filter">
        Buscar tu país o GMT
      </label>
      <input
        id="pomodoro-tz-filter"
        type="search"
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setListOpen(true);
        }}
        onFocus={() => setListOpen(true)}
        placeholder="Ej. Colombia, España, GMT-5, UTC+0…"
        className={`${inputClassName} mb-2`}
        autoComplete="off"
        role="combobox"
        aria-expanded={showList}
        aria-controls="pomodoro-tz-listbox"
        aria-autocomplete="list"
      />

      <p className="text-muted mb-2 font-mono text-[10px]">
        {isSearching
          ? `${filtered.length} desfase(s) encontrado(s)`
          : `${catalog.length} desfases GMT únicos · escribe tu país para filtrar`}
      </p>

      {!showList && (
        <button
          type="button"
          onClick={() => setListOpen(true)}
          className="border-border text-muted hover:bg-surface-hover hover:text-text w-full cursor-pointer rounded-xl border px-3 py-2.5 text-sm transition-colors"
        >
          Ver todos los desfases GMT
        </button>
      )}

      {showList && (
        <div
          id="pomodoro-tz-listbox"
          role="listbox"
          aria-label="Desfases GMT"
          className="border-border bg-bg max-h-[min(320px,45vh)] overflow-y-auto rounded-xl border p-2"
        >
          {browserDiffers && browserGmt && !isSearching && (
            <div className="border-border mb-2 border-b pb-2">
              <p className="text-muted mb-1 px-2 text-[10px] font-medium tracking-wide uppercase">
                Según tu navegador
              </p>
              <GmtRow option={browserGmt} selected={false} onSelect={handleSelect} />
            </div>
          )}

          {isSearching && filtered.length === 0 ? (
            <p className="text-muted px-3 py-4 text-sm">
              No hay resultados. Busca el nombre de tu país (ej.{" "}
              <span className="text-text">México</span>) o el GMT directamente (ej.{" "}
              <span className="text-text">GMT-5</span>).
            </p>
          ) : (
            <div className="space-y-0.5">
              {(isSearching ? filtered : catalog).map((option) => (
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
      )}
    </div>
  );
}
