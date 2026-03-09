import type { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

type AuthContextType = {
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({ session: null });

export const AuthProvider = AuthContext.Provider;

export function useSession() {
  return useContext(AuthContext).session;
}

export function useUser() {
  const session = useSession();
  if (!session) return null;

  const { user } = session;
  const meta = user.user_metadata;

  return {
    id: user.id,
    email: user.email!,
    name: (meta.full_name ?? meta.name ?? "") as string,
    avatar: (meta.avatar_url ?? null) as string | null,
  };
}
