export const STREAMBETTER_BASE = "https://streambetter.lol/serie/";

/** Monta a URL do player StreamBetter: /serie/{tmdb_id}/{temporada}/{episodio} */
export function buildStreamBetterUrl(tmdbId: number, season: number, episode: number): string {
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) throw new Error("TMDB ID inválido");
  if (!Number.isInteger(season) || season < 0) throw new Error("Temporada inválida");
  if (!Number.isInteger(episode) || episode < 0) throw new Error("Episódio inválido");
  return `${STREAMBETTER_BASE}${tmdbId}/${season}/${episode}`;
}

/** Aceita apenas URLs https válidas. */
export function isValidPlayerUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && !!u.hostname;
  } catch {
    return false;
  }
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
