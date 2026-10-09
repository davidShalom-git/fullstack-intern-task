import { create } from "zustand";

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("forma-user") || "null");
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("forma-token"),
  user: readSavedUser(),

  signIn: (session) => {
    localStorage.setItem("forma-token", session.token);
    localStorage.setItem("forma-user", JSON.stringify(session.user));
    set({ token: session.token, user: session.user });
  },

  signOut: () => {
    localStorage.removeItem("forma-token");
    localStorage.removeItem("forma-user");
    set({ token: null, user: null });
  },
}));
