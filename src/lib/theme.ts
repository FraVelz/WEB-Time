export type Theme = "light" | "dark";

/** Nombre de la cookie; debe coincidir con `public/theme-init.js`. */
export const THEME_COOKIE_KEY = "web-time-theme";

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseTheme(value: string | undefined | null): Theme | null {
  return value === "light" || value === "dark" ? value : null;
}

export function getThemeFromCookie(): Theme | null {
  if (typeof document === "undefined") return null;
  const escaped = THEME_COOKIE_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return parseTheme(match ? decodeURIComponent(match[1]) : null);
}

export function setThemeCookie(theme: Theme) {
  if (typeof document === "undefined") return;
  document.cookie = `${THEME_COOKIE_KEY}=${theme};path=/;max-age=${THEME_COOKIE_MAX_AGE};SameSite=Lax`;
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
}

/** DOM y cookie (el servidor lee la cookie en el siguiente request). */
export function persistTheme(theme: Theme) {
  applyTheme(theme);
  setThemeCookie(theme);
}

export function getThemeFromDocument(): Theme {
  const value = document.documentElement.dataset.theme;
  return value === "light" || value === "dark" ? value : "dark";
}

export function resolveInitialTheme(): Theme {
  const fromCookie = getThemeFromCookie();
  if (fromCookie) return fromCookie;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
