import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";

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
      setError(
        error.response?.data?.error ||
          "No se pudo iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-card">

        <div className="login-logo">
          B
        </div>

        <div className="login-header">
          <p className="login-label">BLOG API</p>

          <h1>Bienvenido de nuevo</h1>

          <p>
            Inicia sesión para acceder a tus publicaciones.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="email">
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Iniciando sesión..."
              : "Iniciar sesión"}
          </button>

        </form>

        <p className="login-footer">
          Sistema de gestión de publicaciones
        </p>

      </div>
    </main>
  );
}

export default Login;