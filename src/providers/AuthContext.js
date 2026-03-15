import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { clearSession, getSession, setSession } from "../utils/session";
import { loginWithEmailPassword, registerBorrower } from "../services/authApi";

export const AuthContext = createContext(null);

function toSafeUser(user) {
  if (!user || typeof user !== "object") return user;
  // json-server stores plaintext passwords in `users`; avoid persisting that in session storage.
  const safe = { ...user };
  delete safe.password;
  return safe;
}

export function AuthProvider({ children }) {
  const [isHydrating, setIsHydrating] = useState(true);
  const [session, setSessionState] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = await getSession();
      if (mounted) {
        setSessionState(saved);
        setIsHydrating(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const user = await loginWithEmailPassword({ email, password });
    const safeUser = toSafeUser(user);
    const next = { user: safeUser, role: safeUser?.role || null };
    await setSession(next);
    setSessionState(next);
    return safeUser;
  }, []);

  const signUpBorrower = useCallback(async ({ name, email, password }) => {
    const user = await registerBorrower({ name, email, password });
    const safeUser = toSafeUser(user);
    const next = { user: safeUser, role: safeUser?.role || "borrower" };
    await setSession(next);
    setSessionState(next);
    return safeUser;
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setSessionState(null);
  }, []);

  const value = useMemo(
    () => ({
      isHydrating,
      session,
      role: session?.role || null,
      signIn,
      signUpBorrower,
      signOut,
    }),
    [isHydrating, session, signIn, signUpBorrower, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

