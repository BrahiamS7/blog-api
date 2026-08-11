import "dotenv/config";
import cors from "cors";
import express from "express";
import usuariosRouter from "./routes/usuarios.routes.js";
import postsRouter from "./routes/post.routes.js";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API FUNCIONANDO" });
});
app.use("/usuarios", usuariosRouter);
app.use("/posts", postsRouter);

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port} `);
});
