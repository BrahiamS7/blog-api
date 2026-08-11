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

      setError(
        error.response?.data?.error ||
          "No se pudieron cargar los usuarios"
      );
    }
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function limpiarFormulario() {
    setNombre("");
    setEmail("");
    setPassword("");
    setEditando(null);
    setMostrarFormulario(false);
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
        const datos = {
          nombre,
        };

        if (password.trim()) {
          datos.password = password;
        }

        const usuarioActualizado =
          await actualizarUsuario(
            editando.id,
            datos
          );

        setUsuarios((usuariosActuales) =>
          usuariosActuales.map((usuario) =>
            usuario.id === editando.id
              ? {
                  ...usuario,
                  ...usuarioActualizado,
                }
              : usuario
          )
        );
      } else {
        const nuevoUsuario = await crearUsuario({
          nombre,
          email,
          password,
        });

        setUsuarios((usuariosActuales) => [
          ...usuariosActuales,
          nuevoUsuario,
        ]);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo guardar el usuario"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleEliminar(usuario) {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar a ${usuario.nombre}?`
    );

    if (!confirmar) return;

    try {
      setError("");

      await eliminarUsuario(usuario.id);

      setUsuarios((usuariosActuales) =>
        usuariosActuales.filter(
          (item) => item.id !== usuario.id
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error ||
          "No se pudo eliminar el usuario"
      );
    }
  }

  return (
    <section className="usuarios-section">

      <div className="section-header">

        <div>
          <p className="dashboard-label">
            ADMINISTRACIÓN
          </p>

          <h2>Usuarios</h2>

          <p>
            Administra los usuarios registrados
            en la aplicación.
          </p>
        </div>

        <button
          className="create-button"
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
        >
          + Crear usuario
        </button>

      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {mostrarFormulario && (
        <div className="user-form-card">

          <div className="modal-header">

            <div>
              <p className="dashboard-label">
                {editando
                  ? "EDITAR"
                  : "NUEVO USUARIO"}
              </p>

              <h2>
                {editando
                  ? "Editar usuario"
                  : "Crear usuario"}
              </h2>
            </div>

            <button
              className="close-button"
              onClick={limpiarFormulario}
            >
              ×
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Nombre</label>

              <input
                type="text"
                placeholder="Nombre completo"
                value={nombre}
                onChange={(e) =>
                  setNombre(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Correo</label>

              <input
                type="email"
                placeholder="correo@email.com"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                disabled={!!editando}
              />
            </div>

            <div className="form-group">
              <label>
                {editando
                  ? "Nueva contraseña (opcional)"
                  : "Contraseña"}
              </label>

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />
            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={limpiarFormulario}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="create-button"
                disabled={loading}
              >
                {loading
                  ? "Guardando..."
                  : editando
                    ? "Guardar cambios"
                    : "Crear usuario"}
              </button>

            </div>

          </form>

        </div>
      )}

      <div className="users-list">

        {usuarios.length === 0 ? (
          <div className="empty-state">
            <h3>No hay usuarios</h3>
          </div>
        ) : (
          usuarios.map((usuario) => (
            <article
              className="user-card"
              key={usuario.id}
            >

              <div className="user-avatar">
                {usuario.nombre
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="user-card-info">

                <h3>
                  {usuario.nombre}
                </h3>

                <p>
                  {usuario.email}
                </p>

              </div>

              <span
                className={`role-badge ${
                  usuario.rol === "ADMIN"
                    ? "admin"
                    : "user"
                }`}
              >
                {usuario.rol}
              </span>

              <div className="user-card-actions">

                <button
                  className="edit-button"
                  onClick={() =>
                    prepararEdicion(usuario)
                  }
                >
                  Editar
                </button>

                <button
                  className="delete-button"
                  onClick={() =>
                    handleEliminar(usuario)
                  }
                >
                  Eliminar
                </button>

              </div>

            </article>
          ))
        )}

      </div>

    </section>
  );
}

export default Usuarios;