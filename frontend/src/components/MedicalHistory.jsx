import { useEffect, useState } from "react";
import api from "../services/api";

const SPECIALTY_ICONS = {
  "Médecine générale": "🩺",
  "Cardiologie": "❤️",
  "Pédiatrie": "🧒",
  "Gynécologie": "🤰",
  "Dermatologie": "🧴",
  "Ophtalmologie": "👁️",
  "Psychiatrie": "🧠",
  "Dentisterie": "🦷",
};

function getSpecialtyIcon(specialtyName) {
  return SPECIALTY_ICONS[specialtyName] || "🩺";
}

function MedicalHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/medical-history");

        setHistory(response.data.history || []);
      } catch (requestError) {
        console.error(requestError);

        setError(
          requestError.response?.data?.message ||
            "Impossible de charger l'historique médical."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatDate = (dateValue) => {
    if (!dateValue) return "Date non disponible";

    return new Date(dateValue).toLocaleDateString("fr-FR", {
      dateStyle: "long",
    });
  };

  const toggleExpand = (appointmentId) => {
    setExpandedId(expandedId === appointmentId ? null : appointmentId);
  };

  if (loading) {
    return (
      <section className="dashboard-panel">
        <p>Chargement de l'historique médical...</p>
      </section>
    );
  }

  return (
    <section className="dashboard-panel">
      <div className="dashboard-panel-heading">
        <div>
          <span>Parcours de santé</span>
          <h2>Mon historique médical</h2>
        </div>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {!error && history.length === 0 && (
        <p>Aucun historique médical disponible pour le moment.</p>
      )}

      <div className="medical-timeline">
        {history.map((entry) => (
          <div className="medical-timeline-item" key={entry.appointment_id}>
            <div className="medical-timeline-marker">
              <span className="medical-timeline-icon">
                {getSpecialtyIcon(entry.specialty_name)}
              </span>
              <div className="medical-timeline-line" />
            </div>

            <div className="medical-timeline-content">
              <button
                type="button"
                className="medical-timeline-header"
                onClick={() => toggleExpand(entry.appointment_id)}
              >
                <div>
                  <h3>
                    Dr {entry.doctor_first_name} {entry.doctor_last_name}
                  </h3>
                  <p>{entry.specialty_name}</p>
                </div>

                <div className="medical-timeline-date">
                  <span>📅 {formatDate(entry.start_time)}</span>
                  <span className="medical-timeline-chevron">
                    {expandedId === entry.appointment_id ? "▲" : "▼"}
                  </span>
                </div>
              </button>

              {expandedId === entry.appointment_id && (
                <div className="medical-timeline-details">
                  <p>
                    <strong>🗒️ Motif :</strong> {entry.reason}
                  </p>

                  {entry.symptoms && (
                    <p>
                      <strong>🤒 Symptômes :</strong> {entry.symptoms}
                    </p>
                  )}

                  {entry.diagnosis && (
                    <p>
                      <strong>🔍 Diagnostic :</strong> {entry.diagnosis}
                    </p>
                  )}

                  {entry.doctor_notes && (
                    <p>
                      <strong>📝 Notes du médecin :</strong>{" "}
                      {entry.doctor_notes}
                    </p>
                  )}

                  {entry.prescription && (
                    <div className="medical-timeline-prescription">
                      <h4>💊 Ordonnance</h4>

                      {entry.prescription.instructions && (
                        <p>{entry.prescription.instructions}</p>
                      )}

                      <ul>
                        {entry.prescription.medications.map(
                          (medication, index) => (
                            <li key={index}>
                              <strong>{medication.medication_name}</strong> —{" "}
                              {medication.dosage}, {medication.frequency},{" "}
                              {medication.duration}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {!entry.diagnosis && !entry.prescription && (
                    <p className="medical-timeline-pending">
                      Consultation confirmée, en attente de compte-rendu
                      médical.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MedicalHistory;