import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registrar, login } from "../services/auth";

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
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">B</div>

        <div className="login-header">
          <p className="login-label">BLOG API</p>

          <h1>Creá tu cuenta</h1>

          <p>Registrate para empezar a publicar.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              type="password"
              placeholder="Mínimo 8 caracteres, con un número"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="login-footer">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </div>
    </main>
  );
}

export default Register;
