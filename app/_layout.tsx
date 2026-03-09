import type { Session } from "@supabase/supabase-js";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { AuthProvider } from "../lib/auth-context";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setReady(true);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    supabase
      .from("users")
      .select("is_onboarded")
      .eq("id", session.user.id)
      .single()
      .then(({ data }) => {
        if (data?.is_onboarded) {
          router.replace("/");
        } else {
          router.replace("/onboarding");
        }
      });
  }, [session, ready]);

  return (
    <AuthProvider value={{ session }}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </AuthProvider>
  );
}
