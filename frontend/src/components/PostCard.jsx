import { useState } from "react";
import { toggleLike } from "../services/posts";

function PostCard({ post, onEdit, onDelete }) {
  const [dioLike, setDioLike] = useState(post.dioLike);
  const [totalLikes, setTotalLikes] = useState(post.totalLikes);
  const [cargando, setCargando] = useState(false);

  async function manejarLike() {
    setCargando(true);
    try {
      const data = await toggleLike(post.id);
      setDioLike(data.dioLike);
      setTotalLikes(data.totalLikes);
    } catch (error) {
      console.error("No se pudo actualizar el like:", error);
    } finally {
      setCargando(false);
    }
  }

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div>
          <h3>{post.titulo}</h3>
          <span className="post-author">Por {post.autor.nombre}</span>
        </div>
      </div>

      <p className="post-content">{post.contenido}</p>

      <div className="post-card-actions">
        <button
          className={`like-button ${dioLike ? "is-active" : ""}`}
          onClick={manejarLike}
          disabled={cargando}
        >
          {dioLike ? "❤️" : "🤍"} {totalLikes}
        </button>

        <button className="edit-button" onClick={() => onEdit(post)}>
          Editar
        </button>

        <button className="delete-button" onClick={() => onDelete(post.id)}>
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default PostCard;