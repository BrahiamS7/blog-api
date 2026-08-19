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

    // 1. Hashear una contraseña para el admin semilla
    const passwordHasheada = await bcrypt.hash("contraseñaDePrueba123", 10);
    const emailAdmin = `admin-test-${Date.now()}@example.com`;
    // 2. Crear el admin directo con Prisma (sin pasar por HTTP)
    admin = await prisma.usuario.create({
      data: {
        nombre: "Admin Test",
        email: emailAdmin,
        password: passwordHasheada,
        rol: "ADMIN",
      },
    });

    // 3. Login del admin vía HTTP, para conseguir su token real
    // (acá usás supertest contra tu endpoint de login)
    const loginAdminResponse = await request(app).post("/usuarios/login").send({
      email: emailAdmin,
      password: "contraseñaDePrueba123",
    });

    const tokenAdmin = loginAdminResponse.body.token; // ajustá "token" si tu API lo llama distinto (ej: accessToken)

    // 4. Con el token del admin, crear el usuario de prueba
    // vía POST a tu endpoint protegido de crear usuarios
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

    // 5. Login del usuario de prueba, para guardar tokenUsuario
    const loginUsuarioResponse = await request(app)
      .post("/usuarios/login")
      .send({
        email: emailPrueba,
        password: "contraseñaDePrueba123",
      });

    tokenUsuario = loginUsuarioResponse.body.token;
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
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
