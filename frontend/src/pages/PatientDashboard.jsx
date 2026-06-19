import { useNavigate } from "react-router-dom";
import "../App.css";

function PatientDashboard() {
const navigate = useNavigate();

const storedUser = localStorage.getItem("user");
const user = storedUser
? JSON.parse(storedUser)
: {
first_name: "Aly",
last_name: "Sow",
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
        <span>🔍</span>
        Trouver un médecin
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📅</span>
        Mes rendez-vous
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>💻</span>
        Mes consultations
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📄</span>
        Mes ordonnances
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
        <p className="dashboard-welcome">Bienvenue sur votre espace</p>

        <h1>
          Bonjour, {user.first_name} {user.last_name}
        </h1>

        <p>
          Retrouvez vos rendez-vous, consultations et ordonnances.
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
          <span>Patient</span>
        </div>
      </div>
    </header>

    <section className="dashboard-statistics">
      <article className="dashboard-stat-card">
        <div className="stat-icon">📅</div>

        <div>
          <span>Rendez-vous à venir</span>
          <strong>2</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">✅</div>

        <div>
          <span>Consultations terminées</span>
          <strong>5</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">📄</div>

        <div>
          <span>Ordonnances</span>
          <strong>3</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">🩺</div>

        <div>
          <span>Médecins consultés</span>
          <strong>4</strong>
        </div>
      </article>
    </section>

    <section className="dashboard-grid">
      <article className="dashboard-panel next-appointment-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Prochain rendez-vous</span>
            <h2>Consultation à venir</h2>
          </div>

          <span className="appointment-status">Confirmé</span>
        </div>

        <div className="next-appointment">
          <img
            src="/images/doc-1.jpg"
            alt="Médecin du prochain rendez-vous"
          />

          <div className="appointment-doctor">
            <span>Médecine générale</span>
            <h3>Dr Aïssatou Ndiaye</h3>
            <p>📅 Samedi 20 juin 2026</p>
            <p>🕙 10 h 00 – 10 h 30</p>
          </div>
        </div>

        <div className="appointment-actions">
          <button type="button" className="secondary-dashboard-button">
            Voir les détails
          </button>

          <button type="button" className="primary-dashboard-button">
            Rejoindre la consultation
          </button>
        </div>
      </article>

      <article className="dashboard-panel quick-actions-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Accès rapide</span>
            <h2>Que souhaitez-vous faire ?</h2>
          </div>
        </div>

        <div className="quick-actions">
          <button type="button">
            <span>🔍</span>
            <div>
              <strong>Trouver un médecin</strong>
              <small>Consulter les professionnels disponibles</small>
            </div>
          </button>

          <button type="button">
            <span>📅</span>
            <div>
              <strong>Prendre rendez-vous</strong>
              <small>Choisir une date et un créneau</small>
            </div>
          </button>

          <button type="button">
            <span>📄</span>
            <div>
              <strong>Mes ordonnances</strong>
              <small>Consulter mes prescriptions médicales</small>
            </div>
          </button>
        </div>
      </article>
    </section>

    <section className="dashboard-grid dashboard-bottom-grid">
      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Historique</span>
            <h2>Mes derniers rendez-vous</h2>
          </div>

          <button type="button" className="dashboard-text-button">
            Tout afficher
          </button>
        </div>

        <div className="appointment-list">
          <div className="appointment-list-item">
            <div className="appointment-date">
              <strong>12</strong>
              <span>JUIN</span>
            </div>

            <div>
              <h3>Dr Mamadou Diop</h3>
              <p>Cardiologie · 15 h 30</p>
            </div>

            <span className="status-finished">Terminé</span>
          </div>

          <div className="appointment-list-item">
            <div className="appointment-date">
              <strong>02</strong>
              <span>JUIN</span>
            </div>

            <div>
              <h3>Dr Fatou Sarr</h3>
              <p>Pédiatrie · 09 h 00</p>
            </div>

            <span className="status-finished">Terminé</span>
          </div>
        </div>
      </article>

      <article className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>Documents médicaux</span>
            <h2>Dernières ordonnances</h2>
          </div>

          <button type="button" className="dashboard-text-button">
            Tout afficher
          </button>
        </div>

        <div className="prescription-list">
          <div className="prescription-item">
            <div className="prescription-icon">📄</div>

            <div>
              <h3>Ordonnance du 12 juin 2026</h3>
              <p>Dr Mamadou Diop · Cardiologie</p>
            </div>

            <button type="button">Télécharger</button>
          </div>

          <div className="prescription-item">
            <div className="prescription-icon">📄</div>

            <div>
              <h3>Ordonnance du 2 juin 2026</h3>
              <p>Dr Fatou Sarr · Pédiatrie</p>
            </div>

            <button type="button">Télécharger</button>
          </div>
        </div>
      </article>
    </section>
  </main>
</div>


);
}

export default PatientDashboard;
