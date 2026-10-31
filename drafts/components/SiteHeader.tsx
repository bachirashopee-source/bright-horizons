import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bell, Heart, History, LogOut, Menu, Search, Settings, Shield, User, Users } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { signOut, useAuth } from "@/lib/auth";
import { UserBadges } from "./Badges";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Início" },
  { to: "/animes", label: "Animes" },
  { to: "/generos", label: "Gêneros" },
  { to: "/temporadas", label: "Temporadas" },
] as const;

export function SiteHeader() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/busca", search: { q: q.trim(), tab: "todos" } });
  };

  const comingSoon = (what: string) => toast.info(`${what} chega na próxima etapa do AnimesDVX.`);

  return (
    <header className="sticky top-0 z-40 border-b bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menu"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-surface">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <Logo />
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 hover:bg-accent" activeProps={{ className: "bg-accent text-primary" }} activeOptions={{ exact: n.to === "/" }}>
                  {n.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground font-semibold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Animes ou usuários…" className="bg-card pl-9" aria-label="Pesquisar" />
          </div>
        </form>
        <Button asChild variant="ghost" size="icon" className="ml-auto sm:hidden" aria-label="Pesquisar">
          <Link to="/busca" search={{ q: "", tab: "todos" }}><Search /></Link>
        </Button>

        {user ? (
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Notificações" onClick={() => comingSoon("Notificações")}><Bell /></Button>
            <Button variant="ghost" size="icon" aria-label="Amigos" onClick={() => comingSoon("O sistema de amigos")}><Users /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="rounded-full ring-offset-background focus-visible:ring-2 focus-visible:ring-ring" aria-label="Menu do perfil">
                <Avatar className="h-9 w-9 ring-2 ring-primary/50">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback>{profile?.display_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-1">{profile?.display_name} <UserBadges vip={profile?.is_vip} verified={profile?.is_verified} vipExpiresAt={profile?.vip_expires_at} /></div>
                  <div className="text-xs font-normal text-muted-foreground">@{profile?.username}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profile && (
                  <DropdownMenuItem asChild><Link to="/u/$username" params={{ username: profile.username }}><User /> Meu perfil</Link></DropdownMenuItem>
                )}
                <DropdownMenuItem asChild><Link to="/favoritos"><Heart /> Favoritos</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/historico"><History /> Histórico</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/configuracoes"><Settings /> Configurações</Link></DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild><Link to="/admin"><Shield /> Painel admin</Link></DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/", replace: true });
                  }}
                >
                  <LogOut /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button asChild variant="default" className="bg-brand shadow-glow">
            <Link to="/auth">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
