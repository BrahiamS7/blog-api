import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrar, login } from "../services/auth";
import BrandMark from "../components/BrandMark";

function AuthRipple() {
  return (
    <svg className="auth-ripple" viewBox="0 0 400 400" fill="none">
      <circle cx="330" cy="200" r="5" fill="#FF5A36" opacity="0.4" />
      <path d="M290 200a90 90 0 0 0-90-90" stroke="#FF5A36" strokeWidth="1.5" opacity="0.18" strokeLinecap="round" />
      <path d="M290 200a150 150 0 0 0-150-150" stroke="#FF5A36" strokeWidth="1.5" opacity="0.13" strokeLinecap="round" />
      <path d="M290 200a210 210 0 0 0-210-210" stroke="#FF5A36" strokeWidth="1.5" opacity="0.08" strokeLinecap="round" />
    </svg>
  );
}

function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nombre.trim() || !email.trim() || !password.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await registrar(nombre, email, password);
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.msg ||
          "No se pudo crear la cuenta",
      );
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

        <h1 className="auth-heading">Empecemos a escribir</h1>
        <p className="auth-subtitle">
          Tu cuenta te toma un minuto en crearse.
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
            />
          </div>

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
              placeholder="Ocho caracteres, con un número"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="form-note is-error">{error}</div>}

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
