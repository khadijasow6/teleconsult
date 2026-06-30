import { useState } from "react";
import api from "../services/api";

function ProfilePhoto({ user }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // Cette fonction est appelée quand l'utilisateur choisit une image
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Vérifie que le fichier est une image
    if (!file.type.startsWith("image/")) {
      setError("Veuillez choisir une image.");
      return;
    }

    // Vérifie que l'image ne dépasse pas 2 Mo
    if (file.size > 2 * 1024 * 1024) {
      setError("La photo ne doit pas dépasser 2 Mo.");
      return;
    }

    setError("");
    setMessage("");
    setSelectedPhoto(file);

    // Affiche la photo avant son envoi
    setPreview(URL.createObjectURL(file));
  };

  // Envoie la photo au backend
  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedPhoto) {
      setError("Veuillez d’abord choisir une photo.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setMessage("");

      const formData = new FormData();

      // Le nom doit être identique à celui utilisé dans authRoutes.js
      formData.append("profile_photo", selectedPhoto);

      const response = await api.patch(
        "/auth/profile/photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Met à jour les informations enregistrées dans le navigateur
      const storedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const updatedUser = {
        ...storedUser,
        profile_photo: response.data.profile_photo,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setMessage(response.data.message);

      // Recharge la page pour afficher la nouvelle photo
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible d’envoyer la photo."
      );
    } finally {
      setUploading(false);
    }
  };

  const photoUrl = preview
    ? preview
    : user?.profile_photo
      ? `http://localhost:5000${user.profile_photo}`
      : "";

  return (
    <div className="profile-photo-section">
      <div className="profile-photo-preview">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Photo de profil"
          />
        ) : (
          <span>
            {user?.first_name?.trim().charAt(0)}
            {user?.last_name?.trim().charAt(0)}
          </span>
        )}
      </div>

      <form onSubmit={handleUpload}>
        <label htmlFor="profile-photo">
          Choisir une photo
        </label>

        <input
          id="profile-photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handlePhotoChange}
        />

        <button
          type="submit"
          className="primary-dashboard-button"
          disabled={uploading}
        >
          {uploading
            ? "Envoi en cours..."
            : "Enregistrer la photo"}
        </button>
      </form>

      {message && (
        <p className="auth-success">{message}</p>
      )}

      {error && (
        <p className="auth-error">{error}</p>
      )}
    </div>
  );
}

export default ProfilePhoto;