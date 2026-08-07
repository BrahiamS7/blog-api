import prisma from "../utils/prisma.js";

export async function obtenerPosts(req, res) {
  try {
    const posts = await prisma.post.findMany();
    if (posts.length === 0) {
      return res.status(404).json({ error: "No se encontraron posts" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function postPorId(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (post === null) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function crearPost(req, res) {
  try {
    if (!req.body.titulo || !req.body.contenido || !req.body.autorId) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const nuevoPost = await prisma.post.create({
      data: {
        titulo: req.body.titulo,
        contenido: req.body.contenido,
        autorId: Number(req.body.autorId),
      },
    });
    res.status(201).json(nuevoPost);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function actualizarPost(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (post === null) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    const newData = {};
    if (req.body.titulo) {
      newData.titulo = req.body.titulo;
    }
    if (req.body.contenido) {
      newData.contenido = req.body.contenido;
    }
    const postActualizado = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: newData,
    });
    res.status(200).json(postActualizado);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function eliminarPost(req, res) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (post === null) {
      return res.status(404).json({ error: "Post no encontrado" });
    }
    await prisma.post.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(200).json({ msg: "Post eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}
