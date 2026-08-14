const db = require("../config/db");

const getUserId = (req) =>
  req.user?.id || req.user?.userId || req.user?.user_id;

// Liste des notifications de l'utilisateur connecté (les plus récentes d'abord)
const getMyNotifications = async (req, res) => {
  try {
    const userId = getUserId(req);
    const limit = Math.min(Number(req.query.limit) || 20, 100);

    const [notifications] = await db.query(
      `
        SELECT
          id,
          type,
          title,
          message,
          related_appointment_id,
          is_read,
          created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ?
      `,
      [userId, limit]
    );

    const [[{ unread_count }]] = await db.query(
      `
        SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = ? AND is_read = FALSE
      `,
      [userId]
    );

    return res.status(200).json({
      notifications,
      unread_count,
    });
  } catch (error) {
    console.error("Erreur récupération notifications :", error);

    return res.status(500).json({
      message: "Impossible de récupérer les notifications.",
    });
  }
};

// Compteur seul (utilisé pour le polling léger de la cloche)
const getUnreadCount = async (req, res) => {
  try {
    const userId = getUserId(req);

    const [[{ unread_count }]] = await db.query(
      `
        SELECT COUNT(*) AS unread_count
        FROM notifications
        WHERE user_id = ? AND is_read = FALSE
      `,
      [userId]
    );

    return res.status(200).json({ unread_count });
  } catch (error) {
    console.error("Erreur compteur notifications :", error);

    return res.status(500).json({
      message: "Impossible de récupérer le compteur de notifications.",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);
    const notificationId = req.params.id;

    const [result] = await db.query(
      `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ? AND user_id = ?
      `,
      [notificationId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Notification introuvable.",
      });
    }

    return res.status(200).json({
      message: "Notification marquée comme lue.",
    });
  } catch (error) {
    console.error("Erreur mise à jour notification :", error);

    return res.status(500).json({
      message: "Impossible de mettre à jour cette notification.",
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = getUserId(req);

    await db.query(
      `
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ? AND is_read = FALSE
      `,
      [userId]
    );

    return res.status(200).json({
      message: "Toutes les notifications ont été marquées comme lues.",
    });
  } catch (error) {
    console.error("Erreur mise à jour notifications :", error);

    return res.status(500).json({
      message: "Impossible de mettre à jour les notifications.",
    });
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};