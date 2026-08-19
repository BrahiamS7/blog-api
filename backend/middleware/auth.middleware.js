import jwt from "jsonwebtoken";

export function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "Token no proporcionado",error });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido o expirado", error });
  }
}
export function esAdmin(req, res, next) {
  if (req.usuario.rol !== "ADMIN") {
    return res
      .status(403)
      .json({ error: "Acceso denegado, solo administradores" });
  }
  next();
}
