import "./App.css";

function App() {
  return (
    <div>
      <header className="header">
        <div className="topbar">
          <div className="container topbar-content">
            <p>Votre plateforme de téléconsultation médicale</p>

            <div className="topbar-contact">
              <span>📞 +221 77 000 00 00</span>
              <span>✉ contact@teleconsult.sn</span>
            </div>
          </div>
        </div>

        <nav className="navbar">
          <div className="container navbar-content">
            <a className="logo" href="#accueil">
              <span className="logo-symbol">✚</span>
             <span>SamaSanté</span>
            </a>

            <div className="nav-links">
              <a href="#accueil">Accueil</a>
              <a href="#medecins">Médecins</a>
              <a href="#specialites">Spécialités</a>
              <a href="#fonctionnement">Comment ça marche ?</a>
              <a href="#contact">Contact</a>
            </div>

            <div className="nav-buttons">
              <button className="login-btn">Connexion</button>
              <button className="appointment-btn">
                Prendre rendez-vous
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section id="accueil" className="hero">
          <div className="container hero-content">
            <div className="hero-text">
              <span className="hero-badge">
                Consultation médicale à distance
              </span>

              <h1>
                Votre médecin,
                <br />
                disponible où que
                <br />
                vous soyez
              </h1>

              <p>
                Trouvez un médecin, choisissez un créneau et réalisez votre
                consultation vidéo depuis votre téléphone ou votre ordinateur.
              </p>

              <div className="hero-buttons">
                <button className="primary-btn">
                  Prendre rendez-vous
                </button>

                <button className="outline-btn">
                  Trouver un médecin
                </button>
              </div>
            </div>

            <div className="hero-card">
              <div className="video-icon">🩺</div>
              <h2>Consultez en toute simplicité</h2>
              <p>
                Des médecins qualifiés et disponibles pour vous accompagner à
                distance.
              </p>

              <div className="hero-features">
                <span>✓ Rendez-vous rapide</span>
                <span>✓ Consultation vidéo</span>
                <span>✓ Ordonnance numérique</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;