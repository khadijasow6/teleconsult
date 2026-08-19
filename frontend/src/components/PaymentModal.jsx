import { useState } from "react";
import api from "../services/api";

function PaymentModal({ appointment, onClose, onPaymentSuccess }) {
  const [step, setStep] = useState("method"); // method | code | success
  const [method, setMethod] = useState("WAVE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [simulatedCode, setSimulatedCode] = useState("");
  const [paymentId, setPaymentId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = appointment.consultation_price;

  const handleInitiate = async (event) => {
    event.preventDefault();
    setError("");

    if (!phoneNumber.trim()) {
      setError("Veuillez saisir votre numéro de téléphone.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/payments/initiate", {
        appointment_id: appointment.appointment_id,
        method,
        phone_number: phoneNumber,
      });

      setPaymentId(response.data.payment_id);
      // En production, ce code serait envoyé par SMS.
      // Ici on le récupère pour la démonstration.
      setSimulatedCode(response.data.simulated_confirmation_code);
      setStep("code");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Impossible d'initier le paiement."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    setError("");

    if (!confirmationCode.trim()) {
      setError("Veuillez saisir le code de confirmation.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/payments/confirm", {
        payment_id: paymentId,
        confirmation_code: confirmationCode,
      });

      setStep("success");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Code de confirmation incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  const methodLabel = method === "WAVE" ? "Wave" : "Orange Money";

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div
        className="payment-modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="payment-modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        {step === "method" && (
          <>
            <div className="payment-modal-header">
              <h2>Paiement de la consultation</h2>
              <p>
                Rendez-vous avec Dr {appointment.doctor_first_name}{" "}
                {appointment.doctor_last_name}
              </p>
            </div>

            <div className="payment-amount">
              <span>Montant à payer</span>
              <strong>
                {Number(amount).toLocaleString("fr-FR")} FCFA
              </strong>
            </div>

            <form onSubmit={handleInitiate}>
              <div className="payment-method-choice">
                <button
                  type="button"
                  className={`payment-method-option ${
                    method === "WAVE" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("WAVE")}
                >
                  <span className="payment-method-dot wave" />
                  Wave
                </button>

                <button
                  type="button"
                  className={`payment-method-option ${
                    method === "ORANGE_MONEY" ? "selected" : ""
                  }`}
                  onClick={() => setMethod("ORANGE_MONEY")}
                >
                  <span className="payment-method-dot orange" />
                  Orange Money
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="payment-phone">
                  Numéro {methodLabel}
                </label>

                <input
                  id="payment-phone"
                  type="tel"
                  placeholder="Ex : 77 123 45 67"
                  value={phoneNumber}
                  onChange={(event) =>
                    setPhoneNumber(event.target.value)
                  }
                  required
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="primary-dashboard-button"
                disabled={loading}
              >
                {loading
                  ? "Envoi en cours..."
                  : `Payer avec ${methodLabel}`}
              </button>
            </form>
          </>
        )}

        {step === "code" && (
          <>
            <div className="payment-modal-header">
              <h2>Confirmez le paiement</h2>
              <p>
                Un code de confirmation a été envoyé au{" "}
                {phoneNumber} (simulation {methodLabel}).
              </p>
            </div>

            <div className="payment-simulated-code">
              Code de démonstration : <strong>{simulatedCode}</strong>
            </div>

            <form onSubmit={handleConfirm}>
              <div className="form-group">
                <label htmlFor="confirmation-code">
                  Code de confirmation
                </label>

                <input
                  id="confirmation-code"
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={confirmationCode}
                  onChange={(event) =>
                    setConfirmationCode(event.target.value)
                  }
                  required
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button
                type="submit"
                className="primary-dashboard-button"
                disabled={loading}
              >
                {loading ? "Vérification..." : "Confirmer le paiement"}
              </button>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="payment-success">
            <div className="payment-success-icon">✅</div>
            <h2>Paiement confirmé !</h2>
            <p>
              Votre rendez-vous a été transmis au médecin. Vous serez
              notifié dès qu'il sera confirmé.
            </p>

            <button
              type="button"
              className="primary-dashboard-button"
              onClick={onPaymentSuccess}
            >
              Retour à mes rendez-vous
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentModal;