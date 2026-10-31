import { Link } from "@tanstack/react-router";
import { Film } from "lucide-react";
import { ANIME_STATUS_LABEL, isRecent, type AnimeCardData } from "@/lib/anime";
import { Skeleton } from "@/components/ui/skeleton";

export function AnimeCard({ anime }: { anime: AnimeCardData }) {
  const eps = anime.episodes?.[0]?.count ?? 0;
  return (
    <Link
      to="/anime/$slug"
      params={{ slug: anime.slug }}
      className="group block w-full"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-card ring-1 ring-border transition-all duration-300 group-hover:-translate-y-1 group-hover:ring-primary group-hover:shadow-glow">
        {anime.poster_url ? (
          <img
            src={anime.poster_url}
            alt={anime.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <Film className="h-10 w-10" />
          </div>
        )}
        <div className="absolute left-2 top-2 flex gap-1">
          <span className="rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-bold backdrop-blur">
            {anime.age_rating}
          </span>
          {isRecent(anime.updated_at) && eps > 0 && (
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">NOVO EP</span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-fade-bottom p-2 pt-8 text-[11px] text-muted-foreground">
          {ANIME_STATUS_LABEL[anime.status]} · {eps} ep{eps === 1 ? "" : "s"}
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-tight group-hover:text-primary">{anime.title}</h3>
      {anime.release_year && <p className="text-xs text-muted-foreground">{anime.release_year}</p>}
    </Link>
  );
}

export function AnimeCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
    </div>
  );
}

export function AnimeGrid({ animes, loading }: { animes?: AnimeCardData[]; loading?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {loading
        ? Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)
        : animes?.map((a) => <AnimeCard key={a.id} anime={a} />)}
    </div>
  );
}
