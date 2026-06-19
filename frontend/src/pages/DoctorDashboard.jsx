import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PrescriptionForm from "../components/PrescriptionForm";

import "../App.css";

function DoctorDashboard() {
const navigate = useNavigate();

const storedUser = localStorage.getItem("user");

const user = storedUser
? JSON.parse(storedUser)
: {
first_name: "Mamadou",
last_name: "Diop",
};

const [appointments, setAppointments] = useState([]);
const [availabilities, setAvailabilities] = useState([]);

const [formData, setFormData] = useState({
start_time: "",
end_time: "",
});

const [loading, setLoading] = useState(true);
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [activeSection, setActiveSection] = useState("home");

const menuClass = (sectionName) =>
activeSection === sectionName
? "dashboard-menu-item active"
: "dashboard-menu-item";


const loadDashboard = useCallback(async () => {
try {
setLoading(true);
setError("");


  const [appointmentsResponse, availabilitiesResponse] =
    await Promise.all([
      api.get("/appointments/doctor"),
      api.get("/appointments/doctor/availabilities"),
    ]);

  setAppointments(
    appointmentsResponse.data.appointments || []
  );

  setAvailabilities(
    availabilitiesResponse.data.availabilities || []
  );
} catch (requestError) {
  console.error(requestError);

  setError(
    requestError.response?.data?.message ||
      "Impossible de charger le dashboard médecin."
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
loadDashboard();
}, [loadDashboard]);

const handleChange = (event) => {
setFormData({
...formData,
[event.target.name]: event.target.value,
});
};

const handleAddAvailability = async (event) => {
event.preventDefault();


setMessage("");
setError("");

try {
  const response = await api.post(
    "/appointments/availabilities",
    formData
  );

  setMessage(response.data.message);

  setFormData({
    start_time: "",
    end_time: "",
  });

  await loadDashboard();
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible d’ajouter cette disponibilité."
  );
}


};

const handleAppointmentStatus = async (
appointmentId,
status
) => {
setMessage("");
setError("");


try {
  const response = await api.patch(
    `/appointments/${appointmentId}/status`,
    {
      status,
    }
  );

  setMessage(response.data.message);

  await loadDashboard();
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible de modifier le rendez-vous."
  );
}


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
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

const pendingAppointments = appointments.filter(
(appointment) => appointment.status === "EN_ATTENTE"
);

const confirmedAppointments = appointments.filter(
(appointment) => appointment.status === "CONFIRME"
);
const consultationAppointments = appointments.filter(
(appointment) =>
appointment.status === "CONFIRME" ||
appointment.status === "TERMINE"
);

const uniquePatients = appointments.filter(
(appointment, index, allAppointments) =>
index ===
allAppointments.findIndex(
(otherAppointment) =>
otherAppointment.patient_email ===
appointment.patient_email
)
);

const nextAppointment =
appointments.find(
(appointment) => appointment.status === "CONFIRME"
) ||
appointments.find(
(appointment) => appointment.status === "EN_ATTENTE"
) ||
appointments[0];

const getStatusText = (status) => {
const statuses = {
EN_ATTENTE: "En attente",
CONFIRME: "Confirmé",
REFUSE: "Refusé",
ANNULE: "Annulé",
TERMINE: "Terminé",
};

return statuses[status] || status;
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
className={menuClass("agenda")}
onClick={() => setActiveSection("agenda")}

>


<span>📅</span>



Mon agenda


  </button>

<button
type="button"
className={menuClass("availabilities")}
onClick={() => setActiveSection("availabilities")}

>


<span>🕒</span>

Mes disponibilités

  </button>

<button
type="button"
className={menuClass("requests")}
onClick={() => setActiveSection("requests")}

>

<span>📨</span>
Demandes de rendez-vous
  </button>

<button
type="button"
className={menuClass("patients")}
onClick={() => setActiveSection("patients")}

>
<span>👥</span>

Mes patients

  </button>

<button
type="button"
className={menuClass("consultations")}
onClick={() => setActiveSection("consultations")}

>

<span>💻</span>

Consultations

 </button>

<button
type="button"
className={menuClass("prescriptions")}
onClick={() => setActiveSection("prescriptions")}

>

<span>📄</span>

Ordonnances
  </button>

<button
type="button"
className={menuClass("profile")}
onClick={() => setActiveSection("profile")}

>

<span>👤</span>
Mon profil


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
        <p className="dashboard-welcome">
          Espace médecin
        </p>

        <h1>
          Bonjour, Dr {user.first_name?.trim()}{" "}
          {user.last_name?.trim()}
        </h1>

        <p>
          Gérez vos disponibilités et les rendez-vous de
          vos patients.
        </p>
      </div>

      <div className="dashboard-user">
        <div className="dashboard-user-avatar">
          {user.first_name?.trim().charAt(0)}
          {user.last_name?.trim().charAt(0)}
        </div>

        <div>
          <strong>
            Dr {user.first_name?.trim()}{" "}
            {user.last_name?.trim()}
          </strong>

          <span>Médecin</span>
        </div>
      </div>
    </header>

    {message && (
      <p className="auth-success">{message}</p>
    )}

    {error && <p className="auth-error">{error}</p>}

    {activeSection === "home" && (
<> <section className="dashboard-statistics"> <article className="dashboard-stat-card"> <div className="stat-icon">🕒</div>


    <div>
      <span>Disponibilités créées</span>
      <strong>{availabilities.length}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">📨</div>

    <div>
      <span>Demandes en attente</span>
      <strong>{pendingAppointments.length}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">✅</div>

    <div>
      <span>Rendez-vous confirmés</span>
      <strong>{confirmedAppointments.length}</strong>
    </div>
  </article>

  <article className="dashboard-stat-card">
    <div className="stat-icon">📅</div>

    <div>
      <span>Total des rendez-vous</span>
      <strong>{appointments.length}</strong>
    </div>
  </article>
</section>

<section className="dashboard-grid">
  <article className="dashboard-panel next-appointment-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Prochaine consultation</span>
        <h2>Rendez-vous à venir</h2>
      </div>

      {nextAppointment && (
        <span className="appointment-status">
          {getStatusText(nextAppointment.status)}
        </span>
      )}
    </div>

    {!nextAppointment && (
      <p>Aucun rendez-vous enregistré.</p>
    )}

    {nextAppointment && (
      <>
        <div className="next-appointment">
          <div className="dashboard-user-avatar">
            {nextAppointment.patient_first_name?.charAt(0)}
            {nextAppointment.patient_last_name?.charAt(0)}
          </div>

          <div className="appointment-doctor">
            <span>Patient</span>

            <h3>
              {nextAppointment.patient_first_name}{" "}
              {nextAppointment.patient_last_name}
            </h3>

            <p>
              📅{" "}
              {formatDateTime(nextAppointment.start_time)}
            </p>

            <p>Motif : {nextAppointment.reason}</p>
          </div>
        </div>

        {nextAppointment.status === "CONFIRME" &&
          nextAppointment.meeting_url && (
            <button
              type="button"
              className="primary-dashboard-button"
              onClick={() =>
                window.open(
                  nextAppointment.meeting_url,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Démarrer la consultation
            </button>
          )}
      </>
    )}
  </article>

  <article className="dashboard-panel quick-actions-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Accès rapide</span>
        <h2>Gérer mon activité</h2>
      </div>
    </div>

    <div className="quick-actions">
      <button
        type="button"
        onClick={() =>
          setActiveSection("availabilities")
        }
      >
        <span>🕒</span>

        <div>
          <strong>Ajouter une disponibilité</strong>
          <small>Créer un nouveau créneau</small>
        </div>
      </button>

      <button
        type="button"
        onClick={() => setActiveSection("agenda")}
      >
        <span>📅</span>

        <div>
          <strong>Consulter mon agenda</strong>
          <small>Voir tous mes rendez-vous</small>
        </div>
      </button>

      <button
        type="button"
        onClick={() =>
          setActiveSection("prescriptions")
        }
      >
        <span>📄</span>

        <div>
          <strong>Rédiger une ordonnance</strong>
          <small>Créer une prescription médicale</small>
        </div>
      </button>
    </div>
  </article>
</section>


</>
)}

{activeSection === "availabilities" && (

  <section className="dashboard-grid">
    <article className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span>Planning</span>
          <h2>Ajouter une disponibilité</h2>
        </div>
      </div>


  <form onSubmit={handleAddAvailability}>
    <div className="form-group">
      <label htmlFor="start-time">
        Date et heure de début
      </label>

      <input
        id="start-time"
        type="datetime-local"
        name="start_time"
        value={formData.start_time}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label htmlFor="end-time">
        Date et heure de fin
      </label>

      <input
        id="end-time"
        type="datetime-local"
        name="end_time"
        value={formData.end_time}
        onChange={handleChange}
        required
      />
    </div>

    <button
      type="submit"
      className="primary-dashboard-button"
    >
      Ajouter le créneau
    </button>
  </form>
</article>

<article className="dashboard-panel">
  <div className="dashboard-panel-heading">
    <div>
      <span>Créneaux enregistrés</span>
      <h2>Mes disponibilités</h2>
    </div>
  </div>

  {availabilities.length === 0 && (
    <p>Aucune disponibilité enregistrée.</p>
  )}

  <div className="appointment-list">
    {availabilities.map((availability) => (
      <div
        className="appointment-list-item"
        key={availability.availability_id}
      >
        <div>
          <h3>
            {formatDateTime(availability.start_time)}
          </h3>

          <p>
            Fin :{" "}
            {formatDateTime(availability.end_time)}
          </p>
        </div>

        <span className="appointment-status">
          {availability.appointment_id
            ? "Réservé"
            : "Disponible"}
        </span>
      </div>
    ))}
  </div>
</article>


  </section>
)}

{activeSection === "requests" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>À traiter</span>
        <h2>Demandes de rendez-vous</h2>
      </div>
    </div>


{pendingAppointments.length === 0 && (
  <p>Aucune demande en attente.</p>
)}

<div className="appointment-list">
  {pendingAppointments.map((appointment) => (
    <div
      className="appointment-list-item"
      key={appointment.appointment_id}
    >
      <div className="dashboard-user-avatar">
        {appointment.patient_first_name?.charAt(0)}
        {appointment.patient_last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          {appointment.patient_first_name}{" "}
          {appointment.patient_last_name}
        </h3>

        <p>
          {formatDateTime(appointment.start_time)}
        </p>

        <p>Motif : {appointment.reason}</p>
      </div>

      <div className="doctor-request-actions">
        <button
          type="button"
          className="request-accept-button"
          onClick={() =>
            handleAppointmentStatus(
              appointment.appointment_id,
              "CONFIRME"
            )
          }
        >
          Accepter
        </button>

        <button
          type="button"
          className="request-refuse-button"
          onClick={() =>
            handleAppointmentStatus(
              appointment.appointment_id,
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


  </section>
)}

{activeSection === "agenda" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Planning</span>
        <h2>Mon agenda</h2>
      </div>
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
      <div className="dashboard-user-avatar">
        {appointment.patient_first_name?.charAt(0)}
        {appointment.patient_last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          {appointment.patient_first_name}{" "}
          {appointment.patient_last_name}
        </h3>

        <p>
          {formatDateTime(appointment.start_time)}
        </p>

        <p>Motif : {appointment.reason}</p>
      </div>

      <span className="appointment-status">
        {getStatusText(appointment.status)}
      </span>
    </div>
  ))}
</div>


  </section>
)}

{activeSection === "patients" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Suivi médical</span>
        <h2>Mes patients</h2>
      </div>
    </div>


{uniquePatients.length === 0 && (
  <p>Aucun patient enregistré.</p>
)}

<div className="appointment-list">
  {uniquePatients.map((patient) => (
    <div
      className="appointment-list-item"
      key={`${patient.patient_email}-${patient.appointment_id}`}
    >
      <div className="dashboard-user-avatar">
        {patient.patient_first_name?.charAt(0)}
        {patient.patient_last_name?.charAt(0)}
      </div>

      <div>
        <h3>
          {patient.patient_first_name}{" "}
          {patient.patient_last_name}
        </h3>

        <p>
          {patient.patient_email ||
            "E-mail non renseigné"}
        </p>

        <p>
          {patient.patient_phone ||
            "Téléphone non renseigné"}
        </p>
      </div>
    </div>
  ))}
</div>


  </section>
)}

{activeSection === "consultations" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Téléconsultation</span>
        <h2>Mes consultations</h2>
      </div>
    </div>


{consultationAppointments.length === 0 && (
  <p>Aucune consultation disponible.</p>
)}

<div className="appointment-list">
  {consultationAppointments.map((appointment) => (
    <div
      className="appointment-list-item"
      key={appointment.appointment_id}
    >
      <div>
        <h3>
          {appointment.patient_first_name}{" "}
          {appointment.patient_last_name}
        </h3>

        <p>
          {formatDateTime(appointment.start_time)}
        </p>

        <p>Motif : {appointment.reason}</p>
      </div>

      <div>
        <span className="appointment-status">
          {getStatusText(appointment.status)}
        </span>

        {appointment.status === "CONFIRME" &&
          appointment.meeting_url && (
            <button
              type="button"
              className="primary-dashboard-button"
              onClick={() =>
                window.open(
                  appointment.meeting_url,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Démarrer la consultation
            </button>
          )}
      </div>
    </div>
  ))}
</div>


  </section>
)}

{activeSection === "prescriptions" && ( <PrescriptionForm
 appointments={appointments}
 onPrescriptionCreated={loadDashboard}
/>
)}

{activeSection === "profile" && (

  <section className="dashboard-panel">
    <div className="dashboard-panel-heading">
      <div>
        <span>Informations professionnelles</span>
        <h2>Mon profil</h2>
      </div>
    </div>


<div className="appointment-list">
  <div className="appointment-list-item">
    <div>
      <h3>Nom complet</h3>

      <p>
        Dr {user.first_name?.trim()}{" "}
        {user.last_name?.trim()}
      </p>
    </div>
  </div>

  <div className="appointment-list-item">
    <div>
      <h3>Adresse e-mail</h3>
      <p>{user.email || "Non renseignée"}</p>
    </div>
  </div>

  <div className="appointment-list-item">
    <div>
      <h3>Téléphone</h3>
      <p>{user.phone || "Non renseigné"}</p>
    </div>
  </div>
</div>


  </section>
)}


  </main>
</div>


);
}

export default DoctorDashboard;

