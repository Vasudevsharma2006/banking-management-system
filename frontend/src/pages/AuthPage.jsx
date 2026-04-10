import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.email.includes("@")) return "Please enter a valid email";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(form.password)) return "Password must include one uppercase letter";
    if (!/[0-9]/.test(form.password)) return "Password must include one number";
    if (mode === "register" && form.name.trim().length < 2) return "Name is too short";
    return "";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container auth-wrap">
      <form className="card auth-card" onSubmit={onSubmit}>
        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        <p>Access your secure banking account.</p>

        {mode === "register" && (
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="John Doe"
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="you@bank.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="At least 6 chars"
            required
          />
        </div>

        {error && <p className="alert error">{error}</p>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        <button
          type="button"
          className="btn-link"
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "New user? Register here" : "Already have an account? Login"}
        </button>
      </form>
    </section>
  );
};

export default AuthPage;

