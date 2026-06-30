import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PatientPrescriptions from "../components/PatientPrescriptions";
import ProfilePhoto from "../components/ProfilePhoto";
import "../App.css";

function PatientDashboard() {
const navigate = useNavigate();

const storedUser = localStorage.getItem("user");

const user = storedUser
? JSON.parse(storedUser)
: {
first_name: "Patient",
last_name: "SamaSanté",
email: "",
phone: "",
};

const [activeSection, setActiveSection] = useState("home");

const [doctors, setDoctors] = useState([]);
const [specialties, setSpecialties] = useState([]);
const [slots, setSlots] = useState([]);
const [appointments, setAppointments] = useState([]);

const [search, setSearch] = useState("");
const [selectedSpecialty, setSelectedSpecialty] = useState("");
const [selectedDoctorId, setSelectedDoctorId] = useState("");
const [selectedSlotId, setSelectedSlotId] = useState("");
const [reason, setReason] = useState("");

const [loading, setLoading] = useState(true);
const [booking, setBooking] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const loadDashboard = useCallback(async () => {
try {
setLoading(true);
setError("");


  const [
    doctorsResponse,
    specialtiesResponse,
    slotsResponse,
    appointmentsResponse,
  ] = await Promise.all([
    api.get("/doctors"),
    api.get("/specialties"),
    api.get("/appointments/available-slots"),
    api.get("/appointments/patient"),
  ]);

  setDoctors(doctorsResponse.data.doctors || []);
  setSpecialties(
    specialtiesResponse.data.specialties || []
  );
  setSlots(slotsResponse.data.slots || []);
  setAppointments(
    appointmentsResponse.data.appointments || []
  );
} catch (requestError) {
  console.error(requestError);

  setError(
    requestError.response?.data?.message ||
      "Impossible de charger votre dashboard."
  );
} finally {
  setLoading(false);
}


}, []);

useEffect(() => {
loadDashboard();
}, [loadDashboard]);

const filteredDoctors = useMemo(() => {
return doctors.filter((doctor) => {
const fullName = `${doctor.first_name || ""} ${
        doctor.last_name || ""
      }`.toLowerCase();


  const specialtyName = (
    doctor.specialty_name || ""
  ).toLowerCase();

  const matchesSearch =
    fullName.includes(search.toLowerCase()) ||
    specialtyName.includes(search.toLowerCase());

  const matchesSpecialty =
    selectedSpecialty === "" ||
    String(doctor.specialty_id) ===
      String(selectedSpecialty);

  return matchesSearch && matchesSpecialty;
});


}, [doctors, search, selectedSpecialty]);

const selectedDoctor = doctors.find(
(doctor) =>
String(doctor.doctor_profile_id) ===
String(selectedDoctorId)
);

const selectedDoctorSlots = slots.filter(
(slot) =>
String(slot.doctor_profile_id) ===
String(selectedDoctorId)
);

const confirmedConsultations = appointments.filter(
(appointment) =>
appointment.status === "CONFIRME" ||
appointment.status === "TERMINE"
);

const pendingAppointments = appointments.filter(
(appointment) => appointment.status === "EN_ATTENTE"
);

const futureAppointments = appointments
.filter(
(appointment) =>
new Date(appointment.start_time) > new Date() &&
appointment.status !== "REFUSE" &&
appointment.status !== "ANNULE"
)
.sort(
(firstAppointment, secondAppointment) =>
new Date(firstAppointment.start_time) -
new Date(secondAppointment.start_time)
);

const nextAppointment = futureAppointments[0];

const formatDateTime = (dateValue) => {
if (!dateValue) {
return "Date non disponible";
}


return new Date(dateValue).toLocaleString("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});


};

const getStatusText = (status) => {
const statusNames = {
EN_ATTENTE: "En attente",
CONFIRME: "Confirmé",
REFUSE: "Refusé",
ANNULE: "Annulé",
TERMINE: "Terminé",
};


return statusNames[status] || status;


};

const handleChooseDoctor = (doctorId) => {
setSelectedDoctorId(String(doctorId));
setSelectedSlotId("");
setMessage("");
setError("");


setTimeout(() => {
  document
    .getElementById("booking-form")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}, 100);


};

const handleBookAppointment = async (event) => {
event.preventDefault();


setMessage("");
setError("");

if (!selectedDoctorId) {
  setError("Veuillez choisir un médecin.");
  return;
}

if (!selectedSlotId) {
  setError("Veuillez choisir un créneau disponible.");
  return;
}

try {
  setBooking(true);

  const response = await api.post("/appointments", {
    availability_id: Number(selectedSlotId),
    reason,
  });

  setMessage(response.data.message);
  setReason("");
  setSelectedSlotId("");
  setSelectedDoctorId("");

  await loadDashboard();

  setActiveSection("appointments");
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible de réserver le rendez-vous."
  );
} finally {
  setBooking(false);
}


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

const menuClass = (sectionName) => {
return activeSection === sectionName
? "dashboard-menu-item active"
: "dashboard-menu-item";
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
        className={menuClass("doctors")}
        onClick={() => setActiveSection("doctors")}
      >
        <span>🩺</span>
        Trouver un médecin
      </button>

      <button
        type="button"
        className={menuClass("appointments")}
        onClick={() =>
          setActiveSection("appointments")
        }
      >
        <span>📅</span>
        Mes rendez-vous
      </button>

      <button
        type="button"
        className={menuClass("consultations")}
        onClick={() =>
          setActiveSection("consultations")
        }
      >
        <span>💻</span>
        Mes consultations
      </button>

      <button
        type="button"
        className={menuClass("prescriptions")}
        onClick={() =>
          setActiveSection("prescriptions")
        }
      >
        <span>📄</span>
        Mes ordonnances
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
          Bienvenue sur votre espace
        </p>

        <h1>
          Bonjour, {user.first_name?.trim()}{" "}
          {user.last_name?.trim()}
        </h1>

        <p>
          Retrouvez vos rendez-vous, consultations et
          ordonnances.
        </p>
      </div>

      <div className="dashboard-user">
        <div className="dashboard-user-avatar">
  {user.profile_photo ? (
    <img
      src={`http://localhost:5000${user.profile_photo}`}
      alt="Photo de profil"
    />
  ) : (
    <>
      {user.first_name?.trim().charAt(0)}
      {user.last_name?.trim().charAt(0)}
    </>
  )}
</div>
        <div>
          <strong>
            {user.first_name?.trim()}{" "}
            {user.last_name?.trim()}
          </strong>

          <span>Patient</span>
        </div>
      </div>
    </header>

    {message && (
      <p className="auth-success">{message}</p>
    )}

    {error && <p className="auth-error">{error}</p>}

    {activeSection === "home" && (
      <>
        <section className="dashboard-statistics">
          <article className="dashboard-stat-card">
            <div className="stat-icon">📅</div>

            <div>
              <span>Total des rendez-vous</span>
              <strong>{appointments.length}</strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="stat-icon">⏳</div>

            <div>
              <span>Rendez-vous en attente</span>
              <strong>
                {pendingAppointments.length}
              </strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="stat-icon">✅</div>

            <div>
              <span>Consultations confirmées</span>
              <strong>
                {confirmedConsultations.length}
              </strong>
            </div>
          </article>

          <article className="dashboard-stat-card">
            <div className="stat-icon">🩺</div>

            <div>
              <span>Médecins disponibles</span>
              <strong>{doctors.length}</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span>Prochain rendez-vous</span>
                <h2>Consultation à venir</h2>
              </div>
            </div>

            {!nextAppointment && (
              <p>
                Vous n’avez aucun rendez-vous à venir.
              </p>
            )}

            {nextAppointment && (
              <div className="appointment-list">
                <div className="appointment-list-item">
                  <div className="dashboard-user-avatar">
                    {nextAppointment.doctor_first_name?.charAt(
                      0
                    )}
                    {nextAppointment.doctor_last_name?.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <h3>
                      Dr{" "}
                      {
                        nextAppointment.doctor_first_name
                      }{" "}
                      {nextAppointment.doctor_last_name}
                    </h3>

                    <p>
                      {nextAppointment.specialty_name}
                    </p>

                    <p>
                      {formatDateTime(
                        nextAppointment.start_time
                      )}
                    </p>

                    <p>
                      Motif : {nextAppointment.reason}
                    </p>
                  </div>

                  <span className="appointment-status">
                    {getStatusText(
                      nextAppointment.status
                    )}
                  </span>
                </div>
              </div>
            )}
          </article>

          <article className="dashboard-panel quick-actions-panel">
            <div className="dashboard-panel-heading">
              <div>
                <span>Accès rapide</span>
                <h2>Que souhaitez-vous faire ?</h2>
              </div>
            </div>

            <div className="quick-actions">
              <button
                type="button"
                onClick={() =>
                  setActiveSection("doctors")
                }
              >
                <span>🔍</span>

                <div>
                  <strong>Trouver un médecin</strong>
                  <small>
                    Voir les médecins disponibles
                  </small>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveSection("appointments")
                }
              >
                <span>📅</span>

                <div>
                  <strong>Mes rendez-vous</strong>
                  <small>
                    Consulter mes réservations
                  </small>
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
                  <strong>Mes ordonnances</strong>
                  <small>
                    Consulter mes prescriptions
                  </small>
                </div>
              </button>
            </div>
          </article>
        </section>
      </>
    )}

    {activeSection === "doctors" && (
      <>
        <section className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span>Recherche</span>
              <h2>Trouver un médecin</h2>
            </div>
          </div>

          <div className="doctors-filters">
            <input
              type="text"
              placeholder="Rechercher un médecin"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="doctor-search-input"

            />

            <select
              value={selectedSpecialty}
              onChange={(event) =>
                setSelectedSpecialty(
                  event.target.value
                  
                )
                
              }
              className="doctor-specialty-select"

            >
              <option value="">
                Toutes les spécialités
              </option>
              

              {specialties.map((specialty) => (
                <option
                  key={specialty.id}
                  value={specialty.id}
                >
                  {specialty.name}
                </option>
                
              ))}
            </select>
          </div>
        </section>

        <section className="dashboard-grid">
          {loading && <p>Chargement...</p>}

          {!loading &&
            filteredDoctors.length === 0 && (
              <p>Aucun médecin trouvé.</p>
            )}

          {filteredDoctors.map((doctor) => (
            <article
              className="dashboard-panel"
              key={doctor.doctor_profile_id}
            >
              <div className="dashboard-user-avatar">
                {doctor.first_name
                  ?.trim()
                  .charAt(0)}
                {doctor.last_name
                  ?.trim()
                  .charAt(0)}
              </div>

              <h2>
                Dr {doctor.first_name?.trim()}{" "}
                {doctor.last_name?.trim()}
              </h2>

              <p>{doctor.specialty_name}</p>

              <p>
                {doctor.years_of_experience} années
                d’expérience
              </p>

              <p>{doctor.biography}</p>

              <strong>
                {Number(
                  doctor.consultation_price
                ).toLocaleString("fr-FR")}{" "}
                FCFA
              </strong>

              <br />
              <br />

              <button
                type="button"
                className="primary-dashboard-button"
                onClick={() =>
                  handleChooseDoctor(
                    doctor.doctor_profile_id
                  )
                }
              >
                Prendre rendez-vous
              </button>
            </article>
          ))}
        </section>

        {selectedDoctor && (
          <section
            className="dashboard-panel"
            id="booking-form"
          >
            <div className="dashboard-panel-heading">
              <div>
                <span>Réservation</span>

                <h2>
                  Rendez-vous avec Dr{" "}
                  {selectedDoctor.first_name?.trim()}{" "}
                  {selectedDoctor.last_name?.trim()}
                </h2>
              </div>
            </div>

            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label htmlFor="appointment-slot">
                  Date et heure disponibles
                </label>

                <select
                  id="appointment-slot"
                  value={selectedSlotId}
                  onChange={(event) =>
                    setSelectedSlotId(
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Choisir un créneau
                  </option>

                  {selectedDoctorSlots.map((slot) => (
                    <option
                      key={slot.availability_id}
                      value={slot.availability_id}
                    >
                      {formatDateTime(
                        slot.start_time
                      )}
                    </option>
                  ))}
                </select>
              </div>

              {selectedDoctorSlots.length === 0 && (
                <p>
                  Ce médecin n’a aucun créneau
                  disponible.
                </p>
              )}

              <div className="form-group">
                <label htmlFor="appointment-reason">
                  Motif de la consultation
                </label>

                <textarea
                  id="appointment-reason"
                  value={reason}
                  onChange={(event) =>
                    setReason(event.target.value)
                  }
                  rows="4"
                  placeholder="Décrivez votre problème"
                  required
                />
              </div>

              <button
                type="submit"
                className="primary-dashboard-button"
                disabled={
                  booking ||
                  selectedDoctorSlots.length === 0
                }
              >
                {booking
                  ? "Réservation..."
                  : "Réserver le rendez-vous"}
              </button>
            </form>
          </section>
        )}
      </>
    )}

    {activeSection === "appointments" && (
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Suivi</span>
            <h2>Mes rendez-vous</h2>
          </div>
        </div>

        {!loading && appointments.length === 0 && (
          <p>
            Vous n’avez encore aucun rendez-vous.
          </p>
        )}

        <div className="appointment-list">
          {appointments.map((appointment) => (
            <div
              className="appointment-list-item"
              key={appointment.appointment_id}
            >
              <div className="dashboard-user-avatar">
                {appointment.doctor_first_name?.charAt(
                  0
                )}
                {appointment.doctor_last_name?.charAt(
                  0
                )}
              </div>

              <div>
                <h3>
                  Dr {appointment.doctor_first_name}{" "}
                  {appointment.doctor_last_name}
                </h3>

                <p>{appointment.specialty_name}</p>

                <p>
                  {formatDateTime(
                    appointment.start_time
                  )}
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

    {activeSection === "consultations" && (
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Téléconsultation</span>
            <h2>Mes consultations</h2>
          </div>
        </div>

        {confirmedConsultations.length === 0 && (
          <p>
            Vous n’avez aucune consultation confirmée.
          </p>
        )}

        <div className="appointment-list">
          {confirmedConsultations.map(
            (appointment) => (
              <div
                className="appointment-list-item"
                key={appointment.appointment_id}
              >
                <div>
                  <h3>
                    Dr{" "}
                    {appointment.doctor_first_name}{" "}
                    {appointment.doctor_last_name}
                  </h3>

                  <p>
                    {formatDateTime(
                      appointment.start_time
                    )}
                  </p>

                  <p>
                    Statut :{" "}
                    {getStatusText(
                      appointment.status
                    )}
                  </p>
                </div>

                {appointment.meeting_url ? (
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
                    Rejoindre la consultation
                  </button>
                ) : (
                  <span className="appointment-status">
                    Lien bientôt disponible
                  </span>
                )}
              </div>
            )
          )}
        </div>
      </section>
    )}

    {activeSection === "prescriptions" && (
      <PatientPrescriptions />
    )}

    {activeSection === "profile" && (
      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Informations personnelles</span>
            <h2>Mon profil</h2>
          </div>
        </div>
       <ProfilePhoto user={user} />
        <div className="appointment-list">
          <div className="appointment-list-item">
            <div>
              <h3>Nom complet</h3>

              <p>
                {user.first_name?.trim()}{" "}
                {user.last_name?.trim()}
              </p>
            </div>
          </div>

          <div className="appointment-list-item">
            <div>
              <h3>Adresse e-mail</h3>

              <p>
                {user.email || "Non renseignée"}
              </p>
            </div>
          </div>

          <div className="appointment-list-item">
            <div>
              <h3>Téléphone</h3>

              <p>
                {user.phone || "Non renseigné"}
              </p>
            </div>
          </div>
        </div>
      </section>
    )}
  </main>
</div>


);
}

export default PatientDashboard;
