import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../App.css";

function Login() {
const navigate = useNavigate();
const [formData, setFormData] = useState({
email: "",
password: "",
});

const [message, setMessage] = useState("");
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

setMessage("");
setError("");
setLoading(true);

try {
  const response = await api.post("/auth/login", formData);
localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));

setMessage("Connexion réussie !");

if (response.data.user.role === "PATIENT") {
  navigate("/patient/dashboard");
}
  console.log("Utilisateur connecté :", response.data.user);
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible de se connecter au serveur."
  );
} finally {
  setLoading(false);
}


};

return ( <main className="auth-page"> <div className="auth-container"> <section className="auth-information"> <Link className="auth-logo" to="/"> <span className="logo-symbol">✚</span> <span>SamaSanté</span> </Link>


      <div>
        <span className="auth-badge">Espace sécurisé</span>

        <h1>Bienvenue sur SamaSanté</h1>

        <p>
          Connectez-vous pour gérer vos rendez-vous, rejoindre une
          consultation vidéo et consulter vos ordonnances.
        </p>
      </div>

      <div className="auth-benefits">
        <span>✓ Accès sécurisé à votre compte</span>
        <span>✓ Gestion simple des rendez-vous</span>
        <span>✓ Consultation médicale à distance</span>
      </div>
    </section>

    <section className="auth-form-wrapper">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-heading">
          <h2>Connexion</h2>
          <p>Entrez vos informations pour accéder à votre espace.</p>
        </div>

        {error && <p className="auth-error">{error}</p>}
        {message && <p className="auth-success">{message}</p>}

        <div className="form-group">
          <label htmlFor="login-email">Adresse e-mail</label>

          <input
            id="login-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Mot de passe</label>

          <input
            id="login-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Votre mot de passe"
            required
          />
        </div>

        <div className="login-options">
          <label className="remember-me">
            <input type="checkbox" />
            <span>Se souvenir de moi</span>
          </label>

          <button type="button" className="forgot-password">
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          className="auth-submit-button"
          disabled={loading}
        >
          {loading ? "Connexion en cours..." : "Se connecter"}
        </button>

        <p className="auth-switch">
          Vous n’avez pas encore de compte ?{" "}
          <Link to="/register">Créer un compte</Link>
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

export default Login;
