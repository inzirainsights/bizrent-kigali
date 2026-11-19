/**
 * PROTOTYPE AUTH — simulated in the browser so the sign-in flow can be designed and tested.
 * No password is checked or stored. Replace `signIn`/`signUp`/`signOut` with calls to the
 * shared BizRent auth API; the rest of the UI only depends on this hook's shape.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type SignInMethod = "phone" | "email";

export interface RenterUser {
  id: string;
  name: string;
  method: SignInMethod;
  identifier: string; // +250… or email
}

interface Credentials {
  method: SignInMethod;
  identifier: string;
  password: string;
}

interface AuthValue {
  user: RenterUser | null;
  ready: boolean;
  signIn: (c: Credentials) => Promise<RenterUser>;
  signUp: (c: Credentials & { name: string }) => Promise<RenterUser>;
  signOut: () => void;
}

const KEY = "bizrent.prototype.session";
const AuthContext = createContext<AuthValue | null>(null);

function idFor(identifier: string) {
  let h = 0;
  for (const c of identifier) h = (h * 31 + c.charCodeAt(0)) | 0;
  return `u_${Math.abs(h).toString(36)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<RenterUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const persist = (u: RenterUser | null) => {
    setUser(u);
    if (u) localStorage.setItem(KEY, JSON.stringify(u));
    else localStorage.removeItem(KEY);
  };

  const signIn = useCallback(async ({ method, identifier }: Credentials) => {
    await new Promise((r) => setTimeout(r, 500));
    const u: RenterUser = {
      id: idFor(identifier),
      name: method === "email" ? (identifier.split("@")[0] ?? identifier) : identifier,
      method,
      identifier,
    };
    persist(u);
    return u;
  }, []);

  const signUp = useCallback(async ({ method, identifier, name }: Credentials & { name: string }) => {
    await new Promise((r) => setTimeout(r, 600));
    const u: RenterUser = { id: idFor(identifier), name, method, identifier };
    persist(u);
    return u;
  }, []);

  const signOut = useCallback(() => persist(null), []);

  const value = useMemo(() => ({ user, ready, signIn, signUp, signOut }), [user, ready, signIn, signUp, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
