import {
useCallback,
useEffect,
useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function AdminDashboard() {
const navigate = useNavigate();

const storedUser = localStorage.getItem("user");
const [activeSection, setActiveSection] = useState("home");

const menuClass = (sectionName) =>
activeSection === sectionName
? "dashboard-menu-item active"
: "dashboard-menu-item";

const user = storedUser
? JSON.parse(storedUser)
: {
first_name: "Khadija",
last_name: "Sow",
};
const [statistics, setStatistics] = useState({
total_users: 0,
total_patients: 0,
total_doctors: 0,
pending_doctors: 0,
total_appointments: 0,
pending_appointments: 0,
});

const [users, setUsers] = useState([]);
const [doctors, setDoctors] = useState([]);
const [appointments, setAppointments] = useState([]);
const [specialties, setSpecialties] = useState([]);
const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const loadAdminDashboard = useCallback(async () => {
try {
setLoading(true);
setError("");


const [
dashboardResponse,
specialtiesResponse,
] = await Promise.all([
api.get("/admin/dashboard"),
api.get("/specialties"),
]);

setStatistics(
dashboardResponse.data.statistics
);

setUsers(
dashboardResponse.data.users || []
);

setDoctors(
dashboardResponse.data.doctors || []
);

setAppointments(
dashboardResponse.data.appointments || []
);

setSpecialties(
specialtiesResponse.data.specialties || []
);



} catch (requestError) {
console.error(requestError);


setError(
  requestError.response?.data?.message ||
    "Impossible de charger le dashboard administrateur."
);


} finally {
setLoading(false);
}
}, []);

useEffect(() => {
loadAdminDashboard();
}, [loadAdminDashboard]);
const pendingDoctors = doctors.filter(
(doctor) =>
doctor.validation_status === "EN_ATTENTE"
);
const recentUsers = users.slice(0, 3);
const patientUsers = users.filter(
(currentUser) => currentUser.role === "PATIENT"
);

const handleDoctorStatus = async (
doctorProfileId,
status
) => {
try {
setMessage("");
setError("");


const response = await api.patch(
  `/admin/doctors/${doctorProfileId}/status`,
  { status }
);

setMessage(response.data.message);
await loadAdminDashboard();


} catch (requestError) {
setError(
requestError.response?.data?.message ||
"Impossible de modifier le statut du médecin."
);
}
};
const formatDateTime = (dateValue) => {
if (!dateValue) {
return "Date non disponible";
}

return new Date(dateValue).toLocaleString("fr-FR", {
dateStyle: "long",
timeStyle: "short",
});
};

const getAppointmentStatus = (status) => {
const statuses = {
EN_ATTENTE: "En attente",
CONFIRME: "Confirmé",
REFUSE: "Refusé",
ANNULE: "Annulé",
TERMINE: "Terminé",
};

return statuses[status] || status;
};


const confirmedAppointments = appointments.filter(
(appointment) => appointment.status === "CONFIRME"
);

const pendingAppointments = appointments.filter(
(appointment) => appointment.status === "EN_ATTENTE"
);

const completedAppointments = appointments.filter(
(appointment) => appointment.status === "TERMINE"
);

const refusedAppointments = appointments.filter(
(appointment) => appointment.status === "REFUSE"
);

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

return ( <div className="dashboard-layout"> <aside className="dashboard-sidebar"> <div className="dashboard-logo"> <span className="logo-symbol">✚</span> <span>SamaSanté</span> </div>

    <nav className="dashboard-menu">
  <button
    type="button"
    className={menuClass("home")}
    onClick={() => setActiveSection("home")}
  >
    <span>▦</span>
    Tableau de bord
  </button>

<button
type="button"
className={menuClass("users")}
onClick={() => setActiveSection("users")}

>

<span>👥</span>

Utilisateurs


  </button>

<button
type="button"
className={menuClass("doctors")}
onClick={() => setActiveSection("doctors")}

>
<span>🩺</span>
Médecins

  </button>

<button
type="button"
className={menuClass("patients")}
onClick={() => setActiveSection("patients")}

>

<span>🧑‍🤝‍🧑</span>

Patients


  </button>

<button
type="button"
className={menuClass("specialties")}
onClick={() => setActiveSection("specialties")}

>

<span>🏥</span>

Spécialités

  </button>

<button
type="button"
className={menuClass("appointments")}
onClick={() => setActiveSection("appointments")}

>

<span>📅</span>

Rendez-vous

  </button>

<button
type="button"
className={menuClass("statistics")}
onClick={() => setActiveSection("statistics")}

>

<span>📊</span>

Statistiques

  </button>

<button
type="button"
className={menuClass("settings")}
onClick={() => setActiveSection("settings")}

>


<span>⚙️</span>

Paramètres


  </button>
</nav>


    <button
      type="button"
      className="dashboard-logout"
      onClick={handleLogout}
    >
      <span>↪</span>
      Déconnexion
    </button>
  </aside>

  <main className="dashboard-main">
    <header className="dashboard-header">
      <div>
        <p className="dashboard-welcome">Espace administrateur</p>

        <h1>
          Bonjour, {user.first_name} {user.last_name}
        </h1>

        <p>
          Gérez les utilisateurs, les médecins et l’activité de SamaSanté.
        </p>
      </div>

      <div className="dashboard-user">
        <div className="dashboard-user-avatar">
          {user.first_name?.charAt(0)}
          {user.last_name?.charAt(0)}
        </div>

        <div>
          <strong>
            {user.first_name} {user.last_name}
          </strong>
          <span>Administrateur</span>
        </div>
      </div>
    </header>
    {activeSection === "home" && (
<>



    <section className="dashboard-statistics">
      <article className="dashboard-stat-card">
        <div className="stat-icon">👥</div>

        <div>
          <span>Utilisateurs inscrits</span>
         <strong>{statistics.total_users}</strong>

        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">🩺</div>

        <div>
          <span>Médecins actifs</span>
          <strong>{statistics.total_doctors}</strong>

        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">📅</div>

        <div>
          <span>Rendez-vous</span>
         <strong>{statistics.total_appointments}</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">⏳</div>

        <div>
          <span>Médecins à valider</span>
       <strong>{statistics.pending_doctors}</strong>
        </div>
      </article>
    </section>

    <section className="dashboard-grid">
      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Validation</span>
            <h2>Demandes des médecins</h2>
          </div>

          <button type="button" className="dashboard-text-button">
            Tout afficher
          </button>
        </div>

      <div className="appointment-list">
  {pendingDoctors.length === 0 && (
    <p>Aucun médecin en attente de validation.</p>
  )}

{pendingDoctors.slice(0, 3).map((doctor) => ( <div
   className="appointment-list-item"
   key={doctor.doctor_profile_id}
 > <div className="dashboard-user-avatar">
{doctor.first_name?.charAt(0)}
{doctor.last_name?.charAt(0)} </div>


  <div>
    <h3>
      Dr {doctor.first_name} {doctor.last_name}
    </h3>

    <p>
      {doctor.specialty_name} · Licence :{" "}
      {doctor.license_number}
    </p>
  </div>

  <div className="doctor-request-actions">
    <button
      type="button"
      className="request-accept-button"
      onClick={() =>
        handleDoctorStatus(
          doctor.doctor_profile_id,
          "VALIDE"
        )
      }
    >
      Valider
    </button>

    <button
      type="button"
      className="request-refuse-button"
      onClick={() =>
        handleDoctorStatus(
          doctor.doctor_profile_id,
          "REFUSE"
        )
      }
    >
      Refuser
    </button>
  </div>
</div>


))}

</div>

      </article>

      <article className="dashboard-panel quick-actions-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Accès rapide</span>
            <h2>Gestion de la plateforme</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button type="button">
            <span>👤</span>

            <div>
              <strong>Ajouter un utilisateur</strong>
              <small>Créer un nouveau compte</small>
            </div>
          </button>

          <button type="button">
            <span>🏥</span>

            <div>
              <strong>Ajouter une spécialité</strong>
              <small>Gérer les spécialités médicales</small>
            </div>
          </button>

          <button type="button">
            <span>📊</span>

            <div>
              <strong>Voir les statistiques</strong>
              <small>Consulter l’activité de SamaSanté</small>
            </div>
          </button>
        </div>
      </article>
    </section>

    <section className="dashboard-grid dashboard-bottom-grid">
      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Nouveaux comptes</span>
            <h2>Utilisateurs récents</h2>
          </div>

          <button type="button" className="dashboard-text-button">
            Voir les utilisateurs
          </button>
        </div>

        <div className="appointment-list">
  {recentUsers.length === 0 && (
    <p>Aucun utilisateur enregistré.</p>
  )}

{recentUsers.map((recentUser) => ( <div
   className="appointment-list-item"
   key={recentUser.id}
 > <div className="dashboard-user-avatar">
{recentUser.first_name?.charAt(0)}
{recentUser.last_name?.charAt(0)} </div>

  <div>
    <h3>
      {recentUser.role === "MEDECIN" && "Dr "}
      {recentUser.first_name} {recentUser.last_name}
    </h3>

    <p>
      {recentUser.role === "PATIENT"
        ? "Patient"
        : recentUser.role === "MEDECIN"
          ? "Médecin"
          : "Administrateur"}
      {" · "}
      {recentUser.email}
    </p>
  </div>

  <span className="appointment-status">
    Actif
  </span>
</div>


))}

</div>

      </article>

      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Activité</span>
            <h2>Résumé de la plateforme</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button type="button">
            <span>✅</span>

            <div>
              <strong>62 consultations terminées</strong>
              <small>Depuis le début du mois</small>
            </div>
          </button>

          <button type="button">
            <span>📄</span>

            <div>
              <strong>48 ordonnances créées</strong>
              <small>Depuis le début du mois</small>
            </div>
          </button>

          <button type="button">
            <span>💻</span>

            <div>
              <strong>18 téléconsultations</strong>
              <small>Réalisées cette semaine</small>
            </div>
          </button>
        </div>
      </article>
    </section>
    </>
)}
{activeSection === "users" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Gestion des comptes</span>
        <h2>Tous les utilisateurs</h2>
      </div>

```
  <span className="appointment-status">
    {users.length} utilisateur(s)
  </span>
</div>

{users.length === 0 && (
  <p>Aucun utilisateur enregistré.</p>
)}

<div className="appointment-list">
  {users.map((currentUser) => (
    <div
      className="appointment-list-item"
      key={currentUser.id}
    >
      <div className="dashboard-user-avatar">
        {currentUser.first_name?.charAt(0)}
        {currentUser.last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          {currentUser.role === "MEDECIN" && "Dr "}
          {currentUser.first_name}{" "}
          {currentUser.last_name}
        </h3>

        <p>{currentUser.email}</p>

        <p>
          {currentUser.phone ||
            "Téléphone non renseigné"}
        </p>
      </div>

      <span className="appointment-status">
        {currentUser.role === "PATIENT"
          ? "Patient"
          : currentUser.role === "MEDECIN"
            ? "Médecin"
            : "Administrateur"}
      </span>
    </div>
  ))}
</div>


  </section>
)}
{activeSection === "doctors" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Gestion médicale</span>
        <h2>Liste des médecins</h2>
      </div>

```
  <span className="appointment-status">
    {doctors.length} médecin(s)
  </span>
</div>

{doctors.length === 0 && (
  <p>Aucun médecin enregistré.</p>
)}

<div className="appointment-list">
  {doctors.map((doctor) => (
    <div
      className="appointment-list-item"
      key={doctor.doctor_profile_id}
    >
      <div className="dashboard-user-avatar">
        {doctor.first_name?.charAt(0)}
        {doctor.last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          Dr {doctor.first_name} {doctor.last_name}
        </h3>

        <p>
          {doctor.specialty_name} · Licence :{" "}
          {doctor.license_number}
        </p>

        <p>
          {doctor.email} ·{" "}
          {doctor.years_of_experience || 0} an(s)
          d’expérience
        </p>
      </div>

      <div className="doctor-request-actions">
        <span className="appointment-status">
          {doctor.validation_status === "VALIDE"
            ? "Validé"
            : doctor.validation_status === "REFUSE"
              ? "Refusé"
              : "En attente"}
        </span>

        {doctor.validation_status === "EN_ATTENTE" && (
          <>
            <button
              type="button"
              className="request-accept-button"
              onClick={() =>
                handleDoctorStatus(
                  doctor.doctor_profile_id,
                  "VALIDE"
                )
              }
            >
              Valider
            </button>

            <button
              type="button"
              className="request-refuse-button"
              onClick={() =>
                handleDoctorStatus(
                  doctor.doctor_profile_id,
                  "REFUSE"
                )
              }
            >
              Refuser
            </button>
          </>
        )}
      </div>
    </div>
  ))}
</div>


  </section>
)}

{activeSection === "patients" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Gestion des patients</span>
        <h2>Liste des patients</h2>
      </div>


  <span className="appointment-status">
    {patientUsers.length} patient(s)
  </span>
</div>

{patientUsers.length === 0 && (
  <p>Aucun patient enregistré.</p>
)}

<div className="appointment-list">
  {patientUsers.map((patient) => (
    <div
      className="appointment-list-item"
      key={patient.id}
    >
      <div className="dashboard-user-avatar">
        {patient.first_name?.charAt(0)}
        {patient.last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          {patient.first_name} {patient.last_name}
        </h3>

        <p>{patient.email}</p>

        <p>
          {patient.phone ||
            "Téléphone non renseigné"}
        </p>
      </div>

      <span className="appointment-status">
        Patient
      </span>
    </div>
  ))}
</div>


  </section>
)}
{activeSection === "specialties" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Gestion médicale</span>
        <h2>Liste des spécialités</h2>
      </div>


  <span className="appointment-status">
    {specialties.length} spécialité(s)
  </span>
</div>

{specialties.length === 0 && (
  <p>Aucune spécialité enregistrée.</p>
)}

<div className="appointment-list">
  {specialties.map((specialty) => (
    <div
      className="appointment-list-item"
      key={specialty.id}
    >
      <div className="dashboard-user-avatar">
        🏥
      </div>

      <div>
        <h3>{specialty.name}</h3>

        <p>
          {specialty.description ||
            "Spécialité médicale"}
        </p>
      </div>

      <span className="appointment-status">
        Active
      </span>
    </div>
  ))}
</div>
  </section>
)}
{activeSection === "appointments" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Gestion des consultations</span>
        <h2>Liste des rendez-vous</h2>
      </div>


  <span className="appointment-status">
    {appointments.length} rendez-vous
  </span>
</div>

{appointments.length === 0 && (
  <p>Aucun rendez-vous enregistré.</p>
)}

<div className="appointment-list">
  {appointments.map((appointment) => (
    <div
      className="appointment-list-item"
      key={appointment.appointment_id}
    >
      <div className="appointment-date">
        <strong>
          {new Date(appointment.start_time).getDate()}
        </strong>

        <span>
          {new Date(
            appointment.start_time
          ).toLocaleDateString("fr-FR", {
            month: "short",
          })}
        </span>
      </div>

      <div>
        <h3>
          {appointment.patient_first_name}{" "}
          {appointment.patient_last_name}
        </h3>

        <p>
          Médecin : Dr{" "}
          {appointment.doctor_first_name}{" "}
          {appointment.doctor_last_name}
        </p>

        <p>
          {appointment.specialty_name} ·{" "}
          {formatDateTime(appointment.start_time)}
        </p>

        <p>
          Motif :{" "}
          {appointment.reason ||
            "Motif non renseigné"}
        </p>
      </div>

      <span className="appointment-status">
        {getAppointmentStatus(
          appointment.status
        )}
      </span>
    </div>
  ))}
</div>

  </section>
)}
  {activeSection === "statistics" && (
<> <section className="dashboard-statistics"> <article className="dashboard-stat-card"> <div className="stat-icon">👥</div>

    <div>
      <span>Utilisateurs inscrits</span>
      <strong>{statistics.total_users}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">🩺</div>

    <div>
      <span>Médecins</span>
      <strong>{statistics.total_doctors}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">🧑‍🤝‍🧑</div>

    <div>
      <span>Patients</span>
      <strong>{statistics.total_patients}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">📅</div>

    <div>
      <span>Rendez-vous</span>
      <strong>{statistics.total_appointments}</strong>
    </div>
  </article>
</section>

<section className="dashboard-grid">
  <article className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>État des rendez-vous</span>
        <h2>Activité des consultations</h2>
      </div>
    </div>

    <div className="quick-actions">
      <button type="button">
        <span>⏳</span>

        <div>
          <strong>
            {pendingAppointments.length} en attente
          </strong>

          <small>
            Rendez-vous à traiter
          </small>
        </div>
      </button>

      <button type="button">
        <span>✅</span>

        <div>
          <strong>
            {confirmedAppointments.length} confirmés
          </strong>

          <small>
            Consultations programmées
          </small>
        </div>
      </button>

      <button type="button">
        <span>🏁</span>

        <div>
          <strong>
            {completedAppointments.length} terminés
          </strong>

          <small>
            Consultations réalisées
          </small>
        </div>
      </button>

      <button type="button">
        <span>❌</span>

        <div>
          <strong>
            {refusedAppointments.length} refusés
          </strong>

          <small>
            Demandes refusées
          </small>
        </div>
      </button>
    </div>
  </article>

  <article className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Validation médicale</span>
        <h2>État des médecins</h2>
      </div>
    </div>

    <div className="quick-actions">
      <button type="button">
        <span>🩺</span>

        <div>
          <strong>
            {statistics.total_doctors} médecin(s)
          </strong>

          <small>
            Total des profils médicaux
          </small>
        </div>
      </button>

      <button type="button">
        <span>⏳</span>

        <div>
          <strong>
            {statistics.pending_doctors} en attente
          </strong>

          <small>
            Profils à valider
          </small>
        </div>
      </button>
    </div>
  </article>
</section>
</>
)}
{activeSection === "settings" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Compte administrateur</span>
        <h2>Paramètres</h2>
      </div>
    </div>


<div className="appointment-list">
  <div className="appointment-list-item">
    <div className="dashboard-user-avatar">
      {user.first_name?.charAt(0)}
      {user.last_name?.charAt(0)}
    </div>

    <div>
      <h3>
        {user.first_name} {user.last_name}
      </h3>

      <p>Administrateur de la plateforme SamaSanté</p>
    </div>

    <span className="appointment-status">
      Actif
    </span>
  </div>

  <div className="appointment-list-item">
    <div>
      <h3>Adresse e-mail</h3>

      <p>
        {user.email || "Adresse e-mail non renseignée"}
      </p>
    </div>
  </div>

  <div className="appointment-list-item">
    <div>
      <h3>Téléphone</h3>

      <p>
        {user.phone || "Téléphone non renseigné"}
      </p>
    </div>
  </div>

  <div className="appointment-list-item">
    <div>
      <h3>Rôle</h3>
      <p>Administrateur</p>
    </div>
  </div>
</div>


  </section>
)}

  </main>
</div>

)};


export default AdminDashboard;
