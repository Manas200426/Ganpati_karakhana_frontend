import { create } from "zustand";

const useAuthStore = create((set) => ({
  admin: null,

  token: localStorage.getItem("token") || null,

  setAuth: (data) => {
    localStorage.setItem("token", data.token);

    set({
      admin: data.admin,
      token: data.token,
    });
  },

  logout: () => {
    localStorage.removeItem("token");

    set({
      admin: null,
      token: null,
    });
  },
}));

export default useAuthStore;
