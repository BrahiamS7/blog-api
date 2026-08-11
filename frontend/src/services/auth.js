import api from "../api/axios";

export async function login(email, password) {
  const response = await api.post("/usuarios/login", {
    email,
    password,
  });

  localStorage.setItem("token", response.data.token);

  return response.data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}