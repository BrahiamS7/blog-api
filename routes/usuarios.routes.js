import { Router } from "express";
import {
  obtenerUsuarios,
  usuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  login,
} from "../controllers/usuarios.controller.js";
import { verificarToken, esAdmin } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", verificarToken, esAdmin, obtenerUsuarios);
router.get("/:id", verificarToken, esAdmin, usuarioPorId);
router.post("/", verificarToken, esAdmin, crearUsuario);
router.post("/login", login);
router.put("/:id", verificarToken, esAdmin, actualizarUsuario);
router.delete("/:id", verificarToken, esAdmin, eliminarUsuario);
export default router;
