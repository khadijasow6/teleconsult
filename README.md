SamaSanté

SamaSanté est une plateforme web de téléconsultation médicale permettant aux patients de prendre rendez-vous avec des médecins, de réaliser des consultations vidéo à distance, de payer en ligne et de consulter leurs ordonnances numériques.

Le projet est réalisé dans le cadre du projet TeleConsult.

Objectif du projet

SamaSanté facilite la mise en relation entre les patients et les médecins à travers une plateforme simple, sécurisée et accessible.

La plateforme permet :

aux patients de créer un compte ;
aux médecins de soumettre une demande d'inscription ;
aux administrateurs de valider ou refuser les médecins ;
aux patients de rechercher un médecin par spécialité ;
de réserver un rendez-vous médical ;
de payer une consultation en ligne (Wave / Orange Money) ;
aux médecins d'accepter ou refuser les demandes ;
de rejoindre une consultation vidéo ;
de créer et consulter des ordonnances numériques ;
de télécharger les ordonnances au format PDF ;
de consulter un historique médical complet ;
de recevoir des notifications in-app et par e-mail ;
de réinitialiser son mot de passe en cas d'oubli ;
de gérer les utilisateurs et l'activité de la plateforme.
Rôles de la plateforme
Patient

Le patient peut :

créer un compte ;
se connecter ;
réinitialiser son mot de passe en cas d'oubli ;
consulter les médecins disponibles ;
rechercher un médecin ;
filtrer les médecins par spécialité ;
consulter les créneaux disponibles ;
réserver un rendez-vous ;
payer sa consultation en ligne (Wave ou Orange Money) ;
consulter ses rendez-vous ;
rejoindre une téléconsultation ;
consulter ses ordonnances numériques ;
télécharger ses ordonnances en PDF ;
consulter son historique médical complet ;
recevoir des notifications in-app et par e-mail ;
consulter son profil.
Médecin

Le médecin peut :

créer une demande de compte médecin ;
renseigner sa spécialité ;
renseigner son numéro de licence ;
renseigner son expérience professionnelle ;
définir son tarif de consultation ;
ajouter une biographie professionnelle ;
se connecter après validation par un administrateur ;
réinitialiser son mot de passe en cas d'oubli ;
ajouter ses disponibilités ;
consulter les demandes de rendez-vous ;
accepter ou refuser un rendez-vous ;
consulter son agenda ;
rejoindre une téléconsultation ;
consulter ses patients ;
rédiger une ordonnance numérique ;
recevoir des notifications in-app et par e-mail ;
consulter son profil professionnel.
Administrateur

L'administrateur peut :

consulter les statistiques de la plateforme ;
consulter les utilisateurs ;
consulter les patients ;
consulter les médecins ;
valider un médecin ;
refuser un médecin ;
consulter les spécialités ;
consulter tous les rendez-vous ;
consulter l'état des consultations ;
consulter les paramètres de son compte.
Fonctionnement de l'inscription médecin

Lorsqu'un médecin crée un compte :

son compte utilisateur est créé avec le rôle MEDECIN ;
son profil professionnel est enregistré ;
son statut est défini sur EN_ATTENTE ;
il ne peut pas se connecter immédiatement ;
l'administrateur reçoit sa demande ;
l'administrateur peut valider ou refuser son profil (le médecin est notifié in-app et par e-mail) ;
après validation, le médecin peut se connecter à son dashboard.

Les statuts possibles d'un médecin sont :

EN_ATTENTE
VALIDE
REFUSE
Fonctionnement d'un rendez-vous

Le scénario principal est le suivant :

le médecin ajoute une disponibilité ;
le patient consulte les médecins ;
le patient sélectionne un médecin ;
le patient sélectionne un créneau disponible ;
le patient indique le motif du rendez-vous ;
le patient paie sa consultation en ligne (Wave ou Orange Money) ;
une fois le paiement confirmé, le médecin reçoit la demande (notification in-app et e-mail) ;
le médecin accepte ou refuse le rendez-vous (le patient est notifié) ;
lorsque le rendez-vous est accepté, un lien de téléconsultation est créé ;
le patient et le médecin peuvent rejoindre la consultation ;
le médecin rédige une ordonnance (le patient est notifié) ;
le patient peut consulter son ordonnance depuis son dashboard, la télécharger en PDF, et retrouver l'ensemble de sa consultation dans son historique médical.
Statuts des rendez-vous

Les rendez-vous peuvent avoir les statuts suivants :

EN_ATTENTE_PAIEMENT
EN_ATTENTE
CONFIRME
REFUSE
ANNULE
TERMINE
Système de paiement

Le paiement en ligne est actuellement simulé afin de permettre la démonstration complète du parcours patient sans nécessiter de compte marchand Wave ou Orange Money (procédure d'agrément professionnel non accessible dans le cadre de ce projet académique). Le patient choisit son mode de paiement, saisit un numéro de téléphone, puis confirme via un code de vérification simulé (équivalent au SMS envoyé par les opérateurs réels).

L'architecture (table payments, statuts, références de transaction) a été conçue pour permettre une intégration future des API réelles Wave et Orange Money sans modification structurelle majeure.

Système de notifications

Chaque événement clé de la plateforme déclenche une notification :

affichée dans l'application (cloche de notifications, avec compteur de messages non lus) ;
envoyée par e-mail au destinataire concerné.

Événements notifiés : nouvelle demande de rendez-vous, confirmation ou refus d'un rendez-vous, validation ou refus d'un médecin, nouvelle ordonnance disponible.

Technologies utilisées
Frontend
React.js
Vite
React Router
Axios
JavaScript
CSS
Backend
Node.js
Express.js
MySQL2
JWT
bcryptjs
CORS
dotenv
nodemon
Nodemailer (envoi d'e-mails)
PDFKit (génération de documents PDF)
Base de données
MySQL
phpMyAdmin
XAMPP
Téléconsultation
Jitsi Meet
Services externes
Mailtrap (service d'envoi d'e-mails transactionnels)
Structure du projet
teleconsult/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── appointmentController.js
│   │   │   ├── authController.js
│   │   │   ├── doctorController.js
│   │   │   ├── medicalHistoryController.js
│   │   │   ├── notificationController.js
│   │   │   ├── paymentController.js
│   │   │   ├── prescriptionController.js
│   │   │   └── specialtyController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   ├── medicalHistoryRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── paymentRoutes.js
│   │   │   ├── prescriptionRoutes.js
│   │   │   └── specialtyRoutes.js
│   │   ├── utils/
│   │   │   ├── mailer.js
│   │   │   └── notify.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── database/
│   ├── teleconsult.sql
│   └── migration_notifications.sql
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MedicalHistory.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── PatientPrescriptions.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   └── PrescriptionForm.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
Base de données

La base de données utilisée est :

teleconsult_db

Elle contient les tables suivantes :

users
specialties
doctor_profiles
availabilities
appointments
consultations
prescriptions
prescription_items
notifications
payments
password_resets
Description des principales tables

users
Contient les comptes des patients, médecins et administrateurs.

Principaux rôles :

PATIENT
MEDECIN
ADMIN

doctor_profiles
Contient les informations professionnelles des médecins :

spécialité ;
numéro de licence ;
biographie ;
années d'expérience ;
tarif de consultation ;
statut de validation.

availabilities
Contient les créneaux proposés par les médecins.

appointments
Contient les rendez-vous réservés par les patients.

consultations
Contient les informations médicales de la consultation :

symptômes ;
diagnostic ;
notes du médecin ;
date de début ;
date de fin.

prescriptions
Contient les ordonnances créées après les consultations.

prescription_items
Contient les médicaments associés à une ordonnance :

nom du médicament ;
dosage ;
fréquence ;
durée ;
instructions.

notifications
Contient les notifications in-app envoyées aux utilisateurs :

type de notification ;
titre et message ;
rendez-vous lié (le cas échéant) ;
statut lu / non lu.

payments
Contient les paiements liés aux rendez-vous :

méthode de paiement (Wave / Orange Money) ;
numéro de téléphone ;
montant ;
statut (en attente, payé, échec) ;
référence de transaction.

password_resets
Contient les demandes de réinitialisation de mot de passe :

token unique ;
date d'expiration ;
statut d'utilisation.
Installation du projet
Prérequis

Avant de démarrer le projet, installer :

Node.js ;
npm ;
XAMPP ;
MySQL ;
phpMyAdmin ;
Git.
1. Cloner le projet
git clone https://github.com/khadijasow6/teleconsult.git
cd teleconsult
2. Configurer la base de données

Démarrer Apache et MySQL depuis XAMPP.

Ouvrir phpMyAdmin :

http://localhost/phpmyadmin

Créer une base de données nommée :

teleconsult_db

Importer ensuite le fichier :

database/teleconsult.sql
3. Configurer le backend

Ouvrir un terminal :

cd backend
npm install

Créer un fichier .env dans le dossier backend :

PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=teleconsult_db

JWT_SECRET=votre_cle_secrete
JWT_EXPIRES_IN=24h

SMTP_HOST=live.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=api
SMTP_PASS=votre_token_mailtrap
SMTP_FROM="SamaSanté <no-reply@votredomaine.co>"

Démarrer le backend :

npm run dev

Le backend fonctionne sur :

http://localhost:5000
4. Configurer le frontend

Ouvrir un deuxième terminal :

cd frontend
npm install
npm run dev

Le frontend fonctionne sur :

http://localhost:5173
Routes principales de l'API
Authentification
Inscription patient : POST /api/auth/register
Inscription médecin : POST /api/auth/register-doctor
Connexion : POST /api/auth/login
Profil authentifié : GET /api/auth/profile
Demande de réinitialisation de mot de passe : POST /api/auth/forgot-password
Réinitialisation du mot de passe : POST /api/auth/reset-password

La route protégée nécessite un token JWT :

Authorization: Bearer TOKEN
Spécialités
GET /api/specialties
Médecins
GET /api/doctors
GET /api/doctors/:id
Disponibilités et rendez-vous
Consulter les créneaux disponibles : GET /api/appointments/available-slots
Ajouter une disponibilité : POST /api/appointments/availabilities
Consulter les disponibilités du médecin : GET /api/appointments/doctor/availabilities
Créer un rendez-vous : POST /api/appointments
Rendez-vous du patient : GET /api/appointments/patient
Rendez-vous du médecin : GET /api/appointments/doctor
Rendez-vous administrateur : GET /api/appointments/admin
Modifier le statut d'un rendez-vous : PATCH /api/appointments/:id/status
Paiements
Initier un paiement : POST /api/payments/initiate
Confirmer un paiement : POST /api/payments/confirm
Consulter le paiement d'un rendez-vous : GET /api/payments/appointment/:appointmentId
Ordonnances
Créer une ordonnance : POST /api/prescriptions
Consulter les ordonnances du patient : GET /api/prescriptions/patient
Télécharger une ordonnance en PDF : GET /api/prescriptions/:id/pdf
Historique médical
Historique médical du patient connecté : GET /api/medical-history
Historique médical d'un patient (vue médecin) : GET /api/medical-history/patient/:patientId
Notifications
Consulter mes notifications : GET /api/notifications
Compteur de notifications non lues : GET /api/notifications/unread-count
Marquer une notification comme lue : PATCH /api/notifications/:id/read
Marquer toutes les notifications comme lues : PATCH /api/notifications/read-all
Administration
Consulter les données du dashboard : GET /api/admin/dashboard
Valider ou refuser un médecin : PATCH /api/admin/doctors/:id/status

Exemple de données envoyées :

json
{
  "status": "VALIDE"
}

ou :

json
{
  "status": "REFUSE"
}
Sécurité

La plateforme utilise :

le chiffrement des mots de passe avec bcryptjs ;
l'authentification avec JWT ;
la protection des routes ;
la vérification des rôles ;
la validation des comptes médecins ;
des requêtes SQL paramétrées ;
des tokens de réinitialisation de mot de passe à usage unique et à durée limitée (1 heure) ;
la gestion des erreurs du backend.
Fonctionnalités réalisées
Page d'accueil responsive
Inscription patient
Inscription médecin
Connexion sécurisée
Réinitialisation de mot de passe par e-mail
Gestion des rôles
Validation des médecins
Dashboard patient
Dashboard médecin
Dashboard administrateur
Recherche de médecins
Filtrage par spécialité
Gestion des disponibilités
Réservation de rendez-vous
Paiement en ligne simulé (Wave / Orange Money)
Acceptation et refus des rendez-vous
Agenda médecin
Téléconsultation avec Jitsi Meet
Création d'ordonnances numériques
Consultation des ordonnances
Téléchargement des ordonnances en PDF
Historique médical complet (frise chronologique)
Notifications in-app et par e-mail
Liste des utilisateurs
Liste des patients
Liste des médecins
Liste des spécialités
Liste des rendez-vous
Statistiques administrateur
Interface responsive
Communication entre React et Express
Connexion à MySQL
Améliorations futures

Les évolutions possibles du projet sont :

intégration des API réelles Wave et Orange Money (compte marchand professionnel) ;
ajout de rappels par SMS en complément des notifications in-app et e-mail ;
modification du profil utilisateur (au-delà de la photo déjà disponible) ;
gestion avancée des spécialités ;
déploiement de la plateforme en ligne ;
ajout de tests automatisés ;
documentation Swagger complète.
Identité visuelle

Tous les espaces de SamaSanté utilisent la même identité visuelle :

bleu principal ;
bleu foncé ;
fond blanc ;
gris clair ;
cartes arrondies ;
boutons modernes ;
interface responsive ;
navigation par dashboard.

Projet réalisé par **Khadija Sow**.
