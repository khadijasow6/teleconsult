import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Register() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
first_name: "",
last_name: "",
email: "",
phone: "",
password: "",
confirmPassword: "",
});

const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

const handleChange = (event) => {
setFormData({
...formData,
[event.target.name]: event.target.value,
});
};

const handleSubmit = async (event) => {
event.preventDefault();

setError("");

if (formData.password !== formData.confirmPassword) {
  setError("Les mots de passe ne correspondent pas.");
  return;
}

if (formData.password.length < 6) {
  setError("Le mot de passe doit contenir au moins 6 caractères.");
  return;
}

setLoading(true);

try {
  const response = await api.post("/auth/register", {
    first_name: formData.first_name,
    last_name: formData.last_name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
  });

  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  navigate("/patient/dashboard");
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible de créer le compte."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="auth-page register-page"> <div className="auth-container"> <section className="auth-information"> <Link className="auth-logo" to="/"> <span className="logo-symbol">✚</span> <span>SamaSanté</span> </Link>

      <div>
        <span className="auth-badge">Inscription patient</span>

        <h1>Créez votre espace santé</h1>

        <p>
          Inscrivez-vous pour trouver un médecin, réserver une
          téléconsultation et consulter vos ordonnances.
        </p>
      </div>

      <div className="auth-benefits">
        <span>✓ Inscription simple et rapide</span>
        <span>✓ Données personnelles sécurisées</span>
        <span>✓ Accès à des médecins qualifiés</span>
      </div>
    </section>

    <section className="auth-form-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-heading">
          <h2>Créer un compte</h2>
          <p>Complétez vos informations personnelles.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <div className="register-name-grid">
          <div className="form-group">
            <label htmlFor="register-first-name">Prénom</label>

            <input
              id="register-first-name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Votre prénom"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-last-name">Nom</label>

            <input
              id="register-last-name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Votre nom"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Adresse e-mail</label>

          <input
            id="register-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-phone">Téléphone</label>

          <input
            id="register-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+221 77 000 00 00"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Mot de passe</label>

          <input
            id="register-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 6 caractères"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">
            Confirmer le mot de passe
          </label>

          <input
            id="register-confirm-password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Répétez votre mot de passe"
            required
          />
        </div>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={loading}
        >
          {loading ? "Création du compte..." : "Créer mon compte"}
        </button>

        <p className="auth-switch">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>

        <Link className="back-home-link" to="/">
          ← Retour à l’accueil
        </Link>
      </form>
    </section>
  </div>
</main>

);
}

export default Register;
