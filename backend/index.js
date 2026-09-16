import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import cookieParser from "cookie-parser";
import usuariosRouter from "./routes/usuarios.routes.js";
import postsRouter from "./routes/post.routes.js";
const app = express();

const origenesPermitidos = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((origen) => origen.trim())
  : ["http://localhost:5173"];

app.use(helmet());
app.use(
  cors({
    origin: origenesPermitidos,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "API FUNCIONANDO" });
});
app.use("/usuarios", usuariosRouter);
app.use("/posts", postsRouter);

export default app;