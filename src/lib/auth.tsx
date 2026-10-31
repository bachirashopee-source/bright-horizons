import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
type AuthState = { session: Session | null; ready: boolean };

const AuthCtx = createContext<AuthState>({ session: null, ready: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [state, setState] = useState<AuthState>({ session: null, ready: false });

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      setState({ session, ready: true });
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        if (event === "SIGNED_OUT") qc.clear();
        else qc.invalidateQueries();
      }
    });
    supabase.auth.getSession().then(({ data: d }) => setState({ session: d.session, ready: true }));
    return () => data.subscription.unsubscribe();
  }, [qc]);

  return <AuthCtx.Provider value={state}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const { session, ready } = useContext(AuthCtx);
  const userId = session?.user.id ?? null;

  const profile = useQuery({
    queryKey: ["me", "profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const roles = useQuery({
    queryKey: ["me", "roles", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId!);
      if (error) throw error;
      return data.map((r) => r.role);
    },
  });

  const roleList = roles.data ?? [];
  return {
    ready,
    session,
    user: session?.user ?? null,
    userId,
    profile: profile.data ?? null,
    roles: roleList,
    isAdmin: roleList.includes("admin") || roleList.includes("superadmin"),
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}
