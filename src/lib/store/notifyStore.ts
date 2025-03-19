import { create } from "zustand";

interface Notification {
  id: number;
  message: string;
}

interface NotifyStore {
  notifications: Notification[];
  addNotification: (message: string) => void;
  removeNotification: (id: number) => void;
}

export const useNotifyStore = create<NotifyStore>((set) => ({
  notifications: [],

  addNotification: (message) => {
    const id = Date.now(); // Unique ID based on timestamp
    set((state) => ({
      notifications: [...state.notifications, { id, message }],
    }));

    // Auto-remove after 3 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 3000);
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
}));
