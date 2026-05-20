import { cookies } from "next/headers";
import { parseTheme, THEME_COOKIE_KEY, type Theme } from "@/lib/theme";

/** Tema para el primer HTML; sin cookie → `dark` (theme-init ajusta la primera visita). */
export async function getServerTheme(): Promise<Theme> {
  const store = await cookies();
  return parseTheme(store.get(THEME_COOKIE_KEY)?.value) ?? "dark";
}
