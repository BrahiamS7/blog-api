function PostCard({
  post,
  onEdit,
  onDelete,
}) {
  return (
    <article className="post-card">
      <div className="post-card-header">
        <div>
          <h3>{post.titulo}</h3>

          <span className="post-author">
            Por {post.autor.nombre}
          </span>
        </div>
      </div>

      <p className="post-content">
        {post.contenido}
      </p>

      <div className="post-card-actions">
        <button
          className="edit-button"
          onClick={() => onEdit(post)}
        >
          Editar
        </button>

        <button
          className="delete-button"
          onClick={() => onDelete(post.id)}
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default PostCard;