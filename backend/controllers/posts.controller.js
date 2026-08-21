import prisma from "../utils/prisma.js";

export async function obtenerPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        autor: { select: { nombre: true } },
        _count: { select: { likes: true } },
        likes: {
          where: { usuarioId: req.usuario.id },
          select: { id: true },
        },
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({
        error: "No se encontraron posts",
      });
    }
    const postsConLikes = posts.map((post) => ({
      ...post,
      totalLikes: post._count.likes,
      dioLike: post.likes.length > 0,
      likes: undefined,
      _count: undefined,
    }));

    res.status(200).json(postsConLikes);
  } catch (error) {
    res.status(500).json({
      msg: "error por parte del servidor",
      error,
    });
  }
}

export async function misPosts(req, res) {
  try {
    const posts = await prisma.post.findMany({
      where: { autorId: req.usuario.id },
      include: {
        autor: { select: { nombre: true } },
        _count: { select: { likes: true } },
        likes: {
          where: { usuarioId: req.usuario.id },
          select: { id: true },
        },
      },
    });

    if (posts.length === 0) {
      return res.status(404).json({
        error: "No se encontraron posts",
      });
    }

    const postsConLikes = posts.map((post) => ({
      ...post,
      totalLikes: post._count.likes,
      dioLike: post.likes.length > 0,
      likes: undefined,
      _count: undefined,
    }));

    res.status(200).json(postsConLikes);
  } catch (error) {
    res.status(500).json({
      msg: "error por parte del servidor",
      error: error.message,
    });
  }
}

export async function postPorId(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        autor: { select: { nombre: true } },
        _count: { select: { likes: true } },
        likes: {
          where: { usuarioId: req.usuario.id },
          select: { id: true },
        },
      },
    });

    if (post === null) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    const postConLikes = {
      ...post,
      totalLikes: post._count.likes,
      dioLike: post.likes.length > 0,
      likes: undefined,
      _count: undefined,
    };

    res.status(200).json(postConLikes);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function crearPost(req, res) {
  try {
    if (!req.body.titulo || !req.body.contenido) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const nuevoPost = await prisma.post.create({
      data: {
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        autorId: req.usuario.id,
      },
    });

    res.status(201).json(nuevoPost);
  } catch (error) {
    res.status(500).json({
      msg: "error por parte del servidor",
      error,
    });
  }
}

export async function actualizarPost(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (post === null) {
      return res.status(404).json({
        error: "Post no encontrado",
      });
    }

    // Solo el autor o un ADMIN puede modificar el post
    if (post.autorId !== req.usuario.id && req.usuario.rol !== "ADMIN") {
      return res.status(403).json({
        error: "No tienes permiso para modificar este post",
      });
    }

    const newData = {};

    if (req.body.titulo) {
      newData.titulo = req.body.titulo;
    }

    if (req.body.contenido) {
      newData.contenido = req.body.contenido;
    }

    const postActualizado = await prisma.post.update({
      where: {
        id: Number(req.params.id),
      },
      data: newData,
      include: {
        autor: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    res.status(200).json(postActualizado);
  } catch (error) {
    res.status(500).json({
      msg: "error por parte del servidor",
      error,
    });
  }
}

export async function eliminarPost(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });

    if (post === null) {
      return res.status(404).json({
        error: "Post no encontrado",
      });
    }

    // Solo el autor o un ADMIN puede eliminar el post
    if (post.autorId !== req.usuario.id && req.usuario.rol !== "ADMIN") {
      return res.status(403).json({
        error: "No tienes permiso para eliminar este post",
      });
    }

    await prisma.post.delete({
      where: {
        id: Number(req.params.id),
      },
    });

    res.status(200).json({
      msg: "Post eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      msg: "error por parte del servidor",
      error,
    });
  }
}
export async function toggleLike(req, res) {
  try {
    let dioLike = false;
    const likeExistente = await prisma.like.findUnique({
      where: {
        usuarioId_postId: {
          usuarioId: req.usuario.id,
          postId: Number(req.params.id),
        },
      },
    });

    if (likeExistente) {
      await prisma.like.delete({
        where: {
          usuarioId_postId: {
            usuarioId: req.usuario.id,
            postId: Number(req.params.id),
          },
        },
      });
      dioLike = false;
    } else {
      await prisma.like.create({
        data: {
          usuarioId: req.usuario.id,
          postId: Number(req.params.id),
        },
      });
      dioLike = true;
    }

    const totalLikes = await prisma.like.count({
      where: { postId: Number(req.params.id) },
    });

    res.status(200).json({
      msg: "Like actualizado correctamente",
      dioLike,
      totalLikes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "error por parte del servidor", error: error.message });
  }
}
