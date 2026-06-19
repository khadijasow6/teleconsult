import { useState } from "react";
import api from "../services/api";

function PrescriptionForm({ appointments, onPrescriptionCreated }) {
const [formData, setFormData] = useState({
appointment_id: "",
symptoms: "",
diagnosis: "",
doctor_notes: "",
instructions: "",
additional_notes: "",
medication_name: "",
dosage: "",
frequency: "",
duration: "",
medication_instructions: "",
});

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const availableAppointments = appointments.filter(
(appointment) =>
appointment.status === "CONFIRME" ||
appointment.status === "TERMINE"
);

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

try {
  setLoading(true);

  const response = await api.post("/prescriptions", {
    appointment_id: Number(formData.appointment_id),
    symptoms: formData.symptoms,
    diagnosis: formData.diagnosis,
    doctor_notes: formData.doctor_notes,
    instructions: formData.instructions,
    additional_notes: formData.additional_notes,
    items: [
      {
        medication_name: formData.medication_name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        instructions: formData.medication_instructions,
      },
    ],
  });

  setMessage(response.data.message);

  setFormData({
    appointment_id: "",
    symptoms: "",
    diagnosis: "",
    doctor_notes: "",
    instructions: "",
    additional_notes: "",
    medication_name: "",
    dosage: "",
    frequency: "",
    duration: "",
    medication_instructions: "",
  });

  if (onPrescriptionCreated) {
    await onPrescriptionCreated();
  }
} catch (requestError) {
  setError(
    requestError.response?.data?.message ||
      "Impossible de créer l’ordonnance."
  );
} finally {
  setLoading(false);
}


};

return ( <section className="dashboard-panel" id="doctor-prescriptions"> <div className="dashboard-panel-heading"> <div> <span>Prescription médicale</span> <h2>Rédiger une ordonnance</h2> </div> </div>


  {message && <p className="auth-success">{message}</p>}
  {error && <p className="auth-error">{error}</p>}

  {availableAppointments.length === 0 ? (
    <p>
      Aucun rendez-vous confirmé disponible pour créer une
      ordonnance.
    </p>
  ) : (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="prescription-appointment">
          Patient et rendez-vous
        </label>

        <select
          id="prescription-appointment"
          name="appointment_id"
          value={formData.appointment_id}
          onChange={handleChange}
          required
        >
          <option value="">Choisir un patient</option>

          {availableAppointments.map((appointment) => (
            <option
              key={appointment.appointment_id}
              value={appointment.appointment_id}
            >
              {appointment.patient_first_name}{" "}
              {appointment.patient_last_name} —{" "}
              {new Date(
                appointment.start_time
              ).toLocaleString("fr-FR")}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="symptoms">Symptômes</label>

        <textarea
          id="symptoms"
          name="symptoms"
          value={formData.symptoms}
          onChange={handleChange}
          rows="3"
          placeholder="Symptômes observés"
        />
      </div>

      <div className="form-group">
        <label htmlFor="diagnosis">Diagnostic</label>

        <textarea
          id="diagnosis"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          rows="3"
          placeholder="Diagnostic médical"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="medication-name">
          Nom du médicament
        </label>

        <input
          id="medication-name"
          type="text"
          name="medication_name"
          value={formData.medication_name}
          onChange={handleChange}
          placeholder="Exemple : Paracétamol"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="dosage">Dosage</label>

        <input
          id="dosage"
          type="text"
          name="dosage"
          value={formData.dosage}
          onChange={handleChange}
          placeholder="Exemple : 500 mg"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="frequency">Fréquence</label>

        <input
          id="frequency"
          type="text"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          placeholder="Exemple : 3 fois par jour"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="duration">Durée</label>

        <input
          id="duration"
          type="text"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Exemple : 5 jours"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="medication-instructions">
          Instructions pour le médicament
        </label>

        <textarea
          id="medication-instructions"
          name="medication_instructions"
          value={formData.medication_instructions}
          onChange={handleChange}
          rows="2"
          placeholder="Exemple : après les repas"
        />
      </div>

      <div className="form-group">
        <label htmlFor="general-instructions">
          Instructions générales
        </label>

        <textarea
          id="general-instructions"
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          rows="3"
          placeholder="Conseils et recommandations"
        />
      </div>

      <div className="form-group">
        <label htmlFor="doctor-notes">
          Notes médicales
        </label>

        <textarea
          id="doctor-notes"
          name="doctor_notes"
          value={formData.doctor_notes}
          onChange={handleChange}
          rows="3"
          placeholder="Notes du médecin"
        />
      </div>

      <button
        type="submit"
        className="primary-dashboard-button"
        disabled={loading}
      >
        {loading
          ? "Enregistrement..."
          : "Enregistrer l’ordonnance"}
      </button>
    </form>
  )}
</section>


);
}

export default PrescriptionForm;
