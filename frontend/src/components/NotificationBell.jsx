import { useCallback, useEffect, useRef, useState } from "react";
import api from "../services/api";

function timeAgo(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

const TYPE_ICONS = {
  RENDEZ_VOUS_CREE: "📅",
  RENDEZ_VOUS_CONFIRME: "✅",
  RENDEZ_VOUS_REFUSE: "❌",
  RENDEZ_VOUS_ANNULE: "🚫",
  MEDECIN_VALIDE: "🎉",
  MEDECIN_REFUSE: "⚠️",
  ORDONNANCE_DISPONIBLE: "📄",
};

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/notifications?limit=15");

      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Erreur chargement notifications :", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await api.get("/notifications/unread-count");
      setUnreadCount(response.data.unread_count || 0);
    } catch (error) {
      console.error("Erreur compteur notifications :", error);
    }
  }, []);

  useEffect(() => {
    loadUnreadCount();

    const interval = setInterval(loadUnreadCount, 25000);

    return () => clearInterval(interval);
  }, [loadUnreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);

    if (next) {
      loadNotifications();
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Erreur marquage notification :", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, is_read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error("Erreur marquage notifications :", error);
    }
  };

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        type="button"
        className="notification-bell-trigger"
        onClick={toggleOpen}
        aria-label="Notifications"
      >
        <span>🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-panel">
          <div className="notification-panel-header">
            <strong>Notifications</strong>

            {unreadCount > 0 && (
              <button type="button" onClick={markAllAsRead}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div className="notification-panel-body">
            {loading && (
              <p className="notification-empty">Chargement...</p>
            )}

            {!loading && notifications.length === 0 && (
              <p className="notification-empty">
                Aucune notification pour le moment.
              </p>
            )}

            {!loading &&
              notifications.map((notification) => (
                <button
                  type="button"
                  key={notification.id}
                  className={`notification-item ${
                    notification.is_read ? "" : "notification-item-unread"
                  }`}
                  onClick={() =>
                    !notification.is_read && markAsRead(notification.id)
                  }
                >
                  <span className="notification-item-icon">
                    {TYPE_ICONS[notification.type] || "🔔"}
                  </span>

                  <span className="notification-item-content">
                    <strong>{notification.title}</strong>
                    <span>{notification.message}</span>
                    <em>{timeAgo(notification.created_at)}</em>
                  </span>

                  {!notification.is_read && (
                    <span className="notification-item-dot" />
                  )}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;