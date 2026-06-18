USE teleconsult_db;

CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    role ENUM('PATIENT', 'MEDECIN', 'ADMIN') NOT NULL DEFAULT 'PATIENT',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS specialties (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS doctor_profiles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL UNIQUE,
    specialty_id INT UNSIGNED NOT NULL,
    license_number VARCHAR(100) NOT NULL UNIQUE,
    biography TEXT,
    years_of_experience INT UNSIGNED DEFAULT 0,
    consultation_price DECIMAL(10, 2) DEFAULT 0,
    validation_status ENUM('EN_ATTENTE', 'VALIDE', 'REFUSE')
        NOT NULL DEFAULT 'EN_ATTENTE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (specialty_id)
        REFERENCES specialties(id)
        ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS availabilities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doctor_profile_id INT UNSIGNED NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('DISPONIBLE', 'RESERVE', 'INDISPONIBLE')
        NOT NULL DEFAULT 'DISPONIBLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (doctor_profile_id)
        REFERENCES doctor_profiles(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS appointments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id INT UNSIGNED NOT NULL,
    availability_id INT UNSIGNED NOT NULL UNIQUE,
    reason TEXT NOT NULL,

    status ENUM(
        'EN_ATTENTE',
        'CONFIRME',
        'REFUSE',
        'ANNULE',
        'TERMINE'
    ) NOT NULL DEFAULT 'EN_ATTENTE',

    meeting_room VARCHAR(255) UNIQUE,
    meeting_url VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (patient_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    FOREIGN KEY (availability_id)
        REFERENCES availabilities(id)
        ON DELETE RESTRICT
);
CREATE TABLE IF NOT EXISTS consultations (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    appointment_id INT UNSIGNED NOT NULL UNIQUE,

    symptoms TEXT,
    diagnosis TEXT,
    doctor_notes TEXT,

    started_at DATETIME,
    ended_at DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (appointment_id)
        REFERENCES appointments(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS prescriptions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    consultation_id INT UNSIGNED NOT NULL UNIQUE,

    instructions TEXT,
    additional_notes TEXT,

    issued_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (consultation_id)
        REFERENCES consultations(id)
        ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS prescription_items (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT UNSIGNED NOT NULL,

    medication_name VARCHAR(190) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    frequency VARCHAR(150) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (prescription_id)
        REFERENCES prescriptions(id)
        ON DELETE CASCADE
);
INSERT IGNORE INTO specialties (name, description)
VALUES
    ('Médecine générale', 'Consultations médicales générales'),
    ('Cardiologie', 'Diagnostic et suivi des maladies du cœur'),
    ('Dermatologie', 'Diagnostic et traitement des maladies de la peau'),
    ('Pédiatrie', 'Suivi médical des enfants'),
    ('Gynécologie', 'Santé et suivi médical de la femme'),
    ('Psychologie', 'Accompagnement et suivi psychologique'),
    ('Ophtalmologie', 'Diagnostic et traitement des maladies des yeux'),
    ('Dentisterie', 'Soins des dents et de la bouche');