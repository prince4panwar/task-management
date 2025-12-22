import { create } from "zustand";

export const useSidebarStore = create((set) => ({
  sidebar: localStorage.getItem("showSidebar") === "true" ? true : false,

  setSidebar: (newSidebar) => {
    localStorage.setItem("showSidebar", newSidebar);
    set({ sidebar: newSidebar });
  },

  isSidebarVisible: () => {
    if (sidebar === "true") {
      true;
    } else {
      false;
    }
  },

  toggleSidebar: () =>
    set((state) => {
      const newLocalSidebar = state.sidebar === true ? "false" : "true";
      const newSidebar = state.sidebar === true ? false : true;
      localStorage.setItem("showSidebar", newLocalSidebar);
      return { sidebar: newSidebar };
    }),
}));
