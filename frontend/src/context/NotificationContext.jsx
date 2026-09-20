import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { getToken } from "../services/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setToast(null);
      return;
    }

    const token = getToken();
    if (!token) return;

    const socket = io(API_URL, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Notification socket connected for user:", user.name || user.id);
    });

    socket.on("new_message_notification", (data) => {
      const newNotif = {
        id: Date.now() + Math.random().toString(),
        sessionId: data.sessionId,
        sessionSkill: data.sessionSkill,
        senderName: data.senderName,
        text: data.text,
        createdAt: data.createdAt || new Date().toISOString(),
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      setToast(newNotif);

      // Auto-dismiss toast after 5 seconds
      setTimeout(() => {
        setToast((current) => (current?.id === newNotif.id ? null : current));
      }, 5000);
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const dismissToast = () => {
    setToast(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toast,
        markAllAsRead,
        clearNotifications,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
}
