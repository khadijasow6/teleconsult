import { useEffect, useState } from "react";
import api from "../services/api";

function PatientPrescriptions() {
const [prescriptions, setPrescriptions] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [downloadingId, setDownloadingId] = useState(null);

useEffect(() => {
const loadPrescriptions = async () => {
try {
setLoading(true);
setError("");


    const response = await api.get(
      "/prescriptions/patient"
    );

    setPrescriptions(
      response.data.prescriptions || []
    );
  } catch (requestError) {
    console.error(requestError);

    setError(
      requestError.response?.data?.message ||
        "Impossible de charger les ordonnances."
    );
  } finally {
    setLoading(false);
  }
};

loadPrescriptions();


}, []);

const formatDate = (dateValue) => {
if (!dateValue) {
return "Date non disponible";
}


return new Date(dateValue).toLocaleDateString(
  "fr-FR",
  {
    dateStyle: "long",
  }
);


};

const handleDownloadPdf = async (prescriptionId) => {
try {
setDownloadingId(prescriptionId);


  const response = await api.get(
    `/prescriptions/${prescriptionId}/pdf`,
    { responseType: "blob" }
  );

  const blobUrl = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );

  const link = document.createElement("a");
  link.href = blobUrl;
  link.setAttribute(
    "download",
    `ordonnance-${prescriptionId}.pdf`
  );
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
} catch (requestError) {
  console.error(requestError);
  alert("Impossible de télécharger le PDF pour le moment.");
} finally {
  setDownloadingId(null);
}


};

if (loading) {
return ( <section className="dashboard-panel"> <p>Chargement des ordonnances...</p> </section>
);
}

return ( <section className="dashboard-panel"> <div className="dashboard-panel-heading"> <div> <span>Documents médicaux</span> <h2>Mes ordonnances</h2> </div> </div>


  {error && (
    <p className="auth-error">{error}</p>
  )}

  {!error && prescriptions.length === 0 && (
    <p>
      Aucune ordonnance disponible pour le moment.
    </p>
  )}

  <div className="appointment-list">
    {prescriptions.map((prescription) => (
      <article
        className="appointment-list-item"
        key={prescription.prescription_id}
      >
        <div className="prescription-icon">📄</div>

        <div>
          <h3>
            Ordonnance du{" "}
            {formatDate(prescription.issued_at)}
          </h3>

          <p>
            Dr {prescription.doctor_first_name}{" "}
            {prescription.doctor_last_name}
          </p>

          <p>
            Spécialité :{" "}
            {prescription.specialty_name}
          </p>

          <p>
            <strong>Diagnostic :</strong>{" "}
            {prescription.diagnosis}
          </p>

          {prescription.prescription_instructions && (
            <p>
              <strong>Instructions :</strong>{" "}
              {
                prescription.prescription_instructions
              }
            </p>
          )}

          {prescription.items?.map((item) => (
            <div
              className="prescription-item"
              key={item.item_id}
            >
              <div>
                <h3>{item.medication_name}</h3>
                <p>Dosage : {item.dosage}</p>
                <p>Fréquence : {item.frequency}</p>
                <p>Durée : {item.duration}</p>

                {item.instructions && (
                  <p>
                    Instructions : {item.instructions}
                  </p>
                )}
              </div>
            </div>
          ))}

          <br />

          <button
            type="button"
            className="primary-dashboard-button"
            onClick={() =>
              handleDownloadPdf(prescription.prescription_id)
            }
            disabled={
              downloadingId === prescription.prescription_id
            }
          >
            {downloadingId === prescription.prescription_id
              ? "Génération..."
              : "📥 Télécharger en PDF"}
          </button>
        </div>
      </article>
    ))}
  </div>
</section>


);
}

export default PatientPrescriptions;