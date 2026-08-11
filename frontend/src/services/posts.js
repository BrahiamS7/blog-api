import api from "../api/axios";

export async function obtenerPosts() {
  const response = await api.get("/posts");
  return response.data;
}

export async function obtenerMisPosts() {
  const response = await api.get("/posts/mis-posts");
  return response.data;
}

export async function crearPost(datos) {
  const response = await api.post("/posts", datos);
  return response.data;
}

export async function actualizarPost(id, datos) {
  const response = await api.put(`/posts/${id}`, datos);
  return response.data;
}

export async function eliminarPost(id) {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
}