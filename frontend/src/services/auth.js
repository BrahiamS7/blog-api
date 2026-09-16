import api from "../api/axios";

export async function registrar(nombre, email, password) {
  const response = await api.post("/usuarios/registro", {
    nombre,
    email,
    password,
  });

  return response.data;
}

export async function login(email, password) {
  const response = await api.post("/usuarios/login", {
    email,
    password,
  });

  localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

  return response.data;
}

export async function logout() {
  try {
    await api.post("/usuarios/logout");
  } finally {
    localStorage.removeItem("usuario");
  }
}

export function getCurrentUser() {
  const usuarioGuardado = localStorage.getItem("usuario");

  if (!usuarioGuardado) {
    return null;
  }

  try {
    return JSON.parse(usuarioGuardado);
  } catch (error) {
    console.error("Datos de usuario inválidos:", error);
    return null;
  }
}

export function isAuthenticated() {
  return !!getCurrentUser();
}
