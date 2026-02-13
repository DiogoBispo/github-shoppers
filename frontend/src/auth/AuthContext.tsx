import React, { createContext, useContext, useMemo, useState } from "react";
import { clearToken, getToken, setToken } from "../api/http";

type AuthState = {
  token: string | null;
  isAuthed: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [tokenState, setTokenState] = useState<string | null>(getToken());

  const value = useMemo<AuthState>(
    () => ({
      token: tokenState,
      isAuthed: !!tokenState,
      login: (token: string) => {
        setToken(token);
        setTokenState(token);
      },
      logout: () => {
        clearToken();
        setTokenState(null);
      },
    }),
    [tokenState],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
