import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Doctors() {
const navigate = useNavigate();

const [doctors, setDoctors] = useState([]);
const [specialties, setSpecialties] = useState([]);
const [selectedSpecialty, setSelectedSpecialty] = useState("");
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
const loadData = async () => {
try {
setLoading(true);
setError("");


    const [doctorsResponse, specialtiesResponse] = await Promise.all([
      api.get("/doctors"),
      api.get("/specialties"),
    ]);

    setDoctors(doctorsResponse.data.doctors || []);
    setSpecialties(specialtiesResponse.data.specialties || []);
  } catch (requestError) {
    console.error(requestError);
    setError("Impossible de charger les médecins.");
  } finally {
    setLoading(false);
  }
};

loadData();


}, []);

const filteredDoctors = doctors.filter((doctor) => {
const fullName = `${doctor.first_name} ${doctor.last_name}`.toLowerCase();
const specialtyName = doctor.specialty_name.toLowerCase();


const matchesSearch =
  fullName.includes(search.toLowerCase()) ||
  specialtyName.includes(search.toLowerCase());

const matchesSpecialty =
  selectedSpecialty === "" ||
  String(doctor.specialty_id) === selectedSpecialty;

return matchesSearch && matchesSpecialty;


});

const handleBookAppointment = (doctor) => {
localStorage.setItem("selectedDoctor", JSON.stringify(doctor));
navigate(`/patient/book-appointment/${doctor.doctor_profile_id}`);
};

return ( <div className="dashboard-layout"> <aside className="dashboard-sidebar"> <div className="dashboard-logo"> <span className="logo-symbol">✚</span> <span>SamaSanté</span> </div>


    <nav className="dashboard-menu">
      <button
        type="button"
        className="dashboard-menu-item"
        onClick={() => navigate("/patient/dashboard")}
      >
        <span>▦</span>
        Tableau de bord
      </button>

      <button
        type="button"
        className="dashboard-menu-item active"
      >
        <span>🩺</span>
        Trouver un médecin
      </button>

      <button
        type="button"
        className="dashboard-menu-item"
        onClick={() => navigate("/patient/appointments")}
      >
        <span>📅</span>
        Mes rendez-vous
      </button>

      <button
        type="button"
        className="dashboard-menu-item"
        onClick={() => navigate("/patient/prescriptions")}
      >
        <span>📄</span>
        Mes ordonnances
      </button>
    </nav>

    <button
      type="button"
      className="dashboard-logout"
      onClick={() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }}
    >
      <span>↪</span>
      Déconnexion
    </button>
  </aside>

  <main className="dashboard-main">
    <header className="dashboard-header">
      <div>
        <p className="dashboard-welcome">Espace patient</p>
        <h1>Trouver un médecin</h1>
        <p>
          Recherchez un médecin et prenez rendez-vous en ligne.
        </p>
      </div>

      <button
        type="button"
        className="secondary-dashboard-button"
        onClick={() => navigate("/patient/dashboard")}
      >
        Retour au dashboard
      </button>
    </header>

    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span>Recherche</span>
          <h2>Médecins disponibles</h2>
        </div>
      </div>

      <div className="doctors-filters">
        <input
          type="text"
          placeholder="Rechercher un médecin ou une spécialité"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedSpecialty}
          onChange={(event) =>
            setSelectedSpecialty(event.target.value)
          }
        >
          <option value="">Toutes les spécialités</option>

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

      {loading && <p>Chargement des médecins...</p>}

      {error && <p className="auth-error">{error}</p>}

      {!loading && !error && filteredDoctors.length === 0 && (
        <p>Aucun médecin trouvé.</p>
      )}

      <div className="doctors-grid">
        {filteredDoctors.map((doctor) => (
          <article
            className="doctor-dashboard-card"
            key={doctor.doctor_profile_id}
          >
            <div className="dashboard-user-avatar">
              {doctor.first_name.trim().charAt(0)}
              {doctor.last_name.trim().charAt(0)}
            </div>

            <div className="doctor-dashboard-information">
              <span>{doctor.specialty_name}</span>

              <h3>
                Dr {doctor.first_name.trim()}{" "}
                {doctor.last_name.trim()}
              </h3>

              <p>
                {doctor.years_of_experience} années d’expérience
              </p>

              <p>
                {doctor.biography ||
                  "Médecin disponible sur SamaSanté."}
              </p>

              <strong>
                {Number(
                  doctor.consultation_price
                ).toLocaleString("fr-FR")}{" "}
                FCFA
              </strong>
            </div>

            <button
              type="button"
              className="primary-dashboard-button"
              onClick={() => handleBookAppointment(doctor)}
            >
              Prendre rendez-vous
            </button>
          </article>
        ))}
      </div>
    </section>
  </main>
</div>


);
}

export default Doctors;
