import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/auth";
import BrandMark from "../components/BrandMark";

function AuthRipple() {
  return (
    <svg className="auth-ripple" viewBox="0 0 400 400" fill="none">
      <circle cx="70" cy="200" r="5" fill="#FF5A36" opacity="0.4" />
      <path d="M110 200a90 90 0 0 1 90-90" stroke="#FF5A36" strokeWidth="1.5" opacity="0.18" strokeLinecap="round" />
      <path d="M110 200a150 150 0 0 1 150-150" stroke="#FF5A36" strokeWidth="1.5" opacity="0.13" strokeLinecap="round" />
      <path d="M110 200a210 210 0 0 1 210-210" stroke="#FF5A36" strokeWidth="1.5" opacity="0.08" strokeLinecap="round" />
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Correo y contraseña son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.error || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <AuthRipple />

      <div className="auth-card">
        <div className="auth-brand">
          <BrandMark size={28} />
          <span className="auth-wordmark">Eco</span>
        </div>

        <h1 className="auth-heading">Qué bueno verte de nuevo</h1>
        <p className="auth-subtitle">
          Entrá para leer lo que se está contando hoy.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && <div className="form-note is-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Todavía no tenés cuenta? <Link to="/register">Creá una</Link>
        </p>
      </div>
    </main>
  );
}

export default Login;
