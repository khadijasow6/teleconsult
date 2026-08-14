-- Migration : ajout du système de notifications
-- À exécuter sur la base teleconsult_db existante (via phpMyAdmin ou mysql CLI)

USE teleconsult_db;

CREATE TABLE IF NOT EXISTS notifications (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,

    type ENUM(
        'RENDEZ_VOUS_CREE',
        'RENDEZ_VOUS_CONFIRME',
        'RENDEZ_VOUS_REFUSE',
        'RENDEZ_VOUS_ANNULE',
        'MEDECIN_VALIDE',
        'MEDECIN_REFUSE',
        'ORDONNANCE_DISPONIBLE'
    ) NOT NULL,

    title VARCHAR(190) NOT NULL,
    message TEXT NOT NULL,

    related_appointment_id INT UNSIGNED DEFAULT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (related_appointment_id)
        REFERENCES appointments(id)
        ON DELETE SET NULL,

    INDEX idx_notifications_user (user_id, is_read, created_at)
);