"use client";
import { useNotifyStore } from "../../lib/store/notifyStore";

export default function Notification() {
  const { notifications, removeNotification } = useNotifyStore();

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        zIndex: 1000,
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            backgroundColor: "#333",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            opacity: 1,
            transition: "all 0.3s ease",
          }}
        >
          {notification.message}
          <button
            onClick={() => removeNotification(notification.id)}
            style={{
              marginLeft: "12px",
              background: "transparent",
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
