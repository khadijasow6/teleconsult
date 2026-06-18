import "../App.css";

function Home()  {
return ( <div> <header className="header"> <div className="topbar"> <div className="container topbar-content"> <p>Votre plateforme de téléconsultation médicale</p>

        <div className="topbar-contact">
          <span>📞 +221 77 000 00 00</span>
          <span>✉ contact@samasante.sn</span>
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
          <button type="button" className="login-btn">
            Connexion
          </button>

          <button type="button" className="appointment-btn">
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
            <button type="button" className="primary-btn">
              Prendre rendez-vous
            </button>

            <button type="button" className="outline-btn">
              Trouver un médecin
            </button>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/images/bg_1.jpg"
            alt="Médecin disponible pour une téléconsultation"
          />

          <div className="image-info-card">
            <span>✓ Médecins qualifiés</span>
            <span>✓ Consultation sécurisée</span>
            <span>✓ Ordonnance numérique</span>
          </div>
        </div>
      </div>
    </section>

    <section id="fonctionnement" className="how-it-works">
      <div className="container">
        <div className="section-heading">
          <span>Simple et rapide</span>

          <h2>Comment fonctionne SamaSanté ?</h2>

          <p>
            Réalisez votre consultation médicale à distance en trois
            étapes.
          </p>
        </div>

        <div className="steps">
          <article className="step-card">
            <div className="step-number">1</div>

            <h3>Trouvez un médecin</h3>

            <p>
              Recherchez un professionnel de santé selon son nom ou sa
              spécialité.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number">2</div>

            <h3>Réservez un créneau</h3>

            <p>
              Choisissez une date et une heure parmi les disponibilités du
              médecin.
            </p>
          </article>

          <article className="step-card">
            <div className="step-number">3</div>

            <h3>Consultez en vidéo</h3>

            <p>
              Rejoignez votre médecin en ligne depuis votre espace patient.
            </p>
          </article>
        </div>
      </div>
    </section>

    <section id="specialites" className="specialties-section">
      <div className="container">
        <div className="section-heading">
          <span>Nos spécialités</span>

          <h2>Des médecins pour répondre à vos besoins</h2>

          <p>
            Choisissez la spécialité médicale adaptée à votre situation.
          </p>
        </div>

        <div className="specialties-grid">
          <article className="specialty-card">
            <div className="specialty-icon">🩺</div>
            <h3>Médecine générale</h3>
            <p>Consultations générales et orientation médicale.</p>
          </article>

          <article className="specialty-card">
            <div className="specialty-icon">❤️</div>
            <h3>Cardiologie</h3>
            <p>Diagnostic et suivi des maladies cardiovasculaires.</p>
          </article>

          <article className="specialty-card">
            <div className="specialty-icon">🧴</div>
            <h3>Dermatologie</h3>
            <p>Diagnostic et traitement des maladies de la peau.</p>
          </article>

          <article className="specialty-card">
            <div className="specialty-icon">👶</div>
            <h3>Pédiatrie</h3>
            <p>Suivi médical des enfants et des adolescents.</p>
          </article>

          <article className="specialty-card">
            <div className="specialty-icon">🧠</div>
            <h3>Psychologie</h3>
            <p>Accompagnement psychologique et soutien émotionnel.</p>
          </article>

          <article className="specialty-card">
            <div className="specialty-icon">👁️</div>
            <h3>Ophtalmologie</h3>
            <p>Diagnostic et suivi des maladies des yeux.</p>
          </article>
        </div>
      </div>
    </section>
    <section id="medecins" className="doctors-section">
  <div className="container">
    <div className="section-heading">
      <span>Nos médecins</span>
      <h2>Consultez des professionnels qualifiés</h2>
      <p>
        Découvrez nos médecins disponibles pour vos consultations à distance.
      </p>
    </div>
    
<div className="doctors-grid">
  <article className="doctor-card">
    <img
      src="/images/doc-1.jpg"
      alt="Médecin généraliste"
    />

    <div className="doctor-content">
      <span className="doctor-specialty">Médecine générale</span>
      <h3>Dr Aïssatou Ndiaye</h3>
      <p>8 années d’expérience</p>

      <div className="doctor-status">
        <span>● Disponible aujourd’hui</span>
      </div>

      <button type="button" className="doctor-button">
        Prendre rendez-vous
      </button>
    </div>
  </article>

  <article className="doctor-card">
    <img
      src="/images/doc-2.jpg"
      alt="Médecin cardiologue"
    />

    <div className="doctor-content">
      <span className="doctor-specialty">Cardiologie</span>
      <h3>Dr Khadija  Gueye</h3>
      <p>12 années d’expérience</p>

      <div className="doctor-status">
        <span>● Disponible demain</span>
      </div>

      <button type="button" className="doctor-button">
        Prendre rendez-vous
      </button>
    </div>
  </article>

  <article className="doctor-card">
    <img
      src="/images/doc-3.jpg"
      alt="Médecin pédiatre"
    />

    <div className="doctor-content">
      <span className="doctor-specialty">Pédiatrie</span>
      <h3>Dr Amadou Sow</h3>
      <p>10 années d’expérience</p>

      <div className="doctor-status">
        <span>● Disponible aujourd’hui</span>
      </div>

      <button type="button" className="doctor-button">
        Prendre rendez-vous
      </button>
    </div>
  </article>
</div>
  </div>
</section>
<section id="contact" className="contact-section">
  <div className="container contact-content">
    <div className="contact-text">
      <span>Besoin d’aide ?</span>

```
  <h2>Notre équipe vous accompagne</h2>

  <p>
    Une question concernant un rendez-vous, votre compte ou une
    téléconsultation ? Contactez l’équipe SamaSanté.
  </p>

  <div className="contact-details">
    <p>📞 +221 77 000 00 00</p>
    <p>✉ contact@samasante.sn</p>
    <p>📍 Dakar, Sénégal</p>
  </div>
</div>

<form className="contact-form">
  <div className="form-group">
    <label htmlFor="contact-name">Nom complet</label>
    <input
      id="contact-name"
      type="text"
      placeholder="Votre nom complet"
    />
  </div>

  <div className="form-group">
    <label htmlFor="contact-email">Adresse e-mail</label>
    <input
      id="contact-email"
      type="email"
      placeholder="Votre adresse e-mail"
    />
  </div>

  <div className="form-group">
    <label htmlFor="contact-message">Message</label>
    <textarea
      id="contact-message"
      rows="5"
      placeholder="Écrivez votre message"
    />
  </div>

  <button type="submit" className="contact-button">
    Envoyer le message
  </button>
</form>

  </div>
</section>


  </main>
  <footer className="footer">
  <div className="container footer-content">
    <div className="footer-brand">
      <a className="logo footer-logo" href="#accueil">
        <span className="logo-symbol">✚</span>
        <span>SamaSanté</span>
      </a>

      <p>
        Votre plateforme de téléconsultation médicale simple, rapide et
        sécurisée.
      </p>
    </div>

    <div className="footer-column">
      <h3>Navigation</h3>
      <a href="#accueil">Accueil</a>
      <a href="#medecins">Médecins</a>
      <a href="#specialites">Spécialités</a>
      <a href="#fonctionnement">Comment ça marche ?</a>
    </div>

    <div className="footer-column">
      <h3>Informations</h3>
      <a href="#contact">Contact</a>
      <a href="#confidentialite">Confidentialité</a>
      <a href="#conditions">Conditions d’utilisation</a>
    </div>

    <div className="footer-column">
      <h3>Nous contacter</h3>
      <p>📞 +221 77 000 00 00</p>
      <p>✉ contact@samasante.sn</p>
      <p>📍 Dakar, Sénégal</p>
    </div>
  </div>

  <div className="footer-bottom">
    <div className="container">
      <p>© 2026 SamaSanté. Tous droits réservés.</p>
    </div>
  </div>
</footer>
</div>

);
}

export default Home;
