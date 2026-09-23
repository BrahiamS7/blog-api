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
import BrandMark from "../components/BrandMark";
import Usuarios from "./Usuarios";

function HeartIcon({ filled }) {
  return (
    <svg
      className="heart-icon"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 20.5s-7.5-4.6-10-9.3C.4 8 1.7 4.5 5 3.4c2.2-.8 4.5 0 6 2 1.5-2 3.8-2.8 6-2 3.3 1.1 4.6 4.6 3 7.8-2.5 4.7-10 9.3-10 9.3Z" />
    </svg>
  );
}

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const [seccion, setSeccion] = useState("posts");
  const [filtro, setFiltro] = useState("todos");

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [editando, setEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pulsandoId, setPulsandoId] = useState(null);

  const navigate = useNavigate();
  const usuario = getCurrentUser();

  async function cargarPosts() {
    try {
      setError("");
      const data =
        filtro === "todos" ? await obtenerPosts() : await obtenerMisPosts();
      setPosts(data);
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudieron cargar los posts");
      setPosts([]);
    }
  }

  useEffect(() => {
    if (seccion === "posts") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      cargarPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, seccion]);

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
        await actualizarPost(editando.id, { titulo, contenido });
      } else {
        await crearPost({ titulo, contenido });
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

  function prepararEdicion(post) {
    setEditando(post);
    setTitulo(post.titulo);
    setContenido(post.contenido);
    setMostrarModal(true);
  }

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

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que querés eliminar este post?");
    if (!confirmar) return;

    try {
      setError("");
      await eliminarPost(id);
      setPosts((postsActuales) => postsActuales.filter((post) => post.id !== id));
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

      if (data.dioLike) {
        setPulsandoId(postId);
        setTimeout(() => setPulsandoId(null), 420);
      }
    } catch (error) {
      console.error(error);
      setError(error.response?.data?.error || "No se pudo actualizar el like");
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const primerNombre = usuario?.nombre?.split(" ")[0] || usuario?.email;

  return (
    <div className="app-shell">
      <title>{seccion === "usuarios" ? "Personas" : "Inicio"} — Eco</title>
      <meta name="robots" content="noindex" />

      <header className="topbar">
        <div className="topbar-brand">
          <BrandMark size={26} />
          <span className="auth-wordmark">Eco</span>
        </div>

        <div className="user-chip">
          {usuario && (
            <div className="user-chip-identity">
              <div className="user-chip-avatar">
                {usuario.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-chip-text">
                <span className="user-chip-name">{usuario.nombre || usuario.email}</span>
                <span className="user-chip-role">{usuario.rol}</span>
              </div>
            </div>
          )}

          <button className="btn-text" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </header>

      <main className="feed-page">
        {usuario?.rol === "ADMIN" && (
          <nav className="section-nav">
            <button
              className={seccion === "posts" ? "is-active" : ""}
              onClick={() => setSeccion("posts")}
            >
              Publicaciones
            </button>
            <button
              className={seccion === "usuarios" ? "is-active" : ""}
              onClick={() => setSeccion("usuarios")}
            >
              Personas
            </button>
          </nav>
        )}

        {seccion === "posts" && (
          <>
            <h1 className="feed-greeting">Hola, {primerNombre}</h1>
            <p className="feed-subtitle">¿Qué tenés ganas de contar hoy?</p>

            <button className="composer-trigger" onClick={abrirModal}>
              <span className="user-chip-avatar">
                {usuario?.email.charAt(0).toUpperCase()}
              </span>
              Escribí algo nuevo...
            </button>

            <div className="feed-filters">
              <div className="feed-filter-tabs">
                <button
                  className={filtro === "todos" ? "is-active" : ""}
                  onClick={() => setFiltro("todos")}
                >
                  Para vos
                </button>
                <button
                  className={filtro === "mios" ? "is-active" : ""}
                  onClick={() => setFiltro("mios")}
                >
                  Lo tuyo
                </button>
              </div>
              {posts.length > 0 && (
                <span className="feed-count">
                  {posts.length} {posts.length === 1 ? "publicación" : "publicaciones"}
                </span>
              )}
            </div>

            {error && (
              <div className="error-banner" role="alert">
                {error}
              </div>
            )}

            {posts.length === 0 ? (
              <div className="empty-state">
                <h2>Todavía no hay nada por acá</h2>
                <p>
                  {filtro === "todos"
                    ? "Sé la primera persona en contar algo."
                    : "Lo que escribas va a aparecer en esta sección."}
                </p>
              </div>
            ) : (
              <div className="feed-list">
                {posts.map((post) => (
                  <article className="feed-entry" key={post.id}>
                    <div className="feed-entry-meta">
                      Por <strong>{post.autor?.nombre || "alguien"}</strong>
                    </div>

                    <h3 className="feed-entry-title">{post.titulo}</h3>
                    <p className="feed-entry-body">{post.contenido}</p>

                    <div className="feed-entry-actions">
                      <button
                        className={`like-btn ${post.dioLike ? "is-liked" : ""} ${
                          pulsandoId === post.id ? "pulse" : ""
                        }`}
                        onClick={() => handleLike(post.id)}
                      >
                        <HeartIcon filled={post.dioLike} />
                        {post.totalLikes}
                      </button>

                      {usuario && post.autorId === usuario.id && (
                        <>
                          <button
                            className="btn-text"
                            onClick={() => prepararEdicion(post)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-text is-danger"
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
          </>
        )}

        {seccion === "usuarios" && usuario?.rol === "ADMIN" && <Usuarios />}
      </main>

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-head">
              <h2>{editando ? "Editar publicación" : "Nueva publicación"}</h2>
              <button className="icon-btn" onClick={cerrarModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="field">
                <label htmlFor="titulo">Título</label>
                <input
                  id="titulo"
                  type="text"
                  placeholder="Ponele un título"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="contenido">Contenido</label>
                <textarea
                  id="contenido"
                  placeholder="Contá lo que quieras..."
                  value={contenido}
                  onChange={(e) => setContenido(e.target.value)}
                />
              </div>

              {error && (
                <div className="form-note is-error" role="alert">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? "Guardando..." : editando ? "Guardar cambios" : "Publicar"}
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
