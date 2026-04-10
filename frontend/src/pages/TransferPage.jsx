import { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

const TransferPage = () => {
  const { refreshProfile } = useAuth();
  const [form, setForm] = useState({ recipientAccountNumber: "", amount: "", note: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.recipientAccountNumber.trim()) return setError("Recipient account number is required");
    if (Number(form.amount) <= 0) return setError("Amount must be greater than zero");

    try {
      setLoading(true);
      const { data } = await api.post("/transactions/transfer", {
        recipientAccountNumber: form.recipientAccountNumber.trim(),
        amount: Number(form.amount),
        note: form.note
      });
      setMessage(data.message);
      setForm({ recipientAccountNumber: "", amount: "", note: "" });
      await refreshProfile();
    } catch (err) {
      setError(err?.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container auth-wrap">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>Transfer Money</h2>
        <p>Send funds securely to another account.</p>

        <div className="form-group">
          <label>Recipient Account Number</label>
          <input
            type="text"
            name="recipientAccountNumber"
            value={form.recipientAccountNumber}
            onChange={onChange}
            placeholder="ACC12345678"
            required
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            min="1"
            step="0.01"
            name="amount"
            value={form.amount}
            onChange={onChange}
            placeholder="500"
            required
          />
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <input
            type="text"
            name="note"
            value={form.note}
            onChange={onChange}
            placeholder="Rent, utility bill, etc."
          />
        </div>

        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}

        <button className="btn-primary" disabled={loading}>
          {loading ? "Processing..." : "Send Money"}
        </button>
      </form>
    </section>
  );
};

export default TransferPage;

