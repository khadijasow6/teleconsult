import { useNavigate } from "react-router-dom";
import "../App.css";

function AdminDashboard() {
const navigate = useNavigate();

const storedUser = localStorage.getItem("user");

const user = storedUser
? JSON.parse(storedUser)
: {
first_name: "Khadija",
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
        <span>👥</span>
        Utilisateurs
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>🩺</span>
        Médecins
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>🧑‍🤝‍🧑</span>
        Patients
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>🏥</span>
        Spécialités
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📅</span>
        Rendez-vous
      </button>

      <button type="button" className="dashboard-menu-item">
        <span>📊</span>
        Statistiques
      </button>

      <button type="button" className="dashboard-menu-item">
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

    <section className="dashboard-statistics">
      <article className="dashboard-stat-card">
        <div className="stat-icon">👥</div>

        <div>
          <span>Utilisateurs inscrits</span>
          <strong>156</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">🩺</div>

        <div>
          <span>Médecins actifs</span>
          <strong>24</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">📅</div>

        <div>
          <span>Rendez-vous</span>
          <strong>89</strong>
        </div>
      </article>

      <article className="dashboard-stat-card">
        <div className="stat-icon">⏳</div>

        <div>
          <span>Médecins à valider</span>
          <strong>4</strong>
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
          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">FN</div>

            <div>
              <h3>Dr Fatou Ndiaye</h3>
              <p>Cardiologie · Dakar</p>
            </div>

            <div className="doctor-request-actions">
              <button
                type="button"
                className="request-accept-button"
              >
                Valider
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
            <div className="dashboard-user-avatar">MF</div>

            <div>
              <h3>Dr Moussa Fall</h3>
              <p>Dermatologie · Thiès</p>
            </div>

            <div className="doctor-request-actions">
              <button
                type="button"
                className="request-accept-button"
              >
                Valider
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
            <div className="dashboard-user-avatar">AD</div>

            <div>
              <h3>Dr Awa Diop</h3>
              <p>Pédiatrie · Saint-Louis</p>
            </div>

            <div className="doctor-request-actions">
              <button
                type="button"
                className="request-accept-button"
              >
                Valider
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
          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">AS</div>

            <div>
              <h3>Aly Sow</h3>
              <p>Patient · Inscrit aujourd’hui</p>
            </div>

            <span className="appointment-status">Actif</span>
          </div>

          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">MD</div>

            <div>
              <h3>Dr Mamadou Diop</h3>
              <p>Médecin · Inscrit aujourd’hui</p>
            </div>

            <span className="appointment-status">Actif</span>
          </div>

          <div className="appointment-list-item">
            <div className="dashboard-user-avatar">AM</div>

            <div>
              <h3>Aminata Mbaye</h3>
              <p>Patient · Inscrite hier</p>
            </div>

            <span className="appointment-status">Actif</span>
          </div>
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
  </main>
</div>

);
}

export default AdminDashboard;
