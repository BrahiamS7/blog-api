import api from "../api/axios";

export async function obtenerUsuarios() {
  const response = await api.get("/usuarios");
  return response.data;
}

export async function obtenerUsuario(id) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export async function crearUsuario(usuario) {
  const response = await api.post("/usuarios", usuario);
  return response.data;
}

export async function actualizarUsuario(id, datos) {
  const response = await api.put(`/usuarios/${id}`, datos);
  return response.data;
}

export async function eliminarUsuario(id) {
  await api.delete(`/usuarios/${id}`);
}