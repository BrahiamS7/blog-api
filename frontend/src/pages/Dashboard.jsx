import { useEffect, useState } from "react";
import {
  obtenerPosts,
  obtenerMisPosts,
  crearPost,
  actualizarPost,
  eliminarPost,
  toggleLike,
} from "../services/posts";

import { logout, getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import Usuarios from "./Usuarios";

function Dashboard() {
  // =========================
  // ESTADOS
  // =========================

  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // Sección actual: posts / usuarios
  const [seccion, setSeccion] = useState("posts");

  // Filtro de posts
  const [filtro, setFiltro] = useState("todos");

  // Formulario de posts
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  // Edición de posts
  const [editando, setEditando] = useState(null);

  // Modal
  const [mostrarModal, setMostrarModal] = useState(false);

  // Loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Usuario obtenido del JWT
  const usuario = getCurrentUser();

  // =========================
  // POSTS
  // =========================

  async function cargarPosts() {
    try {
      setError("");

      const data =
        filtro === "todos" ? await obtenerPosts() : await obtenerMisPosts();

      setPosts(data);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.error || "No se pudieron cargar los posts",
      );

      setPosts([]);
    }
  }

  useEffect(() => {
    if (seccion === "posts") {
      cargarPosts();
    }
  }, [filtro, seccion]);

  // =========================
  // CREAR / EDITAR POST
  // =========================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo.trim() || !contenido.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editando) {
        await actualizarPost(editando.id, {
          titulo,
          contenido,
        });
      } else {
        await crearPost({
          titulo,
          contenido,
        });
      }

      cerrarModal();

      await cargarPosts();
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.error || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // EDITAR
  // =========================

  function prepararEdicion(post) {
    setEditando(post);

    setTitulo(post.titulo);
    setContenido(post.contenido);

    setMostrarModal(true);
  }

  // =========================
  // MODAL
  // =========================

  function abrirModal() {
    setEditando(null);
    setTitulo("");
    setContenido("");
    setError("");

    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);

    setEditando(null);
    setTitulo("");
    setContenido("");
    setError("");
  }

  // =========================
  // ELIMINAR POST
  // =========================

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este post?");

    if (!confirmar) return;

    try {
      setError("");

      await eliminarPost(id);

      setPosts((postsActuales) =>
        postsActuales.filter((post) => post.id !== id),
      );
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.error || "No se pudo eliminar el post");
    }
  }

  async function handleLike(postId) {
    try {
      const data = await toggleLike(postId);

      setPosts((postsActuales) =>
        postsActuales.map((post) =>
          post.id === postId
            ? { ...post, dioLike: data.dioLike, totalLikes: data.totalLikes }
            : post,
        ),
      );
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudo actualizar el like");
    }
  }

  // =========================
  // LOGOUT
  // =========================

  function handleLogout() {
    logout();

    navigate("/login");
  }

  // =========================
  // RENDER
  // =========================

  return (
    <div className="app-layout">
      {/* =========================
          NAVBAR
      ========================= */}

      <header className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">B</span>

          <span>Blog API</span>
        </div>

        <div className="navbar-actions">
          {usuario && (
            <div className="user-info">
              <div className="user-avatar">
                {usuario.email.charAt(0).toUpperCase()}
              </div>

              <div className="user-details">
                <span className="user-email">{usuario.email}</span>

                <span className="user-role">{usuario.rol}</span>
              </div>
            </div>
          )}

          <button className="logout-button" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* =========================
          CONTENIDO
      ========================= */}

      <main className="dashboard">
        {/* HEADER */}

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">DASHBOARD</p>

            <h1>
              {seccion === "posts"
                ? "Tus publicaciones"
                : "Administración de usuarios"}
            </h1>

            <p className="dashboard-description">
              {seccion === "posts"
                ? "Crea, administra y comparte tus publicaciones."
                : "Administra los usuarios de tu aplicación."}
            </p>
          </div>
        </div>

        {/* =========================
            TABS PRINCIPALES
        ========================= */}

        <div className="dashboard-tabs">
          <button
            className={seccion === "posts" ? "active" : ""}
            onClick={() => setSeccion("posts")}
          >
            Publicaciones
          </button>

          {usuario?.rol === "ADMIN" && (
            <button
              className={seccion === "usuarios" ? "active" : ""}
              onClick={() => setSeccion("usuarios")}
            >
              Usuarios
            </button>
          )}
        </div>

        {/* =========================
            MENSAJE DE ERROR
        ========================= */}

        {error && <div className="error-message">{error}</div>}

        {/* =====================================================
            SECCIÓN POSTS
        ===================================================== */}

        {seccion === "posts" && (
          <>
            {/* FILTROS */}

            <div className="post-filters">
              <button
                className={`filter-button ${
                  filtro === "todos" ? "active" : ""
                }`}
                onClick={() => setFiltro("todos")}
              >
                Todos los posts
              </button>

              <button
                className={`filter-button ${filtro === "mios" ? "active" : ""}`}
                onClick={() => setFiltro("mios")}
              >
                Mis posts
              </button>
            </div>

            {/* POSTS */}

            <section>
              {posts.length === 0 ? (
                <div className="empty-state">
                  <h2>No hay publicaciones</h2>

                  <p>Todavía no existen publicaciones para mostrar.</p>
                </div>
              ) : (
                <div className="posts-grid">
                  {posts.map((post) => (
                    <article className="post-card" key={post.id}>
                      <div className="post-card-header">
                        <h3>{post.titulo}</h3>

                        <span className="post-author">
                          Publicado por{" "}
                          <strong>{post.autor?.nombre || "Usuario"}</strong>
                        </span>
                      </div>

                      <p className="post-content">{post.contenido}</p>


                      {/* SOLO EL AUTOR PUEDE EDITAR/ELIMINAR */}

                      <div className="post-card-actions">
                        <button
                          className={`like-button ${post.dioLike ? "is-active" : ""}`}
                          onClick={() => handleLike(post.id)}
                        >
                          {post.dioLike ? "❤️" : "🤍"} {post.totalLikes}
                        </button>

                        {usuario && post.autorId === usuario.id && (
                          <>
                            <button
                              className="edit-button"
                              onClick={() => prepararEdicion(post)}
                            >
                              Editar
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleEliminar(post.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            {/* BOTÓN CREAR */}

            <button className="floating-create-button" onClick={abrirModal}>
              + Nueva publicación
            </button>
          </>
        )}

        {/* =====================================================
            SECCIÓN USUARIOS
        ===================================================== */}

        {seccion === "usuarios" && usuario?.rol === "ADMIN" && <Usuarios />}
      </main>

      {/* =====================================================
          MODAL CREAR / EDITAR POST
      ===================================================== */}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div>
                <p className="dashboard-label">
                  {editando ? "EDITAR" : "NUEVA PUBLICACIÓN"}
                </p>

                <h2>{editando ? "Editar publicación" : "Nueva publicación"}</h2>
              </div>

              <button className="close-button" onClick={cerrarModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Título</label>

              <input
                type="text"
                placeholder="Título de la publicación"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <label>Contenido</label>

              <textarea
                placeholder="Escribe tu publicación..."
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={cerrarModal}
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
                      ? "Actualizar"
                      : "Publicar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
