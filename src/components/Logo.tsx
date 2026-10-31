import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-baseline font-display text-2xl font-bold tracking-tight ${className}`}>
      <span className="text-foreground">Animes</span>
      <span className="text-brand transition-all group-hover:drop-shadow-[0_0_12px_var(--primary)]">DVX</span>
    </Link>
  );
}
