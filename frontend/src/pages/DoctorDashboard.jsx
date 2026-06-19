import { useNavigate } from "react-router-dom";
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

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

return ( <div className="dashboard-layout"> <aside className="dashboard-sidebar"> <div className="dashboard-logo"> <span className="logo-symbol">✚</span> <span>SamaSanté</span> </div>

    <nav className="dashboard-menu">
      <button type="button" className="dashboard-menu-item active">
        <span>▦</span>
        Tableau de bord
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📅</span>
        Mon agenda
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>🕒</span>
        Mes disponibilités
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📨</span>
        Demandes de rendez-vous
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>👥</span>
        Mes patients
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>💻</span>
        Consultations
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📄</span>
        Ordonnances
      </button>

      <button type="button" className="dashboard-menu-item">
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
        <p className="dashboard-welcome">Espace médecin</p>

        <h1>
          Bonjour, Dr {user.first_name} {user.last_name}
        </h1>

        <p>
          Gérez votre agenda, vos patients et vos consultations.
        </p>
      </div>

      <div className="dashboard-user">
        <div className="dashboard-user-avatar">
          {user.first_name?.charAt(0)}
          {user.last_name?.charAt(0)}
        </div>

        <div>
          <strong>
            Dr {user.first_name} {user.last_name}
          </strong>
          <span>Médecin</span>
        </div>
      </div>
    </header>

    <section className="dashboard-statistics">
      <article className="dashboard-stat-card">
        <div className="stat-icon">📅</div>

        <div>
          <span>Rendez-vous aujourd’hui</span>
          <strong>6</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">📨</div>

        <div>
          <span>Demandes en attente</span>
          <strong>3</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">👥</div>

        <div>
          <span>Patients suivis</span>
          <strong>48</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">✅</div>

        <div>
          <span>Consultations terminées</span>
          <strong>126</strong>
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

          <span className="appointment-status">Confirmé</span>
        </div>

        <div className="next-appointment">
          <div className="dashboard-user-avatar">AS</div>

          <div className="appointment-doctor">
            <span>Patient</span>
            <h3>Aly Sow</h3>
            <p>📅 Samedi 20 juin 2026</p>
            <p>🕙 10 h 00 – 10 h 30</p>
            <p>Motif : douleurs et fatigue</p>
          </div>
        </div>

        <div className="appointment-actions">
          <button
            type="button"
            className="secondary-dashboard-button"
          >
            Voir le dossier
          </button>

          <button
            type="button"
            className="primary-dashboard-button"
          >
            Démarrer la consultation
          </button>
        </div>
      </article>

      <article className="dashboard-panel quick-actions-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Accès rapide</span>
            <h2>Gérer mon activité</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button type="button">
            <span>🕒</span>

            <div>
              <strong>Ajouter une disponibilité</strong>
              <small>Créer un nouveau créneau</small>
            </div>
          </button>

          <button type="button">
            <span>📅</span>

            <div>
              <strong>Consulter mon agenda</strong>
              <small>Voir mes rendez-vous programmés</small>
            </div>
          </button>

          <button type="button">
            <span>📄</span>

            <div>
              <strong>Rédiger une ordonnance</strong>
              <small>Créer une prescription numérique</small>
            </div>
          </button>
        </div>
      </article>
    </section>

    <section className="dashboard-grid dashboard-bottom-grid">
      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Programme du jour</span>
            <h2>Rendez-vous d’aujourd’hui</h2>
          </div>

          <button
            type="button"
            className="dashboard-text-button"
          >
            Voir l’agenda
          </button>
        </div>

        <div className="appointment-list">
          <div className="appointment-list-item">
            <div className="appointment-date">
              <strong>10</strong>
              <span>H 00</span>
            </div>

            <div>
              <h3>Aly Sow</h3>
              <p>Consultation générale</p>
            </div>

            <span className="appointment-status">
              Confirmé
            </span>
          </div>

          <div className="appointment-list-item">
            <div className="appointment-date">
              <strong>11</strong>
              <span>H 00</span>
            </div>

            <div>
              <h3>Fatou Ndiaye</h3>
              <p>Consultation de suivi</p>
            </div>

            <span className="appointment-status">
              Confirmé
            </span>
          </div>

          <div className="appointment-list-item">
            <div className="appointment-date">
              <strong>14</strong>
              <span>H 30</span>
            </div>

            <div>
              <h3>Moussa Fall</h3>
              <p>Première consultation</p>
            </div>

            <span className="appointment-status">
              Confirmé
            </span>
          </div>
        </div>
      </article>

      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>À valider</span>
            <h2>Demandes de rendez-vous</h2>
          </div>

          <button
            type="button"
            className="dashboard-text-button"
          >
            Tout afficher
          </button>
        </div>

        <div className="appointment-list">
          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">AM</div>

            <div>
              <h3>Aminata Mbaye</h3>
              <p>21 juin 2026 · 09 h 00</p>
            </div>

            <div className="doctor-request-actions">
              <button
                type="button"
                className="request-accept-button"
              >
                Accepter
              </button>

              <button
                type="button"
                className="request-refuse-button"
              >
                Refuser
              </button>
            </div>
          </div>

          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">ID</div>

            <div>
              <h3>Ibrahima Diallo</h3>
              <p>21 juin 2026 · 11 h 30</p>
            </div>

            <div className="doctor-request-actions">
              <button
                type="button"
                className="request-accept-button"
              >
                Accepter
              </button>

              <button
                type="button"
                className="request-refuse-button"
              >
                Refuser
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  </main>
</div>

);
}

export default DoctorDashboard;
