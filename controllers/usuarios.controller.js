import prisma from "../utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    })
    if (!usuario) {
      return res
        .status(401)
        .json({ error: "Contraseña y/o usuario incorrectos" });
    }
    const isValid = await bcrypt.compare(password, usuario.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ error: "Contraseña y/o usuario incorrectos" });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      JWT_SECRET,
      {
        expiresIn: "1h",
      },
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "error por parte del servidor" });
  }
}

export async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany();
    if (usuarios.length === 0) {
      return res.status(404).json({ error: "No se encontraron usuarios" });
    }
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "error por parte del servidor" });
  }
}

export async function usuarioPorId(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (usuario === null) {
      return res.status(404).json({ error: "usuario no encontrado" });
    }
    const { password, ...usuarioSinPassword } = usuario;
    res.status(200).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ error: "error por parte del servidor" });
  }
}

export async function crearUsuario(req, res) {
  try {
    if (!req.body.nombre || !req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: req.body.nombre,
        email: req.body.email,
        password: hashPassword,
      },
    });
    const { password, ...usuarioSinPassword } = nuevoUsuario;
    res.status(201).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ msg: "error por parte del servidor", error });
  }
}

export async function actualizarUsuario(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (usuario === null) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const datosActualizados = {};
    if (req.body.nombre) {
      datosActualizados.nombre = req.body.nombre;
    }
    if (req.body.password) {
      datosActualizados.password = await bcrypt.hash(req.body.password, 10);
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: Number(req.params.id) },
      data: datosActualizados,
    });
    const { password, ...usuarioSinPassword } = usuarioActualizado;
    res.status(200).json(usuarioSinPassword);
  } catch (error) {
    res.status(500).json({ error: "error por parte del servidor" });
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (usuario === null) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await prisma.usuario.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "error por parte del servidor" });
  }
}
