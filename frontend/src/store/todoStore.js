import { create } from "zustand";

export const useTodoStore = create((set) => ({
  todo: {},
  addTodo: (data) => set(() => ({ todo: data })),
  deleteTodo: () => set(() => ({ todo: {} })),
}));
