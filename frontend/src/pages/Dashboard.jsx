import { useEffect, useState } from "react";
import {
  obtenerPosts,
  obtenerMisPosts,
  crearPost,
  actualizarPost,
  eliminarPost,
} from "../services/posts";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");

  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    cargarPosts();
  }, [filtro]);

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

      setTitulo("");
      setContenido("");
      setEditando(null);

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
  }

  function cancelarEdicion() {
    setEditando(null);
    setTitulo("");
    setContenido("");
    setError("");
  }

  async function handleEliminar(id) {
    const confirmar = window.confirm("¿Seguro que quieres eliminar este post?");

    if (!confirmar) return;

    try {
      await eliminarPost(id);

      setPosts((postsActuales) =>
        postsActuales.filter((post) => post.id !== id),
      );
    } catch (error) {
      console.error(error);

      setError(error.response?.data?.error || "No se pudo eliminar el post");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div>
      <header>
        <h1>Blog API</h1>

        <button onClick={handleLogout}>Cerrar sesión</button>
      </header>

      <main>
        <h2>{editando ? "Editar publicación" : "Nueva publicación"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            placeholder="Contenido"
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Guardando..."
              : editando
                ? "Actualizar"
                : "Crear publicación"}
          </button>

          {editando && (
            <button type="button" onClick={cancelarEdicion}>
              Cancelar
            </button>
          )}
        </form>

        {error && <p>{error}</p>}

        <hr />

        <h2>Publicaciones</h2>
        <div>
          <button onClick={() => setFiltro("todos")}>Todos los posts</button>

          <button onClick={() => setFiltro("mios")}>Mis posts</button>
        </div>

        {posts.length === 0 ? (
          <p>No hay publicaciones.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id}>
              <h3>{post.titulo}</h3>

              <p>{post.contenido}</p>

              <small>Autor: {post.autor.nombre}</small>

              <div>
                <button onClick={() => prepararEdicion(post)}>Editar</button>

                <button onClick={() => handleEliminar(post.id)}>
                  Eliminar
                </button>
              </div>
            </article>
          ))
        )}
      </main>
    </div>
  );
}

export default Dashboard;
