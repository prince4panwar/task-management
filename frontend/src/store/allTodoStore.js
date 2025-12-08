import { create } from "zustand";

export const useAllTodoStore = create((set) => ({
  allTodo: [],
  addAllTodo: (data) => set(() => ({ allTodo: data })),
  deleteAllTodo: () => set(() => ({ allTodo: [] })),
}));
