import request from "supertest";
import bcrypt from "bcrypt";
import app from "../index.js";
import prisma from "../utils/prisma.js";

describe("Posts", () => {
  let cookieUsuario;
  let usuarioPruebaId;
  let admin;

  beforeAll(async () => {
    await prisma.post.deleteMany({
      where: {
        autor: {
          email: {
            contains: "admin-test",
          },
        },
      },
    });
    await prisma.usuario.deleteMany({
      where: {
        email: {
          contains: "admin-test",
        },
      },
    });


    const passwordHasheada = await bcrypt.hash("contraseñaDePrueba123", 10);
    const emailAdmin = `admin-test-${Date.now()}@example.com`;

    admin = await prisma.usuario.create({
      data: {
        nombre: "Admin Test",
        email: emailAdmin,
        password: passwordHasheada,
        rol: "ADMIN",
      },
    });


    const loginAdminResponse = await request(app).post("/usuarios/login").send({
      email: emailAdmin,
      password: "contraseñaDePrueba123",
    });

    const cookieAdmin = loginAdminResponse.headers["set-cookie"];


    const emailPrueba = `usuario-test-${Date.now()}@example.com`;
    const crearUsuarioResponse = await request(app)
      .post("/usuarios")
      .set("Cookie", cookieAdmin)
      .send({
        nombre: "Usuario Prueba",
        email: emailPrueba,
        password: "contraseñaDePrueba123",
      });
    usuarioPruebaId = crearUsuarioResponse.body.id;

    const loginUsuarioResponse = await request(app)
      .post("/usuarios/login")
      .send({
        email: emailPrueba,
        password: "contraseñaDePrueba123",
      });

    cookieUsuario = loginUsuarioResponse.headers["set-cookie"];
  });

  afterAll(async () => {
    await prisma.post.deleteMany({
      where: {
        autorId: {
          in: [admin.id, usuarioPruebaId],
        },
      },
    });
    await prisma.usuario.deleteMany({
      where: {
        id: {
          in: [admin.id, usuarioPruebaId],
        },
      },
    });
    await prisma.$disconnect();
  });

  it("deberia crear un post cuando los datos son validos", async () => {
    const crearPost = await request(app)
      .post("/posts/")
      .set("Cookie", cookieUsuario)
      .send({
        titulo: "Post de prueba en test",
        contenido: "Este es un texto de prueba lorem",
      });
    expect(crearPost.status).toBe(201);
    expect(crearPost.body.titulo).toBe("Post de prueba en test");
  });

  it("Deberia rechazar la creacion de un post sin token",async()=>{
    const respuesta=await request(app)
    .post('/posts/')
    .send({
      titulo:'Post de prueba en test',
      contenido:'Contenido de prueba en test'
    })
    expect(respuesta.status).toBe(401);
    expect(respuesta.body.msg).toBe('Token no proporcionado')
  })

  it("no deberia permitir que un usuario edite el post de otro usuario", async () => {
    const postDeUsuario = await request(app)
      .post("/posts/")
      .set("Cookie", cookieUsuario)
      .send({
        titulo: "Post que no deberia poder editar otro usuario",
        contenido: "Contenido original",
      });

    const passwordHasheada = await bcrypt.hash("contraseñaDePrueba123", 10);
    const emailIntruso = `intruso-test-${Date.now()}@example.com`;
    const intruso = await prisma.usuario.create({
      data: {
        nombre: "Usuario Intruso",
        email: emailIntruso,
        password: passwordHasheada,
        rol: "USUARIO",
      },
    });

    const loginIntrusoResponse = await request(app)
      .post("/usuarios/login")
      .send({ email: emailIntruso, password: "contraseñaDePrueba123" });
    const cookieIntruso = loginIntrusoResponse.headers["set-cookie"];

    const respuesta = await request(app)
      .put(`/posts/${postDeUsuario.body.id}`)
      .set("Cookie", cookieIntruso)
      .send({ titulo: "Intento de edicion ajena" });

    expect(respuesta.status).toBe(403);

    await prisma.post.delete({ where: { id: postDeUsuario.body.id } });
    await prisma.usuario.delete({ where: { id: intruso.id } });
  });
});
