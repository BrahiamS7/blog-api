import { useEffect, useState } from "react";
import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from "../services/usuarios";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function cargarUsuarios() {
    try {
      setError("");
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudieron cargar los usuarios");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    cargarUsuarios();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setEmail("");
    setPassword("");
    setEditando(null);
    setMostrarFormulario(false);
    setError("");
  }

  function prepararEdicion(usuario) {
    setEditando(usuario);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setPassword("");
    setMostrarFormulario(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!nombre.trim() || !email.trim()) {
      setError("Nombre y correo son obligatorios");
      return;
    }

    if (!editando && !password.trim()) {
      setError("La contraseña es obligatoria");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editando) {
        const datos = { nombre };
        if (password.trim()) {
          datos.password = password;
        }

        const usuarioActualizado = await actualizarUsuario(editando.id, datos);

        setUsuarios((usuariosActuales) =>
          usuariosActuales.map((usuario) =>
            usuario.id === editando.id
              ? { ...usuario, ...usuarioActualizado }
              : usuario,
          ),
        );
      } else {
        const nuevoUsuario = await crearUsuario({ nombre, email, password });
        setUsuarios((usuariosActuales) => [...usuariosActuales, nuevoUsuario]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudo guardar el usuario");
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(usuario) {
    const confirmar = window.confirm(`¿Seguro que querés eliminar a ${usuario.nombre}?`);
    if (!confirmar) return;

    try {
      setError("");
      await eliminarUsuario(usuario.id);
      setUsuarios((usuariosActuales) =>
        usuariosActuales.filter((item) => item.id !== usuario.id),
      );
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudo eliminar el usuario");
    }
  }

  return (
    <section>
      <div className="admin-head">
        <div>
          <h1 className="feed-greeting" style={{ fontSize: 26 }}>
            Personas
          </h1>
          <p>Quién tiene cuenta en Eco.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          Agregar persona
        </button>
      </div>

      {error && !mostrarFormulario && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="empty-state">
          <h2>No hay nadie todavía</h2>
        </div>
      ) : (
        <div className="admin-list">
          {usuarios.map((usuario) => (
            <div className="admin-row" key={usuario.id}>
              <div className="admin-row-identity">
                <div className="user-chip-avatar">
                  {usuario.nombre.charAt(0).toUpperCase()}
                </div>
                <div className="admin-row-text">
                  <strong>{usuario.nombre}</strong>
                  <span>{usuario.email}</span>
                </div>
              </div>

              <span className={`role-tag ${usuario.rol === "ADMIN" ? "is-admin" : ""}`}>
                {usuario.rol === "ADMIN" ? "Admin" : "Usuario"}
              </span>

              <div className="admin-row-actions">
                <button className="btn-text" onClick={() => prepararEdicion(usuario)}>
                  Editar
                </button>
                <button
                  className="btn-text is-danger"
                  onClick={() => handleEliminar(usuario)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <h2>{editando ? "Editar persona" : "Agregar persona"}</h2>
              <button className="icon-btn" onClick={limpiarFormulario}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field">
                <label htmlFor="nombre-usuario">Nombre</label>
                <input
                  id="nombre-usuario"
                  type="text"
                  placeholder="Nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="email-usuario">Correo</label>
                <input
                  id="email-usuario"
                  type="email"
                  placeholder="correo@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!editando}
                />
              </div>

              <div className="field">
                <label htmlFor="password-usuario">
                  {editando ? "Nueva contraseña (opcional)" : "Contraseña"}
                </label>
                <input
                  id="password-usuario"
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="form-note is-error" role="alert">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={limpiarFormulario}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editando ? "Guardar cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Usuarios;
