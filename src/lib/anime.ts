import type { Tables } from "@/integrations/supabase/types";

export type Anime = Tables<"animes">;
export type Season = Tables<"seasons">;
export type Episode = Tables<"episodes">;

export const ANIME_STATUS_LABEL: Record<Anime["status"], string> = {
  em_lancamento: "Em lançamento",
  finalizado: "Finalizado",
  em_breve: "Em breve",
  pausado: "Pausado",
};

export const AGE_RATINGS = ["L", "10", "12", "14", "16", "18"] as const;

export const GENRES = [
  "Ação", "Aventura", "Comédia", "Drama", "Fantasia", "Ficção Científica", "Isekai",
  "Mecha", "Mistério", "Psicológico", "Romance", "Seinen", "Shoujo", "Shounen",
  "Slice of Life", "Esportes", "Sobrenatural", "Suspense", "Terror", "Música",
] as const;

/** Campos usados em cards (evita trazer colunas desnecessárias). */
export const CARD_FIELDS =
  "id, slug, title, poster_url, release_year, age_rating, status, updated_at, episodes(count)";

export type AnimeCardData = Pick<
  Anime,
  "id" | "slug" | "title" | "poster_url" | "release_year" | "age_rating" | "status" | "updated_at"
> & { episodes?: { count: number }[] };

export function isRecent(date: string | null | undefined, days = 7) {
  if (!date) return false;
  return Date.now() - new Date(date).getTime() < days * 86400000;
}
