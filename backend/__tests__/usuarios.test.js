import request from "supertest";
import bcrypt from "bcrypt";
import app from "../index.js";
import prisma from "../utils/prisma.js";

describe("Usuarios", () => {
  const idsCreados = [];

  afterAll(async () => {
    await prisma.usuario.deleteMany({ where: { id: { in: idsCreados } } });
    await prisma.$disconnect();
  });

  it("deberia permitir el registro publico de un usuario nuevo", async () => {
    const email = `registro-test-${Date.now()}@example.com`;

    const respuesta = await request(app).post("/usuarios/registro").send({
      nombre: "Usuario Registrado",
      email,
      password: "contraseñaDePrueba123",
    });

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.rol).toBe("USUARIO");
    expect(respuesta.body.password).toBeUndefined();

    idsCreados.push(respuesta.body.id);
  });

  it("no deberia permitir registrar dos usuarios con el mismo email", async () => {
    const email = `duplicado-test-${Date.now()}@example.com`;

    const primero = await request(app).post("/usuarios/registro").send({
      nombre: "Usuario Uno",
      email,
      password: "contraseñaDePrueba123",
    });
    idsCreados.push(primero.body.id);

    const segundo = await request(app).post("/usuarios/registro").send({
      nombre: "Usuario Dos",
      email,
      password: "contraseñaDePrueba123",
    });

    expect(segundo.status).toBe(409);
  });

  it("no deberia permitir que un usuario normal liste todos los usuarios", async () => {
    const email = `normal-test-${Date.now()}@example.com`;
    const passwordHasheada = await bcrypt.hash("contraseñaDePrueba123", 10);

    const usuario = await prisma.usuario.create({
      data: { nombre: "Usuario Normal", email, password: passwordHasheada, rol: "USUARIO" },
    });
    idsCreados.push(usuario.id);

    const loginResponse = await request(app)
      .post("/usuarios/login")
      .send({ email, password: "contraseñaDePrueba123" });
    const cookie = loginResponse.headers["set-cookie"];

    const respuesta = await request(app).get("/usuarios").set("Cookie", cookie);

    expect(respuesta.status).toBe(403);
  });

  it("deberia rechazar login con contraseña incorrecta", async () => {
    const email = `login-test-${Date.now()}@example.com`;
    const passwordHasheada = await bcrypt.hash("contraseñaDePrueba123", 10);

    const usuario = await prisma.usuario.create({
      data: { nombre: "Usuario Login", email, password: passwordHasheada, rol: "USUARIO" },
    });
    idsCreados.push(usuario.id);

    const respuesta = await request(app)
      .post("/usuarios/login")
      .send({ email, password: "contraseñaIncorrecta" });

    expect(respuesta.status).toBe(401);
  });
});
