# SamaSanté

SamaSanté est une plateforme web de téléconsultation médicale permettant aux patients de prendre rendez-vous avec des médecins, de réaliser des consultations vidéo à distance et de consulter leurs ordonnances numériques.

Le projet est réalisé dans le cadre du projet **TeleConsult**.

## Objectif du projet

SamaSanté facilite la mise en relation entre les patients et les médecins à travers une plateforme simple, sécurisée et accessible.

La plateforme permet :

* aux patients de créer un compte ;
* aux médecins de soumettre une demande d’inscription ;
* aux administrateurs de valider ou refuser les médecins ;
* aux patients de rechercher un médecin par spécialité ;
* de réserver un rendez-vous médical ;
* aux médecins d’accepter ou refuser les demandes ;
* de rejoindre une consultation vidéo ;
* de créer et consulter des ordonnances numériques ;
* de gérer les utilisateurs et l’activité de la plateforme.

## Rôles de la plateforme

### Patient

Le patient peut :

* créer un compte ;
* se connecter ;
* consulter les médecins disponibles ;
* rechercher un médecin ;
* filtrer les médecins par spécialité ;
* consulter les créneaux disponibles ;
* réserver un rendez-vous ;
* consulter ses rendez-vous ;
* rejoindre une téléconsultation ;
* consulter ses ordonnances numériques ;
* consulter son profil.

### Médecin

Le médecin peut :

* créer une demande de compte médecin ;
* renseigner sa spécialité ;
* renseigner son numéro de licence ;
* renseigner son expérience professionnelle ;
* définir son tarif de consultation ;
* ajouter une biographie professionnelle ;
* se connecter après validation par un administrateur ;
* ajouter ses disponibilités ;
* consulter les demandes de rendez-vous ;
* accepter ou refuser un rendez-vous ;
* consulter son agenda ;
* rejoindre une téléconsultation ;
* consulter ses patients ;
* rédiger une ordonnance numérique ;
* consulter son profil professionnel.

### Administrateur

L’administrateur peut :

* consulter les statistiques de la plateforme ;
* consulter les utilisateurs ;
* consulter les patients ;
* consulter les médecins ;
* valider un médecin ;
* refuser un médecin ;
* consulter les spécialités ;
* consulter tous les rendez-vous ;
* consulter l’état des consultations ;
* consulter les paramètres de son compte.

## Fonctionnement de l’inscription médecin

Lorsqu’un médecin crée un compte :

1. son compte utilisateur est créé avec le rôle `MEDECIN` ;
2. son profil professionnel est enregistré ;
3. son statut est défini sur `EN_ATTENTE` ;
4. il ne peut pas se connecter immédiatement ;
5. l’administrateur reçoit sa demande ;
6. l’administrateur peut valider ou refuser son profil ;
7. après validation, le médecin peut se connecter à son dashboard.

Les statuts possibles d’un médecin sont :

* `EN_ATTENTE`
* `VALIDE`
* `REFUSE`

## Fonctionnement d’un rendez-vous

Le scénario principal est le suivant :

1. le médecin ajoute une disponibilité ;
2. le patient consulte les médecins ;
3. le patient sélectionne un médecin ;
4. le patient sélectionne un créneau disponible ;
5. le patient indique le motif du rendez-vous ;
6. le médecin reçoit la demande ;
7. le médecin accepte ou refuse le rendez-vous ;
8. lorsque le rendez-vous est accepté, un lien de téléconsultation est créé ;
9. le patient et le médecin peuvent rejoindre la consultation ;
10. le médecin rédige une ordonnance ;
11. le patient peut consulter son ordonnance depuis son dashboard.

## Statuts des rendez-vous

Les rendez-vous peuvent avoir les statuts suivants :

* `EN_ATTENTE`
* `CONFIRME`
* `REFUSE`
* `ANNULE`
* `TERMINE`

## Technologies utilisées

### Frontend

* React.js
* Vite
* React Router
* Axios
* JavaScript
* CSS

### Backend

* Node.js
* Express.js
* MySQL2
* JWT
* bcryptjs
* CORS
* dotenv
* nodemon

### Base de données

* MySQL
* phpMyAdmin
* XAMPP

### Téléconsultation

* Jitsi Meet

## Structure du projet

```text
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
│   │   │   ├── prescriptionController.js
│   │   │   └── specialtyController.js
│   │   ├── middlewares/
│   │   │   └── authMiddleware.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── doctorRoutes.js
│   │   │   ├── prescriptionRoutes.js
│   │   │   └── specialtyRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
│
├── database/
│   └── teleconsult.sql
│
├── frontend/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PatientPrescriptions.jsx
│   │   │   └── PrescriptionForm.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── PatientDashboard.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## Base de données

La base de données utilisée est :

```text
teleconsult_db
```

Elle contient les tables suivantes :

* `users`
* `specialties`
* `doctor_profiles`
* `availabilities`
* `appointments`
* `consultations`
* `prescriptions`
* `prescription_items`

## Description des principales tables

### users

Contient les comptes des patients, médecins et administrateurs.

Principaux rôles :

* `PATIENT`
* `MEDECIN`
* `ADMIN`

### doctor_profiles

Contient les informations professionnelles des médecins :

* spécialité ;
* numéro de licence ;
* biographie ;
* années d’expérience ;
* tarif de consultation ;
* statut de validation.

### availabilities

Contient les créneaux proposés par les médecins.

### appointments

Contient les rendez-vous réservés par les patients.

### consultations

Contient les informations médicales de la consultation :

* symptômes ;
* diagnostic ;
* notes du médecin ;
* date de début ;
* date de fin.

### prescriptions

Contient les ordonnances créées après les consultations.

### prescription_items

Contient les médicaments associés à une ordonnance :

* nom du médicament ;
* dosage ;
* fréquence ;
* durée ;
* instructions.

## Installation du projet

### Prérequis

Avant de démarrer le projet, installer :

* Node.js ;
* npm ;
* XAMPP ;
* MySQL ;
* phpMyAdmin ;
* Git.

## 1. Cloner le projet

```bash
git clone https://github.com/khadijasow6/teleconsult.git
cd teleconsult
```

## 2. Configurer la base de données

Démarrer Apache et MySQL depuis XAMPP.

Ouvrir phpMyAdmin :

```text
http://localhost/phpmyadmin
```

Créer une base de données nommée :

```text
teleconsult_db
```

Importer ensuite le fichier :

```text
database/teleconsult.sql
```

## 3. Configurer le backend

Ouvrir un terminal :

```bash
cd backend
npm install
```

Créer un fichier `.env` dans le dossier `backend` :

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=teleconsult_db

JWT_SECRET=votre_cle_secrete
JWT_EXPIRES_IN=24h
```

Démarrer le backend :

```bash
npm run dev
```

Le backend fonctionne sur :

```text
http://localhost:5000
```

## 4. Configurer le frontend

Ouvrir un deuxième terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend fonctionne sur :

```text
http://localhost:5173
```

## Routes principales de l’API

### Authentification

#### Inscription patient

```http
POST /api/auth/register
```

#### Inscription médecin

```http
POST /api/auth/register-doctor
```

#### Connexion

```http
POST /api/auth/login
```

#### Profil authentifié

```http
GET /api/auth/profile
```

La route protégée nécessite un token JWT :

```text
Authorization: Bearer TOKEN
```

### Spécialités

```http
GET /api/specialties
```

### Médecins

```http
GET /api/doctors
```

```http
GET /api/doctors/:id
```

### Disponibilités et rendez-vous

#### Consulter les créneaux disponibles

```http
GET /api/appointments/available-slots
```

#### Ajouter une disponibilité

```http
POST /api/appointments/availabilities
```

#### Consulter les disponibilités du médecin

```http
GET /api/appointments/doctor/availabilities
```

#### Créer un rendez-vous

```http
POST /api/appointments
```

#### Rendez-vous du patient

```http
GET /api/appointments/patient
```

#### Rendez-vous du médecin

```http
GET /api/appointments/doctor
```

#### Rendez-vous administrateur

```http
GET /api/appointments/admin
```

#### Modifier le statut d’un rendez-vous

```http
PATCH /api/appointments/:id/status
```

### Ordonnances

#### Créer une ordonnance

```http
POST /api/prescriptions
```

#### Consulter les ordonnances du patient

```http
GET /api/prescriptions/patient
```

### Administration

#### Consulter les données du dashboard

```http
GET /api/admin/dashboard
```

#### Valider ou refuser un médecin

```http
PATCH /api/admin/doctors/:id/status
```

Exemple de données envoyées :

```json
{
  "status": "VALIDE"
}
```

ou :

```json
{
  "status": "REFUSE"
}
```

## Sécurité

La plateforme utilise :

* le chiffrement des mots de passe avec `bcryptjs` ;
* l’authentification avec JWT ;
* la protection des routes ;
* la vérification des rôles ;
* la validation des comptes médecins ;
* des requêtes SQL paramétrées ;
* la gestion des erreurs du backend.

## Fonctionnalités réalisées

* Page d’accueil responsive
* Inscription patient
* Inscription médecin
* Connexion sécurisée
* Gestion des rôles
* Validation des médecins
* Dashboard patient
* Dashboard médecin
* Dashboard administrateur
* Recherche de médecins
* Filtrage par spécialité
* Gestion des disponibilités
* Réservation de rendez-vous
* Acceptation et refus des rendez-vous
* Agenda médecin
* Téléconsultation avec Jitsi Meet
* Création d’ordonnances numériques
* Consultation des ordonnances
* Liste des utilisateurs
* Liste des patients
* Liste des médecins
* Liste des spécialités
* Liste des rendez-vous
* Statistiques administrateur
* Interface responsive
* Communication entre React et Express
* Connexion à MySQL

## Améliorations futures

Les évolutions possibles du projet sont :

* ajout d’un système de notifications ;
* envoi d’e-mails de confirmation ;
* récupération du mot de passe ;
* modification du profil utilisateur ;
* ajout d’une photo de profil ;
* paiement en ligne ;
* ajout d’un historique médical complet ;
* téléchargement des ordonnances en PDF ;
* gestion avancée des spécialités ;
* déploiement de la plateforme en ligne ;
* ajout de tests automatisés ;
* documentation Swagger complète.

## Identité visuelle

Tous les espaces de SamaSanté utilisent la même identité visuelle :

* bleu principal ;
* bleu foncé ;
* fond blanc ;
* gris clair ;
* cartes arrondies ;
* boutons modernes ;
* interface responsive ;
* navigation par dashboard.

## Auteur

Projet réalisé par **Khadija Sow**.
