import "dotenv/config";
import cors from "cors";
import express from "express";
import usuariosRouter from "./routes/usuarios.routes.js";
import postsRouter from "./routes/post.routes.js";
const app = express();
app.use(
  cors({
    origin: "*",
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API FUNCIONANDO" });
});
app.use("/usuarios", usuariosRouter);
app.use("/posts", postsRouter);

export default app;