import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  fullName: string;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  fullName: "",
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN" && newSession?.user) {
        const u = newSession.user;
        // Registrar el acceso (fecha, hora, correo y nombre)
        setTimeout(() => {
          supabase
            .from("login_events")
            .insert({
              user_id: u.id,
              email: u.email,
              full_name:
                (u.user_metadata?.full_name as string) ||
                (u.user_metadata?.name as string) ||
                "",
              event_type: "login",
              user_agent: navigator.userAgent,
            })
            .then(() => undefined);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const fullName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email?.split("@")[0] ||
    "";

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, fullName, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
