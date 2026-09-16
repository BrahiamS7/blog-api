import request from "supertest";
import bcrypt from "bcrypt";
import app from "../index.js";
import prisma from "../utils/prisma.js";

describe("Posts", () => {
  let tokenUsuario;
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

    const tokenAdmin = loginAdminResponse.body.token; // ajustá "token" si tu API lo llama distinto (ej: accessToken)


    const emailPrueba = `usuario-test-${Date.now()}@example.com`;
    const crearUsuarioResponse = await request(app)
      .post("/usuarios")
      .set("Authorization", `Bearer ${tokenAdmin}`)
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

    tokenUsuario = loginUsuarioResponse.body.token;
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
      .set("Authorization", `Bearer ${tokenUsuario}`)
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
});
