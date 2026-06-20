import { useEffect, useState } from "react";
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
account_type: "PATIENT",
specialty_id: "",
license_number: "",
biography: "",
years_of_experience: "",
consultation_price: "",

});


const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [specialties, setSpecialties] = useState([]);

useEffect(() => {
const loadSpecialties = async () => {
try {
const response = await api.get("/specialties");


  setSpecialties(
    response.data.specialties || []
  );
} catch (requestError) {
  console.error(
    "Erreur chargement spécialités :",
    requestError
  );
}


};

loadSpecialties();
}, []);


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
  if (formData.account_type === "MEDECIN") {
const response = await api.post(
"/auth/register-doctor",
{
first_name: formData.first_name,
last_name: formData.last_name,
email: formData.email,
phone: formData.phone,
password: formData.password,
specialty_id: formData.specialty_id,
license_number: formData.license_number,
biography: formData.biography,
years_of_experience:
formData.years_of_experience,
consultation_price:
formData.consultation_price,
}
);

alert(response.data.message);
navigate("/login");
} else {
const response = await api.post(
"/auth/register",
{
first_name: formData.first_name,
last_name: formData.last_name,
email: formData.email,
phone: formData.phone,
password: formData.password,
}
);

localStorage.setItem(
"token",
response.data.token
);

localStorage.setItem(
"user",
JSON.stringify(response.data.user)
);

navigate("/patient/dashboard");
}

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
        <div className="form-group">
  <label htmlFor="account-type">
    Type de compte
  </label>

<select
id="account-type"
name="account_type"
value={formData.account_type}
onChange={handleChange}
required

>


<option value="PATIENT">
  Je suis un patient
</option>

<option value="MEDECIN">
  Je suis un médecin
</option>

  </select>
</div>


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
      
{formData.account_type === "MEDECIN" && (
<> <div className="form-group"> <label htmlFor="register-specialty">
Spécialité </label>


  <select
    id="register-specialty"
    name="specialty_id"
    value={formData.specialty_id}
    onChange={handleChange}
    required
  >
    <option value="">
      Sélectionnez une spécialité
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

<div className="form-group">
  <label htmlFor="register-license">
    Numéro de licence
  </label>

  <input
    id="register-license"
    type="text"
    name="license_number"
    value={formData.license_number}
    onChange={handleChange}
    placeholder="Exemple : SN-MED-2026-002"
    required
  />
</div>

<div className="form-group">
  <label htmlFor="register-experience">
    Années d’expérience
  </label>

  <input
    id="register-experience"
    type="number"
    name="years_of_experience"
    value={formData.years_of_experience}
    onChange={handleChange}
    placeholder="Exemple : 5"
    min="0"
    required
  />
</div>

<div className="form-group">
  <label htmlFor="register-price">
    Tarif de consultation (FCFA)
  </label>

  <input
    id="register-price"
    type="number"
    name="consultation_price"
    value={formData.consultation_price}
    onChange={handleChange}
    placeholder="Exemple : 15000"
    min="0"
    required
  />
</div>

<div className="form-group">
  <label htmlFor="register-biography">
    Biographie professionnelle
  </label>

  <textarea
    id="register-biography"
    name="biography"
    value={formData.biography}
    onChange={handleChange}
    placeholder="Présentez brièvement votre parcours et votre expérience."
    rows="4"
  />
</div>


</>
)}




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
