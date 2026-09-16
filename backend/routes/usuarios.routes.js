import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  obtenerUsuarios,
  usuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
} from "../controllers/usuarios.controller.js";
import {
  verificarToken,
  esAdmin,
} from "../middleware/auth.middleware.js";
const router = Router();

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión, probá de nuevo más tarde" },
});

router.get("/", verificarToken, esAdmin, obtenerUsuarios);
router.get("/:id", verificarToken, esAdmin, usuarioPorId);
router.post("/", verificarToken, esAdmin, crearUsuario);
router.post("/registro", crearUsuario);
router.post("/login", limiteLogin, login);
router.put("/:id", verificarToken, esAdmin, actualizarUsuario);
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);
export default router;
