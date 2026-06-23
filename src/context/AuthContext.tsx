'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  /** Set of recipe ids the current user has favorited. Empty when logged out. */
  favoritedIds: Set<string>;
  addFavoriteId: (id: string) => void;
  removeFavoriteId: (id: string) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());

  // Fetches the user's favorited recipe ids and stores them in the context Set.
  // One request per session — RecipeCards read from this Set for initial state.
  const loadFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites', { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      setFavoritedIds(
        new Set<string>((data.recipes as { id: string }[]).map((r) => r.id)),
      );
    } catch {
      // Non-critical — cards just start in their default (unfilled) state
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      // credentials: 'include' tells the browser to attach the httpOnly cookie
      // even though JS cannot read it — without this flag same-origin requests
      // also omit cookies in some fetch implementations.
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      const data = await res.json();
      const nextUser = data.user ?? null;
      setUser(nextUser);
      if (nextUser) {
        await loadFavorites();
      } else {
        setFavoritedIds(new Set());
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [loadFavorites]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Login failed');
      setUser(data.user);
      await loadFavorites();
    },
    [loadFavorites],
  );

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Registration failed');
    setUser(data.user);
    setFavoritedIds(new Set()); // new user has no favorites
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
    setFavoritedIds(new Set());
  }, []);

  // Optimistic Set mutations used by RecipeCard to keep context in sync
  // without waiting for a full refresh. Always create a new Set so React
  // detects the reference change and re-renders subscribers.
  const addFavoriteId = useCallback((id: string) => {
    setFavoritedIds((prev) => new Set([...prev, id]));
  }, []);

  const removeFavoriteId = useCallback((id: string) => {
    setFavoritedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        favoritedIds,
        addFavoriteId,
        removeFavoriteId,
        login,
        register,
        logout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
