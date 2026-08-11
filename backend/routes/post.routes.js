import { Router } from "express";
import {
  obtenerPosts,
  postPorId,
  crearPost,
  actualizarPost,
  eliminarPost,
  misPosts,
} from "../controllers/posts.controller.js";
import { verificarToken } from "../middleware/auth.middleware.js";
const router = Router();

router.get("/", verificarToken, obtenerPosts);
router.get("/mis-posts", verificarToken, misPosts);
router.get("/:id", verificarToken, postPorId);
router.post("/", verificarToken, crearPost);
router.put("/:id", verificarToken, actualizarPost);
router.delete("/:id", verificarToken, eliminarPost);
export default router;
